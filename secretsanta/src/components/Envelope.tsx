import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import type { Person } from "../data/people";
import { PhotoRing } from "./PhotoRing";
import { Snowflake } from "./Snowflake";

type Phase = "closed" | "opening" | "rising" | "done";

const W = "min(86vw, 380px)";
const DOTS =
  "radial-gradient(rgba(255,255,255,.38) 1px, transparent 1.6px) 0 0 / 18px 18px, radial-gradient(rgba(255,255,255,.2) 1px, transparent 1.6px) 9px 9px / 18px 18px";

function Burst() {
  const parts = useMemo(
    () =>
      Array.from({ length: 30 }, (_, i) => {
        const ang = (i / 30) * Math.PI * 2 + Math.random() * 0.4;
        const dist = 110 + Math.random() * 150;
        return {
          x: Math.cos(ang) * dist,
          y: Math.sin(ang) * dist - 40,
          s: 8 + Math.random() * 16,
          d: Math.random() * 0.25,
          flake: i % 3 !== 0,
        };
      }),
    []
  );
  return (
    <div className="pointer-events-none absolute left-1/2 top-1/2 z-50">
      {parts.map((p, i) => (
        <motion.div
          key={i}
          className="absolute text-white"
          style={{ filter: "drop-shadow(0 0 6px rgba(150,215,255,1))" }}
          initial={{ x: 0, y: 0, opacity: 1, scale: 0.2, rotate: 0 }}
          animate={{ x: p.x, y: p.y + 60, opacity: 0, scale: 1, rotate: 240 }}
          transition={{ duration: 1.8, delay: p.d, ease: "easeOut" }}
        >
          {p.flake ? (
            <Snowflake size={p.s} />
          ) : (
            <div style={{ width: p.s / 2, height: p.s / 2, borderRadius: "50%", background: "#cfeeff" }} />
          )}
        </motion.div>
      ))}
    </div>
  );
}

interface Props {
  receiver: Person;
  onOpened?: () => void;
}

