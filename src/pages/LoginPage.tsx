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

        {/* Фото в ледяной раме */}
        <Float delay={0.2} className="mt-6">
          <div className="relative">
            {/* мягкое северное свечение вокруг рамки */}
            <div
              className="pointer-events-none absolute -inset-4 rounded-[38px] blur-2xl"
              style={{ background: "radial-gradient(circle, rgba(160,225,255,0.55), transparent 72%)" }}
            />
            <div
              className="login-photo glowpulse relative rounded-[28px] p-[5px]"
              style={{
                width: "min(76vw, 40svh, 340px)",
                minWidth: 220,
                aspectRatio: "1 / 1",
                background:
                  "linear-gradient(135deg,#ffffff,#8fd0ff 25%,#2f7fe0 50%,#bfe6ff 75%,#ffffff)",
              }}
            >
              <div className="relative h-full w-full overflow-hidden rounded-[24px]">
                <img
                  src={HERO_PHOTO}
                  alt="VIP Казашки"
                  referrerPolicy="no-referrer"
                  draggable={false}
                  className="h-full w-full object-cover"
                />
                {/* тонкая внутренняя ледяная кромка */}
                <div className="pointer-events-none absolute inset-0 rounded-[24px] ring-1 ring-inset ring-white/45" />
              </div>

              <Snowflake size={34} className="twinkle absolute -left-4 -top-4 text-white drop-shadow-[0_0_8px_rgba(160,220,255,1)]" />
              <Snowflake size={22} className="twinkle absolute -right-2.5 -top-2.5 text-sky-100 drop-shadow-[0_0_8px_rgba(160,220,255,1)]" style={{ animationDelay: "0.5s" }} />
              <Snowflake size={20} className="twinkle absolute -bottom-2.5 -left-2.5 text-sky-100 drop-shadow-[0_0_8px_rgba(160,220,255,1)]" style={{ animationDelay: "1.4s" }} />
              <Snowflake size={28} className="twinkle absolute -bottom-3 -right-3 text-white drop-shadow-[0_0_8px_rgba(160,220,255,1)]" style={{ animationDelay: "1s" }} />

              {/* звёздочки-искорки по краям рамки */}
              <span className="twinkle pointer-events-none absolute -right-5 top-1/3 text-sm text-white drop-shadow-[0_0_6px_#fff]" style={{ animationDelay: "0.8s" }}>✦</span>
              <span className="twinkle pointer-events-none absolute -left-5 bottom-1/3 text-xs text-sky-100 drop-shadow-[0_0_6px_#fff]" style={{ animationDelay: "1.6s" }}>✦</span>
            </div>
          </div>
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
