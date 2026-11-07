import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HERO_PHOTO, OPEN_AT, checkPassword, findPersonByName, type Person } from "../data/people";
import { useNow } from "../utils/time";
import { Decor, Drifts } from "../components/Decor";
import { Float } from "../components/Float";
import { Snowflake } from "../components/Snowflake";

interface Props {
  onSuccess: (p: Person) => void;
  onBack?: () => void; // только в тестовом режиме
}

export function LoginPage({ onSuccess, onBack }: Props) {
  const now = useNow(1000);
  const locked = now < OPEN_AT;

  const [name, setName] = useState("");
  const [pass, setPass] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [shakeKey, setShakeKey] = useState(0);

  const fail = (msg: string) => {
    setError(msg);
    setShakeKey((k) => k + 1);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (Date.now() < OPEN_AT) {
      return fail("Пока рано — Санта ещё пакует подарки 🎁 Загляни 01.12.2026 в 13:10");
    }
    const person = findPersonByName(name);
    if (!person) {
      return fail("Такого имени нет в списке 🤔 Проверь написание (например: Соня 7А)");
    }
    if (!checkPassword(person, pass)) {
      return fail("Пароль не подошёл ❄️ Попробуй ещё разок");
    }
    setError("");
    onSuccess(person);
  };

  return (
    <div className="relative min-h-[100svh] overflow-hidden">
      {/* Заполняем «пустоты»: то же фото, размытое на весь экран + ледяная дымка */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute inset-[-8%] scale-110"
          style={{
            backgroundImage: `url(${HERO_PHOTO})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "blur(26px) saturate(1.25) brightness(0.85)",
            opacity: 0.85,
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(4,18,60,.82) 0%, rgba(10,60,140,.35) 40%, rgba(30,110,200,.3) 75%, rgba(150,210,250,.55) 100%)",
          }}
        />
      </div>

      <Decor />

      {onBack && (
        <button
          onClick={onBack}
          className="btn-ghost absolute left-3 top-14 z-30"
          style={{ fontSize: 12, padding: "6px 12px" }}
        >
          ← назад
        </button>
      )}

      <div className="relative z-10 mx-auto flex max-w-md flex-col items-center px-5 pb-44 pt-28 md:pt-24">
        <Float from="up">
          <p className="mb-2 text-center text-[11px] font-extrabold uppercase tracking-[0.38em] text-sky-100/90">
            ✦ VIP Казашки ✦
          </p>
          <h1
            className="ice-text text-center font-display font-black leading-none tracking-[0.08em]"
            style={{ fontSize: "clamp(2.1rem, 10.5vw, 3.7rem)" }}
          >
            ТАЙНЫЙ
            <br />
            САНТА
          </h1>
        </Float>

        {/* Фото в ледяной раме */}
        <Float delay={0.2} className="mt-6">
          <div
            className="glowpulse relative rounded-[28px] p-[5px]"
            style={{
              width: "min(76vw, 40svh, 340px)",
              minWidth: 220,
              aspectRatio: "1 / 1",
              background:
                "linear-gradient(135deg,#ffffff,#8fd0ff 25%,#2f7fe0 50%,#bfe6ff 75%,#ffffff)",
            }}
          >
            <img
              src={HERO_PHOTO}
              alt="VIP Казашки"
              referrerPolicy="no-referrer"
              draggable={false}
              className="h-full w-full rounded-[24px] object-cover"
            />
            <Snowflake size={34} className="twinkle absolute -left-4 -top-4 text-white drop-shadow-[0_0_8px_rgba(160,220,255,1)]" />
            <Snowflake size={26} className="twinkle absolute -bottom-3 -right-3 text-white drop-shadow-[0_0_8px_rgba(160,220,255,1)]" style={{ animationDelay: "1s" }} />
          </div>
        </Float>

        {/* Форма */}
        <Float delay={0.4} className="mt-7 w-full">
          <form
            key={shakeKey}
            onSubmit={submit}
            className={`glass relative w-full rounded-3xl p-5 ${shakeKey ? "shake" : ""}`}
            autoComplete="off"
          >
            <p className="mb-3 text-center font-script text-2xl text-white drop-shadow-[0_2px_8px_rgba(0,30,110,.7)]">
              Представься, мы тебя ждали
            </p>
            <div className="space-y-3">
              <input
                className="field"
                placeholder="Твоё имя"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setError("");
                }}
                autoCapitalize="words"
                autoComplete="off"
                spellCheck={false}
                enterKeyHint="next"
              />
              <div className="relative">
                <input
                  className="field pr-14"
                  type={show ? "text" : "password"}
                  placeholder="Секретный пароль"
                  value={pass}
                  onChange={(e) => {
                    setPass(e.target.value);
                    setError("");
                  }}
                  autoComplete="off"
                  spellCheck={false}
                  enterKeyHint="go"
                />
                <button
                  type="button"
                  onClick={() => setShow((v) => !v)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-xl px-2.5 py-1.5 text-lg"
                  aria-label="Показать пароль"
                >
                  {show ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            <AnimatePresence>
              {error && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-3 overflow-hidden rounded-xl bg-white/90 px-3 py-2 text-center text-sm font-bold text-rose-600"
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>

            <button type="submit" className="btn-ice mt-4" data-locked={locked}>
              {locked ? "🔒 Откроется 01.12.2026 в 13:10" : "Открыть конверт ✉️"}
            </button>
          </form>
        </Float>
      </div>

      <Drifts />
    </div>
  );
}
