const CDN = "https://fs.oblakoteka.ru/d.fotovssylku.ru/2026/11/07/";

export interface Person {
  id: string;
  name: string; // как показываем
  aliases: string[]; // как можно ввести имя
  password: string;
  photo: string;
}

export const PEOPLE: Person[] = [
  {
    id: "egor",
    name: "Егор",
    aliases: ["егор"],
    password: "ричвич",
    photo: CDN + "IMG_9061.md.jpeg",
  },
  {
    id: "arina",
    name: "Арина",
    aliases: ["арина"],
    password: "снегурка",
    photo: CDN + "c69c5bfb9628f3ea9d2afd3c692e2383.md.jpeg",
  },
  {
    id: "sonya7a",
    name: "Соня 7А",
    aliases: ["соня7а", "соня7"],
    password: "мясокомбинат",
    photo: CDN + "8f6455ce2f4c93986430309421e773d6.md.jpeg",
  },
  {
    id: "sonya8g",
    name: "Соня 8Г",
    aliases: ["соня8г", "соня8"],
    password: "коля",
    photo: CDN + "7036ae9fd29a28ed668472f9b2c99523.md.jpeg",
  },
  {
    id: "sofa",
    name: "Софа",
    aliases: ["софа"],
    password: "борислов",
    photo: CDN + "ae8806c6b239d9f9ce8002946c80a65f.md.jpeg",
  },
  {
    id: "alisa",
    name: "Алиса",
    aliases: ["алиса"],
    password: "скотомогильник",
    photo: CDN + "IMG_9074.md.jpeg",
  },
  {
    id: "vera",
    name: "Вера",
    aliases: ["вера"],
    password: "сосисон",
    photo: CDN + "IMG_9075.md.jpeg",
  },
  {
    id: "vasilina",
    name: "Василина",
    aliases: ["василина"],
    password: "аэрогриль",
    photo: CDN + "7714167c454ff6265cd9fa7611358878.md.jpeg",
  },
  {
    id: "liza",
    name: "Лиза",
    aliases: ["лиза"],
    password: "бтс",
    photo: CDN + "026173d5e8547ff914bad988e7fa70ab.md.jpeg",
  },
  {
    id: "zlata",
    name: "Злата",
    aliases: ["злата"],
    password: "печень",
    photo: CDN + "4ccb56ad8cf28910865ff91a346de3fd.md.jpeg",
  },
];

// Главное фото первой страницы
export const HERO_PHOTO = CDN + "IMG_9053.md.jpeg";

// 01.12.2026 13:10 (по времени устройства)
export const OPEN_AT = new Date(2026, 11, 1, 13, 10, 0).getTime();

const LATIN_TO_CYR: Record<string, string> = {
  a: "а",
  c: "с",
  e: "е",
  o: "о",
  p: "р",
  x: "х",
  y: "у",
  k: "к",
  m: "м",
  t: "т",
  h: "н",
  b: "в",
};

export function normalize(s: string): string {
  return s
    .toLowerCase()
    .replace(/ё/g, "е")
    .replace(/[a-z]/g, (ch) => LATIN_TO_CYR[ch] ?? ch)
    .replace(/[\s\-_.,]+/g, "");
}

export function findPersonByName(input: string): Person | undefined {
  const n = normalize(input);
  if (!n) return undefined;
  return PEOPLE.find(
    (p) => normalize(p.name) === n || p.aliases.some((a) => normalize(a) === n)
  );
}

export function checkPassword(p: Person, input: string): boolean {
  return normalize(input) === normalize(p.password);
}

export function getPerson(id: string): Person {
  return PEOPLE.find((p) => p.id === id)!;
}
