// Content used by the animated sections. Names, times and numbers are sample data.

export const CH = {
  wa: { label: "WhatsApp", color: "var(--wa)" },
  ig: { label: "Instagram", color: "var(--ig)" },
  tg: { label: "Telegram", color: "var(--tg)" },
  web: { label: "Sayt chat", color: "var(--lime)" },
};

/** Hero live feed — cycles forever while the hero is visible. */
export const HERO_FEED = [
  { ch: "wa", name: "Aysel M.", text: "Salam, qiyməti nə qədərdir?" },
  { ch: "ig", name: "Rəşad Q.", text: "Ünvanı göndərə bilərsiniz?" },
  { ch: "tg", name: "Elvin S.", text: "“Bu gün açıqsınız?”", voice: "0:06" },
  { ch: "web", name: "Günay T.", text: "Sabah boş vaxtınız var?" },
  { ch: "wa", name: "Nərmin A.", text: "Çatdırılma var?" },
  { ch: "ig", name: "Tural H.", text: "Endirim var?" },
  { ch: "tg", name: "Kamran B.", text: "Можно записаться на завтра?" },
  { ch: "web", name: "Leyla R.", text: "İş saatlarınız necədir?" },
];

/** Problem section — positions in % of the stage, rotation in deg. */
export const PROBLEM_BUBBLES = [
  { t: "Salam, qiyməti nə qədərdir?", ch: "wa", x: 6, y: 14, r: -3 },
  { t: "Ünvanı göndərə bilərsiniz?", ch: "ig", x: 36, y: 10, r: 2 },
  { t: "Sabah boş vaxtınız var?", ch: "tg", x: 64, y: 17, r: -2 },
  { t: "2 otaqlı mənziliniz var?", ch: "web", x: 4, y: 37, r: 3 },
  { t: "İş saatlarınız necədir?", ch: "wa", x: 78, y: 33, r: 4 },
  { t: "Neçəyədir?", ch: "ig", x: 22, y: 26, r: -5 },
  { t: "Hello? Anyone there?", ch: "web", x: 82, y: 49, r: 2 },
  { t: "Kredit imkanı var?", ch: "ig", x: 9, y: 63, r: -4 },
  { t: "Можно записаться?", ch: "tg", x: 74, y: 62, r: -2 },
  { t: "Endirim var?", ch: "wa", x: 21, y: 76, r: 2 },
  { t: "Bu gün açıqsınız?", ch: "tg", x: 62, y: 76, r: 3 },
  { t: "Nömrənizi yazın zəhmət olmasa", ch: "wa", x: 36, y: 84, r: -2 },
  { t: "Çatdırılma var?", ch: "web", x: 86, y: 22, r: -3 },
  { t: "Cavab verən varmı?", ch: "ig", x: 47, y: 70, r: 4 },
];

export const PLATFORM_CAPTIONS = [
  "Bütün kanal bir siyahıda — WhatsApp, Instagram, Telegram, sayt.",
  "Hər söhbətdə hazır cavab təklif edir, siz təsdiqləyirsiniz.",
  "Kim maraqlanır, kim satın alıb — avtomatik toplanır.",
  "Neçə söhbət, neçə handoff, cavab sürəti — real ədədlərlə.",
];

/** Sectors — auto-cycling tabs. */
export const SECTORS = [
  {
    name: "Klinika",
    ch: "wa",
    msgs: [
      ["out", "Salam, sabah dermatoloq üçün boş vaxtınız var?"],
      ["in", "Salam! Sabah saat 14:30 və 16:00 boşdur. Hansı sizə uyğundur?"],
      ["out", "14:30 olsun"],
      ["in", "Qeyd etdim. Adınızı və telefon nömrənizi yazın, təsdiq göndərim."],
    ],
    result: "Qəbula yazıldı · sabah 14:30",
    q: "“Sabah dermatoloqa yer var?”",
  },
  {
    name: "Daşınmaz əmlak",
    ch: "ig",
    msgs: [
      ["out", "Salam, Nərimanovda 2 otaqlı mənziliniz var?"],
      ["in", "Salam! Nərimanovda 2 otaqlı 3 variantımız var. Büdcəniz təxminən nə qədərdir?"],
      ["out", "150 min ətrafı. Kredit imkanı var?"],
      ["in", "Bəli, 2 variant kreditə uyğundur. Baxışa şənbə 12:00 sizə uyğundur?"],
    ],
    result: "Lead toplandı · Baxış: şənbə 12:00",
    q: "“Nərimanovda 2 otaqlı var?”",
  },
  {
    name: "Turizm",
    ch: "tg",
    msgs: [
      ["out", "İyulda 2 nəfərlik Antalya turu neçəyədir?"],
      ["in", "Salam! İyul üçün bir neçə variant var. Neçə gecəlik və hansı tarixlərdə düşünürsünüz?"],
      ["out", "7 gecə, 10 iyuldan. Uşaq da olacaq, 5 yaş."],
      ["in", "Aydındır! Ailə otelləri ilə dəqiq qiyməti menecerimiz 10 dəqiqəyə göndərəcək."],
    ],
    result: "Tur sorğusu menecerdə",
    amber: true,
    q: "“İyulda Antalya turu?”",
  },
  {
    name: "Gözəllik",
    ch: "ig",
    msgs: [
      ["out", "Cümə günü manikür üçün yer var?"],
      ["in", "Salam! Cümə 11:00 və 15:30 boşdur. Gel lak da istəyirsiniz?"],
      ["out", "Bəli, 15:30 olsun"],
      ["in", "Yazdım! Cümə 15:30, manikür + gel lak. Bir gün əvvəl xatırladacağam."],
    ],
    result: "Rezervasiya edildi · cümə 15:30",
    q: "“Cümə manikür üçün yer?”",
  },
  {
    name: "Təhsil",
    ch: "web",
    msgs: [
      ["out", "İngilis dili kursu neçəyədir?"],
      ["in", "Salam! Səviyyənizə görə qrup seçirik. Əvvəl pulsuz sınaq dərsinə gəlmək istərdiniz?"],
      ["out", "Olar, şənbə mümkündür?"],
      ["in", "Əla! Şənbə 10:00 sınaq dərsinə yazdım. Adınızı və nömrənizi yazın."],
    ],
    result: "Sınaq dərsinə yazıldı",
    q: "“İngilis dili kursu neçəyədir?”",
  },
];
