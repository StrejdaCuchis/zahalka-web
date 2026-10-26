# Kontrola plovoucí scény — 26. 10. 2026

## Výsledek

| Kontrolovaný stav | Hodnota |
| --- | ---: |
| Kombinací stránka × velikost okna | 176 |
| Měřených řádků textu | 6154 |
| Nejnižší kontrast běžného volného textu | 4,59 : 1 |
| Nejnižší kontrast textu na vlastním podkladu (karty, tlačítka) | 6,23 : 1 |
| Běžný text nad korálovou nebo zelenou | 0 |
| Velký nadpis nad korálovou (limit 3 : 1, nejméně 3,56 : 1) | 15 řádků |
| Vodorovné přetečení stránky | 0 |

Produkční build: 16 stránek bez chyby.

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
- Plynulost pohybu při scrollování a přechody mezi stránkami. Nebyly vizuálně
  ověřené, a to ani na skutečném telefonu.
- Navigaci a patičku mimo `main`; mají vlastní neprůhledný podklad a jejich
  kontrast řeší [technický dluh](../technicky-dluh.md).
