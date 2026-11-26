import { OPEN_AT, PEOPLE, type Person } from "../data/people";
import { Float } from "../components/Float";
import { Drifts } from "../components/Decor";
import { PhotoRing } from "../components/PhotoRing";
import { sound } from "../utils/sound";

interface Props {
  onPick: (p: Person) => void;
  onLogin: () => void;
  onExit: () => void;
}

// OPEN_AT нужен только чтобы подсказать, когда откроется жеребьёвка
const openLabel = new Intl.DateTimeFormat("ru-RU", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
}).format(new Date(OPEN_AT));

export function AdminPage({ onPick, onLogin, onExit }: Props) {
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
          <p className="mx-auto mt-2 max-w-sm text-[11px] font-bold uppercase tracking-wider text-sky-200/75">
            жеребьёвка одна на всех · открытие {openLabel}
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

      <Drifts />
    </div>
  );
}
