import { useState, useCallback, useMemo, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Copy, Check, MessageCircle, ExternalLink, Send, Instagram, Eye } from "lucide-react";
import { SiTiktok, SiKick, SiSpotify, SiFacebook, SiSteam, SiRoblox } from "react-icons/si";
import ParticleEffect from "@/components/ParticleEffect";
import MemberIntro from "@/components/MemberIntro";
import MemberCard from "@/components/MemberCard";
import { useMembers, GENERATIONS } from "@/contexts/MemberContext";
import { useMusic } from "@/contexts/MusicContext";
import { getBorderImage } from "@/data/borderFrames";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { Helmet } from "react-helmet-async";
import MemberBio from "@/components/MemberBio";
const SOCIAL_ICON_STYLES: Record<string, string> = {
  default: "bg-secondary text-secondary-foreground hover:bg-surface-hover",
  neon: "bg-transparent border border-[hsl(var(--glow))] text-foreground shadow-[0_0_10px_hsl(var(--glow)/0.3)] hover:shadow-[0_0_20px_hsl(var(--glow)/0.5)]",
  gradient: "bg-gradient-to-r from-[hsl(var(--glow-purple))] to-[hsl(var(--glow))] text-foreground hover:opacity-80",
  glass: "glass border border-border text-foreground hover:bg-surface-hover",
  outline: "bg-transparent border-2 border-foreground text-foreground hover:bg-foreground hover:text-background",
  pill: "bg-secondary text-secondary-foreground rounded-full hover:bg-surface-hover",
};

const GunslolIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
    <text x="12" y="16" textAnchor="middle" fontSize="10" fill="currentColor">G</text>
  </svg>
);



