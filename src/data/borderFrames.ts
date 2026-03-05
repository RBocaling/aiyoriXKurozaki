import borderGold from "@/assets/border-gold.png";
import borderElectric from "@/assets/border-electric.png";
import borderPlasma from "@/assets/border-plasma.png";
import borderFire from "@/assets/border-fire.png";
import borderFrost from "@/assets/border-frost.png";
import borderToxic from "@/assets/border-toxic.png";
import borderSakura from "@/assets/border-sakura.png";
import borderRainbow from "@/assets/border-rainbow.png";
import borderShadow from "@/assets/border-shadow.png";
import borderDiamond from "@/assets/border-diamond.png";

export interface BorderFrame {
  id: string;
  name: string;
  image: string;
  category: string;
}

export const BORDER_FRAMES: BorderFrame[] = [
  { id: "gold", name: "Royal Gold", image: borderGold, category: "legendary" },
  { id: "electric", name: "Electric Storm", image: borderElectric, category: "epic" },
  { id: "plasma", name: "Plasma Void", image: borderPlasma, category: "epic" },
  { id: "fire", name: "Dragon Fire", image: borderFire, category: "epic" },
  { id: "frost", name: "Ice Crown", image: borderFrost, category: "epic" },
  { id: "toxic", name: "Venom Strike", image: borderToxic, category: "rare" },
  { id: "sakura", name: "Cherry Bloom", image: borderSakura, category: "rare" },
  { id: "rainbow", name: "Prismatic", image: borderRainbow, category: "legendary" },
  { id: "shadow", name: "Dark Abyss", image: borderShadow, category: "rare" },
  { id: "diamond", name: "Diamond Star", image: borderDiamond, category: "legendary" },
];

export function getBorderImage(borderId: string): string | undefined {
  return BORDER_FRAMES.find(b => b.id === borderId)?.image;
}
