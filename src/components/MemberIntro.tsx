import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface MemberIntroProps {
  type: string;
  memberName: string;
  onComplete: () => void;
}

const MemberIntro = ({ type, memberName, onComplete }: MemberIntroProps) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setVisible(false), 2500);
    const t2 = setTimeout(onComplete, 3200);
    return () => { clearTimeout(t); clearTimeout(t2); };
  }, [onComplete]);

  const getAnimation = () => {
    switch (type) {
      case "iris":
        return {
          initial: { clipPath: "circle(0% at 50% 50%)", opacity: 1 },
          animate: { clipPath: "circle(100% at 50% 50%)", opacity: 1 },
          exit: { opacity: 0 },
          transition: { duration: 1.5, ease: [0.16, 1, 0.3, 1] },
        };
      case "glitch":
        return {
          initial: { opacity: 1, x: 0 },
          animate: { opacity: 1, x: [0, -10, 10, -5, 5, 0] },
          exit: { opacity: 0, scale: 1.2 },
          transition: { duration: 0.8, ease: "easeOut" },
        };
      case "shatter":
        return {
          initial: { opacity: 1, scale: 3, rotateZ: 45 },
          animate: { opacity: 1, scale: 1, rotateZ: 0 },
          exit: { opacity: 0, scale: 0.5 },
          transition: { duration: 1.2, type: "spring", damping: 12 },
        };
      case "vortex":
        return {
          initial: { opacity: 1, scale: 0, rotate: -720 },
          animate: { opacity: 1, scale: 1, rotate: 0 },
          exit: { opacity: 0, scale: 0, rotate: 360 },
          transition: { duration: 1.5, ease: [0.16, 1, 0.3, 1] },
        };
      case "lightning":
        return {
          initial: { opacity: 0, scaleY: 0 },
          animate: { opacity: [0, 1, 0.5, 1], scaleY: 1 },
          exit: { opacity: 0, y: -100 },
          transition: { duration: 0.8, ease: "easeOut" },
        };
      default:
        return {
          initial: { opacity: 0, scale: 0.8 },
          animate: { opacity: 1, scale: 1 },
          exit: { opacity: 0 },
          transition: { duration: 0.8 },
        };
    }
  };

  const anim = getAnimation();

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center"
          style={{ background: "hsl(0 0% 2%)" }}
          {...anim}
        >
          {/* Glitch overlay lines */}
          {type === "glitch" && (
            <>
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute left-0 right-0"
                  style={{
                    height: 2,
                    top: `${10 + i * 12}%`,
                    background: `hsl(${180 + i * 30} 80% 60% / 0.3)`,
                  }}
                  animate={{ x: [-100, 100, -50, 0], opacity: [0, 1, 0.5, 0] }}
                  transition={{ duration: 0.5, delay: i * 0.05, repeat: 3 }}
                />
              ))}
            </>
          )}

          {/* Lightning flashes */}
          {type === "lightning" && (
            <motion.div
              className="absolute inset-0"
              animate={{
                background: [
                  "hsl(0 0% 2%)",
                  "hsl(210 80% 90% / 0.3)",
                  "hsl(0 0% 2%)",
                  "hsl(270 80% 80% / 0.2)",
                  "hsl(0 0% 2%)",
                ],
              }}
              transition={{ duration: 1, times: [0, 0.1, 0.3, 0.4, 0.6] }}
            />
          )}

          {/* Vortex rings */}
          {type === "vortex" && (
            <>
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute rounded-full border"
                  style={{
                    width: 100 + i * 80,
                    height: 100 + i * 80,
                    borderColor: `hsl(${270 + i * 20} 60% 50% / ${0.3 - i * 0.05})`,
                  }}
                  animate={{ rotate: 360, scale: [1, 1.1, 1] }}
                  transition={{ duration: 2 + i * 0.5, repeat: Infinity, ease: "linear" }}
                />
              ))}
            </>
          )}

          <motion.div
            className="relative z-10 text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <h1 className="font-display text-4xl md:text-6xl tracking-wider text-chrome-bright">
              {memberName}
            </h1>
            <motion.div
              className="h-px mx-auto mt-4"
              style={{ background: "linear-gradient(90deg, transparent, hsl(210 80% 60%), transparent)" }}
              initial={{ width: 0 }}
              animate={{ width: 200 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MemberIntro;
