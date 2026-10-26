# Autorská pozadí Zahálky

## Plovoucí scéna — 26. 10. 2026

Grafikovy kompozice tvoří scénu za obsahem každé stránky. Obsah ji může
překrývat; kritériem je kontrast přímo za textem, ne nulový geometrický průnik.
Původní barvy, zrnitost, natočení, proporce ani velikosti tvarů se nemění.
Nepoužívá se barevný filtr, snížená opacity obrázků ani podkladové čtecí plochy.

![Přehled původních dodaných kompozic](prehled.webp)

| Varianta | Použití |
| --- | --- |
| 1 | Homepage |
| 2 | Příměšťák |
| 3 | Program, detaily akcí, Cookies a 404 |
| 4 | Blog a článek |
| 5 | O nás a Kontakt |
| 6 | Newsletter |

### Kompozice

Obrazovka odpovídá grafikově kreslicí ploše (16 : 9, do 500 px šířky 9 : 16).
Souřadnice v `pozadi.json` jsou středy tvarů, takže tvary přetékají přes okraj
stejně jako v dodaných návrzích. Šířka tvaru je podíl šířky obrazovky.

### Plovoucí a ukotvené tvary

Text v `main` používá inkoust `#0C281E`. Kontrast vůči nejtmavšímu místu tvaru
(0,1. percentil pixelů v plném rozlišení):

| Tvar | Kontrast | Chování |
| --- | ---: | --- |
| Žlutá | 8,4 : 1 | plove pevně za obsahem |
| Modrá | 7,7 : 1 | plove pevně za obsahem |
| Fialová | 5,5 : 1 | plove pevně za obsahem |
| Oranžová | 4,6 : 1 | plove pevně za obsahem |
| Korálová | 3,6 : 1 | ukotvená, smí být jen pod velkými nadpisy |
| Zelená | 1,9 : 1 | ukotvená mimo text |

Plovoucí tvary jsou `position: fixed` a text přes ně při scrollování jezdí.
Ukotvené tvary z horních tří pětin kreslicí plochy patří k úvodu stránky,
spodní k jejímu závěru, a odjíždějí s obsahem.

Stránka může ukotvený tvar zarovnat ke konkrétnímu prvku přes CSS anchor
positioning. Kotva musí ležet v pozicovaném předkovi, jinak ji prohlížeč
ignoruje a platí poloha z kreslicí plochy.

- `--kotva-sceny` (do 500 px): horní sytý tvar na střed prvku. Homepage:
  tlačítka úvodu.
- `--kotva-zaveru`: spodní sytý tvar na střed prvku. Kontakt: mapa, do 500 px
  kontaktní údaje.

Na stránce s úzkým středovým sloupcem mohou plout i syté tvary, pokud stránka
nastaví `syteVedleTextu` (polovina šířky textového sloupce v px) v `Zaklad.astro`.
Tvary se pak drží v pravém okraji: jejich střed se podle potřeby posune ke kraji,
aby začínaly za koncem textu (16 px od 1024 px, jinak 8 px), a text jede vedle
nich. Konec textu se počítá jako polovina sloupce od středu, nejvýš boční
odsazení stránky 2rem od kraje. Velikost se nemění, jen víc přesahují přes okraj.
Používá to O nás (346 px). Viditelná šířka korálové i zelené: 23 px na telefonu,
29 px při 768 px, 149 px při 1024 px a 357 px při 1440 px.

Na O nás a Kontaktu je korálová na desktopu posunutá do pravého horního rohu
(92 % šířky, 1,5 rem nad okraj), aby i při levitaci zůstala jen pod velkým
nadpisem. Velikost se nemění.

### Pohyb

- **Klidná paralaxa při scrollování:** tvary při scrollování dolů pomalu
  stoupají a jemně se natáčejí. Pohyb je lineární bez opakovaných vln;
  směr obrátí až scrollování zpět. Na jednu výšku obrazovky scrollu se
  posunou o 2,4–3,6 % její výšky a natočí nejvýše o 0,6°. Díky rozsahu v pixelech
  scrollu je odezva stejná na krátké i dlouhé stránce.
