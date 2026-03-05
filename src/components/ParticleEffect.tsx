import { useEffect, useRef } from "react";

interface ParticleEffectProps {
  effect: string;
}

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  color: string;
  rotation: number;
  rotationSpeed: number;
}

const EFFECT_CONFIGS: Record<string, { colors: string[]; count: number; sizeRange: [number, number]; speedRange: [number, number]; gravity: number }> = {
  snow: { colors: ["#ffffff", "#e0e8ff", "#c8d8ff"], count: 60, sizeRange: [2, 5], speedRange: [0.3, 1.5], gravity: 0.5 },
  fire: { colors: ["#ff4500", "#ff6600", "#ffaa00", "#ff2200"], count: 50, sizeRange: [2, 6], speedRange: [0.5, 2], gravity: -1.5 },
  rain: { colors: ["#4488ff", "#6699ff", "#88bbff"], count: 80, sizeRange: [1, 3], speedRange: [3, 6], gravity: 4 },
  stars: { colors: ["#ffffff", "#ffffcc", "#ffccff", "#ccffff"], count: 40, sizeRange: [1, 4], speedRange: [0.1, 0.5], gravity: 0 },
  sakura: { colors: ["#ffb7c5", "#ff99b4", "#ffc0cb", "#ff85a2"], count: 35, sizeRange: [4, 8], speedRange: [0.3, 1.2], gravity: 0.8 },
  smoke: { colors: ["#444444", "#555555", "#666666", "#777777"], count: 30, sizeRange: [8, 20], speedRange: [0.2, 0.8], gravity: -0.5 },
  sparkle: { colors: ["#ffd700", "#ffed4e", "#fff8dc", "#ffffff"], count: 45, sizeRange: [1, 4], speedRange: [0.2, 1], gravity: 0 },
};

const ParticleEffect = ({ effect }: ParticleEffectProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animFrameRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !effect || effect === "none") return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const config = EFFECT_CONFIGS[effect];
    if (!config) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Init particles
    particlesRef.current = Array.from({ length: config.count }, () => {
      const color = config.colors[Math.floor(Math.random() * config.colors.length)];
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: config.sizeRange[0] + Math.random() * (config.sizeRange[1] - config.sizeRange[0]),
        speedX: (Math.random() - 0.5) * config.speedRange[1],
        speedY: config.speedRange[0] + Math.random() * (config.speedRange[1] - config.speedRange[0]),
        opacity: 0.3 + Math.random() * 0.7,
        color,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 3,
      };
    });

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      for (const p of particlesRef.current) {
        ctx.save();
        ctx.globalAlpha = p.opacity;
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);

        if (effect === "sakura") {
          // Petal shape
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.ellipse(0, 0, p.size, p.size * 0.6, 0, 0, Math.PI * 2);
          ctx.fill();
        } else if (effect === "rain") {
          ctx.strokeStyle = p.color;
          ctx.lineWidth = p.size * 0.5;
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(0, p.size * 4);
          ctx.stroke();
        } else if (effect === "fire") {
          const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, p.size);
          gradient.addColorStop(0, p.color);
          gradient.addColorStop(1, "transparent");
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(0, 0, p.size, 0, Math.PI * 2);
          ctx.fill();
        } else if (effect === "smoke") {
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.opacity * 0.3;
          ctx.beginPath();
          ctx.arc(0, 0, p.size, 0, Math.PI * 2);
          ctx.fill();
        } else if (effect === "sparkle") {
          ctx.fillStyle = p.color;
          // Star shape
          for (let i = 0; i < 4; i++) {
            ctx.beginPath();
            ctx.ellipse(0, 0, p.size * 0.3, p.size, (i * Math.PI) / 4, 0, Math.PI * 2);
            ctx.fill();
          }
        } else {
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(0, 0, p.size, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();

        // Update
        p.x += p.speedX;
        p.y += p.speedY * (config.gravity > 0 ? 1 : -1);
        p.y += config.gravity * 0.3;
        p.rotation += p.rotationSpeed;

        if (effect === "sparkle" || effect === "stars") {
          p.opacity = 0.3 + Math.sin(Date.now() * 0.003 + p.x) * 0.5;
        }

        // Wrap around
        if (p.y > canvas.height + 20) { p.y = -20; p.x = Math.random() * canvas.width; }
        if (p.y < -20) { p.y = canvas.height + 20; p.x = Math.random() * canvas.width; }
        if (p.x > canvas.width + 20) p.x = -20;
        if (p.x < -20) p.x = canvas.width + 20;
      }

      animFrameRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [effect]);

  if (!effect || effect === "none") return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-[5] pointer-events-none"
    />
  );
};

export default ParticleEffect;
