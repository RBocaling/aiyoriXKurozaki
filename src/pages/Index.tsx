import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import IntroAnimation from "@/components/IntroAnimation";
import VideoBackground from "@/components/VideoBackground";
import { useMusic } from "@/contexts/MusicContext";
import axkLogo from "@/assets/aiyorixkurozaki-logo.png";

const Index = () => {
  const [showIntro, setShowIntro] = useState(true);
  const [triggered, setTriggered] = useState(false);
  const { play, isPlaying } = useMusic();
  const handleIntroComplete = useCallback(() => setShowIntro(false), []);

  const handleTrigger = () => {
    if (!triggered) {
      setTriggered(true);
      if (!isPlaying) play();
    }
  };

  return (
    <div >
      {showIntro && <IntroAnimation onComplete={handleIntroComplete} />}
      <VideoBackground />

      <main className="relative z-10 min-h-screen flex items-center justify-center pb-16">
        <div
          className="text-center max-w-3xl mx-auto px-6"
          style={{ perspective: "1200px" }}
        >
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.6, rotateX: 25 }}
            animate={{
              opacity: showIntro ? 0 : 1,
              scale: showIntro ? 0.6 : 1,
              rotateX: showIntro ? 25 : 0,
            }}
            transition={{ delay: 0.2, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <img
              src={axkLogo}
              alt="Aiyori X Kurozaki"
              className="w-[280px] md:w-[450px] mx-auto mb-8"
            />
          </motion.div>

          {/* Subtitle */}
          <motion.p
            className="font-accent text-xs tracking-[0.5em] mb-8"
            style={{ color: "hsl(0 0% 35%)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: showIntro ? 0 : 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            AIYORI <span style={{ color: "hsl(0 80% 55%)" }}>✕</span> KUROZAKI
          </motion.p>

          {/* Description */}
          <motion.p
            className="font-body text-sm md:text-base leading-relaxed max-w-2xl mx-auto"
            style={{ color: "hsl(0 0% 50%)" }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: showIntro ? 0 : 1, y: showIntro ? 30 : 0 }}
            transition={{ delay: 0.7, duration: 1 }}
          >
            Aiyori is the whisper that rots your mind from the inside, and
            Kurozaki is the shadow that makes sure you never recover; together
            they don't chase fear—they create it, moving in perfect, merciless
            sync like a curse that doesn't scream, only watches and waits until
            it's too late.
          </motion.p>

          {/* <motion.div
            className="mt-10 font-accent text-[10px] tracking-[0.8em]"
            style={{ color: "hsl(0 0% 25%)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: showIntro ? 0 : 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
          >
            A<span className="text-red-500/60 text-lg">X</span>K
          </motion.div> */}
        </div>
      </main>
    </div>
  );
};

export default Index;
