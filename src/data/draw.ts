import { OPEN_AT, PEOPLE } from "./people";

// Начальная жеребьёвка зафиксирована заранее (учтено правило: Соня дарит и получает
// подарок только у/от Златы, Софы или Веры).
// Хранится в закодированном виде, чтобы случайно не заспойлерить результат.
const ENCODED = "eyJ2ZXJhIjoic29ueWEiLCJzb255YSI6InNvZmEiLCJzb2ZhIjoiZWdvciIsImVnb3IiOiJ2YXNpbGluYSIsInZhc2lsaW5hIjoic29ueWE3YSIsInNvbnlhN2EiOiJhbGlzYSIsImFsaXNhIjoiemxhdGEiLCJ6bGF0YSI6ImFyaW5hIiwiYXJpbmEiOiJsaXphIiwibGl6YSI6InZlcmEifQ==";
const STORAGE_KEY = "vip_kazashki_santa_draw_v4";
const SONYA_PARTNERS = new Set(["zlata", "sofa", "vera"]);

function isValidDraw(map: Record<string, string>): boolean {
  const ids = PEOPLE.map((p) => p.id);
  const values = ids.map((id) => map[id]);
  if (new Set(values).size !== ids.length) return false;
  for (const id of ids) {
    const target = map[id];
    if (!target || !ids.includes(target) || target === id) return false;
    if (map[target] === id) return false;
  }
  // Соня: и дарит, и получает подарок только у/от Златы, Софы или Веры
  if (!SONYA_PARTNERS.has(map["sonya"])) return false;
  const giver = ids.find((id) => map[id] === "sonya");
  if (!giver || !SONYA_PARTNERS.has(giver)) return false;
  return true;
}

function decodeDefault(): Record<string, string> {
  return JSON.parse(atob(ENCODED));
}

export function getDraw(): Record<string, string> {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(atob(saved));
      if (parsed && typeof parsed === "object" && isValidDraw(parsed)) {
        return parsed;
      }
    }
  } catch {
    // игнорируем повреждённое хранилище
  }
  return decodeDefault();
}

/** Пережеребьёвка (работает только пока не наступило время открытия) */
export function rerollDraw(): boolean {
  if (Date.now() >= OPEN_AT) return false;
  const ids = PEOPLE.map((p) => p.id);
  for (let attempt = 0; attempt < 500; attempt++) {
    const arr = [...ids];
    for (let i = arr.length - 1; i > 0; i--) {
      const buf = new Uint32Array(1);
      crypto.getRandomValues(buf);
      const j = buf[0] % (i + 1);
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    const cand: Record<string, string> = {};
    for (let i = 0; i < arr.length; i++) {
      cand[arr[i]] = arr[(i + 1) % arr.length];
    }
    if (isValidDraw(cand)) {
      localStorage.setItem(STORAGE_KEY, btoa(JSON.stringify(cand)));
      return true;
    }
  }
  return false;
}

export function hasCustomDraw(): boolean {
  try {
    return Boolean(localStorage.getItem(STORAGE_KEY));
  } catch {
    return false;
  }
}
