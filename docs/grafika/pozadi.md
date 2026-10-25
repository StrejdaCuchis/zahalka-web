# Autorská pozadí Zahálky

## Rozhodnutí, 25. 10. 2026

Cílem je rozpoznatelná Zahálka a dobře čitelné informace vedoucí k přihlášení.
Každá varianta má vlastní úlohu, nikoli náhodné střídání při načtení stránky.
Podklady obsahují šest variant (potvrzeno zadavatelem), vždy desktop a mobil.

![Přehled všech dodaných kompozic na současné krémové barvě](prehled.webp)

| Číslo | Kompozice a riziko | Rozhodnutí |
| --- | --- | --- |
| 1 | Modrá vlevo, korálová vpravo nahoře, fialová dole. Vyvážené rámování, blízké původní homepage. Mobil přesouvá barvy k okrajům. | Úvod homepage. Nahradit tři generované bloby jednou autorskou kompozicí, zachovat ilustraci a hlavní odkazy. |
| 2 | Nejvyšší barevná hustota, žlutá a zelená vlevo, fialová a modrá vpravo. Na mobilu je fialová blízko textové osy. | Úvod Příměšťáku. Pod souhrnem a CTA udržet klidnou krémovou plochu; nenechat dekoraci odsouvat přihlášení. |
| 3 | Desktop má největší volnou plochu vlevo nahoře; oranžová zprava a fialová zdola vytvářejí směrové rámování. Mobil přidává žlutou vlevo nahoře. | Program a detail akce. Dekorace jen v úvodním pásu, obsah a přihlášení zůstávají na krémové ploše. |
| 4 | Chladnější fialová a modrá, drobný žlutý kontrapunkt. Mobilní tvary se soustředí do spodní poloviny. | Blog, pouze úvod přehledu. Texty článků a plakáty nejsou překryty další dekorací. |
| 5 | Modrá, korálová a zelená. Mobil má překryv barev nahoře a zelený tvar na pravém okraji. | O nás a Kontakt jako společná rodina stránek o prostoru. Dlouhé texty, fotky a mapa mají vlastní klidnou plochu. |
| 6 | Desktop je výrazný vlevo, mobil soustředí všechny tři tvary doprostřed. Mobilní varianta nemá použitelný souvislý sloupec pro delší text. | Newsletter: samostatná dekorativní plocha vedle obsahu na desktopu, nad obsahem na mobilu. Nikdy pod formulářem. |

## Pracovní postup

1. Inventura originálů a srovnání obou formátů na skutečné barvě webu.
2. Přiřazení podle volného prostoru a úkolu návštěvníka, nikoli jen podle barev.
3. Optimalizace a integrace vždy jedné varianty; vlastní commit 1 až 6.
4. Produkční build a vizuální kontrola každého kroku na desktopu a mobilu.
5. Závěrečná kontrola všech šesti variant a nejdůležitější stránky: detailu akce.

## Technická pravidla

- Originály: `/Users/tomaskucera/Downloads/grafika`, soubory `1` až `6`.
- PNG mají průhlednost, desktop 2560 × 1440, mobil 1080 × 1920.
- Dodaná SVG jsou rastrové kompozice s vloženými bitmapami, přibližně 21–46 MB za soubor. Nejsou vhodná pro přímé nasazení.
- Produkční soubory: průhledné WebP, desktop 1920 × 1080, mobil 720 × 1280, kvalita 80. Barevnost a zrnitost zůstávají součástí dodaného motivu.
- Obnovení jedné varianty: `python3 scripts/pripravit-pozadi.py /cesta/ke/grafika 1` (vyžaduje Pillow).
- Komponenta `GrafickePozadi.astro` volí vlastní mobilní kompozici přes `<picture>` při šířce do 700 px, bez JavaScriptu. Otevřený obsah a navigace zůstávají nezávislé na dekoraci.
- Dekorace mají prázdný alt, `aria-hidden`, rozměry a neodchytávají kliknutí. Pozadí se neopakuje pod dlouhým obsahem a nepoužívá se jako významový obrázek pro sdílení.
- Pod textem mají kompozice intenzitu 24 % nad stávající krémovou. Syté části (hlavně zelená a korálová) jinak s běžným zeleným textem AA nesplňují. Samostatná varianta 6 zůstává na 100 %. Drobné texty nad dekorací nesmějí mít sníženou opacity.
- Původní komponenta Blob zůstává pro drobné dekorace na pomocných stránkách.

## Kontrola přijetí

- Desktop 1280 × 900; mobil 390 × 844, krajní mobilní šířka 320 px.
- Žádný vodorovný posun, deformace motivu ani překrytí odkazu dekorací.
- Nadpis, datum, místo a CTA mají čitelnou plochu. Podklady nesmějí zvýšit výšku úvodu detailu akce.
- Přepnutí zdrojů mobil/desktop, načtení obrázků, zachování jednoho h1 a sémantiky.
- Program a odkazy fungují i bez závislosti na skriptu pozadí; pozadí žádný skript nepřidává.
- Build musí projít před každým commitem. Vizuální kontrola se týká skutečného produkčního výstupu.
