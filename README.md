# Aloai — Landing page

Bizneslər üçün AI qəbul platforması Aloai-nin interaktiv landing səhifəsi. Səhifə aşağı sürüşdürüldükcə hər bölmə məhsulun necə işlədiyini özü göstərir.

**Canlı:** https://aloai-landing.vercel.app

## Texnologiyalar

- [Vite](https://vite.dev) — dev server və build
- [GSAP](https://gsap.com) + ScrollTrigger, MotionPath — scroll animasiyaları
- [Lenis](https://lenis.darkroom.engineering) — yumşaq scroll
- Framework yoxdur: təmiz HTML, CSS və JavaScript

## İşə salmaq

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # dist/ qovluğuna production build
npm run preview  # build-i lokal yoxlamaq
```

## Struktur

```
index.html        Bütün bölmələrin HTML-i (12 bölmə)
src/
  style.css       Dizayn tokenləri (Aloai dizayn sistemi) və bütün stillər
  main.js         Animasiyalar: hər bölmə üçün ayrıca init funksiyası
  data.js         Söhbət nümunələri, sahələr, mətnlər
public/
  favicon.svg
```

## Bölmələr

| # | Bölmə | Animasiya |
|---|---|---|
| 01 | Hero | Canlı mesaj axını, hər mesaja "AI cavabladı" |
| 02 | Problem | Sabit ekran: balonlar yığılır, sayğac artır, sonra süpürülür |
| 03 | Kanallar | Xətlər çəkilir, mesajlar Aloai-yə axır, səsli mesaj mətnə çevrilir |
| 04 | Platforma | Sabit ekran: 4 addım (qutu, co-pilot, lead, analitika) |
| 05 | Canlı nümunə | Sabit ekran: səsli mesaj, şəkil, rus dili + cavabın mənbəyi |
| 06 | Necə işləyir | 15 dəqiqəlik qurulma zolağı, hər addımın mini vizualı |
| 07 | İnsan lazım olanda | Sabit ekran: şikayət, siqnal, AI susur, menecer götürür |
| 08 | Sahələr | Avtomatik dəyişən tablar, hər sahədə nəticə |
| 09 | Etibar | Sayğaclar |
| 10 | Qiymət | 3 paket + Korporativ |
| 11 | Suallar | Açıq FAQ |
| 12 | CTA | Cavabsız sayğac 0-a enir |

Telefonda (1024px-dən dar) sabit ekranlar adi scroll animasiyasına keçir. `prefers-reduced-motion` aktiv olanda animasiyalar söndürülür və bütün məzmun son halında göstərilir.

## Deploy

Vercel layihəsi: `aloai-landing`.

```bash
npx vercel deploy --prod
```

## Təsdiq gözləyən məzmun

`[kvadrat mötərizə]` içindəki mətnlər real məlumatla əvəz edilməlidir (dillər, endirim şərti, təhlükəsizlik). Söhbətlərdəki adlar, saatlar və rəqəmlər nümunədir.
