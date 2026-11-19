import { useEffect } from "react";
import { motion } from "framer-motion";
import { Snowflake } from "./Snowflake";
import { sound } from "../utils/sound";

interface Props {
  src: string;
  name: string;
  failed: boolean;
  onClose: () => void;
}

/** Полноэкранное увеличение аватара: фото плавно «вылетает» из кружка */
export function AvatarZoom({ src, name, failed, onClose }: Props) {
  useEffect(() => {
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
  }, [onClose]);

  const diameter = "min(76vw, 58svh)";

  return (
    <motion.div
      className="fixed inset-0 z-[80] flex flex-col items-center justify-center px-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      onClick={() => {
        sound.playClick();
        onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-label={`Фото: ${name}`}
    >
      {/* затемнение фона */}
      <div
        className="absolute inset-0"
        style={{ background: "radial-gradient(ellipse at center, rgba(10,36,84,.78), rgba(2,8,28,.92))" }}
      />

      {/* крупное фото в ледяном кольце */}
      <motion.div
        className="relative"
        style={{ width: diameter, height: diameter }}
        initial={{ scale: 0.32, y: 90, opacity: 0, rotate: -7 }}
        animate={{ scale: 1, y: 0, opacity: 1, rotate: 0 }}
        exit={{ scale: 0.4, y: 70, opacity: 0, rotate: 4 }}
        transition={{ type: "spring", stiffness: 310, damping: 25 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* вращающееся ледяное кольцо (как у аватара) */}
        <div
          className="spin-slow absolute inset-0 rounded-full"
          style={{
            background:
              "conic-gradient(from 0deg, #f1faff, #55b0ff, #1f64cc, #a9ddff, #ffffff, #4aa6f5, #1f64cc, #d4efff, #f1faff)",
            boxShadow: "0 24px 70px rgba(4,20,80,.75), 0 0 60px rgba(120,200,255,.45)",
          }}
        />
        <div className="absolute rounded-full bg-white" style={{ inset: "3.5%" }} />
        <div
          className="absolute overflow-hidden rounded-full"
          style={{ inset: "6.5%", background: "linear-gradient(135deg,#5db4ff,#1d56b8)" }}
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
        </div>
        {/* снежинки по орбите */}
        <Snowflake size={30} className="twinkle absolute -left-2 top-2 text-white drop-shadow-[0_0_10px_rgba(160,220,255,1)]" />
        <Snowflake size={22} className="twinkle absolute -right-1 top-8 text-sky-100 drop-shadow-[0_0_8px_rgba(160,220,255,1)]" style={{ animationDelay: "0.6s" }} />
        <Snowflake size={24} className="twinkle absolute bottom-4 -left-3 text-sky-100 drop-shadow-[0_0_8px_rgba(160,220,255,1)]" style={{ animationDelay: "1.1s" }} />
        <Snowflake size={18} className="twinkle absolute bottom-10 -right-3 text-white drop-shadow-[0_0_8px_rgba(160,220,255,1)]" style={{ animationDelay: "1.5s" }} />
      </motion.div>

      {/* имя и подсказка */}
      <motion.p
        className="relative mt-6 font-script text-4xl text-sky-100"
        initial={{ opacity: 0, y: 26 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ delay: 0.12, duration: 0.4 }}
      >
        {name}
      </motion.p>
      <motion.p
        className="relative mt-2 text-[11px] font-bold uppercase tracking-[0.3em] text-sky-200/70"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ delay: 0.2 }}
      >
        нажми в любое место, чтобы закрыть
      </motion.p>
    </motion.div>
  );
}
