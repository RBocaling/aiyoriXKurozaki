import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Member } from "@/data/types";
import {
  fetchMembersAPI,
  addMemberAPI,
  updateMemberAPI,
  deleteMemberAPI,
} from "../api/member.api";
import { GENERATIONS } from "@/data/members";

interface MemberContextType {
  members: Member[];
  loading: boolean;
  actionLoading: boolean;
  addMember: (member: Member) => Promise<void>;
  updateMember: (member: Member) => Promise<void>;
  deleteMember: (id: string) => Promise<void>;
  getMember: (id: string) => Member | undefined;
}

const MemberContext = createContext<MemberContextType | null>(null);

export function MemberProvider({ children }: { children: ReactNode }) {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const data = await fetchMembersAPI();
      setMembers(data);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const addMember = async (member: Member) => {
    try {
      setActionLoading(true);
      await addMemberAPI(member);
      setMembers((prev) => [...prev, member]);
    } catch (error) {
      console.error("Add error:", error);
    } finally {
      setActionLoading(false);
    }
  };

  const updateMember = async (member: Member) => {
    try {
      setActionLoading(true);
      await updateMemberAPI(member);
      setMembers((prev) => prev.map((m) => (m.id === member.id ? member : m)));
    } catch (error) {
      console.error("Update error:", error);
    } finally {
      setActionLoading(false);
    }
  };

  const deleteMember = async (id: string) => {
    try {
      setActionLoading(true);
      await deleteMemberAPI(id);
      setMembers((prev) => prev.filter((m) => m.id !== id));
    } catch (error) {
      console.error("Delete error:", error);
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
  if (!ctx) {
    throw new Error("useMembers must be used within MemberProvider");
  }
  return ctx;
}

export { GENERATIONS };
