import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Person } from "../data/people";
import { EnvelopeStage } from "../components/Envelope";
import { Decor, Drifts } from "../components/Decor";
import { Float } from "../components/Float";

interface Props {
  /** Кто открывает конверт (в тестовом режиме — нет) */
  giver?: Person;
  /** Чьё имя выпало */
  receiver: Person;
  /** Тестовый просмотр */
  preview?: boolean;
  onBack: () => void;
}

export function RevealPage({ giver, receiver, preview, onBack }: Props) {
  const [opened, setOpened] = useState(false);
  const [round, setRound] = useState(0);

  return (
    <div className="relative min-h-[100svh] overflow-hidden">
      <Decor compact />

      <div className="relative z-10 mx-auto flex max-w-md flex-col items-center px-5 pb-44 pt-28 text-center">
        <Float from="up">
          {preview && (
            <p className="mx-auto mb-3 w-fit rounded-full bg-white/15 px-3 py-1 text-[11px] font-extrabold uppercase tracking-widest text-sky-100 ring-1 ring-white/30">
              тест · если выпал(а) {receiver.name}
            </p>
          )}
          <AnimatePresence mode="wait">
            <motion.div
              key={opened ? "after" : "before"}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.45 }}
            >
              {opened ? (
                <>
                  <h1 className="ice-text font-display text-[clamp(1.7rem,8vw,2.4rem)] font-black leading-tight">
                    Вот кому ты даришь подарок
                  </h1>
                  <p className="mt-1 font-script text-2xl text-sky-100">и пусть это останется тайной ✨</p>
                </>
              ) : (
                <>
                  <h1 className="ice-text font-display text-[clamp(1.9rem,9vw,2.8rem)] font-black leading-tight">
                    {giver ? `Привет, ${giver.name}!` : "Привет, Санта!"}
                  </h1>
                  <p className="mt-1.5 text-sm font-semibold text-sky-100/90">
                    Для тебя пришёл особенный конверт 🎄
                  </p>
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </Float>

        <Float delay={0.25} className="mt-2">
          <EnvelopeStage key={round} receiver={receiver} onOpened={() => setOpened(true)} />
        </Float>

        <Float delay={0.5} className="mt-4 flex flex-wrap justify-center gap-2">
          {preview && (
            <button
              className="btn-ghost"
              onClick={() => {
                setOpened(false);
                setRound((r) => r + 1);
              }}
            >
              ↺ закрыть конверт
            </button>
          )}
          <button className="btn-ghost" onClick={onBack}>
            {preview ? "← к списку" : "Спрятать и выйти"}
          </button>
        </Float>
      </div>

      <Drifts />
    </div>
  );
}
