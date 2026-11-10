import { useEffect, useRef } from "react";

interface Flake {
  x: number;
  y: number;
  r: number;
  vy: number;
  amp: number;
  ph: number;
  fr: number;
  a: number;
}

/** Мягкий падающий снег на canvas (лёгкий, со спрайтом вместо градиента на каждый кадр) */
export function SnowCanvas({ visible = true }: { visible?: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d")!;
    let w = 0;
    let h = 0;
    let raf = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    // спрайт снежинки-«боке»
    const sprite = document.createElement("canvas");
    sprite.width = sprite.height = 64;
    const sctx = sprite.getContext("2d")!;
    const g = sctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    g.addColorStop(0, "rgba(255,255,255,1)");
    g.addColorStop(0.35, "rgba(255,255,255,0.85)");
    g.addColorStop(1, "rgba(255,255,255,0)");
    sctx.fillStyle = g;
    sctx.fillRect(0, 0, 64, 64);

    let flakes: Flake[] = [];

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = w < 600 ? 70 : 140;
      flakes = Array.from({ length: count }, () => spawn(true));
    };

    const spawn = (anywhere: boolean): Flake => {
      const depth = Math.random();
      return {
        x: Math.random() * w,
        y: anywhere ? Math.random() * h : -20,
        r: 2 + depth * depth * 9,
        vy: 0.35 + depth * 1.3,
        amp: 6 + Math.random() * 26,
        ph: Math.random() * Math.PI * 2,
        fr: 0.4 + Math.random() * 0.9,
        a: 0.35 + depth * 0.6,
      };
    };

    let t = 0;
    const tick = () => {
      t += 0.016;
      ctx.clearRect(0, 0, w, h);
      for (let i = 0; i < flakes.length; i++) {
        const f = flakes[i];
        f.y += f.vy;
        const x = f.x + Math.sin(t * f.fr + f.ph) * f.amp;
        if (f.y > h + 20) flakes[i] = spawn(false);
        ctx.globalAlpha = f.a;
        const s = f.r * 2.4;
        ctx.drawImage(sprite, x - s / 2, f.y - s / 2, s, s);
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(tick);
    };

    resize();
    tick();
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      className="pointer-events-none fixed inset-0 z-[1] transition-opacity duration-1000"
      style={{ opacity: visible ? 1 : 0 }}
    />
  );
}
