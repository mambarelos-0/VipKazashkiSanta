import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { OPEN_AT, PEOPLE, type Person } from "../data/people";
import { hasCustomDraw, rerollDraw } from "../data/draw";
import { Float } from "../components/Float";
import { Drifts } from "../components/Decor";
import { PhotoRing } from "../components/PhotoRing";
import { Snowflake } from "../components/Snowflake";
import { sound } from "../utils/sound";

interface Props {
  onPick: (p: Person) => void;
  onLogin: () => void;
  onExit: () => void;
}

export function AdminPage({ onPick, onLogin, onExit }: Props) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [notice, setNotice] = useState("");
  const [custom, setCustom] = useState(() => hasCustomDraw());

  const isLocked = Date.now() >= OPEN_AT;

  const handleReroll = () => {
    if (Date.now() >= OPEN_AT) {
      setConfirmOpen(false);
      setNotice("Время уже наступило — пережеребьёвка закрыта 🔒");
      sound.playError();
      return;
    }
    const ok = rerollDraw();
    setConfirmOpen(false);
    if (ok) {
      sound.playShuffle();
      setCustom(true);
      setNotice("✨ Готово! Все перемешаны заново (Василина и Соня 8Г не попадут друг другу)");
    } else {
      sound.playError();
      setNotice("Не удалось перемешать, попробуй ещё раз");
    }
  };

  return (
    <div className="relative min-h-[100svh] overflow-hidden">
      <div className="relative z-10 mx-auto max-w-lg px-5 pb-44 pt-12 text-center">
        <Float from="up">
          <p className="mx-auto mb-2 w-fit rounded-full bg-white/15 px-3 py-1 text-[11px] font-extrabold uppercase tracking-widest text-sky-100 ring-1 ring-white/30">
            🛠 тестовый режим
          </p>
          <h1 className="ice-text font-display text-[clamp(1.8rem,8vw,2.6rem)] font-black leading-tight">
            Все имена
          </h1>
          <p className="mx-auto mt-1 max-w-sm text-sm font-semibold text-sky-100/90">
            Нажми на имя — увидишь конверт и открытку с этим именем, фото и вишлистом. Кому кто выпал — тут не видно 😉
          </p>
        </Float>

        <Float delay={0.2} className="mt-6 grid grid-cols-2 gap-3">
          {PEOPLE.map((p) => (
            <button
              key={p.id}
              onClick={() => {
                sound.playClick();
                onPick(p);
              }}
              className="glass group flex flex-col items-center gap-3 rounded-3xl px-3 py-4 transition hover:-translate-y-1 hover:brightness-110 active:scale-[0.98]"
            >
              <PhotoRing src={p.photo} name={p.name} size={64} orbit={false} />
              <span className="font-script text-2xl leading-none text-white drop-shadow-[0_2px_6px_rgba(0,30,110,.7)]">
                {p.name}
              </span>
            </button>
          ))}
        </Float>

        <AnimatePresence>
          {notice && (
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-5 rounded-2xl bg-white/90 px-4 py-2.5 text-sm font-extrabold text-sky-900 shadow-lg"
            >
              {notice}
            </motion.p>
          )}
        </AnimatePresence>

        <Float delay={0.35} className="mt-6 flex flex-col gap-3">
          <button
            className="btn-ice"
            onClick={() => {
              sound.playClick();
              onLogin();
            }}
          >
            👀 Посмотреть страницу входа
          </button>

          {!isLocked && (
            <button
              className="btn-ghost w-full py-3.5 text-[15px]"
              onClick={() => {
                sound.playClick();
                setConfirmOpen(true);
              }}
            >
              🎲 Пережеребьёвка {custom ? "✓ (обновлена)" : ""}
            </button>
          )}

          <button
            className="btn-ghost"
            onClick={() => {
              sound.playClick();
              onExit();
            }}
          >
            ← выйти из тестового режима
          </button>
        </Float>
      </div>

      {/* Модальное окно подтверждения пережеребьёвки */}
      <AnimatePresence>
        {confirmOpen && (
          <motion.div
            className="fixed inset-0 z-[70] flex items-center justify-center px-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className="absolute inset-0 bg-sky-950/70 backdrop-blur-md"
              onClick={() => setConfirmOpen(false)}
            />
            <motion.div
              className="relative z-10 w-full max-w-sm rounded-3xl p-6 text-center"
              style={{
                background: "linear-gradient(160deg,#ffffff 0%,#e5f4ff 60%,#c6e4fc 100%)",
                boxShadow: "0 24px 70px rgba(3,20,80,.65), inset 0 0 0 2px #fff",
              }}
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
            >
              <Snowflake size={32} className="mx-auto mb-2 text-sky-500" />
              <h3 className="font-display text-xl font-black text-sky-950">
                Перемешать всех заново?
              </h3>
              <p className="mt-2 text-sm font-bold leading-relaxed text-sky-800/90">
                Никто не узнает результат заранее, а Василина и Соня 8Г точно не попадутся друг другу.
              </p>
              <p className="mt-2 rounded-xl bg-sky-100/90 px-3 py-2 text-xs font-semibold text-sky-700">
                Сохраняется на этом устройстве и останется даже после перезагрузки страницы (до 01.12.2026 13:10).
              </p>
              <div className="mt-5 flex gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setConfirmOpen(false);
                  }}
                  className="flex-1 rounded-2xl border border-sky-300 bg-white py-3 text-sm font-extrabold text-sky-800 transition hover:bg-sky-50"
                >
                  Отмена
                </button>
                <button
                  type="button"
                  onClick={handleReroll}
                  className="btn-ice flex-1 !py-3 !text-sm"
                >
                  Да, перемешать 🎲
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Drifts />
    </div>
  );
}
