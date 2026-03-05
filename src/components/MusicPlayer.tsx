import { motion } from "framer-motion";
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX } from "lucide-react";
import { useMusic } from "@/contexts/MusicContext";

const MusicPlayer = () => {
  const { isPlaying, currentTrack, tracks, volume, isMuted, progress, duration, isMemberPlaying, toggle, next, prev, setVolume, toggleMute, seek } = useMusic();

  const pct = duration > 0 ? (progress / duration) * 100 : 0;
  const fmt = (s: number) => { const m = Math.floor(s / 60); return `${m}:${String(Math.floor(s % 60)).padStart(2, "0")}`; };

  return (
    <motion.div
      className="fixed bottom-0 left-0 right-0 z-50"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ delay: 1, type: "spring", damping: 25 }}
    >
      <div className="glass border-t border-border">
        {/* Progress bar */}
        <div className="h-0.5 w-full relative cursor-pointer" style={{ background: "hsl(0 0% 15%)" }} onClick={e => { const r = e.currentTarget.getBoundingClientRect(); seek((e.clientX - r.left) / r.width); }}>
          <motion.div className="h-full" style={{ width: `${pct}%`, background: isMemberPlaying ? "hsl(0 80% 55%)" : "hsl(var(--glow))" }} />
        </div>

        <div className="flex items-center justify-between px-4 md:px-8 py-2.5 max-w-screen-xl mx-auto">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <motion.div
              className="w-10 h-10 rounded-full overflow-hidden shrink-0 border border-border"
              animate={isPlaying ? { rotate: 360 } : {}}
              transition={isPlaying ? { duration: 8, repeat: Infinity, ease: "linear" } : {}}
            >
              <div className="w-full h-full" style={{ background: isMemberPlaying ? "linear-gradient(135deg, hsl(0 40% 20%), hsl(0 30% 15%))" : "linear-gradient(135deg, hsl(270 40% 20%), hsl(210 30% 15%))" }} />
            </motion.div>
            <div className="min-w-0">
              <p className="font-accent text-sm tracking-wider text-foreground truncate">
                {isMemberPlaying ? "Member Track" : (tracks[currentTrack]?.title || "No Track")}
              </p>
              <p className="font-accent text-[10px] tracking-wider text-muted-foreground">{fmt(progress)} / {fmt(duration || 0)}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 md:gap-5">
            <motion.button onClick={prev} className="text-muted-foreground hover:text-foreground transition-colors" whileTap={{ scale: 0.85 }}><SkipBack className="w-4 h-4" /></motion.button>
            <motion.button
              className="w-10 h-10 rounded-full flex items-center justify-center border border-border"
              style={{ background: "hsl(var(--secondary))" }}
              whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
              onClick={toggle}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
            </motion.button>
            <motion.button onClick={next} className="text-muted-foreground hover:text-foreground transition-colors" whileTap={{ scale: 0.85 }}><SkipForward className="w-4 h-4" /></motion.button>
          </div>

          <div className="hidden md:flex items-center gap-3 flex-1 justify-end">
            <button onClick={toggleMute} className="text-muted-foreground hover:text-foreground transition-colors">
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <span className="font-accent text-[10px] tracking-wider text-muted-foreground">VOL</span>
            <input
              type="range" min="0" max="100"
              value={isMuted ? 0 : volume}
              onChange={e => setVolume(Number(e.target.value))}
              className="w-24 h-1 rounded-full appearance-none cursor-pointer"
              style={{ background: `linear-gradient(to right, hsl(0 0% 70%) ${isMuted ? 0 : volume}%, hsl(0 0% 20%) ${isMuted ? 0 : volume}%)` }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MusicPlayer;
