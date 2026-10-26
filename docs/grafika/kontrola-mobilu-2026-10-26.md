# Mobilní kompozice — 26. 10. 2026

## Změna návrhu

Drobné dekorace v bočních okrajích neodpovídaly dodaným mobilním podkladům.
Nové řešení používá původní mobilní velikosti, proporce, vodorovné polohy
a pořadí vrstev. Velké tvary se střídají s obsahovými bloky; text má čistý
podklad. Je zachovaná barevnost, zrnitost i úplné obrysy existujících WebP.
Grafické soubory a obsahové Markdown soubory se při opravě nemění.

Na 390 px měří motivy homepage 156–248 px, motivy Programu 203–315 px.
Výsledkem je změna mobilních svislých rozestupů, nikoli šířek textu, pořadí
informací nebo typografie. Desktopové kompozice od 701 px zůstávají zachované.

Prázdný Program a 404 zobrazují souvislou kompozici. Naplněný Program vkládá
první motiv za první kartu a další mezi zbylé karty. Na O nás je prostřední
motiv mezi celými kapitolami příběhu; rozdělení probíhá při buildu a původní
HTML obsahu se zachovává. Newsletter nemá mobilní limit ilustrace 10rem.

## Ověření

- Produkční build: úspěšný, 16 stránek. Samostatně prošel build izolované testovací kopie.
- Šířky: 320, 360, 375, 390, 414, 430, 540, 640, 700, 701, 768, 1101, 1470 a 1920 px.
- Všech 16 cest zahrnuje šest detailů akcí, článek, Cookies i 404.
- 224 kombinací skutečného obsahu a 224 kombinací izolované kopie s budoucími akcemi, aktivním táborem a formulářem newsletteru: žádná kolize dekorací s textem, obrázky či ovládáním a žádný ořez hranicí kontejneru nebo viewportu.
- 35 dalších stavů: všech pět filtrů programu v sedmi mobilních šířkách. Žádná kolize ani ořez; filtry dál správně skrývají karty.
- 48 porovnání s dříve ověřenou desktopovou verzí: zachovaný počet obsahových prvků, bez strukturální změny rozložení (tolerance 3 px pro rozdíly vykreslení).
- Náhledy všech šesti barevných variant prohlédnuté v šířce 390 px. Pro finální snímky stránky proscrollované, aby se vykreslily i lazy obrázky.

Geometrická kontrola porovnává celé obdélníky dekorací proti skutečným řádkům
textu a ovládacím plochám. Průnik větší než 1 px v obou osách se počítá jako
kolize. Kontrola ořezu zahrnuje všechny předky s `overflow: hidden` i viewport.
Záměrné vzájemné překrytí tvarů uvnitř původní ilustrace se zachovává.

Na 390 × 844 px končí hlavní odkazy homepage přibližně na 541 px, přihláška
na detailu testovací akce na 434 px a přihláška na testovací tábor na 699 px.
První dekorace je až za nimi. Neodesílal se žádný formulář ani přihláška.

Testovací termíny, odkazy a nastavení newsletteru existují jen v dočasné kopii.
Nové řešení neobsahuje klientský JS. Rozměry dekorací rezervuje CSS aspect-ratio;
desktopová stránka nestahuje bitmapy nových mobilních kompozic.

Budoucí změny šířek obsahových bloků a nových typů obsahu je potřeba znovu ověřit.
Kontrola neznamená úplný audit přístupnosti celého webu.
