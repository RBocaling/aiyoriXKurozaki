import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import VideoBackground from "@/components/VideoBackground";
import { BORDER_FRAMES } from "@/data/borderFrames";
import { Member } from "@/data/types";
import { useMembers, GENERATIONS } from "@/contexts/MemberContext";
import { useAuth } from "@/contexts/AuthContext";
import { Plus, Trash2, Edit, Save, X, Eye, LogOut, CheckCircle, AlertTriangle, Upload } from "lucide-react";

const INTRO_ANIMATIONS = ["iris", "glitch", "shatter", "vortex", "lightning"];
const PARTICLE_EFFECTS = ["none", "snow", "fire", "rain", "stars", "sakura", "smoke", "sparkle"];
const SOCIAL_ICON_STYLES = ["default", "neon", "gradient", "glass", "outline", "pill"];
const ANIMATIONS = ["float", "pulse", "spin", "glitch"];
const CUSTOM_DESIGNS = ["chrome", "glass", "neon"];

const SOCIAL_FIELDS = [
  { key: "discord", ph: "Discord username" },
  { key: "twitter", ph: "X / Twitter URL" },
  { key: "telegram", ph: "Telegram URL" },
  { key: "instagram", ph: "Instagram URL" },
  { key: "tiktok", ph: "TikTok URL" },
  { key: "kick", ph: "Kick URL" },
  { key: "spotify", ph: "Spotify URL" },
  { key: "gunslol", ph: "Guns.lol URL" },
  { key: "facebook", ph: "Facebook URL" },
  { key: "steam", ph: "Steam URL" },
  { key: "roblox", ph: "Roblox URL" },
];

type ModalType = "add" | "edit" | "view" | null;
type ToastType = { type: "success" | "error" | "confirm"; message: string; onConfirm?: () => void } | null;

