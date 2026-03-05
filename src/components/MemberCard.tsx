import { motion } from "framer-motion";
import { Member } from "@/data/types";
import { getBorderImage } from "@/data/borderFrames";

interface MemberCardProps {
  member: Member;
  index: number;
  onClick: (member: Member) => void;
}

const getAnimationVariant = (anim: string) => {
  switch (anim) {
    case "float":
      return { y: [0, -6, 0], transition: { duration: 3, repeat: Infinity, ease: "easeInOut" } };
    case "pulse":
      return { scale: [1, 1.04, 1], transition: { duration: 2.5, repeat: Infinity, ease: "easeInOut" } };
    case "spin":
      return {};
    case "glitch":
      return { x: [0, -2, 2, -1, 0], transition: { duration: 0.3, repeat: Infinity, repeatDelay: 4 } };
    default:
      return {};
  }
};

const MemberCard = ({ member, index, onClick }: MemberCardProps) => {
  const borderImage = getBorderImage(member.borderFrame);

  return (
    <motion.div
      className="cursor-pointer group flex flex-col items-center"
      initial={{ opacity: 0, scale: 0.5, rotateY: -30 }}
      animate={{ opacity: 1, scale: 1, rotateY: 0 }}
      transition={{ delay: index * 0.06, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ scale: 1.12, z: 50 }}
      whileTap={{ scale: 0.92 }}
      onClick={() => onClick(member)}
      style={{ perspective: "800px" }}
    >
      <motion.div
        className="relative"
        animate={getAnimationVariant(member.animation)}
        style={{ width: 110, height: 110 }}
      >
        {/* Avatar circle */}
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <div className="w-[62px] h-[62px] rounded-full overflow-hidden">
            <img
              src={member.avatar}
              alt={member.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Border frame overlay */}
        {borderImage && (
          <motion.img
            src={borderImage}
            alt=""
            className={`absolute inset-0 w-full h-full object-contain pointer-events-none rounded-full border-anim-${member.borderFrame}`}
            animate={member.animation === "spin" ? { rotate: 360 } : {}}
            transition={member.animation === "spin" ? { duration: 10, repeat: Infinity, ease: "linear" } : {}}
          />
        )}

        {/* Hover glow */}
        <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{ boxShadow: "0 0 30px 10px hsl(210 80% 60% / 0.15)" }}
        />
      </motion.div>

      {/* Name */}
      <motion.p
        className="mt-1 font-accent text-[11px] tracking-wider text-center truncate w-full max-w-[100px]"
        style={{ color: "hsl(0 0% 70%)" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: index * 0.06 + 0.3 }}
      >
        {member.name}
      </motion.p>
    </motion.div>
  );
};

export default MemberCard;
