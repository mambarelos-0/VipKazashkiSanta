import { useId } from "react";
import { motion } from "framer-motion";
import { SnowflakeShape } from "./Snowflake";

export type Pattern = "plain" | "stripes" | "dots" | "flake" | "zigzag";

interface BaubleProps {
  size: number;
  from: string; // светлый цвет
  to: string; // тёмный цвет
  pattern?: Pattern;
  cap?: "gold" | "silver";
}

/** Одна детализированная ёлочная игрушка (без подвеса) */
export function BaubleBall({ size, from, to, pattern = "plain", cap = "silver" }: BaubleProps) {
  const id = useId().replace(/:/g, "");
  const capLight = cap === "gold" ? "#fff0b0" : "#ffffff";
  const capDark = cap === "gold" ? "#b8861f" : "#8fa7c4";
  return (
    <svg width={size} height={size * 1.16} viewBox="0 0 100 116" style={{ overflow: "visible" }}>
      <defs>
        <radialGradient id={`b${id}`} cx="35%" cy="30%" r="80%">
          <stop offset="0%" stopColor={from} />
          <stop offset="55%" stopColor={to} />
          <stop offset="100%" stopColor="#020d2c" stopOpacity="0.85" />
        </radialGradient>
        <linearGradient id={`c${id}`} x1="0" x2="1">
          <stop offset="0%" stopColor={capDark} />
          <stop offset="45%" stopColor={capLight} />
          <stop offset="100%" stopColor={capDark} />
        </linearGradient>
        <clipPath id={`k${id}`}>
          <circle cx="50" cy="68" r="47" />
        </clipPath>
      </defs>

      {/* колпачок */}
      <circle cx="50" cy="3" r="5" fill="none" stroke={capDark} strokeWidth="2" />
      <rect x="39" y="6" width="22" height="14" rx="3" fill={`url(#c${id})`} />
      <rect x="37" y="17" width="26" height="5" rx="2.5" fill={`url(#c${id})`} />

      {/* шар */}
      <circle cx="50" cy="68" r="47" fill={`url(#b${id})`} />
      <g clipPath={`url(#k${id})`}>
        {pattern === "stripes" && (
          <g fill="#fff" opacity="0.28">
            <rect x="0" y="52" width="100" height="9" transform="rotate(-18 50 68)" />
            <rect x="0" y="70" width="100" height="9" transform="rotate(-18 50 68)" />
            <rect x="0" y="88" width="100" height="9" transform="rotate(-18 50 68)" />
          </g>
        )}
        {pattern === "dots" && (
          <g fill="#fff" opacity="0.4">
            {[0, 1, 2, 3, 4].flatMap((r) =>
              [0, 1, 2, 3, 4].map((c) => (
                <circle key={`${r}-${c}`} cx={14 + c * 18 + (r % 2) * 9} cy={32 + r * 16} r="3.2" />
              ))
            )}
          </g>
        )}
        {pattern === "zigzag" && (
          <g fill="none" stroke="#fff" strokeWidth="4" opacity="0.4" strokeLinejoin="round">
            <path d="M0 58 L12 48 L24 58 L36 48 L48 58 L60 48 L72 58 L84 48 L96 58 L108 48" />
            <path d="M0 82 L12 72 L24 82 L36 72 L48 82 L60 72 L72 82 L84 72 L96 82 L108 72" />
          </g>
        )}
        {pattern === "flake" && (
          <g transform="translate(50 70) scale(0.78)" stroke="#fff" color="#fff" opacity="0.92">
            <SnowflakeShape sw={3.6} />
          </g>
        )}
        {/* нижний отблеск */}
        <ellipse cx="62" cy="108" rx="34" ry="12" fill="#fff" opacity="0.14" />
      </g>

      {/* блики */}
      <ellipse cx="33" cy="42" rx="15" ry="8" fill="#fff" opacity="0.75" transform="rotate(-35 33 42)" />
      <circle cx="24" cy="58" r="2.6" fill="#fff" opacity="0.7" />
      <path d="M82 52 A38 38 0 0 1 70 100" fill="none" stroke="#fff" strokeOpacity="0.22" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

interface HangingProps extends BaubleProps {
  left: string; // CSS left
  length: number; // длина нити
  delay?: number;
  duration?: number;
}

/** Игрушка, висящая на нити от верха экрана: падает при появлении и качается */
export function HangingBauble({ left, length, delay = 0, duration = 5, ...ball }: HangingProps) {
  return (
    <motion.div
      className="absolute top-0 z-10"
      style={{ left, marginLeft: -ball.size / 2 }}
      initial={{ y: -(length + ball.size * 1.4), opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 55, damping: 9, delay: 0.25 + delay * 0.4 }}
    >
      <div
        className="sway flex flex-col items-center"
        style={{ animationDuration: `${duration}s`, animationDelay: `${-delay * 1.7}s` }}
      >
        <div
          style={{
            width: 1.5,
            height: length,
            background: "linear-gradient(180deg, rgba(255,255,255,0.15), rgba(235,248,255,0.95))",
          }}
        />
        <div style={{ marginTop: -2, filter: "drop-shadow(0 8px 10px rgba(0,10,50,.45))" }}>
          <BaubleBall {...ball} />
        </div>
      </div>
    </motion.div>
  );
}
