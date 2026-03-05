import { motion, AnimatePresence } from "framer-motion";
import { Member } from "@/data/types";
import { getBorderImage } from "@/data/borderFrames";
import { X, MessageCircle, ExternalLink, Send, Instagram } from "lucide-react";

interface MemberModalProps {
  member: Member | null;
  onClose: () => void;
}

const MemberModal = ({ member, onClose }: MemberModalProps) => {
  if (!member) return null;

  const borderImage = getBorderImage(member.borderFrame);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[80] flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0"
          style={{ background: "hsl(0 0% 0% / 0.9)", backdropFilter: "blur(20px)" }}
          onClick={onClose}
        />

        {/* Card with 3D entrance */}
        <motion.div
          className="relative glass border border-border rounded-3xl max-w-sm w-full overflow-hidden"
          initial={{ scale: 0.3, opacity: 0, rotateX: 40, rotateY: -20, z: -200 }}
          animate={{ scale: 1, opacity: 1, rotateX: 0, rotateY: 0, z: 0 }}
          exit={{ scale: 0.5, opacity: 0, rotateX: -20 }}
          transition={{ type: "spring", damping: 18, stiffness: 200 }}
          style={{ perspective: "1000px", transformStyle: "preserve-3d" }}
        >
          <button onClick={onClose} className="absolute top-4 right-4 z-10 text-muted-foreground hover:text-foreground transition-colors">
            <X className="w-5 h-5" />
          </button>

          {member.backgroundImage && (
            <div className="absolute inset-0 opacity-15">
              <img src={member.backgroundImage} alt="" className="w-full h-full object-cover" />
            </div>
          )}

          <div className="relative p-8 flex flex-col items-center text-center">
            {/* Avatar with border frame */}
            <motion.div
              className="relative mb-6"
              style={{ width: 160, height: 160 }}
              initial={{ scale: 0, rotateZ: -20 }}
              animate={{ scale: 1, rotateZ: 0 }}
              transition={{ delay: 0.2, type: "spring", damping: 15 }}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-[90px] h-[90px] rounded-full overflow-hidden">
                  <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" />
                </div>
              </div>
              {borderImage && (
                <img src={borderImage} alt="" className="absolute inset-0 w-full h-full object-contain pointer-events-none" />
              )}
            </motion.div>

            <motion.h2
              className="font-display text-xl tracking-wider text-chrome-bright mb-1"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
            >
              {member.name}
            </motion.h2>

            <motion.p
              className="font-accent text-xs tracking-[0.3em] text-muted-foreground mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.45 }}
            >
              {member.generation}
            </motion.p>

            {/* Social links */}
            <motion.div
              className="flex gap-3 flex-wrap justify-center"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 }}
            >
              {member.discord && (
                <a href="#" className="flex items-center gap-2 px-3 py-2 rounded-xl bg-secondary text-secondary-foreground hover:bg-surface-hover transition-all hover:scale-105 text-xs font-accent tracking-wider">
                  <MessageCircle className="w-3.5 h-3.5" /> Discord
                </a>
              )}
              {member.twitter && (
                <a href={member.twitter} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-3 py-2 rounded-xl bg-secondary text-secondary-foreground hover:bg-surface-hover transition-all hover:scale-105 text-xs font-accent tracking-wider">
                  <ExternalLink className="w-3.5 h-3.5" /> X
                </a>
              )}
              {member.telegram && (
                <a href={member.telegram} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-3 py-2 rounded-xl bg-secondary text-secondary-foreground hover:bg-surface-hover transition-all hover:scale-105 text-xs font-accent tracking-wider">
                  <Send className="w-3.5 h-3.5" /> Telegram
                </a>
              )}
              {member.instagram && (
                <a href={member.instagram} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-3 py-2 rounded-xl bg-secondary text-secondary-foreground hover:bg-surface-hover transition-all hover:scale-105 text-xs font-accent tracking-wider">
                  <Instagram className="w-3.5 h-3.5" /> Instagram
                </a>
              )}
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default MemberModal;
