# Kontrola plovoucí scény — 26. 10. 2026

## Výsledek

| Kontrolovaný stav | Hodnota |
| --- | ---: |
| Kombinací stránka × velikost okna | 176 |
| Měřených řádků textu | 6154 |
| Nejnižší kontrast běžného volného textu | 4,59 : 1 |
| Nejnižší kontrast textu na vlastním podkladu (karty, tlačítka) | 6,23 : 1 |
| Běžný text nad korálovou nebo zelenou | 0 |
| Velký nadpis nad korálovou (limit 3 : 1, nejméně 3,56 : 1) | 16 řádků |
| Vodorovné přetečení stránky | 0 |

Produkční build: 16 stránek bez chyby.

### Levitace a přechod (doplněno)

- Ukotvené tvary se měřily s rezervou 6 px kolem každého řádku, která pokrývá
  jejich levitaci ±5 px. Výsledek beze změny: 0 nálezů ve 176 kombinacích.
- Každá stránka má v každé šířce právě jeden vykreslený tvar s názvem přechodu,
  takže prohlížeč přechod nepřeskočí.
- Pokrytí obrazovky bublinou při 8×, ještě před vrcholným napětím: nejméně
  97,3 % (Příměšťák 768×1024), v 79 z 88 kombinací stránka × velikost 100 %.
- Průběh přechodu ověřený výpočtem v zastaveném přechodu: nafouknutí 1× → 8×
  do 630 ms, napětí 7,7 × 8,4 v 675 ms, prasknutí do 780 ms, nová stránka
  plně viditelná v 780 ms, bublina nové stránky v 900 ms.

### Plovoucí korálová a zelená na O nás (doplněno)

Od 1024 px plují pevně v obrazovce, text kolem nich proplouvá ve všech výškách.
Proto se kontrolovalo vodorovně: žádný řádek volného textu (s rezervou 6 px)
nesmí zasahovat do sloupců, kde je tvar neprůhledný. Výsledek ve 10 šířkách
od 1024 do 2560 px: 0 kolizí, tvary začínají 17 px za koncem nejširšího řádku.
Pod 1024 px (7 velikostí) zůstávají ukotvené a prošly běžným měřením.

## Rozsah

- Stránky: homepage, Program, Příměšťák, O nás, Kontakt, Newsletter, Blog,
  článek Voda ve městě, šest detailů akcí, Cookies a 404.
- Velikosti okna: 320×568, 375×667, 390×844, 430×932, 600×960, 768×1024,
  1024×768, 1280×800, 1440×900, 1920×1080 a 2560×1440.
- Vizuálně prohlédnuté všechny stránky v 390×844 a 1440×900.

## Metoda

Pro každý textový uzel v `main` prohlížeč vrátil skutečné obdélníky řádků,
velikost a váhu písma, barvu a součin opacity předků.

- **Text bez vlastního podkladu** se porovnal s krémovým pozadím a s nejtmavším
  místem plovoucích tvarů (oranžová `#EF5A16`, 0,1. percentil pixelů). Plovoucí
  tvary se při scrollování posouvají, proto se počítá s nejhorším místem pod
  jakýmkoli řádkem.
- **Ukotvené tvary** (korálová, zelená) se vykreslily do canvasu a pod každým
  řádkem se kontrolovaly skutečné neprůhledné pixely, ne obdélník obrázku.
- **Text na kartě nebo tlačítku** se porovnal s barvou jejich podkladu.

Limit je 4,5 : 1 pro běžný a 3 : 1 pro velký text (24 px, nebo 18,66 px při
váze alespoň 700). Měří se klidová poloha bez scrollu; plovoucí tvary jsou
kryté výpočtem proti nejtmavšímu místu.

## Co kontrola nepokrývá

- Stav s budoucími akcemi, aktivními přihláškami na tábor a nastaveným
  formulářem newsletteru (aktuální obsah má všechny akce v minulosti).
- Vizuální dojem a plynulost přechodu a levitace. Průběh je ověřený výpočtem,
  ne okem; snímky obrazovky vrstvu přechodu nezachytí. Neověřeno ani na
  skutečném telefonu.
- Pokrytí bublinou po odscrollování: posun při scrollu může tvar částečně
  vysunout z obrazovky.
- Navigaci a patičku mimo `main`; mají vlastní neprůhledný podklad a jejich
  kontrast řeší [technický dluh](../technicky-dluh.md).
