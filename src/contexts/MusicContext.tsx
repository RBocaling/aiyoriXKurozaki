import { createContext, useContext, useState, useRef, useEffect, useCallback, ReactNode } from "react";

export interface Track {
  title: string;
  artist: string;
  url: string;
}

const DEFAULT_TRACKS: Track[] = [
  { title: "Ethereal Drift", artist: "AXK", url: "/bg-music.mp3" },
];

interface MusicContextType {
  isPlaying: boolean;
  currentTrack: number;
  tracks: Track[];
  volume: number;
  isMuted: boolean;
  progress: number;
  duration: number;
  isMemberPlaying: boolean;
  play: () => void;
  pause: () => void;
  toggle: () => void;
  next: () => void;
  prev: () => void;
  setVolume: (v: number) => void;
  toggleMute: () => void;
  seek: (pct: number) => void;
  setMemberTrack: (url: string | undefined) => void;
  clearMemberTrack: () => void;
}

const MusicContext = createContext<MusicContextType | null>(null);

export function MusicProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [volume, setVolumeState] = useState(70);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [memberTrackUrl, setMemberTrackUrl] = useState<string | undefined>();
  const [isMemberPlaying, setIsMemberPlaying] = useState(false);
  const tracks = DEFAULT_TRACKS;

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.volume = 0.7;
      !audioRef.current;
    }
    return () => { audioRef.current?.pause(); };
  }, []);

  const currentUrl = memberTrackUrl || tracks[currentTrack]?.url;

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentUrl) return;
    const wasPlaying = isPlaying;
    audio.src = currentUrl;
    audio.load();
    if (wasPlaying) audio.play().catch(() => {});
  }, [currentUrl]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = isMuted ? 0 : volume / 100;
  }, [volume, isMuted]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onTime = () => { setProgress(audio.currentTime); setDuration(audio.duration || 0); };
const onEnd = () => {
  const audio = audioRef.current;
  if (!audio) return;

  // reset progress
  setProgress(0);

  // restart song
  audio.currentTime = 0;

  // play again
  audio.play().catch(() => {});
};    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("ended", onEnd);
    return () => { audio.removeEventListener("timeupdate", onTime); audio.removeEventListener("ended", onEnd); };
  }, [memberTrackUrl, tracks.length]);

  const play = useCallback(() => { audioRef.current?.play().catch(() => {}); setIsPlaying(true); }, []);
  const pause = useCallback(() => { audioRef.current?.pause(); setIsPlaying(false); }, []);
  const toggle = useCallback(() => { isPlaying ? pause() : play(); }, [isPlaying, play, pause]);
  const next = useCallback(() => { setCurrentTrack(c => (c + 1) % tracks.length); setProgress(0); }, [tracks.length]);
  const prev = useCallback(() => { setCurrentTrack(c => (c - 1 + tracks.length) % tracks.length); setProgress(0); }, [tracks.length]);
  const setVolume = useCallback((v: number) => { setVolumeState(v); setIsMuted(false); }, []);
  const toggleMute = useCallback(() => setIsMuted(m => !m), []);
  const seek = useCallback((pct: number) => { if (audioRef.current && duration) audioRef.current.currentTime = pct * duration; }, [duration]);
  
  const setMemberTrack = useCallback((url: string | undefined) => {
    setMemberTrackUrl(url);
    setIsMemberPlaying(!!url);
  }, []);
  
  const clearMemberTrack = useCallback(() => {
    setMemberTrackUrl(undefined);
    setIsMemberPlaying(false);
  }, []);

  return (
    <MusicContext.Provider value={{ isPlaying, currentTrack, tracks, volume, isMuted, progress, duration, isMemberPlaying, play, pause, toggle, next, prev, setVolume, toggleMute, seek, setMemberTrack, clearMemberTrack }}>
      {children}
    </MusicContext.Provider>
  );
}

export function useMusic() {
  const ctx = useContext(MusicContext);
  if (!ctx) throw new Error("useMusic must be used within MusicProvider");
  return ctx;
}
