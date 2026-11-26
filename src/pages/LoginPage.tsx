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

        {/* Фото — сказочный домик со снежной крышей */}
        <Float delay={0.2} className="mt-4">
          <figure className="relative mx-auto" style={{ width: "min(64vw, 30svh, 252px)", minWidth: 190 }}>
            {/* крыша со снегом и трубой */}
            <svg
              viewBox="-14 -8 328 142"
              width="118%"
              style={{ display: "block", marginLeft: "-9%", overflow: "visible" }}
              aria-hidden="true"
            >
              <defs>
                <linearGradient id="roofGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#418ae3" />
                  <stop offset="0.55" stopColor="#265cb3" />
                  <stop offset="1" stopColor="#153c79" />
                </linearGradient>
              </defs>
              {/* скат крыши — сказочный купол */}
              <path
                d="M-12,124 Q150,-10 312,124 Z"
                fill="url(#roofGrad)"
                stroke="rgba(255,255,255,.4)"
                strokeWidth="2"
                strokeLinejoin="round"
              />
              {/* труба с шапкой снега */}
              <rect x="222" y="26" width="33" height="50" rx="6" fill="#1d4c96" stroke="rgba(255,255,255,.32)" strokeWidth="1.5" transform="rotate(5 238 50)" />
              <rect x="216" y="17" width="45" height="13" rx="6.5" fill="#f5fcff" transform="rotate(5 238 23)" />
              {/* пуфы дыма */}
              <circle cx="240" cy="4" r="4.6" fill="rgba(245,252,255,.8)" />
              <circle cx="250" cy="-4" r="3.1" fill="rgba(245,252,255,.55)" />
              {/* толстый слой снега на коньке крыши */}
              <path
                d="M-16,121 Q150,-12 316,121"
                fill="none"
                stroke="#f5fcff"
                strokeWidth="23"
                strokeLinecap="round"
              />
              {/* фестончатый край снега (скатывается по дуге) */}
              {Array.from({ length: 12 }, (_, i) => {
                const t = 0.045 + (i / 11) * 0.91;
                const P0 = [-16, 121], C = [150, -12], P2 = [316, 121];
                const x = (1 - t) * (1 - t) * P0[0] + 2 * (1 - t) * t * C[0] + t * t * P2[0];
                const y = (1 - t) * (1 - t) * P0[1] + 2 * (1 - t) * t * C[1] + t * t * P2[1];
                return <circle key={i} cx={x} cy={y + 13} r={i % 2 ? 8.5 : 12} fill="#f5fcff" />;
              })}
            </svg>

            {/* «стены» дома — само фото */}
            <div
              className="relative overflow-hidden"
              style={{
                marginTop: -12,
                aspectRatio: "4 / 4.6",
                borderRadius: "4px 4px 20px 20px",
                boxShadow: "0 30px 60px rgba(2,10,42,.62), 0 4px 16px rgba(110,200,255,.18)",
              }}
            >
              <img
                src={HERO_PHOTO}
                alt="VIP Казашки"
                referrerPolicy="no-referrer"
                draggable={false}
                className="h-full w-full object-cover"
                style={{ objectPosition: "center 18%" }}
              />
              {/* мягкая внутренняя тень — глубина вместо рамки */}
              <div
                className="pointer-events-none absolute inset-0"
                style={{
                  boxShadow:
                    "inset 0 -46px 52px rgba(3,12,42,.45), inset 0 22px 30px rgba(255,255,255,.12), inset 0 0 0 1px rgba(255,255,255,.14)",
                }}
              />
            </div>

            {/* сугроб под домом — фото «стоит» в снегу */}
            <svg
              viewBox="0 0 340 62"
              aria-hidden="true"
              className="pointer-events-none absolute left-1/2 z-20"
              style={{ width: "152%", bottom: -15, transform: "translateX(-50%)", overflow: "visible" }}
            >
              <defs>
                <linearGradient id="snowDriftGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#ffffff" />
                  <stop offset="0.6" stopColor="#e8f4fd" />
                  <stop offset="1" stopColor="#c9e2f6" />
                </linearGradient>
              </defs>
              <path
                d="M0,62 L0,30 Q36,6 76,22 Q110,38 152,13 Q198,-8 242,22 Q288,46 340,27 L340,62 Z"
                fill="url(#snowDriftGrad)"
              />
              {/* тонкая синяя линия по гребню — объём */}
              <path
                d="M0,30 Q36,6 76,22 Q110,38 152,13 Q198,-8 242,22 Q288,46 340,27"
                fill="none"
                stroke="rgba(120,175,228,.65)"
                strokeWidth="1.6"
              />
            </svg>

            {/* парящие снежинки вокруг сугроба — «воздух» под домом */}
            <Snowflake size={15} className="floaty pointer-events-none absolute z-30 text-white/90 drop-shadow-[0_0_5px_rgba(190,230,255,.9)]" style={{ left: "-13%", bottom: "9%", animationDelay: "0.4s" }} />
            <Snowflake size={11} className="floaty pointer-events-none absolute z-30 text-sky-100/85" style={{ left: "-3%", bottom: "-5%", animationDelay: "1.3s" }} />
            <Snowflake size={17} className="floaty pointer-events-none absolute z-30 text-white/90 drop-shadow-[0_0_6px_rgba(190,230,255,.9)]" style={{ right: "-12%", bottom: "12%", animationDelay: "0.8s" }} />
            <Snowflake size={12} className="floaty pointer-events-none absolute z-30 text-sky-100/85" style={{ right: "-2%", bottom: "-4%", animationDelay: "1.7s" }} />
            <Snowflake size={9} className="floaty pointer-events-none absolute z-30 text-white/80" style={{ left: "24%", bottom: "-11%", animationDelay: "2.1s" }} />
            <Snowflake size={10} className="floaty pointer-events-none absolute z-30 text-white/80" style={{ right: "25%", bottom: "-12%", animationDelay: "0.2s" }} />

            {/* искры на сугробе */}
            <span aria-hidden="true" className="twinkle pointer-events-none absolute z-30 text-[10px] text-white drop-shadow-[0_0_4px_#fff]" style={{ left: "18%", bottom: "2%" }}>✦</span>
            <span aria-hidden="true" className="twinkle pointer-events-none absolute z-30 text-xs text-white drop-shadow-[0_0_5px_#fff]" style={{ right: "20%", bottom: "4%", animationDelay: "1.2s" }}>✦</span>

            {/* тёплый свет, отражающийся от снега */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute left-1/2 top-full z-30 h-12 w-[150%] -translate-x-1/2 -translate-y-3"
              style={{ background: "radial-gradient(ellipse at center, rgba(170,232,255,.4), transparent 65%)" }}
            />
            {/* искры вокруг крыши */}
            <span aria-hidden="true" className="twinkle pointer-events-none absolute left-[-10px] top-[16%] text-lg text-white drop-shadow-[0_0_7px_#fff]">✦</span>
            <span aria-hidden="true" className="twinkle pointer-events-none absolute right-[-8px] top-[38%] text-sm text-sky-100 drop-shadow-[0_0_6px_#fff]" style={{ animationDelay: "0.9s" }}>✦</span>
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
