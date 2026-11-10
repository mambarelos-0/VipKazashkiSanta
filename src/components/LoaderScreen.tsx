import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { HERO_PHOTO, PEOPLE } from "../data/people";
import { Snowflake } from "./Snowflake";

interface Props {
  onReady: () => void;
}

const ALL_URLS = [HERO_PHOTO, ...PEOPLE.map((p) => p.photo)];

function preloadOne(src: string, retries = 1): Promise<boolean> {
  return new Promise((resolve) => {
    let settled = false;
    const finish = (ok: boolean) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      resolve(ok);
    };

    const img = new Image();
    img.referrerPolicy = "no-referrer";

    const timer = window.setTimeout(() => finish(false), 12000);

    img.onload = () => {
      if (typeof img.decode === "function") {
        img.decode().then(() => finish(true)).catch(() => finish(true));
      } else {
        finish(true);
      }
    };

    img.onerror = () => {
      clearTimeout(timer);
      if (retries > 0) {
        window.setTimeout(() => {
          preloadOne(src, retries - 1).then((ok) => {
            if (!settled) {
              settled = true;
              resolve(ok);
            }
          });
        }, 600);
      } else {
        finish(false);
      }
    };

    img.src = src;
  });
}

export function LoaderScreen({ onReady }: Props) {
  const total = ALL_URLS.length;
  const [loaded, setLoaded] = useState(0);

  useEffect(() => {
    let cancelled = false;
    let count = 0;

    Promise.all(
      ALL_URLS.map((url) =>
        preloadOne(url).then((ok) => {
          if (!cancelled) {
            count += 1;
            setLoaded(count);
          }
          return ok;
        })
      )
    ).then(() => {
      if (cancelled) return;
      window.setTimeout(() => {
        if (!cancelled) onReady();
      }, 450);
    });

    return () => {
      cancelled = true;
    };
  }, [onReady]);

  const pct = Math.min(100, Math.round((loaded / total) * 100));


  return (
    <motion.div
      className="relative flex min-h-[100svh] flex-col items-center justify-center px-6 text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.03 }}
      transition={{ duration: 0.55 }}
    >
      <div className="relative flex flex-col items-center">
        {/* Светящиеся орбиты вокруг снежинки */}
        <div className="pointer-events-none absolute -top-10 h-40 w-40 rounded-full border border-sky-100/15" />
        <motion.div className="pointer-events-none absolute -top-10 h-40 w-40 rounded-full border border-transparent border-t-sky-100/70"
          animate={{ rotate: 360 }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }} />
        {/* вращающаяся снежинка */}
        <div className="relative mb-6 flex items-center justify-center">
          <div
            className="absolute -inset-6 rounded-full blur-2xl"
            style={{ background: "rgba(120,200,255,0.45)" }}
          />
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="relative text-white"
            style={{ filter: "drop-shadow(0 0 14px rgba(160,225,255,0.95))" }}
          >
            <Snowflake size={84} sw={2.1} />
          </motion.div>
        </div>

        <p className="mb-1 text-[11px] font-extrabold uppercase tracking-[0.38em] text-sky-100/80">
          ❄ VIP Казашки ❄
        </p>
        <h1 className="ice-text font-display text-3xl font-black tracking-wide sm:text-4xl">
          ТАЙНЫЙ САНТА
        </h1>

        <p className="mt-3 font-script text-2xl text-sky-100/95">Загрузка…</p>

        {/* Прогресс-бар */}
        <div className="mt-6 w-[min(82vw,310px)]">
          <div
            role="progressbar" aria-label="Загрузка сайта" aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct}
            className="relative h-2 w-full overflow-hidden rounded-full p-[1px]"
            style={{
              background: "rgba(255,255,255,0.16)",
              border: "1px solid rgba(255,255,255,0.38)",
              boxShadow: "inset 0 2px 6px rgba(0,15,60,0.45)",
            }}
          >
            <motion.div
              className="h-full rounded-full"
              style={{
                background: "linear-gradient(90deg, #74c4ff, #d4f0ff, #58aef8)",
                boxShadow: "0 0 14px rgba(130,210,255,0.9)",
              }}
              initial={{ width: "6%" }}
              animate={{ width: `${Math.max(8, pct)}%` }}
              transition={{ duration: 0.35, ease: "easeOut" }}
            />
          </div>

          <div className="mt-5 flex justify-center gap-2" aria-hidden="true">
            {[0, 1, 2].map((i) => (
              <motion.span key={i} className="h-1.5 w-1.5 rounded-full bg-sky-100"
                animate={{ opacity: [0.25, 1, 0.25], y: [0, -4, 0] }}
                transition={{ duration: 1.5, delay: i * 0.2, repeat: Infinity }} />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
