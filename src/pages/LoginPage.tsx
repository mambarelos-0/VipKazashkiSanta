import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HERO_PHOTO, OPEN_AT, checkPassword, findPersonByName, type Person } from "../data/people";
import { useNow } from "../utils/time";
import { Decor, Drifts } from "../components/Decor";
import { Float } from "../components/Float";
import { Snowflake } from "../components/Snowflake";
import { sound } from "../utils/sound";

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
    sound.playError();
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
    sound.playClick();
    setError("");
    onSuccess(person);
  };

  return (
    <div className="santa-login relative min-h-[100svh] overflow-hidden">
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
          onClick={() => {
            sound.playClick();
            onBack();
          }}
          className="btn-ghost absolute left-3 top-14 z-30"
          style={{ fontSize: 12, padding: "6px 12px" }}
        >
          ← назад
        </button>
      )}

      <div className="relative z-10 mx-auto flex max-w-md flex-col items-center px-5 pb-44 pt-28 md:pt-24">
        <Float from="up">
          <p className="login-eyebrow shimmer-text mb-2 text-center text-[11px] font-extrabold uppercase tracking-[0.38em]">
            ✦ VIP Казашки ✦
          </p>
          <h1
            className="login-title ice-text text-center font-display font-black leading-none tracking-[0.08em]"
            style={{ fontSize: "clamp(2.1rem, 10.5vw, 3.7rem)" }}
          >
            ТАЙНЫЙ
            <br />
            САНТА
          </h1>
        </Float>

        {/* Фото — «арка» с васи-лентой: без рамок, с рукописной подписью */}
        <Float delay={0.2} className="mt-7">
          <figure className="relative" style={{ transform: "rotate(-2.4deg)" }}>
            {/* васи-лента поверх верха фото */}
            <div
              aria-hidden="true"
              className="absolute left-1/2 top-[-13px] z-10 h-[24px] w-[104px] -translate-x-1/2"
              style={{
                transform: "translateX(-50%) rotate(-1.6deg)",
                background:
                  "linear-gradient(100deg, rgba(255,255,255,.55) 0%, rgba(197,231,255,.78) 18%, rgba(255,255,255,.6) 45%, rgba(160,215,255,.72) 78%, rgba(255,255,255,.55) 100%)",
                boxShadow: "0 4px 10px rgba(2,14,44,.38), inset 0 1px 0 rgba(255,255,255,.7)",
                clipPath: "polygon(1.5% 8%, 98.5% 0, 100% 88%, 0 100%)",
              }}
            />
            <div
              className="relative overflow-hidden"
              style={{
                width: "min(70vw, 35svh, 285px)",
                minWidth: 208,
                aspectRatio: "4 / 5",
                borderRadius: "50% 50% 18px 18px / 37% 37% 18px 18px",
                boxShadow: "0 30px 64px rgba(2,10,42,.6), 0 5px 20px rgba(110,200,255,.22)",
              }}
            >
              <img
                src={HERO_PHOTO}
                alt="VIP Казашки"
                referrerPolicy="no-referrer"
                draggable={false}
                className="h-full w-full object-cover"
                style={{ objectPosition: "center 20%" }}
              />
              {/* мягкая внутренняя тень — глубина вместо рамки */}
              <div
                className="pointer-events-none absolute inset-0"
                style={{
                  borderRadius: "inherit",
                  boxShadow:
                    "inset 0 -42px 52px rgba(3,12,42,.42), inset 0 20px 34px rgba(255,255,255,.13), inset 0 0 0 1px rgba(255,255,255,.16)",
                }}
              />
            </div>
            {/* подпись от руки под фото */}
            <figcaption
              className="mt-3 text-center font-script text-[28px] leading-none"
              style={{
                color: "#e3f2ff",
                textShadow: "0 2px 16px rgba(90,180,255,.55)",
                transform: "rotate(1.2deg)",
              }}
            >
              VIP Казашки ❄
            </figcaption>
          </figure>
        </Float>

        {/* Форма */}
        <Float delay={0.4} className="mt-7 w-full">
          <form
            key={shakeKey}
            onSubmit={submit}
            className={`login-card glass relative w-full overflow-hidden rounded-3xl p-5 ${shakeKey ? "shake" : ""}`}
            autoComplete="off"
          >
            <div className="login-card-shine" aria-hidden="true" />
            <div className="login-ornament" aria-hidden="true"><span />✧<span /></div>
            {/* декоративные снежинки в углах карточки */}
            <Snowflake size={16} className="pointer-events-none absolute left-3 top-3 text-white/35" />
            <Snowflake size={16} className="pointer-events-none absolute right-3 top-3 text-white/35" />
            <p className="mb-3 text-center font-script text-2xl text-white drop-shadow-[0_2px_8px_rgba(0,30,110,.7)]">
              Представься, мы тебя ждали
            </p>
            <div className="space-y-3 relative">
              <label className="login-label" htmlFor="santa-name">Твоё имя</label>
              <input
                id="santa-name"
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
                <label className="login-label" htmlFor="santa-password">Секретный пароль</label>
                <div className="relative">
                <input
                  id="santa-password"
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
                  onClick={() => {
                    sound.playClick();
                    setShow((v) => !v);
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-xl px-2.5 py-1.5 text-lg"
                  aria-label={show ? "Скрыть пароль" : "Показать пароль"}
                  aria-pressed={show}
                >
                  {show ? "🙈" : "👁️"}
                </button>
                </div>
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

            <button type="submit" className="login-submit btn-ice mt-4" data-locked={locked}>
              <span className="relative z-10">{locked ? "🔒 Откроется 01.12.2026 в 13:10" : "Открыть конверт ✉️"}</span>
              <span className="login-button-spark login-button-spark-one" aria-hidden="true">✧</span>
              <span className="login-button-spark login-button-spark-two" aria-hidden="true">✦</span>
            </button>
          </form>
        </Float>
      </div>

      <Drifts />
    </div>
  );
}
