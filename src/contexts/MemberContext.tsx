import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { supabase } from "@/lib/supabase";
import { GENERATIONS } from "@/data/members";


interface MemberContextType {
  members: any[];
  loading: boolean;
  addMember: (member: any) => Promise<void>;
  updateMember: (member: any) => Promise<void>;
  deleteMember: (id: string) => Promise<void>;
  getMember: (id: string) => any | undefined;
}

const MemberContext = createContext<MemberContextType | null>(null);

export function MemberProvider({ children }: { children: ReactNode }) {
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔥 DB -> CAMEL CASE MAPPER
  const mapFromDB = (row: any): any => ({
    id: row.id,
    name: row.name,
    avatar: row.avatar,
    generation: row.generation,
    borderFrame: row.borderframe,
    animation: row.animation,
    customDesign: row.customdesign,

    bio: row.bio,
     
    discord: row.discord,
    twitter: row.twitter,
    telegram: row.telegram,
    instagram: row.instagram,
    tiktok: row.tiktok,
    kick: row.kick,
    spotify: row.spotify,
    gunslol: row.gunslol,
    facebook: row.facebook,
    steam: row.steam,
    roblox: row.roblox,

    soundUrl: row.soundurl,
    backgroundImage: row.backgroundimage,
    backgroundGif: row.backgroundgif,

    introAnimation: row.introanimation,
    particleEffect: row.particleeffect,
    socialIconStyle: row.socialiconstyle,

    children: row.children || [],
    partners: row.partners || [],

    views: row.views || 0,
  });

  // 🔥 CAMEL -> DB FORMAT
  const mapToDB = (member: any) => ({
    id: member.id,
    name: member.name,
    avatar: member.avatar,
    generation: member.generation,
    borderframe: member.borderFrame,
    animation: member.animation,
    customdesign: member.customDesign,
    bio: member.bio,
    discord: member.discord,
    twitter: member.twitter,
    telegram: member.telegram,
    instagram: member.instagram,
    tiktok: member.tiktok,
    kick: member.kick,
    spotify: member.spotify,
    gunslol: member.gunslol,
    facebook: member.facebook,
    steam: member.steam,
    roblox: member.roblox,

    soundurl: member.soundUrl,
    backgroundimage: member.backgroundImage,
    backgroundgif: member.backgroundGif,

    introanimation: member.introAnimation,
    particleeffect: member.particleEffect,
    socialiconstyle: member.socialIconStyle,

    children: member.children || [],
    partners: member.partners || [],

    views: member.views || 0,
  });

  // 🔥 FETCH MEMBERS
  const fetchMembers = async () => {
    const { data, error } = await supabase.from("members").select("*");

    if (error) {
      console.error("Fetch error:", error);
      return;
    }

    const mapped = (data || []).map(mapFromDB);
    setMembers(mapped);
    setLoading(false);
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  // ➕ ADD
  const addMember = async (member: any) => {
    const { error } = await supabase.from("members").insert([mapToDB(member)]);

    if (error) {
      console.error("Add error:", error);
      return;
    }

    setMembers((prev) => [...prev, member]);
  };

  // ✏️ UPDATE
  const updateMember = async (member: any) => {
    const { error } = await supabase
      .from("members")
      .update(mapToDB(member))
      .eq("id", member.id);

    if (error) {
      console.error("Update error:", error);
      return;
    }

    setMembers((prev) => prev.map((m) => (m.id === member.id ? member : m)));
  };

  // ❌ DELETE
  const deleteMember = async (id: string) => {
    const { error } = await supabase.from("members").delete().eq("id", id);

    if (error) {
      console.error("Delete error:", error);
      return;
    }

    setMembers((prev) => prev.filter((m) => m.id !== id));
  };

  const getMember = (id: string) => members.find((m) => m.id === id);

  return (
    <MemberContext.Provider
      value={{
        members,
        loading,
        addMember,
        updateMember,
        deleteMember,
        getMember,
      }}
    >
      {children}
    </MemberContext.Provider>
  );
}

export function useMembers() {
  const ctx = useContext(MemberContext);
  if (!ctx) throw new Error("useMembers must be used within MemberProvider");
  return ctx;
}

export { GENERATIONS };
