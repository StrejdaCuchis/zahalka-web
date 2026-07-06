# Grafické podklady pro web – „Zahálka – kulturní prostor"

Kompletní vizuální systém odvozený z pěti screenshotů (instagramové posty).
Slouží jako referenční dokument pro kódování webu, aby výsledek vizuálně vycházel z existující grafiky.

---

## 1. Barevná paleta

### Základ / pozadí
| Název | HEX | Použití |
|---|---|---|
| Krémově bílá (off-white) | `#EDEBE5` | Dominantní podklad všech grafik. Teplý, jemně našedlý tón – **nikdy** čistě bílá `#FFFFFF`. |

### Primární barva / text
| Název | HEX | Použití |
|---|---|---|
| Tmavě zelená (piniová / petrolejová) | `#2E5E4E` – `#284E40` | Veškerý text, logo, obloukové nadpisy, popisné bloky. |

### Akcentní barvy – organické „blob" tvary (s gradientem)
Každý tvar má lineární nebo radiální **přechod** z tmavšího do světlejšího odstínu a **zrnitou texturu (grain / noise)**.

| Barva | Tmavší tón | Světlejší tón | Výskyt |
|---|---|---|---|
| Levandulově modrá | `#A9B6E8` | `#C5CEF0` | screen 1, 3, 4, 5 |
| Fialová | `#B79DE8` | `#C9B6F0` | screen 2, 4, 5 |
| Šalvějová zelená | `#5E8A6E` | `#7BA588` | screen 1 |
| Oranžová / terakota | `#E28B5A` | `#E9A876` | screen 2, 3, 4 |
| Žlutozelená (limetka) | `#C7C84A` | `#D4D45E` | screen 5 |

> Pozn.: HEX hodnoty jsou odečtené vizuálně ze screenshotů; před finálem doporučuji ověřit pipetou z originálních podkladů (viz sekce 9).

---

## 2. Typografie

### Font
Bezpatkový groteskní sans-serif, geometricko-humanistického charakteru.
- **Návrh pro web:** `Aeonik`, `Neue Haas Grotesk`, případně volně dostupné `Manrope` / `Inter`.
- Charakter: čisté, mírně širší tahy, dobrá čitelnost ve verzálkách.

### Řezy a použití
| Prvek | Řez | Velikost (rel.) | Poznámka |
|---|---|---|---|
| Obloukový název akce | Bold / SemiBold, VERZÁLKY | velký | Sleduje křivku blobu (text on path). |
| Logo „ZAHÁLKA" | Bold, VERZÁLKY | střední | Písmena kopírují oblouk. |
| „KULTURNÍ / PROSTOR" | Bold, VERZÁLKY | malé | Dvouřádkově pod logem. |
| Nadpisy sekcí (screen 3) | Bold, VERZÁLKY | velký | Např. „KDE BUDEME V KVĚTNU ZAHÁLET". |
| Doplňkový text – datum / místo / cena | Regular i Bold | malé–střední | Verzálky bold (screen 1, 5) i minusky regular (screen 2). Zarovnání vlevo, těsné řádkování. |

### Typografické zásady
- Nadpisy převážně **VELKÝMI PÍSMENY**.
- **Obloukový text (text-on-path)** je klíčový poznávací prvek – hlavní název kopíruje spodní/horní hranu organického tvaru.
- Popisné bloky: zarovnání vlevo, těsný leading, 2–4 řádky.

---

## 3. Logo

- **Umístění:** vždy **vpravo nahoře**.
- **Skladba:**
  - „ZAHÁLKA" – verzálky prohnuté do oblouku.
  - „KULTURNÍ PROSTOR" – pod tím, dva řádky, menší verzálky bold.
- **Barva:** tmavě zelená `#2E5E4E` na off-white podkladu.
- Logo je konstantní napříč všemi formáty → na webu patří do hlavičky (header, vpravo).

---

## 4. Layout a kompozice

- **Formáty zdrojů:** 4:5 (portrét) a 1:1 (čtverec) – instagramové posty.
- **Organické „blob" tvary** vycházejí z rohů plátna (levý horní, pravý horní, pravý dolní) a měkce zasahují do plochy.
- **Velký negativní prostor** – vzdušnost je záměrná, off-white podklad dominuje.
- **Rozmístění prvků:**
  - Logo → pravý horní roh.
  - Obloukový název akce → střed / horní část, kopíruje křivku blobu.
  - Informační blok (datum, místo, cena) → **vlevo dole**.
  - Ilustrace (volitelně) → centrální figura.
- **Navigační / stránkovací prvky** (šipky, tečky) na screenech pocházejí z Instagramu – na web se nepřenášejí, slouží jen jako reference karuselu.

---

## 5. Ilustrační styl

- Ploché vektory, omezená paleta shodná s identitou.
- **Postavy zezadu**, dřepící / schoulené, bosé.
- Oděv typu „mikina + kalhoty" v akcentních barvách (žlutozelená, modrá, oranžová, fialová).
- Jemné **bílé linky** naznačují záhyby látky.
- Vlasy: zelené šrafování.
- Rekvizity: kniha, paleta se štětcem, malý domeček – tematicky k akci.

---

## 6. Textura (grain / noise)

- Všechny bloby i celkové plátno nesou jemnou **zrnitou texturu**.
- Na webu realizovat přes SVG filtr `feTurbulence` + `feColorMatrix`, případně poloprůhledný noise PNG overlay s `mix-blend-mode`.

---

## 7. CSS design tokeny (návrh)

```css
:root {
  /* Pozadí a text */
  --color-bg:        #EDEBE5;
  --color-primary:   #2E5E4E;
  --color-primary-d: #284E40;

  /* Akcentní bloby – tmavší / světlejší */
  --lavender:   #A9B6E8;
  --lavender-l: #C5CEF0;
  --purple:     #B79DE8;
  --purple-l:   #C9B6F0;
  --sage:       #5E8A6E;
  --sage-l:     #7BA588;
  --orange:     #E28B5A;
  --orange-l:   #E9A876;
  --lime:       #C7C84A;
  --lime-l:     #D4D45E;

  /* Typografie */
  --font-heading: 'Aeonik', 'Manrope', sans-serif; /* uppercase, bold */
  --font-body:    'Inter', sans-serif;

  /* Rytmus / spacing */
  --radius-blob: 50% 50% 50% 50% / 60% 40% 60% 40%; /* orientační */
}

body {
  background: var(--color-bg);
  color: var(--color-primary);
  font-family: var(--font-body);
}
```

---

## 8. Zásady přenosu do webu

1. **Bloby** jako inline SVG s gradientem (`linearGradient` / `radialGradient`) a noise filtrem; umístit absolutně do rohů sekcí.
2. **Obloukový text** přes SVG `<textPath>` navázaný na `<path>` kopírující hranu blobu.
3. **Logo** konstantně v pravém horním rohu headeru.
4. **Whitespace** – velkorysé odsazení, sekce oddělené barevnými bloby, ne plnými bloky.
5. **Ilustrace** jako SVG, aby zůstaly ostré a barevně sladěné s tokeny.
6. **Nadpisy verzálkami**, popisky vlevo, těsné řádkování.
7. **Nepoužívat čistě bílou** – vždy off-white podklad.

---

## 9. Otevřené body k ověření před kódem

- Přesné HEX hodnoty ověřit pipetou z originálních (nezkomprimovaných) podkladů.
- Získat přesný název fontu z brand manuálu (pokud existuje).
- Ujasnit směr gradientů u jednotlivých blobů (radiální vs. lineární, úhel).
- Dodat vektorové verze loga a ilustrací (SVG), pokud jsou k dispozici.
