import { useState } from "react";
import { Snowflake } from "./Snowflake";

interface Props {
  src: string;
  name: string;
  size?: number;
  orbit?: boolean;
}

/** Круглое фото в голубой рамке со снежинками */
export function PhotoRing({ src, name, size = 104, orbit = true }: Props) {
  const [failed, setFailed] = useState(false);
  const box = size + 28;
  const R = size / 2 + 8;
  const flakes = [0, 60, 120, 180, 240, 300];

  return (
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
  );
}
