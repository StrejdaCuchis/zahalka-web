# Autorská pozadí Zahálky

## Prototyp: plovoucí scéna — 26. 10. 2026

Větev `prototyp/plovouci-scena`, zatím jen homepage, O nás a Příměšťák
(`scena` v `Zaklad.astro`). Ostatní stránky používají řešení popsané níže.

- Kompozice se mapuje na obrazovku jako grafikova kreslicí plocha. Střed tvaru
  leží na souřadnici z `pozadi.json`, takže tvary přetékají přes okraj jako
  v dodaných návrzích. Velikost, barva ani bitmapy se nemění.
- Světlé tvary (modrá 7,4, žlutá 8,1, fialová 5,3 : 1 vůči textu `#123428`)
  jsou pevné za obsahem a text přes ně jezdí. Syté tvary (korálová 3,5,
  oranžová 4,4, zelená 1,9 : 1) jsou ukotvené k úvodu nebo konci stránky.
- Čtecí plochy se na těchto stránkách nepoužívají. Vlastní podklad mají jen
  karty, boxy a tlačítka.
- Na telefonu (do 500 px) se horní sytý tvar zarovná na prvek s `anchor-name:
  --kotva-sceny` (homepage: tlačítka úvodu). Bez podpory anchor positioning
  zůstává původní poloha.
- Hloubka při scrollování přes CSS scroll-driven animace, přechody mezi
  stránkami přes CSS View Transitions. Bez podpory nebo při omezení pohybu
  je scéna statická. Žádný klientský JavaScript.
- Ověření: 3 stránky × 20 velikostí (320×568 až 2560×1440), 3013 řádků
  textu. Žádný běžný text na sytém tvaru (měřeno po pixelech bitmapy),
  žádné vodorovné přetečení.

## Aktuální řešení — 26. 10. 2026

Grafika je dekorativní vrstva za obsahem. **Fotografie, karty i text ji mohou
překrývat.** Kritériem je čitelnost a přístupnost, nikoli nulový geometrický
průnik. Grafika nepřidává prázdné sekce ani neprodlužuje cestu k programu
nebo přihlášce.

Původní barvy, zrnitost, natočení a proporce bitmap se nemění. Nepoužívá se
barevný filtr, snížená opacity obrázků, deformace ani `cover`. Celé tvary
pocházejí ze SVG zdrojů; obsah je může přirozeně zakrýt.

![Přehled původních dodaných kompozic](prehled.webp)

| Varianta | Použití |
| --- | --- |
| 1 | Homepage |
| 2 | Příměšťák |
| 3 | Program, detaily akcí, Cookies a 404 |
| 4 | Přehled Blogu |
| 5 | O nás a Kontakt |
| 6 | Newsletter, na mobilu za blokem „Co můžete čekat“ |

## Mobil do 700 px

`PozadiStranky.astro` používá původní mobilní relativní velikosti a polohy
z `pozadi.json`, s odstupem 1rem od okrajů. Šířky motivů odpovídají mobilním
podkladům, obvykle přibližně 40–90 % kompoziční plochy. Svislé rozmístění se
přizpůsobuje délce obsahové části stránky. Oranžová v Programu a tmavě zelená
varianty 5 jsou ukotvené níže, aby nekomplikovaly čtení úvodu. Horní fialová
Blogu je blíž úvodu, aby celá nezmizela pod první fotografií. Newsletter
má fialovou nahoře a modrou níže v kompaktní ploše za textem.

Mobilní text nad grafikou používá tmavší zelený tón `#123428`. Na světlé modré,
žluté a fialové může být text přímo. Nad sytějšími částmi používají vybrané
souvislé čtecí bloky neprůhledný světlý povrch stávajících karet
(`color-mix(in srgb, var(--barva-pozadi) 60%, white)`). Nejde o zesvětlení
bitmap: vrstva obsahu pouze překrývá grafiku pod sebou.

Čtecí plochy jsou zvolené pro kontaktní bloky, úvod a závěr příběhu O nás,
obsah tábora, text detailů akcí, sekce Cookies a zprávu 404. Nepřidávají
padding ani výšku; okolní prostor řeší pouze malý paint-only box-shadow.
Běžné karty, newsletter a přihlášky používají své existující neprůhledné
povrchy. Na mobilu nejsou potlačené důležité texty sníženou opacity.

Předchozí řešení samostatnými dekorativními bloky mezi obsahem bylo nahrazené.
`MobilniKompozice.astro` a `ObsahSKompozici.astro` už nejsou součástí řešení.
Obsah stránek i jeho původní pořadí jsou zachované, včetně nepřerušeného příběhu
z Markdownu. Newsletter má ilustraci absolutně za textem; nerezervuje kvůli ní
samostatný dlouhý blok pod obsahem.

## Desktop a tablet

Nad 700 px zůstává předchozí řešení zachované. Od 1101 px mají boční motivy
limit šířky 26rem, na homepage korálový 32rem. Výpočet využívá volné místo vedle
obsahových sloupců. Při šířce 1470 px měří modrý motiv homepage přibližně
324 px a korálový 412 px. Oprava mobilu tyto kompozice nezmenšuje.

## Zdrojové podklady a obnova

PNG exporty už některé tvary ořezávají hranicí kreslicí plochy. Dodané SVG
obsahují celé bitmapy a jejich původní masky. Přípravný skript odstranil jen
vnější obdélníkový klip; zachovává vnitřní masky, barvy, texturu a natočení.
Každý úplný tvar je optimalizovaný do WebP.

- Originály: `/Users/tomaskucera/Downloads/grafika`, varianty 1–6 pro desktop a mobil.
- `scripts/pripravit-vrstvy-pozadi.py`: příprava celých vrstev ze SVG.
- `scripts/vykreslit-vrstvu.mjs`: renderer přes sharp ze závislostí Astro.
- `src/data/pozadi.json`: původní rozměry a relativní polohy.
- `public/obrazky/pozadi/vrstvy/`: 37 úplných optimalizovaných tvarů.
- `src/components/PozadiStranky.astro`: společné desktopové a mobilní vrstvení.
- `src/components/GrafickePozadi.astro`: ilustrace varianty 6 v newsletteru.
- `src/styly/global.css`: mobilní kontrast textu a vybrané čtecí plochy.
- `src/layouts/Zaklad.astro`: společná vrstva a identifikace konkrétní stránky.

```sh
python3 scripts/pripravit-vrstvy-pozadi.py /cesta/ke/grafika
```

Kompozice se přepínají při 700 px. Skrytá kompozice má v `picture` průhledný
fallback, takže nestahuje bitmapy druhého zařízení. Dekorace mají prázdný alt,
`aria-hidden`, rozměry a neodchytávají kliknutí. Spodní vrstvy se načítají lazy.
Polohování ani čitelnost nevyžadují klientský JavaScript.

## Ověření a odborné podklady

Aktuální výsledek popisuje [kontrola mobilního vrstvení a kontrastu](kontrola-mobilu-2026-10-26.md).
Historický [protokol z 25. 10.](kontrola-prekryvu-2026-10-25.md) dokumentuje
předchozí návrh; zákaz překrytí grafiky se podle nového zadání nepoužívá.

Východisko: [W3C, technika G18](https://www.w3.org/WAI/WCAG21/Techniques/general/G18)
a [NN/g, Ensure High Contrast for Text Over Images](https://www.nngroup.com/articles/text-over-images/).
Rozhodující je kontrast přímo za textem: 4,5 : 1 pro běžný text a 3 : 1 pro
velký text. Konkrétní způsob vrstvení je návrh pro tento web, nikoli jediný
předepsaný způsob implementace.
