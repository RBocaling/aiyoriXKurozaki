import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import VideoBackground from "@/components/VideoBackground";
import MemberCard from "@/components/MemberCard";
import { useMembers, GENERATIONS } from "@/contexts/MemberContext";
import axkLogo from "@/assets/aiyorixkurozaki-logo.png";

const Members = () => {
  const navigate = useNavigate();
  const { members } = useMembers();

  const generationsWithMembers = GENERATIONS.map(gen => ({
    ...gen,
    members: members.filter(m => m.generation === gen.name),
  })).filter(g => g.members.length > 0);

  const totalMembers = members.length;

  return (
    <>
      <VideoBackground />
      <main className="relative z-10 min-h-screen pt-20 pb-20">
        <div className="container mx-auto px-6 flex flex-col items-center">
          <motion.div className="text-center mb-12" initial={{ opacity: 0, y: -30, rotateX: 20 }} animate={{ opacity: 1, y: 0, rotateX: 0 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }} style={{ perspective: "1000px" }}>
            <img src={axkLogo} alt="Aiyori X Kurozaki" className="w-[200px] md:w-[300px] mx-auto mb-3" />
            <p className="font-accent text-[10px] tracking-[0.4em] text-muted-foreground">FAMILY HIERARCHY</p>
          </motion.div>

          {generationsWithMembers.map((gen, gi) => (
            <motion.section key={gen.name} className="mb-14" initial={{ opacity: 0, x: gi % 2 === 0 ? -60 : 60 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: gi * 0.2, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}>
              <div className="flex items-center justify-center w-auto  gap-3 mb-6">
                <motion.div className="w-2.5 h-2.5 rounded-full " style={{ background: gen.color, boxShadow: `0 0 10px ${gen.color}` }} animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 2, repeat: Infinity }} />
                <h2 className="font-accent text-sm tracking-[0.3em]" style={{ color: gen.color }}>{gen.name}</h2>
                <span className="font-accent text-[10px] text-muted-foreground">({gen.members.length} members)</span>
                {/* <div className="flex-1 h-p"  /> */}
              </div>
              <div className="flex flex-wrap gap-4 md:gap-6 justify-center ">
                {gen.members.map((member, i) => (
                  <MemberCard key={member.id} member={member} index={gi * 10 + i} onClick={() => navigate(`/member/${member.id}`)} />
                ))}
              </div>
            </motion.section>
          ))}

          <motion.div className="mt-16 text-center" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2, duration: 0.6 }}>
            <p className="font-accent text-[10px] tracking-[0.4em] text-muted-foreground mb-4">Family Overview</p>
            <div className="inline-flex gap-3 flex-wrap justify-center">
              {GENERATIONS.map(gen => {
                const count = members.filter(m => m.generation === gen.name).length;
                return (
                  <motion.div key={gen.name} className="px-4 py-2.5 rounded-xl glass border border-border text-center min-w-[80px]" whileHover={{ scale: 1.05, y: -3 }}>
                    <p className="font-display text-lg text-foreground">{count}</p>
                    <p className="font-accent text-[9px] tracking-wider text-muted-foreground">{gen.name}</p>
                  </motion.div>
                );
              })}
              <motion.div className="px-4 py-2.5 rounded-xl glass border border-border text-center min-w-[80px]" whileHover={{ scale: 1.05, y: -3 }}>
                <p className="font-display text-lg text-foreground">{totalMembers}</p>
                <p className="font-accent text-[9px] tracking-wider text-muted-foreground">Total</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </main>
    </>
  );
};

export default Members;
