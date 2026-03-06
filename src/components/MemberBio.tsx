import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface MemberBioProps {
  bio: string;
  visible: boolean;
}

const MemberBio = ({ bio, visible }: MemberBioProps) => {
  const [phase, setPhase] = useState<"lightning" | "typing" | "done">(
    "lightning",
  );
  const [displayedText, setDisplayedText] = useState("");
  const [showCursor, setShowCursor] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number>(0);
  const [flashes, setFlashes] = useState(0);

  // Phase 1: Lightning strikes first
  useEffect(() => {
    if (!visible || !bio) return;
    setPhase("lightning");
    setDisplayedText("");
    setShowCursor(true);
    setFlashes(0);

    let count = 0;
    const flashInterval = setInterval(() => {
      setFlashes((prev) => prev + 1);
      count++;
      if (count >= 3) {
        clearInterval(flashInterval);
        setTimeout(() => setPhase("typing"), 400);
      }
    }, 500);

    return () => clearInterval(flashInterval);
  }, [bio, visible]);

  // Phase 2: Typewriter after lightning
  useEffect(() => {
    if (phase !== "typing" || !bio) return;
    let i = 0;
    const interval = setInterval(() => {
      if (i < bio.length) {
        setDisplayedText(bio.slice(0, i + 1));
        i++;
      } else {
        clearInterval(interval);
        setPhase("done");
        setTimeout(() => setShowCursor(false), 1200);
      }
    }, 28);
    return () => clearInterval(interval);
  }, [phase, bio]);

  // Electric canvas effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !visible) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth * 2;
      canvas.height = canvas.offsetHeight * 2;
    };
    resize();

    interface Bolt {
      points: { x: number; y: number }[];
      life: number;
      maxLife: number;
      width: number;
    }
    interface Ember {
      x: number;
      y: number;
      vx: number;
      vy: number;
      life: number;
      maxLife: number;
      size: number;
      hue: number;
    }

    const bolts: Bolt[] = [];
    const embers: Ember[] = [];

    const createBolt = () => {
      const startX = Math.random() * canvas.width;
      const points = [{ x: startX, y: 0 }];
      let y = 0;
      while (y < canvas.height) {
        y += 10 + Math.random() * 25;
        const lastX = points[points.length - 1].x;
        points.push({ x: lastX + (Math.random() - 0.5) * 60, y });
      }
      bolts.push({
        points,
        life: 0,
        maxLife: 12 + Math.random() * 8,
        width: 1 + Math.random() * 2,
      });
    };

    let frame = 0;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      frame++;

      // Spawn bolts occasionally
      if (frame % 90 === 0 || (frame < 60 && frame % 15 === 0)) createBolt();

      // Spawn embers
      if (frame % 4 === 0) {
        embers.push({
          x: Math.random() * canvas.width,
          y: canvas.height * (0.3 + Math.random() * 0.7),
          vx: (Math.random() - 0.5) * 2,
          vy: -(Math.random() * 1.5 + 0.5),
          life: 0,
          maxLife: 40 + Math.random() * 60,
          size: Math.random() * 2 + 0.5,
          hue: 10 + Math.random() * 25, // red-orange range
        });
      }

      // Draw bolts
      for (let i = bolts.length - 1; i >= 0; i--) {
        const b = bolts[i];
        b.life++;
        const alpha = (1 - b.life / b.maxLife) * 0.8;
        if (alpha <= 0) {
          bolts.splice(i, 1);
          continue;
        }

        ctx.beginPath();
        ctx.moveTo(b.points[0].x, b.points[0].y);
        for (let j = 1; j < b.points.length; j++) {
          ctx.lineTo(b.points[j].x, b.points[j].y);
        }
        // Core
        ctx.strokeStyle = `rgba(255, 120, 30, ${alpha})`;
        ctx.lineWidth = b.width;
        ctx.stroke();
        // Glow
        ctx.strokeStyle = `rgba(255, 60, 20, ${alpha * 0.4})`;
        ctx.lineWidth = b.width * 4;
        ctx.stroke();
      }

      // Draw embers
      for (let i = embers.length - 1; i >= 0; i--) {
        const e = embers[i];
        e.x += e.vx;
        e.y += e.vy;
        e.life++;
        const alpha = 1 - e.life / e.maxLife;
        if (alpha <= 0) {
          embers.splice(i, 1);
          continue;
        }

        ctx.beginPath();
        ctx.arc(e.x, e.y, e.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${e.hue}, 100%, 55%, ${alpha * 0.8})`;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(e.x, e.y, e.size * 3, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${e.hue}, 100%, 45%, ${alpha * 0.12})`;
        ctx.fill();
      }

      animFrameRef.current = requestAnimationFrame(animate);
    };
    animate();

    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [visible]);

  if (!bio) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="relative mb-2 px-2 overflow-hidden sbg-red-500"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.8 }}
        >
          {/* Electric canvas */}
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none z-0"
            style={{ opacity: 0.5 }}
          />

          {/* Lightning flash overlay */}
          <AnimatePresence>
            {phase === "lightning" && flashes > 0 && (
              <motion.div
                key={`flash-${flashes}`}
                className="absolute inset-0 rounded-2xl pointer-events-none z-10"
                initial={{ opacity: 0.9 }}
                animate={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                style={{
                  background:
                    "radial-gradient(ellipse at center, rgba(255,100,20,0.25) 0%, rgba(255,40,10,0.08) 50%, transparent 80%)",
                }}
              />
            )}
          </AnimatePresence>

          {/* Bio text */}
          <div className="relative z-20 py-4 px-1">
            <div className="relative z-20 py-4 px-1">
              <motion.p
                className="font-body text-sm md:text-base leading-relaxed text-center tracking-wide"
                initial={{ opacity: 0 }}
                animate={{ opacity: phase === "lightning" ? 0 : 1 }}
                transition={{ duration: 0.4 }}
                style={{
                  textShadow:
                    "0 0 6px rgba(255,255,255,0.7), 0 0 12px rgba(255,255,255,0.4), 0 0 24px rgba(255,255,255,0.2), 0 2px 6px rgba(0,0,0,0.2)",
                }}
              >
                {/* SHIMMER TEXT */}
                <motion.span
                  className="inline-block font-bold text-sm md:text-lg"
                  style={{
                    color: "#ff3b1f",
                    position: "relative",
                    textShadow:
                      "0 0 6px rgba(255,60,20,0.7), 0 0 12px rgba(255,80,30,0.5), 0 0 24px rgba(255,40,10,0.3)",
                  }}
                >
                  {/* base text */}
                  {displayedText}

                  {/* sword shine */}
                  {phase === "done" && (
                    <motion.span
                      style={{
                        position: "absolute",
                        inset: 0,
                        background:
                          "linear-gradient(110deg, transparent 40%, rgba(255,140,40,0.9) 48%, rgba(255,220,160,1) 50%, rgba(255,140,40,0.9) 52%, transparent 60%)",
                        backgroundSize: "200% 100%",
                        WebkitBackgroundClip: "text",
                        backgroundClip: "text",
                        color: "transparent",
                        pointerEvents: "none",
                      }}
                      animate={{
                        backgroundPosition: ["-200% 0%", "200% 0%"],
                      }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        repeatDelay: 3,
                        ease: "easeInOut",
                      }}
                    >
                      {displayedText}
                    </motion.span>
                  )}
                </motion.span>

                {/* CURSOR */}
                {showCursor && phase !== "lightning" && (
                  <motion.span
                    className="inline-block w-[2px] h-[1.1em] ml-0.5 align-text-bottom"
                    style={{
                      background: "#ffffff",
                      boxShadow: "0 0 6px rgba(255,255,255,0.9)",
                    }}
                    animate={{ opacity: [1, 0, 1] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                  />
                )}
              </motion.p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MemberBio;
