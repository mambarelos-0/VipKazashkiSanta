import { useId } from "react";
import { HangingBauble } from "./Bauble";

const BULB_COLORS = ["#9fe0ff", "#ffffff", "#5fb4ff", "#d8f3ff", "#7fd0ff"];

/** Гирлянда с огоньками, провисающая дугами */
export function LightGarland() {
  const swags = 4;
  const bulbs: { x: number; y: number; c: string; d: number }[] = [];
  let n = 0;
  for (let k = 0; k < swags; k++) {
    for (const t of [0.14, 0.38, 0.62, 0.86]) {
      const x = (k + t) * (100 / swags);
      const y = 2 + 36 * t * (1 - t);
      bulbs.push({ x, y, c: BULB_COLORS[n % BULB_COLORS.length], d: (n * 0.37) % 2.4 });
      n++;
    }
  }
  const path = Array.from({ length: swags }, (_, k) => {
    const x0 = (k * 100) / swags;
    const xm = x0 + 100 / swags / 2;
    const x1 = x0 + 100 / swags;
    return `${k === 0 ? `M${x0} 2` : ""} Q${xm} 20 ${x1} 2`;
  }).join(" ");

  return (
    <div className="pointer-events-none absolute left-0 right-0 top-0 z-[5] h-12">
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 20" preserveAspectRatio="none">
        <path d={path} fill="none" stroke="#bfe3ff" strokeOpacity="0.85" strokeWidth="1.6" vectorEffect="non-scaling-stroke" />
      </svg>
      {bulbs.map((b, i) => (
        <span
          key={i}
          className="twinkle absolute block rounded-full"
          style={{
            left: `${b.x}%`,
            top: `${b.y * 2.3}px`,
            width: 9,
            height: 13,
            marginLeft: -4.5,
            background: b.c,
            boxShadow: `0 0 12px 3px ${b.c}, 0 0 28px 6px ${b.c}66`,
            animationDelay: `${b.d}s`,
            borderRadius: "50% 50% 55% 55%",
          }}
        />
      ))}
    </div>
  );
}

/** Верхний декор: гирлянда + игрушки по бокам (центр свободен для текста) */
export function Decor({ compact = false }: { compact?: boolean }) {
  return (
    <div className="pointer-events-none absolute left-0 right-0 top-0 z-[5] h-[260px] overflow-visible">
      <LightGarland />
      <HangingBauble left="5%" length={compact ? 40 : 62} size={52} from="#8fd0ff" to="#1560c8" pattern="flake" cap="silver" delay={0} duration={5.2} />
      <HangingBauble left="15%" length={compact ? 90 : 128} size={42} from="#ffffff" to="#7fb9ea" pattern="stripes" cap="gold" delay={1} duration={4.6} />
      <HangingBauble left="26%" length={compact ? 28 : 36} size={34} from="#b5e4ff" to="#2f86e0" pattern="dots" cap="silver" delay={2} duration={5.8} />
      <HangingBauble left="74%" length={compact ? 30 : 40} size={36} from="#d9f1ff" to="#4d9be6" pattern="zigzag" cap="gold" delay={1.5} duration={5.4} />
      <HangingBauble left="85%" length={compact ? 96 : 134} size={44} from="#9ad8ff" to="#0e4fb5" pattern="dots" cap="silver" delay={0.5} duration={4.9} />
      <HangingBauble left="95%" length={compact ? 44 : 66} size={54} from="#ffffff" to="#5aa6ee" pattern="flake" cap="gold" delay={2.5} duration={5.6} />
    </div>
  );
}

/** Маленькая заснеженная ёлочка */
export function Fir({ className, flip = false }: { className?: string; flip?: boolean }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg
      viewBox="0 -12 120 192"
      className={className}
      style={{ transform: flip ? "scaleX(-1)" : undefined }}
      aria-hidden
    >
      <defs>
        <linearGradient id={`f${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2a8bc9" />
          <stop offset="100%" stopColor="#0b3d86" />
        </linearGradient>
        <radialGradient id={`s${id}`} cx="40%" cy="35%">
          <stop offset="0%" stopColor="#fff7c9" />
          <stop offset="100%" stopColor="#e0a92b" />
        </radialGradient>
      </defs>
      <rect x="53" y="150" width="14" height="26" rx="3" fill="#2a2f55" />
      <polygon points="60,70 112,152 8,152" fill={`url(#f${id})`} />
      <polygon points="60,38 100,108 20,108" fill={`url(#f${id})`} />
      <polygon points="60,10 88,66 32,66" fill={`url(#f${id})`} />
      {/* снежные шапки */}
      <path d="M32 66 L60 10 L88 66 Q74 60 66 68 Q58 58 50 68 Q42 60 32 66 Z" fill="#fff" opacity="0.95" />
      <path d="M20 108 L60 38 L100 108 Q84 100 74 110 Q64 98 54 110 Q42 100 20 108 Z" fill="#fff" opacity="0.9" />
      <path d="M8 152 L60 70 L112 152 Q92 142 80 154 Q68 140 56 154 Q42 142 8 152 Z" fill="#fff" opacity="0.85" />
      {/* шарики */}
      {[
        [48, 92, "#7fd0ff"],
        [74, 100, "#ffffff"],
        [60, 124, "#4aa6f5"],
        [34, 138, "#ffffff"],
        [88, 134, "#7fd0ff"],
        [58, 54, "#7fd0ff"],
        [66, 82, "#c6ecff"],
      ].map(([x, y, c], i) => (
        <circle key={i} cx={x as number} cy={y as number} r="4.2" fill={c as string} className="twinkle" style={{ animationDelay: `${i * 0.3}s` }} />
      ))}
      {/* звезда */}
      <path
        d="M60 -6 L64 4 L75 4.5 L66.5 11 L69.5 22 L60 15.5 L50.5 22 L53.5 11 L45 4.5 L56 4 Z"
        fill={`url(#s${id})`}
        transform="translate(0 4)"
      />
    </svg>
  );
}

/** Сугробы + ёлочки внизу страницы */
export function Drifts() {
  return (
    <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-[4] h-[170px] overflow-hidden">
      <Fir className="absolute bottom-6 -left-3 h-[150px] w-[100px] opacity-95 md:left-[6%] md:h-[190px] md:w-[126px]" />
      <Fir className="absolute bottom-4 -right-4 h-[170px] w-[112px] md:right-[6%] md:h-[210px] md:w-[140px]" flip />
      <svg className="absolute bottom-0 h-full w-full" viewBox="0 0 1440 170" preserveAspectRatio="none">
        <defs>
          <linearGradient id="dr1" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#b9dfff" />
            <stop offset="100%" stopColor="#6fb4ee" />
          </linearGradient>
          <linearGradient id="dr2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#cfe9ff" />
          </linearGradient>
        </defs>
        <path d="M0 80 C180 30 360 110 560 70 C760 30 940 110 1160 60 C1290 35 1380 60 1440 70 L1440 170 L0 170 Z" fill="url(#dr1)" opacity="0.8" />
        <path d="M0 118 C200 78 380 150 620 112 C860 74 1040 150 1250 108 C1350 90 1410 100 1440 106 L1440 170 L0 170 Z" fill="url(#dr2)" />
      </svg>
    </div>
  );
}
