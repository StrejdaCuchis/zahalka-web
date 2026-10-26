# Kontrola plovoucí scény — 26. 10. 2026

## Druhé zesílení levitace o dalších 50 % (aktuální úprava)

Posun i náklon levitace byly znovu vynásobené 1,5. Světlé tvary mají
rozsah ±42,12–56,16 px a ±1,4625–2,0475°, syté ±14,625 px bez natočení.
Celá svislá dráha světlých tvarů nyní měří 84,24–112,32 px.
Periody, fáze a scrollová paralaxa zůstaly stejné.

Produkční build 16 stránek prošel. V otevřeném náhledu blogu byly před
obnovením stále předchozí hodnoty (modrá 32,76 px, žlutá 28,08 px,
fialová 37,44 px). Po obnovení prohlížeč potvrdil nové hodnoty 49,14 px,
42,12 px a 56,16 px, aktivní levitaci a zachovanou scrollovou paralaxu.

## Zesílení levitace o dalších 50 % (předchozí úprava)

Posun i náklon levitace byly vynásobené 1,5 oproti předchozímu stavu.
Světlé tvary se pohupují o ±28,08–37,44 px a ±0,975–1,365°, syté
svisle o ±9,75 px bez natočení. Periody, fáze a scrollová paralaxa
zůstaly stejné.

## Zesílení levitace o 30 % (předchozí úprava)

Posun i náklon levitace byly vynásobené 1,3. Světlé tvary se pohupují
o ±18,72–24,96 px a ±0,65–0,91°, syté o ±6,5 px bez natočení. Periody,
počáteční fáze a scrollová paralaxa zůstaly stejné. Následující měření
popisuje předchozí amplitudy.

## Kombinace levitace a paralaxy (předchozí úprava)

- Vrácena pomalá levitace na vnitřním obrázku s cykly 56–76 s. Paralaxa
  zůstává na `picture`; její posun i natočení jsou o 20 % větší.
- Blog, scroll 413,5 px: modrá −12,405 px, žlutá +11,1645 px, fialová
  −14,886 px. Modrá a žlutá mají opačné natočení a levitační periody
  28 a 31 s jedním směrem. Opakovaný odečet při stejném scrollu potvrdil
  stálou paralaxu a měnící se transformaci levitace.
- O nás, 390 × 844 px: žádné vodorovné přetečení; korálová a zelená mají
  levitaci ±5 px a nulové natáčení v obou vrstvách.
- Produkční build všech 16 stránek prošel. Omezení pohybu vypíná obě
  vrstvy přes `prefers-reduced-motion` v CSS.

## Zklidnění scrollování (předchozí úprava)

- Opakované vlnění i časovou levitaci nahradila jediná lineární paralaxa
  řízená scrollem; tvary se jemně natáčejí a směr obracejí pouze se scrollem.
- V produkčním náhledu na O nás: při scrollu 720 px má modrá posun −18 px
  a natočení −0,375°; při 1440 px −36 px a −0,75°. Scroll zpět na 720 px
  vrátil přesně původní hodnoty. Obrázky nemají další časovou animaci.
- Ověřené mobilní zobrazení při 390 × 844 px: paralaxa funguje, korálová
  a zelená se nenatáčejí a stránka nemá vodorovné přetečení.
- Blog při šířce 1280 px: všechny tři tvary používají scrollovou časovou osu,
  bez vodorovného přetečení. Produkční build: 16 stránek bez chyby.
- V CSS jsou vlastnosti animace zapsané jednotlivě. Zkrácený zápis při
  sestavení slučoval časovou osu do syntaxe, kterou náhledový prohlížeč
  ignoroval; kontrola proto proběhla nad výsledným produkčním CSS.

Následující širší měření kontrastu a přechodů pochází z předchozí verze scény.

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

Plují pevně v obrazovce ve všech šířkách a text kolem nich proplouvá ve všech
výškách. Proto se kontrolovalo vodorovně: žádný řádek volného textu (s rezervou
4 px) nesmí zasahovat do sloupců, kde je tvar neprůhledný. Výsledek v 16 šířkách
od 320 do 2560 px: 0 kolizí. Viditelný proužek je 23 px na telefonu a od
1024 px tvary začínají 17 px za koncem nejširšího řádku.

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
