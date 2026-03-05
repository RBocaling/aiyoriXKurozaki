import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axkLogo from "@/assets/aiyorixkurozaki-logo.png";

interface IntroAnimationProps {
  onComplete: () => void;
}

const IntroAnimation = ({ onComplete }: IntroAnimationProps) => {
  const [phase, setPhase] = useState<"black" | "iris" | "logo" | "done">("black");

  useEffect(() => {
    const t0 = setTimeout(() => setPhase("iris"), 300);
    const t1 = setTimeout(() => setPhase("logo"), 1200);
    const t2 = setTimeout(() => setPhase("done"), 4500);
    const t3 = setTimeout(() => onComplete(), 5500);
    return () => { clearTimeout(t0); clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {phase !== "done" && (
        <motion.div
          className="fixed inset-0 z-[200] flex items-center justify-center"
          style={{ background: "hsl(0 0% 2%)" }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
        >
          {/* Bokeh particles */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                width: 60 + i * 30,
                height: 60 + i * 30,
                background: `radial-gradient(circle, hsl(${0 + i * 10} 60% 40% / 0.08), transparent)`,
                top: `${15 + i * 12}%`,
                left: `${10 + i * 15}%`,
              }}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.2, 0.5, 0.2],
                x: [0, 20, 0],
                y: [0, -15, 0],
              }}
              transition={{ duration: 3 + i * 0.5, repeat: Infinity, delay: i * 0.3 }}
            />
          ))}

          {/* Circle iris reveal */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ clipPath: "circle(0% at 50% 50%)" }}
            animate={{
              clipPath: phase === "iris"
                ? "circle(8% at 50% 50%)"
                : phase === "logo"
                ? "circle(60% at 50% 50%)"
                : "circle(100% at 50% 50%)",
            }}
            transition={{
              duration: phase === "iris" ? 0.9 : 1.5,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
          >
            <div className="absolute inset-0" style={{
              background: "radial-gradient(circle at center, hsl(0 0% 5%), hsl(0 0% 2%))"
            }} />

            {/* 3D perspective container */}
            <motion.div
              className="relative z-10"
              style={{ perspective: "1200px" }}
            >
              <motion.div
                initial={{ rotateX: 30, rotateY: -15, scale: 0.3, opacity: 0 }}
                animate={["logo", "done"].includes(phase) ? {
                  rotateX: 0,
                  rotateY: 0,
                  scale: 1,
                  opacity: 1,
                } : { rotateX: 30, rotateY: -15, scale: 0.3, opacity: 0 }}
                transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                style={{ transformStyle: "preserve-3d" }}
              >
                {/* Logo image */}
                <motion.img
                  src={axkLogo}
                  alt="Aiyori X Kurozaki"
                  className="w-[300px] md:w-[500px] h-auto"
                  animate={["logo", "done"].includes(phase) ? {
                    filter: ["brightness(0.5)", "brightness(1.2)", "brightness(1)"],
                  } : {}}
                  transition={{ duration: 1.5, delay: 0.3 }}
                />

                {/* Subtitle */}
                <motion.p
                  className="text-center font-accent text-sm md:text-base tracking-[0.6em] mt-4"
                  style={{ color: "hsl(0 0% 40%)" }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={["logo", "done"].includes(phase) ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.8, duration: 0.8 }}
                >
                  AXK
                </motion.p>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Cinematic bars */}
          <motion.div
            className="absolute top-0 left-0 right-0 h-16"
            style={{ background: "hsl(0 0% 0%)" }}
            initial={{ y: 0 }}
            animate={phase === "logo" ? { y: -80 } : { y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          />
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-16"
            style={{ background: "hsl(0 0% 0%)" }}
            initial={{ y: 0 }}
            animate={phase === "logo" ? { y: 80 } : { y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default IntroAnimation;
