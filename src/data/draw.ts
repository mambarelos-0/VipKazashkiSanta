import { OPEN_AT, PEOPLE } from "./people";

// Начальная жеребьёвка зафиксирована заранее (учтено правило: Соня Ш дарит и получает
// подарок только у/от Златы, Софы, Веры или Сони 8Г; Соня 8Г и Вера друг другу не достаются).
// Хранится в закодированном виде, чтобы случайно не заспойлерить результат.
const ENCODED = "eyJ2ZXJhIjoic29ueWEiLCJzb255YSI6InNvZmEiLCJzb2ZhIjoiZWdvciIsImVnb3IiOiJ2YXNpbGluYSIsInZhc2lsaW5hIjoic29ueWE3YSIsInNvbnlhN2EiOiJhbGlzYSIsImFsaXNhIjoic29ueWE4ZyIsInNvbnlhOGciOiJ6bGF0YSIsInpsYXRhIjoiYXJpbmEiLCJhcmluYSI6ImxpemEiLCJsaXphIjoidmVyYSJ9";
const STORAGE_KEY = "vip_kazashki_santa_draw_v5";
const SONYA_PARTNERS = new Set(["zlata", "sofa", "vera", "sonya8g"]);

function isValidDraw(map: Record<string, string>): boolean {
  const ids = PEOPLE.map((p) => p.id);
  const values = ids.map((id) => map[id]);
  if (new Set(values).size !== ids.length) return false;
  for (const id of ids) {
    const target = map[id];
    if (!target || !ids.includes(target) || target === id) return false;
    if (map[target] === id) return false;
  }
  // Соня Ш: и дарит, и получает подарок только у/от Златы, Софы, Веры или Сони 8Г
  if (!SONYA_PARTNERS.has(map["sonya"])) return false;
  const giver = ids.find((id) => map[id] === "sonya");
  if (!giver || !SONYA_PARTNERS.has(giver)) return false;
  // Соня 8Г и Вера друг другу не достаются
  if (map["sonya8g"] === "vera" || map["vera"] === "sonya8g") return false;
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