- **Rozsah:** po osmi výškách obrazovky dosáhnou světlé tvary posunu
  19,2–28,8 % výšky obrazovky a natočení 2,4–4,8°, pak drží koncovou polohu.
  Korálová a zelená na O nás se posunou nejvýše o 14,4–16,8 % výšky obrazovky
  bez natáčení, aby zůstaly vedle textu. Na začátku platí původní kompozice.
- **Levitace i v klidu:** obrázek uvnitř každého tvaru se pomalu pohupuje
  o ±42,12–56,16 px a natáčí o ±1,4625–2,0475°. Cesta jedním směrem trvá 28–38 s,
  celý cyklus 56–76 s. Každý tvar má vlastní tempo a počáteční fázi;
  `ease-in-out` zajišťuje pozvolné obracení směru. Korálová a zelená drží
  rozsah ±14,625 px bez natočení. Levitace na obrázku se skládá
  s paralaxou na `picture`, takže oba pohyby fungují současně.
- **Výraznější hloubka na blogu:** ve variantě 4 (Blog i články) při scrollu
  modrá stoupá a žlutá klesá, každá jinou rychlostí a s opačným natočením.
  Rozsah scrollového posunu i natočení se proti předchozí úpravě zvýšil
  o 20 %. Posun i natočení levitace se po navýšení o 30 % zvýšily ještě dvakrát o 50 %;
  její tempo a odezva na scroll zůstaly stejné.
- **Přechod mezi stránkami:** jeden tvar odcházející stránky se během 0,63 s
  nafoukne na 8× přes celou obrazovku, krátce se napne, praskne a pod ním se
  objeví nová stránka (celkem 0,9 s, CSS View Transitions). Bublinou je oblý
  tvar: fialová na homepage, Programu, akcích, Cookies a 404, modrá na ostatních
  stránkách. Zahnutá žlutá a oranžová by obrazovku nezakryly.

Stránka na začátku a konci neodpružuje (`overscroll-behavior-y: none` na `html`
a `body`). Jinak by se při přetažení na iPhonu hlavička nebo patička odtrhla
od okraje a v mezeře by prosvitly pevné tvary scény.

Bez podpory scrollových animací zůstává levitace. Uživatelé s omezením
pohybu vidí statickou scénu a obvyklé načtení stránky. Klientský JavaScript se nepoužívá.

## Soubory

- `src/components/PlovouciScena.astro`: scéna, rozdělení tvarů, paralaxa, pomalá levitace a výběr bubliny.
- `src/layouts/Zaklad.astro`: vložení scény podle `pozadi`, ořez plochy, patička nad scénou.
- `src/styly/global.css`: inkoust a plná opacity textu nad scénou, přechod s prasknutím bubliny.
- `src/data/pozadi.json`: původní rozměry a středy tvarů.
- `public/obrazky/pozadi/vrstvy/`: 37 úplných optimalizovaných tvarů.
- `scripts/pripravit-vrstvy-pozadi.py`, `scripts/vykreslit-vrstvu.mjs`: příprava
  celých vrstev z dodaných SVG (originály v `/Users/tomaskucera/Downloads/grafika`).

```sh
python3 scripts/pripravit-vrstvy-pozadi.py /cesta/ke/grafika
```

Skrytá kompozice má v `picture` průhledný fallback, takže telefon nestahuje
desktopové bitmapy a naopak. Dekorace mají prázdný alt, `aria-hidden`
a neodchytávají kliknutí. Spodní ukotvené tvary se načítají lazy.

## Ověření

Aktuální výsledek: [kontrola plovoucí scény](kontrola-sceny-2026-10-26.md).
Starší protokoly ([25. 10.](kontrola-prekryvu-2026-10-25.md),
[26. 10., mobilní vrstvení](kontrola-mobilu-2026-10-26.md)) popisují nahrazená řešení.

Východisko: [W3C, technika G18](https://www.w3.org/WAI/WCAG21/Techniques/general/G18)
a [NN/g, Ensure High Contrast for Text Over Images](https://www.nngroup.com/articles/text-over-images/).
Rozhodující je kontrast přímo za textem: 4,5 : 1 pro běžný text a 3 : 1 pro
velký text.
