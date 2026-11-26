// Базовая жеребьёвка зафиксирована в коде и одинакова на всех устройствах.
// (учтено правило: Соня Ш дарит и получает только у/от Златы, Софы, Веры или Сони 8Г;
// Соня 8Г и Вера друг другу не достаются)
// Хранится в закодированном виде, чтобы случайно не заспойлерить результат.
const ENCODED =
  "eyJzb255YSI6InZlcmEiLCJ2ZXJhIjoiYWxpc2EiLCJhbGlzYSI6InNvbnlhN2EiLCJzb255YTdhIjoic29ueWE4ZyIsInNvbnlhOGciOiJhcmluYSIsImFyaW5hIjoidmFzaWxpbmEiLCJ2YXNpbGluYSI6InNvZmEiLCJzb2ZhIjoibGl6YSIsImxpemEiOiJlZ29yIiwiZWdvciI6InpsYXRhIiwiemxhdGEiOiJzb255YSJ9";

export function getDraw(): Record<string, string> {
  return JSON.parse(atob(ENCODED)) as Record<string, string>;
}
