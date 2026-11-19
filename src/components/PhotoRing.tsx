import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Snowflake } from "./Snowflake";
import { AvatarZoom } from "./AvatarZoom";
import { sound } from "../utils/sound";

interface Props {
  src: string;
  name: string;
  size?: number;
  orbit?: boolean;
}

/** Круглое фото в голубой рамке со снежинками (по нажатию — увеличение) */
export function PhotoRing({ src, name, size = 104, orbit = true }: Props) {
  const [failed, setFailed] = useState(false);
  const [zoom, setZoom] = useState(false);
  const box = size + 28;
  const R = size / 2 + 8;
  const flakes = [0, 60, 120, 180, 240, 300];

  return (
    <>
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      {/* свечение */}
      <div className="absolute -inset-3 rounded-full blur-xl" style={{ background: "rgba(110,190,255,0.55)" }} />

      {/* вращающееся ледяное кольцо */}
      <div
        className="spin-slow absolute inset-0 rounded-full"
        style={{
          background:
            "conic-gradient(from 0deg, #f1faff, #55b0ff, #1f64cc, #a9ddff, #ffffff, #4aa6f5, #1f64cc, #d4efff, #f1faff)",
          boxShadow: "0 6px 18px rgba(10,60,160,.45)",
        }}
      />
      {/* белая окантовка */}
      <div className="absolute rounded-full bg-white" style={{ inset: 5 }} />

      {/* фото */}
      <div
        className="absolute overflow-hidden rounded-full"
        style={{ inset: 8, background: "linear-gradient(135deg,#5db4ff,#1d56b8)" }}
      >
        {failed ? (
          <div className="flex h-full w-full items-center justify-center font-display text-3xl font-black text-white">
            {name.trim().charAt(0).toUpperCase()}
          </div>
        ) : (
          <img
            src={src}
            alt={name}
            referrerPolicy="no-referrer"
            draggable={false}
            onError={() => setFailed(true)}
            className="h-full w-full object-cover"
            style={{ objectPosition: "center 28%" }}
          />
        )}
      </div>

      {/* зона нажатия: увеличить фото */}
      <span
        role="button"
        tabIndex={0}
        aria-label={`Увеличить фото: ${name}`}
        className="absolute z-[5] cursor-zoom-in rounded-full outline-none focus-visible:ring-4 focus-visible:ring-sky-300/70"
        style={{ inset: 8 }}
        onClick={(e) => {
          e.stopPropagation();
          sound.playClick();
          setZoom(true);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            e.stopPropagation();
            setZoom(true);
          }
        }}
      />
      {/* значок-подсказка «можно увеличить» */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute z-[6] flex items-center justify-center rounded-full border border-white/70 text-white"
        style={{
          width: Math.max(24, Math.round(size * 0.28)),
          height: Math.max(24, Math.round(size * 0.28)),
          right: -3,
          bottom: -3,
          background: "rgba(8,30,74,.66)",
          boxShadow: "0 2px 10px rgba(2,16,54,.55), inset 0 1px 0 rgba(255,255,255,.35)",
        }}
      >
        <svg viewBox="0 0 24 24" width="56%" height="56%" fill="none" stroke="currentColor" strokeWidth={2.3} strokeLinecap="round">
          <circle cx="10.5" cy="10.5" r="6.4" />
          <line x1="15.2" y1="15.2" x2="20.6" y2="20.6" />
        </svg>
      </span>

      {/* снежинки по орбите */}
      {orbit && (
        <div
          className="spin-rev pointer-events-none absolute"
          style={{ width: box, height: box, left: (size - box) / 2, top: (size - box) / 2 }}
        >
          {flakes.map((a, i) => (
            <div
              key={a}
              className="absolute text-white"
              style={{
                left: "50%",
                top: "50%",
                transform: `translate(-50%,-50%) rotate(${a}deg) translateY(-${R}px)`,
                filter: "drop-shadow(0 0 4px rgba(150,215,255,.95))",
              }}
            >
              <Snowflake size={i % 2 ? 11 : 15} className="twinkle" style={{ animationDelay: `${i * 0.35}s` }} />
            </div>
          ))}
        </div>
      )}
    </div>
    <AnimatePresence>
      {zoom && <AvatarZoom src={src} name={name} failed={failed} onClose={() => setZoom(false)} />}
    </AnimatePresence>
  </>
  );
}