export function EnvelopeStage({ receiver, onOpened }: Props) {
  const [phase, setPhase] = useState<Phase>("closed");
  const [flapBehind, setFlapBehind] = useState(false);
  const timers = useRef<number[]>([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const open = () => {
    if (phase !== "closed") return;
    setPhase("opening");
    timers.current.push(
      window.setTimeout(() => setFlapBehind(true), 380),
      window.setTimeout(() => setPhase("rising"), 750),
      window.setTimeout(() => {
        setPhase("done");
        onOpened?.();
      }, 2050)
    );
  };

  const flapOpen = phase !== "closed";
  const gone = phase === "done";
  const letterUp = phase === "rising" || phase === "done";

  const fade = { y: gone ? 140 : 0, opacity: gone ? 0 : 1 };
  const fadeT = { duration: 0.9, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] };

  return (
    <div className="relative" style={{ width: W, height: `calc(${W} * 1.1)`, paddingTop: `calc(${W} * 0.42)` }}>
      <div
        className="relative"
        style={{ width: W, height: `calc(${W} * 0.68)`, perspective: 1300, cursor: phase === "closed" ? "pointer" : "default" }}
        onClick={open}
      >
        {/* мягкое свечение под конвертом */}
        <motion.div
          className="absolute -inset-6 rounded-[40px] blur-2xl"
          style={{ background: "radial-gradient(circle, rgba(130,205,255,.7), transparent 70%)" }}
          animate={{ opacity: gone ? 0 : [0.55, 1, 0.55] }}
          transition={gone ? { duration: 0.6 } : { duration: 2.8, repeat: Infinity }}
        />

        {/* ЗАДНЯЯ СТЕНКА */}
        <motion.div
          className="absolute inset-0 overflow-hidden rounded-2xl"
          style={{
            zIndex: 0,
            background: "linear-gradient(160deg,#154a9c,#0c3174)",
            boxShadow: "0 24px 50px rgba(2,15,60,.6), inset 0 0 0 2px rgba(255,255,255,.25)",
          }}
          animate={fade}
          transition={fadeT}
        >
          <div className="absolute inset-0" style={{ background: DOTS, opacity: 0.5 }} />
        </motion.div>

        {/* ПИСЬМО */}
        <motion.div
          className="absolute"
          style={{
            left: "6%",
            width: "88%",
            bottom: "4%",
            aspectRatio: "1 / 1.02",
            transformOrigin: "50% 100%",
            zIndex: gone ? 40 : 10,
          }}
          initial={{ y: 0, scale: 0.56 }}
          animate={letterUp ? { y: gone ? "-14%" : "-50%", scale: 1 } : { y: 0, scale: 0.56 }}
          transition={{ duration: gone ? 0.9 : 1.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <div
            className="relative flex h-full w-full flex-col items-center justify-center rounded-2xl px-3 text-center"
            style={{
              background: "linear-gradient(160deg,#ffffff 0%,#e6f4ff 55%,#c7e5fc 100%)",
              boxShadow: "0 24px 70px rgba(4,30,100,.55), 0 0 40px rgba(150,215,255,.55), inset 0 0 0 2px #fff",
            }}
          >
            <div className="pointer-events-none absolute inset-2 rounded-xl border border-dashed border-sky-300" />
            <Snowflake size={20} className="absolute left-3.5 top-3.5 text-sky-400" />
            <Snowflake size={20} className="absolute right-3.5 top-3.5 text-sky-400" />
            <Snowflake size={14} className="absolute bottom-3.5 left-3.5 text-sky-300" />
            <Snowflake size={14} className="absolute bottom-3.5 right-3.5 text-sky-300" />

            <p className="mb-3 text-[11px] font-extrabold uppercase tracking-[0.28em] text-sky-600">
              Ты даришь подарок
            </p>
            <PhotoRing src={receiver.photo} name={receiver.name} size={92} />
            <h2
              className="mt-4 font-script leading-none"
              style={{
                fontSize: "clamp(2.2rem, 11vw, 3rem)",
                background: "linear-gradient(180deg,#1b4fb8,#0a2a70)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
                paddingBottom: 4,
              }}
            >
              {receiver.name}
            </h2>
            <p className="mt-1.5 text-xs font-bold text-sky-600/90">🤫 тссс… это тайна</p>
          </div>
        </motion.div>

        {/* КАРМАН (лево / право / низ) */}
        <motion.div
          className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl"
          style={{ zIndex: 20 }}
          animate={fade}
          transition={fadeT}
        >
          <svg className="absolute inset-0 h-full w-full" viewBox="0 0 380 258" preserveAspectRatio="none">
            <defs>
              <linearGradient id="pl" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#3f8fe8" />
                <stop offset="100%" stopColor="#1c58b4" />
              </linearGradient>
              <linearGradient id="pr" x1="1" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3584e0" />
                <stop offset="100%" stopColor="#1a4fa8" />
              </linearGradient>
              <linearGradient id="pb" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#5aaaf5" />
                <stop offset="100%" stopColor="#2766c6" />
              </linearGradient>
            </defs>
            <polygon points="0,0 192,136 0,258" fill="url(#pl)" />
            <polygon points="380,0 188,136 380,258" fill="url(#pr)" />
            <polygon points="0,258 190,122 380,258" fill="url(#pb)" />
            <g fill="none" stroke="#fff" strokeOpacity="0.4" strokeWidth="1.4" vectorEffect="non-scaling-stroke">
              <polyline points="0,0 192,136 0,258" vectorEffect="non-scaling-stroke" />
              <polyline points="380,0 188,136 380,258" vectorEffect="non-scaling-stroke" />
              <polyline points="0,258 190,122 380,258" vectorEffect="non-scaling-stroke" />
            </g>
          </svg>
          <div className="absolute inset-0" style={{ background: DOTS, opacity: 0.55 }} />
          {/* надпись на конверте */}
          <div className="absolute inset-x-0 bottom-[9%] flex flex-col items-center">
            <span className="font-script text-[clamp(1.1rem,5vw,1.5rem)] leading-none text-white drop-shadow-[0_2px_6px_rgba(0,20,80,.6)]">
              Тайный Санта
            </span>
            <span className="mt-1 text-[9px] font-extrabold uppercase tracking-[0.3em] text-sky-100/90">
              VIP Казашки · 2026
            </span>
          </div>
        </motion.div>

        {/* КЛАПАН */}
        <motion.div
          className="absolute left-0 top-0 w-full"
          style={{
            height: "55%",
            transformOrigin: "50% 0",
            transformStyle: "preserve-3d",
            zIndex: flapBehind ? 5 : 30,
          }}
          animate={{ rotateX: flapOpen ? 180 : 0, ...fade }}
          transition={{ rotateX: { duration: 0.8, ease: [0.4, 0, 0.2, 1] }, y: fadeT, opacity: fadeT }}
        >
          <div
            className="absolute inset-0"
            style={{
              clipPath: "polygon(0 0, 100% 0, 50% 100%)",
              background: "linear-gradient(180deg,#69b5ff 0%,#3b86e6 60%,#2a6bd0 100%)",
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
            }}
          >
            <div className="absolute inset-0" style={{ background: DOTS, opacity: 0.6 }} />
          </div>
          <div
            className="absolute inset-0"
            style={{
              clipPath: "polygon(0 0, 100% 0, 50% 100%)",
              background: "linear-gradient(180deg,#0e3a85,#1c56b0)",
              transform: "rotateX(180deg)",
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
            }}
          />
          {/* печать-снежинка */}
          <div
            className="absolute left-1/2 flex items-center justify-center rounded-full"
            style={{
              bottom: -24,
              width: 52,
              height: 52,
              marginLeft: -26,
              background: "radial-gradient(circle at 35% 30%, #ffffff, #b6e0ff 45%, #4a9aea 100%)",
              boxShadow: "0 6px 14px rgba(0,20,90,.55), inset 0 0 0 3px rgba(255,255,255,.7)",
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
            }}
          >
            <Snowflake size={30} className="text-sky-700" sw={3} />
          </div>
        </motion.div>

        {phase === "done" && <Burst />}
      </div>

      {/* подсказка */}
      {phase === "closed" && (
        <motion.div
          className="pointer-events-none absolute inset-x-0 top-0 flex flex-col items-center text-center"
          style={{ paddingTop: `calc(${W} * 0.1)` }}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
        >
          <p className="font-script text-2xl text-sky-100 drop-shadow-[0_2px_10px_rgba(0,30,110,.8)]">
            Нажми на конверт
          </p>
          <span className="hintbob mt-1 text-2xl">👇</span>
        </motion.div>
      )}
    </div>
  );
}
