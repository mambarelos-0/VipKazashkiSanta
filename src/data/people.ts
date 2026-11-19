import egor from "../assets/avatars/egor.jpg";
import arina from "../assets/avatars/arina.jpg";
import sonya7a from "../assets/avatars/sonya7a.jpg";
import sonya from "../assets/avatars/sonya.jpg";
import sofa from "../assets/avatars/sofa.jpg";
import alisa from "../assets/avatars/alisa.jpg";
import vera from "../assets/avatars/vera.jpg";
import vasilina from "../assets/avatars/vasilina.jpg";
import liza from "../assets/avatars/liza.jpg";
import zlata from "../assets/avatars/zlata.jpg";

// Главное фото (на Яндекс.Диске его не было, осталось прежнее внешнее)
export const HERO_PHOTO =
  "https://fs.oblakoteka.ru/d.fotovssylku.ru/2026/11/07/IMG_9053.md.jpeg";

export interface Person {
  id: string;
  name: string; // как показываем
  aliases: string[]; // как можно ввести имя
  password: string;
  photo: string;
  wishlist: string;
}

export const PEOPLE: Person[] = [
  {
    id: "egor",
    name: "Егор",
    aliases: ["егор"],
    password: "ричвич",
    photo: egor,
    wishlist: "хочу каких нибудь свечек необычных и еще чето🐄✨",
  },
  {
    id: "arina",
    name: "Арина",
    aliases: ["арина"],
    password: "снегурка",
    photo: arina,
    wishlist: "можно какие-то сладости, брелки, украшения, открытки. ну а так на свой вкус",
  },
  {
    id: "sonya7a",
    name: "Соня 7А",
    aliases: ["соня7а", "соня7"],
    password: "мясокомбинат",
    photo: sonya7a,
    wishlist: "все что угодно кроме горького шоколада, например крема, чашки, конфеты",
  },
  {
    id: "sonya",
    name: "Соня",
    aliases: ["соня", "соня8г", "соня8"],
    password: "опгшница",
    photo: sonya,
    wishlist:
      "https://www.wildberries.ru/catalog/317255274/detail.aspx?size=478300790, https://www.wildberries.ru/catalog/1631623796/detail.aspx?size=2583602779",
  },
  {
    id: "sofa",
    name: "Софа",
    aliases: ["софа"],
    password: "борислов",
    photo: sofa,
    wishlist: "какое нибудь лего и бейбифокс",
  },
  {
    id: "alisa",
    name: "Алиса",
    aliases: ["алиса"],
    password: "скотомогильник",
    photo: alisa,
    wishlist: "просто какую нибудь новогоднюю фигню",
  },
  {
    id: "vera",
    name: "Вера",
    aliases: ["вера"],
    password: "сосисон",
    photo: vera,
    wishlist: "хочу фуглера из детского мира ( обязательно брелок !!!!!!!)",
  },
  {
    id: "vasilina",
    name: "Василина",
    aliases: ["василина"],
    password: "аэрогриль",
    photo: vasilina,
    wishlist:
      "https://www.wildberries.ru/catalog/1432418975/detail.aspx?targetUrl=SN , https://www.wildberries.ru/catalog/1637761815/detail.aspx?targetUrl=SN",
  },
  {
    id: "liza",
    name: "Лиза",
    aliases: ["лиза"],
    password: "бтс",
    photo: liza,
    wishlist: "https://www.ozon.ru/cart?share=c_34ty6puvucneiwF3JlvZ0",
  },
  {
    id: "zlata",
    name: "Злата",
    aliases: ["злата"],
    password: "печень",
    photo: zlata,
    wishlist:
      "фуглер (брелок!!!) или https://www.avito.ru/samara/chasy_i_ukrasheniya/chrome_hearts_koltso_8499362854?utm_campaign=native&utm_medium=item_page_ios&utm_source=soc_sharing или https://www.wildberries.ru/catalog/444467039/detail.aspx?size=628692192 или https://www.avito.ru/moskva/chasy_i_ukrasheniya/braslet_chrome_hearts_8388012024?utm_campaign=native&utm_medium=item_page_ios&utm_source=soc_sharing или https://www.avito.ru/toguchin/chasy_i_ukrasheniya/koltso_s_krylyami_angela_chrome_hearts_type_y2k_8503816571?utm_campaign=native&utm_medium=item_page_ios&utm_source=soc_sharing либо какую нибудь крутую сумочку с Авито",
  },
];

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
