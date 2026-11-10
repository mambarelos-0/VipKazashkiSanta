import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { OPEN_AT } from "../data/people";
import { pad2, plural, useNow } from "../utils/time";
import { Snowflake } from "../components/Snowflake";
import { Decor } from "../components/Decor";
import { Float } from "../components/Float";

interface Props {
  onUnlock: () => void;
  onAdmin: () => void;
}

const TAPS_NEEDED = 25;

export function CountdownPage({ onUnlock, onAdmin }: Props) {
  const now = useNow(250);
  const diff = Math.max(0, OPEN_AT - now);

  useEffect(() => {
    if (OPEN_AT - now <= 0) onUnlock();
  }, [now, onUnlock]);

  const total = Math.floor(diff / 1000);
  const d = Math.floor(total / 86400);
  const h = Math.floor((total % 86400) / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;

  // секретный режим: 25 нажатий по снежинке
  const taps = useRef(0);
  const resetTimer = useRef<number | undefined>(undefined);
  const tap = () => {
    taps.current += 1;
    window.clearTimeout(resetTimer.current);
    resetTimer.current = window.setTimeout(() => (taps.current = 0), 6000);
    if (taps.current >= TAPS_NEEDED) {
      taps.current = 0;
      onAdmin();
    }
  };
  useEffect(() => () => window.clearTimeout(resetTimer.current), []);

  const cells: [string, string][] = [
    [String(d), plural(d, ["день", "дня", "дней"])],
    [pad2(h), plural(h, ["час", "часа", "часов"])],
    [pad2(m), plural(m, ["минута", "минуты", "минут"])],
    [pad2(s), plural(s, ["секунда", "секунды", "секунд"])],
  ];

  return (
    <div className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-5 py-12 text-center">
      {/* размытый слой с декором */}
      <div className="pointer-events-none absolute inset-0 blur-[14px]" style={{ transform: "scale(1.08)" }}>
        <Decor compact />
        <div
          className="absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{ background: "radial-gradient(closest-side, rgba(190,230,255,.55), transparent)" }}
        />
      </div>
      {/* матовое стекло */}
      <div className="pointer-events-none absolute inset-0 backdrop-blur-xl" style={{ background: "rgba(8,30,90,.22)" }} />

      <div className="relative z-10 flex w-full max-w-xl flex-col items-center">
        <Float>
          <p className="mb-5 text-[11px] font-extrabold uppercase tracking-[0.4em] text-sky-100/80">
            ❄ VIP Казашки · Тайный Санта ❄
          </p>
        </Float>

        <Float delay={0.15}>
          <p className="mb-2 font-script text-2xl text-sky-100/90">Волшебство начнётся</p>
          <h1 className="ice-text font-display text-[clamp(2rem,9.5vw,3.6rem)] font-black leading-tight tracking-wide">
            01.12.2026 <span className="whitespace-nowrap">13:10</span>
          </h1>
        </Float>

        <Float delay={0.3} className="mt-9 w-full">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-sky-100/70">осталось</p>
          <div className="grid grid-cols-4 gap-2.5 sm:gap-4">
            {cells.map(([v, label], i) => (
              <div
                key={i}
                className="glass flex flex-col items-center rounded-2xl px-1 py-3.5 sm:py-5"
              >
                <span className="font-display text-[clamp(1.6rem,8vw,3rem)] font-black leading-none tabular-nums text-white drop-shadow-[0_3px_12px_rgba(120,190,255,.8)]">
                  {v}
                </span>
                <span className="mt-1.5 text-[10px] font-bold uppercase tracking-wider text-sky-100/80 sm:text-xs">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </Float>

        {/* единственная снежинка (она же — секретная кнопка) */}
        <Float delay={0.5} className="mt-12">
          <motion.div
            className="secret-tap p-4 text-white"
            onClick={tap}
            animate={{ rotate: 360 }}
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
            style={{ filter: "drop-shadow(0 0 14px rgba(170,225,255,.95))" }}
          >
            <Snowflake size={96} sw={2} />
          </motion.div>
        </Float>
      </div>
    </div>
  );
}
