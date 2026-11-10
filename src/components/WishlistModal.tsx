import { Fragment } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Person } from "../data/people";
import { PhotoRing } from "./PhotoRing";
import { Snowflake } from "./Snowflake";
import { sound } from "../utils/sound";

interface Props {
  person: Person | null;
  onClose: () => void;
}

function getLinkMeta(url: string): { label: string; badge: string; color: string } {
  const low = url.toLowerCase();
  if (low.includes("wildberries.ru") || low.includes("wb.ru")) {
    return {
      label: "Открыть на Wildberries",
      badge: "WB",
      color: "linear-gradient(135deg, #8e3dff, #5a1fb8)",
    };
  }
  if (low.includes("avito.ru")) {
    return {
      label: "Открыть на Авито",
      badge: "Avito",
      color: "linear-gradient(135deg, #27b4ff, #1378d6)",
    };
  }
  if (low.includes("ozon.ru")) {
    return {
      label: "Открыть на Ozon",
      badge: "Ozon",
      color: "linear-gradient(135deg, #1b6dff, #0a42b8)",
    };
  }
  return {
    label: "Открыть ссылку",
    badge: "🔗",
    color: "linear-gradient(135deg, #3aa0ff, #1f6fe0)",
  };
}

function renderWishlistContent(text: string) {
  const regex = /(https?:\/\/[^\s,]+)/g;
  const parts = text.split(regex);
  let linkNum = 0;

  return (
    <div className="space-y-2.5 text-left">
      {parts.map((part, idx) => {
        if (!part) return null;
        if (/^https?:\/\//i.test(part)) {
          linkNum += 1;
          const meta = getLinkMeta(part);
          return (
            <a
              key={idx}
              href={part}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => sound.playClick()}
              className="group flex items-center justify-between gap-3 rounded-2xl border border-sky-200/80 bg-white/95 px-3.5 py-2.5 text-sky-950 shadow-sm transition hover:-translate-y-0.5 hover:border-sky-400 hover:shadow-md active:scale-[0.99]"
            >
              <div className="flex min-w-0 items-center gap-2.5">
                <span
                  className="shrink-0 rounded-xl px-2.5 py-1 text-[11px] font-extrabold text-white shadow-sm"
                  style={{ background: meta.color }}
                >
                  {meta.badge}
                </span>
                <div className="min-w-0">
                  <div className="text-sm font-extrabold text-sky-900">
                    {meta.label} {linkNum > 1 ? `#${linkNum}` : ""}
                  </div>
                  <div className="truncate text-[11px] font-semibold text-sky-500">{part}</div>
                </div>
              </div>
              <span className="shrink-0 text-base font-bold text-sky-500 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                ↗
              </span>
            </a>
          );
        }

        const cleaned = part.replace(/^[\s,]+|[\s,]+$/g, "");
        if (!cleaned) return null;

        return (
          <Fragment key={idx}>
            <p className="rounded-2xl bg-white/60 px-3.5 py-2.5 text-[15px] font-bold leading-relaxed text-sky-950">
              {cleaned}
            </p>
          </Fragment>
        );
      })}
    </div>
  );
}

export function WishlistModal({ person, onClose }: Props) {
  return (
    <AnimatePresence>
      {person && (
        <motion.div
          className="fixed inset-0 z-[70] flex items-center justify-center px-4 py-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* затемнение */}
          <div
            className="absolute inset-0 bg-sky-950/65 backdrop-blur-md"
            onClick={() => {
              sound.playClick();
              onClose();
            }}
          />

          {/* окно */}
          <motion.div
            className="relative z-10 flex max-h-[85svh] w-full max-w-md flex-col overflow-hidden rounded-3xl p-5 text-center"
            style={{
              background: "linear-gradient(160deg,#ffffff 0%,#e5f4ff 55%,#c5e4fc 100%)",
              boxShadow:
                "0 28px 80px rgba(3,20,80,.65), 0 0 40px rgba(140,210,255,.55), inset 0 0 0 2px #fff",
            }}
            initial={{ opacity: 0, scale: 0.88, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", stiffness: 260, damping: 24 }}
          >
            <Snowflake size={18} className="absolute left-3.5 top-3.5 text-sky-400" />
            <Snowflake size={18} className="absolute right-3.5 top-3.5 text-sky-400" />

            <div className="flex flex-col items-center">
              <PhotoRing src={person.photo} name={person.name} size={68} orbit={false} />
              <p className="mt-2.5 text-[11px] font-extrabold uppercase tracking-[0.26em] text-sky-600">
                🎁 Вишлист
              </p>
              <h3
                className="font-script text-4xl leading-none"
                style={{
                  background: "linear-gradient(180deg,#1b4fb8,#0a2a70)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  color: "transparent",
                }}
              >
                {person.name}
              </h3>
            </div>

            <div className="mt-4 flex-1 overflow-y-auto pr-1">
              {renderWishlistContent(person.wishlist)}
            </div>

            <button
              type="button"
              onClick={() => {
                sound.playClick();
                onClose();
              }}
              className="btn-ice mt-4"
            >
              Понятно, спасибо ✨
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