const AdminPanel = () => {
  const { members, addMember, updateMember, deleteMember } = useMembers();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [modal, setModal] = useState<ModalType>(null);
  const [viewMember, setViewMember] = useState<Member | null>(null);
  const [toastMsg, setToastMsg] = useState<ToastType>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<Member>>(defaultForm());

  function defaultForm(): Partial<Member> {
    return {
      name: "",
      bio: "",
      avatar: "",
      generation: GENERATIONS[0].name,
      borderFrame: "gold",
      animation: "float",
      customDesign: "chrome",
      discord: "",
      twitter: "",
      telegram: "",
      instagram: "",
      tiktok: "",
      kick: "",
      spotify: "",
      gunslol: "",
      facebook: "",
      steam: "",
      roblox: "",
      introAnimation: "iris",
      particleEffect: "none",
      socialIconStyle: "default",
      children: [],
      partners: [],
      soundUrl: "",
      backgroundImage: "",
      backgroundGif: "",
    };
  }

  const showToast = (type: "success" | "error", message: string) => {
    setToastMsg({ type, message });
    setTimeout(() => setToastMsg(null), 3000);
  };

  const showConfirm = (message: string, onConfirm: () => void) => {
    setToastMsg({ type: "confirm", message, onConfirm });
  };

  const openAdd = () => { setForm(defaultForm()); setEditingId(null); setModal("add"); };
  const openEdit = (m: Member) => { setForm({ ...m }); setEditingId(m.id); setModal("edit"); };
  const openView = (m: Member) => { setViewMember(m); setModal("view"); };
  const closeModal = () => { setModal(null); setViewMember(null); setEditingId(null); };

  const handleSave = () => {
    if (!form.name?.trim()) { showToast("error", "Member name is required!"); return; }
    const member: any = {
      id: editingId || Date.now().toString(),
      name: form.name || "",
      bio: form.bio || "",
      avatar: form.avatar || `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`,
      generation: form.generation || GENERATIONS[0].name,
      borderFrame: form.borderFrame || "gold",
      animation: form.animation || "float",
      customDesign: (form.customDesign as any) || "chrome",
      discord: form.discord, twitter: form.twitter, telegram: form.telegram, instagram: form.instagram,
      tiktok: form.tiktok, kick: form.kick, spotify: form.spotify, gunslol: form.gunslol,
      facebook: form.facebook, steam: form.steam, roblox: form.roblox,
      soundUrl: form.soundUrl, backgroundImage: form.backgroundImage, backgroundGif: form.backgroundGif,
      introAnimation: (form.introAnimation as any) || "iris",
      particleEffect: (form.particleEffect as any) || "none",
      socialIconStyle: (form.socialIconStyle as any) || "default",
      children: form.children || [],
      partners: form.partners || [],
      views: 0,
    };
    if (editingId) { updateMember(member); showToast("success", `${member.name} updated successfully!`); }
    else { addMember(member); showToast("success", `${member.name} added successfully!`); }
    closeModal();
  };

  const handleDelete = (m: Member) => {
    showConfirm(`Delete ${m.name}? This cannot be undone.`, () => {
      deleteMember(m.id);
      setToastMsg(null);
      showToast("success", `${m.name} deleted.`);
    });
  };

  const handleLogout = () => { logout(); navigate("/admin/login"); };

  const updateField = (key: string, value: any) => setForm(f => ({ ...f, [key]: value }));
  const toggleChild = (childId: string) => {
    const cur = form.children || [];
    updateField("children", cur.includes(childId) ? cur.filter(c => c !== childId) : [...cur, childId]);
  };
  const togglePartner = (partnerId: string) => {
    const cur = form.partners || [];
    updateField("partners", cur.includes(partnerId) ? cur.filter(c => c !== partnerId) : [...cur, partnerId]);
  };

  const selectCls = "w-full bg-secondary border border-border rounded-xl px-3 py-2.5 text-sm text-foreground font-body focus:outline-none focus:ring-1 focus:ring-ring";
  const inputCls = selectCls;
  const labelCls = "font-accent text-[10px] tracking-wider text-muted-foreground block mb-1";

  return (
    <>
      <VideoBackground />

      {/* Toast Messages */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div
            className="fixed top-24 right-6 z-[300] max-w-sm"
            initial={{ opacity: 0, x: 60, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 60, scale: 0.9 }}
            transition={{ type: "spring", damping: 20 }}
          >
            <div
              className={`glass border rounded-2xl p-4 flex items-start gap-3 ${
                toastMsg.type === "success"
                  ? "border-[hsl(140_70%_45%/0.4)]"
                  : toastMsg.type === "error"
                    ? "border-[hsl(0_62%_50%/0.4)]"
                    : "border-[hsl(42_90%_55%/0.4)]"
              }`}
            >
              {toastMsg.type === "success" && (
                <CheckCircle
                  className="w-5 h-5 shrink-0"
                  style={{ color: "hsl(140 70% 55%)" }}
                />
              )}
              {toastMsg.type === "error" && (
                <AlertTriangle
                  className="w-5 h-5 shrink-0"
                  style={{ color: "hsl(0 80% 60%)" }}
                />
              )}
              {toastMsg.type === "confirm" && (
                <AlertTriangle
                  className="w-5 h-5 shrink-0"
                  style={{ color: "hsl(42 90% 55%)" }}
                />
              )}
              <div className="flex-1">
                <p className="font-accent text-sm tracking-wider text-foreground">
                  {toastMsg.message}
                </p>
                {toastMsg.type === "confirm" && (
                  <div className="flex gap-2 mt-3">
                    <button
                      className="px-3 py-1.5 rounded-lg text-xs font-accent tracking-wider"
                      style={{
                        background: "hsl(0 62% 50%)",
                        color: "hsl(0 0% 98%)",
                      }}
                      onClick={toastMsg.onConfirm}
                    >
                      DELETE
                    </button>
                    <button
                      className="px-3 py-1.5 rounded-lg glass border border-border text-xs font-accent tracking-wider text-muted-foreground"
                      onClick={() => setToastMsg(null)}
                    >
                      CANCEL
                    </button>
                  </div>
                )}
              </div>
              {toastMsg.type !== "confirm" && (
                <button
                  onClick={() => setToastMsg(null)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modals */}
      <AnimatePresence>
        {(modal === "add" || modal === "edit") && (
          <motion.div
            className="fixed inset-0 z-[200] flex items-start justify-center pt-20 pb-8 px-4 overflow-y-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={closeModal}
            />
            <motion.div
              className="relative w-full max-w-2xl glass border border-border rounded-2xl p-6 z-10"
              initial={{ opacity: 0, y: -30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -30, scale: 0.95 }}
              transition={{ type: "spring", damping: 25 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-display text-lg tracking-wider text-chrome-bright">
                  {modal === "edit" ? "EDIT MEMBER" : "ADD MEMBER"}
                </h3>
                <button
                  onClick={closeModal}
                  className="p-2 rounded-xl glass border border-border text-muted-foreground hover:text-foreground"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Basic */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className={labelCls}>Name *</label>
                  <input
                    className={inputCls}
                    value={form.name || ""}
                    onChange={(e) => updateField("name", e.target.value)}
                    placeholder="Member name"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className={labelCls}>Bio</label>

                  <textarea
                    className={inputCls + " min-h-[90px] resize-none"}
                    value={form.bio || ""}
                    onChange={(e) => updateField("bio", e.target.value)}
                    placeholder="Short description about the member..."
                    maxLength={500}
                  />

                  <p className="text-[10px] text-muted-foreground mt-1">
                    {(form.bio || "").length}/500
                  </p>
                </div>
                <MediaInput
                  label="Avatar"
                  value={form.avatar || ""}
                  onChange={(v) => updateField("avatar", v)}
                  placeholder="Avatar URL or upload"
                />
                <div>
                  <label className={labelCls}>Generation</label>
                  <select
                    className={selectCls}
                    value={form.generation}
                    onChange={(e) => updateField("generation", e.target.value)}
                  >
                    {GENERATIONS.map((g) => (
                      <option key={g.name} value={g.name}>
                        {g.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Animation</label>
                  <select
                    className={selectCls}
                    value={form.animation}
                    onChange={(e) => updateField("animation", e.target.value)}
                  >
                    {ANIMATIONS.map((a) => (
                      <option key={a} value={a}>
                        {a.charAt(0).toUpperCase() + a.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Custom Design</label>
                  <select
                    className={selectCls}
                    value={form.customDesign}
                    onChange={(e) =>
                      updateField("customDesign", e.target.value as any)
                    }
                  >
                    {CUSTOM_DESIGNS.map((d) => (
                      <option key={d} value={d}>
                        {d.charAt(0).toUpperCase() + d.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Effects */}
              <h4 className={labelCls + " mb-2"}>INTRO & EFFECTS</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                  <label className={labelCls}>Intro Animation</label>
                  <select
                    className={selectCls}
                    value={form.introAnimation}
                    onChange={(e) =>
                      updateField("introAnimation", e.target.value)
                    }
                  >
                    {INTRO_ANIMATIONS.map((a) => (
                      <option key={a} value={a}>
                        {a.charAt(0).toUpperCase() + a.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Particle Effect</label>
                  <select
                    className={selectCls}
                    value={form.particleEffect}
                    onChange={(e) =>
                      updateField("particleEffect", e.target.value)
                    }
                  >
                    {PARTICLE_EFFECTS.map((p) => (
                      <option key={p} value={p}>
                        {p.charAt(0).toUpperCase() + p.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Social Icon Style</label>
                  <select
                    className={selectCls}
                    value={form.socialIconStyle}
                    onChange={(e) =>
                      updateField("socialIconStyle", e.target.value)
                    }
                  >
                    {SOCIAL_ICON_STYLES.map((s) => (
                      <option key={s} value={s}>
                        {s.charAt(0).toUpperCase() + s.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Social */}
              <h4 className={labelCls + " mb-2"}>SOCIAL MEDIA</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                {SOCIAL_FIELDS.map((s) => (
                  <input
                    key={s.key}
                    className={inputCls}
                    value={(form as any)[s.key] || ""}
                    onChange={(e) => updateField(s.key, e.target.value)}
                    placeholder={s.ph}
                  />
                ))}
              </div>

              {/* Media */}
              <h4 className={labelCls + " mb-2"}>MEDIA & SOUND</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                <MediaInput
                  label="Background Image"
                  value={form.backgroundImage || ""}
                  onChange={(v) => updateField("backgroundImage", v)}
                  placeholder="Image URL or upload"
                />
                <MediaInput
                  label="Background GIF"
                  value={form.backgroundGif || ""}
                  onChange={(v) => updateField("backgroundGif", v)}
                  placeholder="GIF URL or upload"
                />
                <MediaInput
                  label="Background Music"
                  value={form.soundUrl || ""}
                  onChange={(v) => updateField("soundUrl", v)}
                  placeholder="Music URL or upload"
                  accept="audio/*"
                />
              </div>

              {/* Borders */}
              <h4 className={labelCls + " mb-3"}>BORDER FRAME</h4>
              <div className="grid grid-cols-5 sm:grid-cols-5 md:grid-cols-10 gap-3 mb-6">
                {BORDER_FRAMES.map((border) => (
                  <motion.button
                    key={border.id}
                    className={`relative rounded-xl overflow-hidden transition-all ${form.borderFrame === border.id ? "ring-2 ring-foreground" : "ring-1 ring-border"}`}
                    style={{ aspectRatio: "1" }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => updateField("borderFrame", border.id)}
                  >
                    <img
                      src={border.image}
                      alt={border.name}
                      className="w-full h-full object-contain"
                    />
                  </motion.button>
                ))}
              </div>

              {/* Partners */}
              <h4 className={labelCls + " mb-3"}>PARTNERS</h4>
              <div className="flex flex-wrap gap-2 mb-6">
                {members
                  .filter((m) => m.id !== editingId)
                  .map((m) => (
                    <motion.button
                      key={m.id}
                      className={`px-3 py-1.5 rounded-lg text-xs font-accent tracking-wider transition-all ${
                        (form.partners || []).includes(m.id)
                          ? "bg-[hsl(320_60%_55%)] text-foreground"
                          : "glass border border-border text-muted-foreground hover:text-foreground"
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => togglePartner(m.id)}
                    >
                      {m.name}
                    </motion.button>
                  ))}
              </div>

              {/* Children */}
              <h4 className={labelCls + " mb-3"}>CHILDREN (Family Tree)</h4>
              <div className="flex flex-wrap gap-2 mb-6">
                {members
                  .filter((m) => m.id !== editingId)
                  .map((m) => (
                    <motion.button
                      key={m.id}
                      className={`px-3 py-1.5 rounded-lg text-xs font-accent tracking-wider transition-all ${
                        (form.children || []).includes(m.id)
                          ? "bg-primary text-primary-foreground"
                          : "glass border border-border text-muted-foreground hover:text-foreground"
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => toggleChild(m.id)}
                    >
                      {m.name}
                    </motion.button>
                  ))}
              </div>

              <div className="flex gap-3 justify-end">
                <button
                  className="px-4 py-2.5 rounded-xl glass border border-border font-accent text-xs tracking-wider text-muted-foreground hover:text-foreground"
                  onClick={closeModal}
                >
                  <X className="w-4 h-4 inline mr-1" /> CANCEL
                </button>
                <motion.button
                  className="px-6 py-2.5 rounded-xl font-accent text-xs tracking-wider bg-primary text-primary-foreground hover:opacity-90"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSave}
                >
                  <Save className="w-4 h-4 inline mr-1" />{" "}
                  {editingId ? "UPDATE" : "SAVE"}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* View Modal */}
        {modal === "view" && viewMember && (
          <motion.div
            className="fixed inset-0 z-[200] flex items-center justify-center px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={closeModal}
            />
            <motion.div
              className="relative w-full max-w-md glass border border-border rounded-2xl p-6 z-10 text-center"
              initial={{ opacity: 0, scale: 0.8, rotateY: -15 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              exit={{ opacity: 0, scale: 0.8, rotateY: 15 }}
              transition={{ type: "spring", damping: 20 }}
            >
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 p-2 rounded-xl glass border border-border text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-4 border-2 border-border">
                <img
                  src={viewMember.avatar}
                  alt={viewMember.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <h2 className="font-display text-xl tracking-wider text-chrome-bright mb-1">
                {viewMember.name}
              </h2>
              {viewMember.bio && (
                <div className="glass border border-border rounded-lg px-4 py-3 mb-4 text-left">
                  <p className="font-accent text-[9px] tracking-wider text-muted-foreground mb-1">
                    BIO
                  </p>
                  <p className="font-body text-xs text-foreground leading-relaxed">
                    {viewMember.bio}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-2 text-left mb-4">
                {[
                  ["Border", viewMember.borderFrame],
                  ["Animation", viewMember.animation],
                  ["Design", viewMember.customDesign],
                  ["Intro", viewMember.introAnimation || "iris"],
                  ["Particles", viewMember.particleEffect || "none"],
                  ["Icons", viewMember.socialIconStyle || "default"],
                ].map(([k, v]) => (
                  <div
                    key={k}
                    className="glass border border-border rounded-lg px-3 py-2"
                  >
                    <p className="font-accent text-[9px] tracking-wider text-muted-foreground">
                      {k}
                    </p>
                    <p className="font-accent text-xs tracking-wider text-foreground capitalize">
                      {v}
                    </p>
                  </div>
                ))}
              </div>

              {viewMember.soundUrl && (
                <p className="text-[10px] font-accent text-muted-foreground mb-2">
                  🎵 Has background music
                </p>
              )}
              {viewMember.backgroundGif && (
                <p className="text-[10px] font-accent text-muted-foreground mb-2">
                  🎬 Has background GIF
                </p>
              )}
              {(viewMember.children?.length || 0) > 0 && (
                <p className="text-[10px] font-accent text-muted-foreground">
                  👶 {viewMember.children!.length} children
                </p>
              )}
              {(viewMember.partners?.length || 0) > 0 && (
                <p className="text-[10px] font-accent text-muted-foreground">
                  💍 {viewMember.partners!.length} partner(s)
                </p>
              )}

              <motion.button
                className="mt-4 px-6 py-2.5 rounded-xl font-accent text-xs tracking-wider bg-primary text-primary-foreground"
                whileHover={{ scale: 1.02 }}
                onClick={() => {
                  closeModal();
                  navigate(`/member/${viewMember.id}`);
                }}
              >
                VIEW PROFILE
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="relative z-10 min-h-screen pt-20 pb-20">
        <div className="container mx-auto px-6 max-w-4xl">
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="font-display text-2xl md:text-3xl tracking-wider text-chrome-bright mb-2">
              ADMIN PANEL
            </h1>
            <p className="font-accent text-[10px] tracking-[0.4em] text-muted-foreground">
              MEMBER MANAGEMENT
            </p>
          </motion.div>

          <div className="flex items-center justify-center gap-3 mb-8">
            <motion.button
              className="flex items-center gap-2 px-6 py-3 rounded-xl glass border border-border font-accent text-sm tracking-wider text-foreground hover:bg-surface-hover transition-colors"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={openAdd}
            >
              <Plus className="w-4 h-4" /> ADD MEMBER
            </motion.button>
            <motion.button
              className="flex items-center gap-2 px-4 py-3 rounded-xl glass border border-border font-accent text-sm tracking-wider text-muted-foreground hover:text-foreground transition-colors"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4" /> LOGOUT
            </motion.button>
          </div>

          {/* Members list */}
          <div className="space-y-2">
            {members.map((member, i) => (
              <motion.div
                key={member.id}
                className="glass border border-border rounded-xl p-4 flex items-center gap-4"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04, type: "spring", damping: 20 }}
                whileHover={{ x: 5 }}
              >
                <div className="w-10 h-10 rounded-full overflow-hidden shrink-0">
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-accent text-sm tracking-wider text-foreground">
                    {member.name}
                  </p>
                  <p className="font-accent text-[10px] tracking-wider text-muted-foreground truncate">
                    {member.generation} · {member.borderFrame} ·{" "}
                    {member.introAnimation || "iris"} ·{" "}
                    {member.particleEffect || "none"}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    className="p-2 rounded-xl glass border border-border text-muted-foreground hover:text-foreground transition-colors"
                    onClick={() => openView(member)}
                    title="View"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    className="p-2 rounded-xl glass border border-border text-muted-foreground hover:text-foreground transition-colors"
                    onClick={() => openEdit(member)}
                    title="Edit"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    className="p-2 rounded-xl glass border border-border text-destructive hover:opacity-80 transition-opacity"
                    onClick={() => handleDelete(member)}
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
};

/* Reusable media input: URL text field + file upload button */
function MediaInput({ label, value, onChange, placeholder, accept }: { label: string; value: string; onChange: (v: string) => void; placeholder: string; accept?: string }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    onChange(url);
  };
  return (
    <div>
      <label className="font-accent text-[10px] tracking-wider text-muted-foreground block mb-1">{label}</label>
      <div className="flex gap-2">
        <input
          className="flex-1 bg-secondary border border-border rounded-xl px-3 py-2.5 text-sm text-foreground font-body focus:outline-none focus:ring-1 focus:ring-ring"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
        />
        <button
          type="button"
          className="px-3 py-2.5 rounded-xl glass border border-border text-muted-foreground hover:text-foreground transition-colors shrink-0"
          onClick={() => fileRef.current?.click()}
          title="Upload file"
        >
          <Upload className="w-4 h-4" />
        </button>
        <input ref={fileRef} type="file" accept={accept || "image/*,image/gif"} className="hidden" onChange={handleFile} />
      </div>
    </div>
  );
}

export default AdminPanel;
