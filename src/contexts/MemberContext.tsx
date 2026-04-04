import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { GENERATIONS } from "@/data/members";

const API_URL = "https://aiyuri-backend-3.onrender.com/members";

interface MemberContextType {
  members: any[];
  loading: boolean;
  actionLoading: boolean;
  addMember: (member: any) => Promise<void>;
  updateMember: (member: any) => Promise<void>;
  deleteMember: (id: string) => Promise<void>;
  getMember: (id: string) => any | undefined;
}

const MemberContext = createContext<MemberContextType | null>(null);

export function MemberProvider({ children }: { children: ReactNode }) {
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

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

  const fetchMembers = async () => {
    try {
      setLoading(true);

      const res = await fetch(API_URL);
      const data = await res.json();

      setMembers(data.map(mapFromDB));
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const addMember = async (member: any) => {
    try {
      setActionLoading(true);

      await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mapToDB(member)),
      });

      setMembers((prev) => [...prev, member]);
    } catch (err) {
      console.error("Add error:", err);
    } finally {
      setActionLoading(false);
    }
  };

  const updateMember = async (member: any) => {
    try {
      setActionLoading(true);

      await fetch(`${API_URL}/${member.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mapToDB(member)),
      });

      setMembers((prev) => prev.map((m) => (m.id === member.id ? member : m)));
    } catch (err) {
      console.error("Update error:", err);
    } finally {
      setActionLoading(false);
    }
  };

  const deleteMember = async (id: string) => {
    try {
      setActionLoading(true);

      await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      setMembers((prev) => prev.filter((m) => m.id !== id));
    } catch (err) {
      console.error("Delete error:", err);
    } finally {
      setActionLoading(false);
    }
  };

  const getMember = (id: string) => members.find((m) => m.id === id);

  return (
    <MemberContext.Provider
      value={{
        members,
        loading,
        actionLoading,
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
