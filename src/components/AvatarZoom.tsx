import { useEffect } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { Snowflake } from "./Snowflake";
import { sound } from "../utils/sound";

interface Props {
  src: string;
  name: string;
  failed: boolean;
  onClose: () => void;
}

// две орбиты снежинок: внешняя — крупные и редкие, внутренняя — помельче и гуще
const ORBIT_OUTER = [10, 26, 14, 30, 12, 22, 16, 28, 12, 24, 15, 27, 13, 21];
const ORBIT_INNER = [11, 15, 10, 16, 12, 14, 10, 16];

/** Полноэкранное увеличение аватара: фото выезжает снизу и становится большим кругом */
export function AvatarZoom({ src, name, failed, onClose }: Props) {
  useEffect(() => {
    sound.playSwoosh();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onClose]);

  // радиусы орбит и диаметр фото — одним выражением, чтобы всё масштабировалось одинаково
  const D = "min(78vw, 56svh)";
  const ORBIT_OUTER_R = "calc(min(78vw, 56svh) / 2 + 34px)";
  const ORBIT_INNER_R = "calc(min(78vw, 56svh) / 2 + 12px)";

  return createPortal(
    <motion.div
      className="fixed inset-0 z-[80] flex flex-col items-center justify-center overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.28 }}
      onClick={() => {
        sound.playClick();
        onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-label={`Фото: ${name}`}
    >
      {/* затемнение с ледяным отливом */}
      <div
        className="absolute inset-0"
        style={{ background: "radial-gradient(ellipse at center, rgba(13,42,96,.72), rgba(3,9,30,.93))" }}
      />

      {/* крупное круглое фото с выездом снизу */}
      <motion.div
        className="relative"
        style={{ width: D, height: D }}
        initial={{ scale: 0.18, y: "44vh", opacity: 0, rotate: -10 }}
        animate={{ scale: 1, y: 0, opacity: 1, rotate: 0 }}
        exit={{ scale: 0.24, y: "38vh", opacity: 0, rotate: 8 }}
        transition={{ type: "spring", stiffness: 235, damping: 22, mass: 0.9 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* внешнее свечение */}
        <div
          className="absolute -inset-5 rounded-full"
          style={{ background: "radial-gradient(circle, rgba(140,215,255,.5), transparent 70%)" }}
        />
        {/* ледяное кольцо (статичное, богато слоёное) */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background:
              "conic-gradient(from 210deg, #eaf7ff 0deg, #79c2ff 38deg, #1d5fc4 78deg, #cfeeff 118deg, #ffffff 158deg, #4aa3ec 205deg, #1753b4 248deg, #b9e4ff 296deg, #f4fcff 338deg, #eaf7ff 360deg)",
            boxShadow: "0 26px 80px rgba(2,14,52,.8), 0 0 90px rgba(110,205,255,.5)",
          }}
        />
        {/* тонкая тёмная риска внутри кольца */}
        <div
          className="absolute rounded-full"
          style={{ inset: "2.6%", background: "linear-gradient(160deg,#0b2f66,#123f7e)" }}
        />
        <div className="absolute rounded-full bg-white" style={{ inset: "3.8%" }} />
        {/* само фото */}
        <div
          className="absolute overflow-hidden rounded-full"
          style={{ inset: "6.8%", background: "linear-gradient(135deg,#5db4ff,#1d56b8)" }}
        >
          {failed ? (
            <div className="flex h-full w-full items-center justify-center font-display text-8xl font-black text-white">
              {name.trim().charAt(0).toUpperCase()}
            </div>
          ) : (
            <img
              src={src}
              alt={name}
              referrerPolicy="no-referrer"
              draggable={false}
              className="h-full w-full object-cover"
              style={{ objectPosition: "center 28%" }}
            />
          )}
          {/* блик на «стекле» */}
          <div
            className="pointer-events-none absolute inset-0 rounded-full"
            style={{ background: "linear-gradient(155deg, rgba(255,255,255,.55) 0%, rgba(255,255,255,.14) 22%, transparent 42%)" }}
          />
        </div>

        {/* орбита 1 — внешняя, медленная */}
        <div className="spin-slow pointer-events-none absolute inset-0">
          {ORBIT_OUTER.map((size, i) => {
            const a = (360 / ORBIT_OUTER.length) * i;
            return (
              <div
                key={i}
                className="absolute text-white"
                style={{
                  left: "50%",
                  top: "50%",
                  transform: `translate(-50%,-50%) rotate(${a}deg) translateY(calc(-1 * ${ORBIT_OUTER_R}))`,
                  filter: "drop-shadow(0 0 6px rgba(170,225,255,.95))",
                }}
              >
                <Snowflake size={size} className="twinkle" style={{ animationDelay: `${i * 0.33}s` }} />
              </div>
            );
          })}
        </div>
        {/* орбита 2 — внутренняя, в обратную сторону */}
        <div className="spin-rev pointer-events-none absolute inset-0" style={{ animationDuration: "26s" }}>
          {ORBIT_INNER.map((size, i) => {
            const a = (360 / ORBIT_INNER.length) * i + 22;
            return (
              <div
                key={i}
                className="absolute text-sky-100"
                style={{
                  left: "50%",
                  top: "50%",
                  transform: `translate(-50%,-50%) rotate(${a}deg) translateY(calc(-1 * ${ORBIT_INNER_R}))`,
                  filter: "drop-shadow(0 0 5px rgba(150,215,255,.9))",
                }}
              >
                <Snowflake size={size} className="twinkle" style={{ animationDelay: `${i * 0.41}s` }} />
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* имя и подсказка */}
      <motion.p
        className="relative mt-7 font-script text-4xl text-sky-100"
        style={{ textShadow: "0 2px 18px rgba(90,180,255,.45)" }}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 12 }}
        transition={{ delay: 0.14, duration: 0.4 }}
      >
        {name}
      </motion.p>
      <motion.p
        className="relative mt-2 text-[10px] font-bold uppercase tracking-[0.32em] text-sky-200/70"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ delay: 0.24 }}
      >
        нажми в любое место, чтобы закрыть
      </motion.p>
    </motion.div>,
    document.body
  );
}
