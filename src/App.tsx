import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { OPEN_AT, getPerson, type Person } from "./data/people";
import { getDraw } from "./data/draw";
import { Backdrop } from "./components/Backdrop";
import { SnowCanvas } from "./components/SnowCanvas";
import { Snowflake } from "./components/Snowflake";
import { LoaderScreen } from "./components/LoaderScreen";
import { CountdownPage } from "./pages/CountdownPage";
import { LoginPage } from "./pages/LoginPage";
import { RevealPage } from "./pages/RevealPage";
import { AdminPage } from "./pages/AdminPage";
import { sound } from "./utils/sound";

type View =
  | { name: "countdown" }
  | { name: "login" }
  | { name: "reveal"; giver: Person }
  | { name: "admin" }
  | { name: "adminReveal"; person: Person }
  | { name: "adminLogin" };

/** Эффект «проплывающей» метели при смене страницы */
function Swoosh() {
  const flakes = useMemo(
    () =>
      Array.from({ length: 16 }, () => ({
        top: Math.random() * 100,
        size: 14 + Math.random() * 30,
        delay: Math.random() * 0.5,
        dur: 1.2 + Math.random() * 0.7,
      })),
    []
  );
  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {[0, 0.12, 0.26].map((d, i) => (
        <div
          key={i}
          className="absolute inset-y-[-10%] left-0 w-[70%]"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(255,255,255,.55), rgba(190,228,255,.85), rgba(255,255,255,.55), transparent)",
            filter: "blur(34px)",
            opacity: 0.9 - i * 0.2,
            animation: `swoosh ${1.5 + i * 0.1}s cubic-bezier(.6,0,.3,1) ${d}s both`,
          }}
        />
      ))}
      {flakes.map((f, i) => (
        <div
          key={i}
          className="absolute left-0 text-white"
          style={{
            top: `${f.top}%`,
            animation: `flyacross ${f.dur}s ease-in-out ${f.delay}s both`,
            filter: "drop-shadow(0 0 8px rgba(160,220,255,1))",
          }}
        >
          <Snowflake size={f.size} />
        </div>
      ))}
    </div>
  );
}

export default function App() {
  const [ready, setReady] = useState(false);
  const [muted, setMuted] = useState(() => sound.isMuted());
  const [view, setView] = useState<View>(() =>
    Date.now() >= OPEN_AT ? { name: "login" } : { name: "countdown" }
  );

  // если время наступило, принудительно закрываем тестовый режим и открываем вход
  useEffect(() => {
    const id = window.setInterval(() => {
      if (Date.now() >= OPEN_AT) {
        setView((v) => {
          if (v.name === "countdown" || v.name === "admin" || v.name === "adminReveal" || v.name === "adminLogin") {
            return { name: "login" };
          }
          return v;
        });
      }
    }, 1000);
    return () => clearInterval(id);
  }, []);

  // после загрузки на страницах входа/конверта/админки мягко включаем шкатулку при первом касании
  useEffect(() => {
    if (!ready || view.name === "countdown") {
      sound.stopMusic();
      return;
    }
    const kick = () => sound.unlockAndStartMusicIfAllowed();
    window.addEventListener("pointerdown", kick, { once: true });
    return () => window.removeEventListener("pointerdown", kick);
  }, [ready, view.name]);

  const unlock = useCallback(() => {
    setView((v) => (v.name === "countdown" ? { name: "login" } : v));
  }, []);

  const viewKey = !ready
    ? "loader"
    : view.name === "reveal"
      ? `reveal-${view.giver.id}`
      : view.name === "adminReveal"
        ? `adminReveal-${view.person.id}`
        : view.name;

  // эффект проплывающей метели и перезвона при смене страницы
  const [swooshKey, setSwooshKey] = useState(0);
  const prevReady = useRef(false);
  const prevViewKey = useRef("");
  useEffect(() => {
    if (!ready) return;
    if (!prevReady.current) {
      prevReady.current = true;
      prevViewKey.current = viewKey;
      return;
    }
    if (prevViewKey.current !== viewKey) {
      prevViewKey.current = viewKey;
      setSwooshKey((k) => k + 1);
      sound.playSwoosh();
    }
  }, [ready, viewKey]);

  const draw = useMemo(() => getDraw(), [view.name]);

  let page: React.ReactNode = null;
  if (ready) {
    switch (view.name) {
      case "countdown":
        page = (
          <CountdownPage
            onUnlock={unlock}
            onAdmin={() => {
              if (Date.now() < OPEN_AT) {
                sound.unlockAndStartMusicIfAllowed();
                setView({ name: "admin" });
              }
            }}
          />
        );
        break;
      case "login":
        page = (
          <LoginPage
            onSuccess={(p) => {
              if (Date.now() >= OPEN_AT) {
                sound.unlockAndStartMusicIfAllowed();
                setView({ name: "reveal", giver: p });
              }
            }}
          />
        );
        break;
      case "reveal": {
        const targetId = draw[view.giver.id];
        page = (
          <RevealPage
            giver={view.giver}
            receiver={getPerson(targetId)}
            onBack={() => setView({ name: "login" })}
          />
        );
        break;
      }
      case "admin":
        page = (
          <AdminPage
            onPick={(p) => setView({ name: "adminReveal", person: p })}
            onLogin={() => setView({ name: "adminLogin" })}
            onExit={() => setView(Date.now() >= OPEN_AT ? { name: "login" } : { name: "countdown" })}
          />
        );
        break;
      case "adminReveal":
        page = <RevealPage receiver={view.person} preview onBack={() => setView({ name: "admin" })} />;
        break;
      case "adminLogin":
        page = (
          <LoginPage
            onBack={() => setView({ name: "admin" })}
            onSuccess={(p) => {
              if (Date.now() >= OPEN_AT) setView({ name: "reveal", giver: p });
            }}
          />
        );
        break;
    }
  }

  return (
    <div className="relative min-h-[100svh]">
      <Backdrop />
      <SnowCanvas visible={!ready || view.name !== "countdown"} />

      {/* Кнопка звука */}
      {ready && view.name !== "countdown" && (
        <button
          type="button"
          onClick={() => {
            const nextMuted = sound.toggleMute();
            setMuted(nextMuted);
          }}
          aria-label={muted ? "Включить новогодний звук" : "Выключить звук"}
          className="fixed right-3 top-3 z-[60] flex h-10 w-10 items-center justify-center rounded-full border border-white/35 bg-white/15 text-lg text-white shadow-lg backdrop-blur-md transition hover:scale-105 hover:bg-white/25 active:scale-95"
        >
          {muted ? "🔇" : "🔔"}
        </button>
      )}

      <AnimatePresence mode="wait">
        {!ready ? (
          <LoaderScreen key="loader" onReady={() => setReady(true)} />
        ) : (
          <motion.main
            key={viewKey}
            className="relative z-[2]"
            initial={{ opacity: 0, y: 50, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -40, scale: 1.03 }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          >
            {page}
          </motion.main>
        )}
      </AnimatePresence>

      {swooshKey > 0 && <Swoosh key={swooshKey} />}
    </div>
  );
}
