export interface Member {
  id: string;
  name: string;
  avatar: string;
  generation: string;
  borderFrame: string;
  animation: string;
  discord?: string;
  twitter?: string;
  telegram?: string;
  instagram?: string;
  tiktok?: string;
  kick?: string;
  spotify?: string;
  gunslol?: string;
  facebook?: string;
  steam?: string;
  roblox?: string;
  soundUrl?: string;
  backgroundImage?: string;
  backgroundGif?: string;
  customDesign: "chrome" | "glass" | "neon";
  introAnimation?: "iris" | "glitch" | "shatter" | "vortex" | "lightning";
  particleEffect?: "none" | "snow" | "fire" | "rain" | "stars" | "sakura" | "smoke" | "sparkle";
  socialIconStyle?: "default" | "neon" | "gradient" | "glass" | "outline" | "pill";
  children?: string[];
  partners?: string[];
  views?: number;
}

export interface Generation {
  name: string;
  color: string;
  memberCount: number;
}
