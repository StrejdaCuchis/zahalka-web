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

Na O nás a Kontaktu je korálová na desktopu posunutá do pravého rohu (92 %
šířky), aby zůstala jen pod velkým nadpisem. Velikost se nemění.

### Pohyb

Plovoucí tvary se při scrollování posouvají různou rychlostí a mírně natáčejí
(CSS scroll-driven animace). Při přechodu mezi stránkami se tvar stejné barvy
přelije do nové kompozice (CSS View Transitions). Prohlížeče bez podpory
a uživatelé s omezením pohybu vidí statickou scénu. Klientský JavaScript se
nepoužívá.

## Soubory

- `src/components/PlovouciScena.astro`: scéna, rozdělení tvarů a pohyb.
- `src/layouts/Zaklad.astro`: vložení scény podle `pozadi`, ořez plochy, patička nad scénou.
- `src/styly/global.css`: inkoust a plná opacity textu nad scénou, přechody stránek.
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