const MemberProfile = () => {
  const { name } = useParams<{ name: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { members, getMember, updateMember } = useMembers();
  const { setMemberTrack, clearMemberTrack, pause, play, isPlaying } =
    useMusic();
  const [showIntro, setShowIntro] = useState(true);
  const [showBlur, setShowBlur] = useState(true);
  const [copied, setCopied] = useState(false);

  const decodedName = useMemo(() => {
    return name?.replace(/_/g, " ") || "";
  }, [name]);

  const member = useMemo(() => {
    return members.find(
      (m) => m.name.toLowerCase() === decodedName.toLowerCase(),
    );
  }, [decodedName, members]);

  console.log("member", name);
  
  const children = useMemo(
    () =>
      member?.children
        ?.map((cid) => members.find((m) => m.id === cid))
        .filter(Boolean) || [],
    [member, members],
  );
  const partners = useMemo(
    () =>
      member?.partners
        ?.map((pid) => members.find((m) => m.id === pid))
        .filter(Boolean) || [],
    [member, members],
  );
  const genColor = useMemo(
    () =>
      GENERATIONS.find((g) => g.name === member?.generation)?.color ||
      "hsl(210 80% 60%)",
    [member],
  );

  // Increment views on mount
  useEffect(() => {
    if (!member) return;

    const incrementViews = async () => {
      await supabase
        .from("members")
        .update({ views: member.views + 1 })
        .eq("id", member.id);
    };

    incrementViews();
  }, [member]);

  // Blur screen click handler - pause main, play member track
  const handleBlurClick = useCallback(() => {
    setShowBlur(false);
    if (member?.soundUrl) {
      pause();
      setTimeout(() => {
        setMemberTrack(member.soundUrl);
        play();
      }, 100);
    }
  }, [member, pause, play, setMemberTrack]);

  // Cleanup member track on unmount
  useEffect(() => {
    return () => {
      clearMemberTrack();
    };
  }, [clearMemberTrack]);

  const handleIntroComplete = useCallback(() => setShowIntro(false), []);

  const handleCopyLink = () => {
    const slug = member.name.replaceAll(" ", "_");

    const url = `${window.location.origin}/${slug}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    toast({ title: "Link copied!", description: url });
    setTimeout(() => setCopied(false), 2000);
  };

  if (!member) {
    return (
      <main className="relative z-10 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-display text-2xl text-chrome-bright mb-4">
            Member not found
          </h1>
          <Link
            to="/"
            className="font-accent text-sm tracking-wider text-muted-foreground hover:text-foreground"
          >
            ← Back to Members
          </Link>
        </div>
      </main>
    );
  }

  const borderImage = getBorderImage(member.borderFrame);
  const iconStyle = SOCIAL_ICON_STYLES[member.socialIconStyle || "default"];

  const socials = [
    {
      key: "discord",
      icon: <MessageCircle className="w-4 h-4" />,
      label: "Discord",
      value: member.discord,
      href: "#",
    },
    {
      key: "twitter",
      icon: <ExternalLink className="w-4 h-4" />,
      label: "X",
      value: member.twitter,
      href: member.twitter,
    },
    {
      key: "telegram",
      icon: <Send className="w-4 h-4" />,
      label: "Telegram",
      value: member.telegram,
      href: member.telegram,
    },
    {
      key: "instagram",
      icon: <Instagram className="w-4 h-4" />,
      label: "Instagram",
      value: member.instagram,
      href: member.instagram,
    },
    {
      key: "tiktok",
      icon: <SiTiktok className="w-4 h-4" />,
      label: "TikTok",
      value: member.tiktok,
      href: member.tiktok,
    },
    {
      key: "kick",
      icon: <SiKick className="w-4 h-4" />,
      label: "Kick",
      value: member.kick,
      href: member.kick,
    },
    {
      key: "spotify",
      icon: <SiSpotify className="w-4 h-4" />,
      label: "Spotify",
      value: member.spotify,
      href: member.spotify,
    },
    {
      key: "gunslol",
      icon: <GunslolIcon />,
      label: "Guns.lol",
      value: member.gunslol,
      href: member.gunslol,
    },
    {
      key: "facebook",
      icon: <SiFacebook className="w-4 h-4" />,
      label: "Facebook",
      value: member.facebook,
      href: member.facebook,
    },
    {
      key: "steam",
      icon: <SiSteam className="w-4 h-4" />,
      label: "Steam",
      value: member.steam,
      href: member.steam,
    },
    {
      key: "roblox",
      icon: <SiRoblox className="w-4 h-4" />,
      label: "Roblox",
      value: member.roblox,
      href: member.roblox,
    },
  ].filter((s) => s.value);

  return (
    <>
      <Helmet>
        <title>{member.name} | AIYORI X KUROZAKI</title>
      </Helmet>

      {showIntro && member.introAnimation && (
        <MemberIntro
          type={member.introAnimation}
          memberName={member.name}
          onComplete={handleIntroComplete}
        />
      )}

      {/* NO VideoBackground here - only personalized bg */}
      <ParticleEffect effect={member.particleEffect || "none"} />

      {/* Personalized background */}
      {member.backgroundImage || member.backgroundGif ? (
        <div className="fixed inset-0 z-[1]">
          <img
            src={member.backgroundGif || member.backgroundImage}
            alt=""
            className="w-full h-full object-cover"
          />
          <div
            className="absolute inset-0"
            style={{ background: "hsl(0 0% 2% / 0.7)" }}
          />
        </div>
      ) : (
        <div
          className="fixed inset-0 z-[1]"
          style={{ background: "hsl(0 0% 3%)" }}
        />
      )}

      {/* Blur screen trigger */}
      <AnimatePresence>
        {showBlur && !showIntro && member.soundUrl && (
          <motion.div
            className="fixed inset-0 z-[90] flex items-center justify-center cursor-pointer"
            style={{
              backdropFilter: "blur(20px)",
              background: "hsl(0 0% 2% / 0.6)",
            }}
            onClick={handleBlurClick}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="text-center"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <div
                className="w-20 h-20 mx-auto mb-4 rounded-full border border-border flex items-center justify-center"
                style={{ background: "hsl(var(--secondary))" }}
              >
                <motion.div
                  className="w-0 h-0"
                  style={{
                    borderLeft: "14px solid hsl(var(--foreground))",
                    borderTop: "10px solid transparent",
                    borderBottom: "10px solid transparent",
                  }}
                />
              </div>
              <p className="font-accent text-sm tracking-[0.4em] text-muted-foreground">
                TAP TO PLAY
              </p>
              <p className="font-accent text-[10px] tracking-wider text-muted-foreground mt-1">
                {member.name}'s Theme
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Views counter - bottom left */}
      <motion.div
        className="fixed bottom-20 left-4 z-40 flex items-center gap-1.5 px-3 py-1.5 rounded-lg glass border border-border"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: showIntro ? 0 : 1, x: showIntro ? -20 : 0 }}
        transition={{ delay: 1.2 }}
      >
        <Eye className="w-3.5 h-3.5 text-muted-foreground" />
        <span className="font-accent text-[10px] tracking-wider text-muted-foreground">
          {member.views || 0}
        </span>
      </motion.div>

      <main className="relative z-10 min-h-screen pt-20 pb-24">
        <div className="container mx-auto px-6 max-w-2xl">
          <motion.div
            className="flex items-center justify-between mb-10"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: showIntro ? 0 : 1, y: showIntro ? -20 : 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
          >
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 font-accent text-sm tracking-wider text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> BACK
            </button>
            <motion.button
              onClick={handleCopyLink}
              className="flex items-center gap-2 px-4 py-2 rounded-xl glass border border-border font-accent text-xs tracking-wider text-muted-foreground hover:text-foreground"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {copied ? (
                <Check className="w-3.5 h-3.5" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
              {copied ? "COPIED" : "COPY LINK"}
            </motion.button>
          </motion.div>

          <motion.div
            className="bg-b bordesr borsder-border rounded-3xl p-8 md:p-12 text-center"
            initial={{ opacity: 0, scale: 0.5, rotateX: 30, rotateY: -15 }}
            animate={{
              opacity: showIntro ? 0 : 1,
              scale: showIntro ? 0.5 : 1,
              rotateX: showIntro ? 30 : 0,
              rotateY: showIntro ? -15 : 0,
            }}
            transition={{
              delay: 0.2,
              duration: 1,
              type: "spring",
              damping: 18,
            }}
            style={{ perspective: "1200px", transformStyle: "preserve-3d" }}
          >
            <motion.div
              className="relative mx-auto mb-8"
              style={{ width: 200, height: 200 }}
              initial={{ scale: 0, rotateZ: -30 }}
              animate={{
                scale: showIntro ? 0 : 1,
                rotateZ: showIntro ? -30 : 0,
              }}
              transition={{ delay: 0.4, type: "spring", damping: 14 }}
            >
              <div className="absolute inset-0 flex items-center justify-center z-20">
                <div className="w-[110px] h-[110px] rounded-full overflow-hidden">
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              {borderImage && (
                <motion.img
                  src={borderImage}
                  alt=""
                  className={`absolute inset-0 w-full h-full object-contain pointer-events-none rounded-full border-anim-${member.borderFrame}`}
                  animate={member.animation === "spin" ? { rotate: 360 } : {}}
                  transition={
                    member.animation === "spin"
                      ? { duration: 10, repeat: Infinity, ease: "linear" }
                      : {}
                  }
                />
              )}
            </motion.div>

            <motion.h1
              className="font-display text-2xl md:text-4xl tracking-wider text-chrome-bright mb-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: showIntro ? 0 : 1, y: showIntro ? 20 : 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              {member.name}
            </motion.h1>
            <motion.p
              className="font-accent text-xs tracking-[0.4em] mb-4"
              style={{ color: genColor }}
              initial={{ opacity: 0 }}
              animate={{ opacity: showIntro ? 0 : 1 }}
              transition={{ delay: 0.7 }}
            >
              {member.generation}
            </motion.p>

            {/* BIO */}
            {member.bio && <MemberBio bio={member.bio} visible={!showIntro} />}
            {/* Social links */}
            <motion.div
              className="flex gap-3 flex-wrap justify-center mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: showIntro ? 0 : 1, y: showIntro ? 20 : 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              {socials.map((s) => (
                <motion.a
                  key={s.key}
                  href={s.href}
                  target={s.key !== "discord" ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-accent tracking-wider transition-all ${iconStyle}`}
                  whileHover={{ scale: 1.08, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {s.icon} {s.label}
                </motion.a>
              ))}
            </motion.div>

            <motion.div
              className="h-px mx-auto mb-8"
              style={{
                background: `linear-gradient(90deg, transparent, ${genColor}60, transparent)`,
                maxWidth: 300,
              }}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: showIntro ? 0 : 1 }}
              transition={{ delay: 0.9, duration: 0.6 }}
            />

            {/* Partners */}
            {partners.length > 0 && (
              <motion.div
                className="mb-8"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: showIntro ? 0 : 1, y: showIntro ? 30 : 0 }}
                transition={{ delay: 0.95, duration: 0.7 }}
              >
                <h3 className="font-accent text-sm tracking-[0.3em] text-muted-foreground mb-6">
                  PARTNER{partners.length > 1 ? "S" : ""}
                </h3>
                <div className="flex flex-wrap gap-5 justify-center">
                  {partners.map(
                    (p, i) =>
                      p && (
                        <MemberCard
                          key={p.id}
                          member={p}
                          index={i}
                          onClick={() =>
                            navigate(`/${p.name.replaceAll(" ", "_")}`)
                          }
                        />
                      ),
                  )}
                </div>
              </motion.div>
            )}

            {/* Children */}
            {children.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: showIntro ? 0 : 1, y: showIntro ? 30 : 0 }}
                transition={{ delay: 1, duration: 0.7 }}
              >
                <h3 className="font-accent text-sm tracking-[0.3em] text-muted-foreground mb-6">
                  CHILDREN ({children.length})
                </h3>
                <div className="flex flex-wrap gap-5 justify-center">
                  {children.map(
                    (child, i) =>
                      child && (
                        <MemberCard
                          key={child.id}
                          member={child}
                          index={i}
                          onClick={() =>
                            navigate(
                              `/${child.name.replaceAll(" ", "_")}`,
                            )
                          }
                        />
                      ),
                  )}
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </main>
    </>
  );
};;

export default MemberProfile;
