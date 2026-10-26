# Mobilní vrstvení a kontrast — 26. 10. 2026

> Historický protokol. Čtecí plochy i toto vrstvení nahradila
> [plovoucí scéna](kontrola-sceny-2026-10-26.md).

## Zadání a výsledek

Velké původní bloby tvoří pozadí. Mohou je překrývat fotografie, karty i text,
pokud zůstává čitelný. Předchozí samostatné grafické bloky mezi sekcemi byly
odstraněné; obsah se vrací do původního kompaktního toku.

Bitmapy pozadí zůstaly beze změny. Na mobilu se zlepšil kontrast textu tmavším
zeleným tónem `#123428`, odstraněním příliš nízké opacity drobných textů
a lokálními neprůhlednými čtecími plochami u sytých barev. Modrá, žlutá
či fialová může zůstat přímo za textem. Požadavek „žádný geometrický překryv“
už není kritériem kontroly.

## Rozsah ověření

- Produkční build úspěšný: 16 stránek. Samostatně prošel i build izolované testovací kopie.
- Šířky 320, 360, 375, 390, 414, 430, 540, 640 a 700 px.
- Všech 16 cest: homepage, Program, Příměšťák, O nás, Kontakt, Newsletter, Blog, článek, šest detailů akcí, Cookies a 404.
- 144 kombinací skutečného obsahu: 3213 textových úseků, bez nalezeného nedostatečného kontrastu.
- 144 kombinací testovací kopie s budoucími akcemi, aktivním táborem a formulářem newsletteru: 4311 textových úseků, bez nalezeného nedostatečného kontrastu.
- 20 dalších stavů všech pěti filtrů Programu v šířkách 320, 390, 540 a 700 px: dalších 380 textových úseků, bez nalezeného nedostatečného kontrastu. Filtry zobrazují správné počty karet.
- Minimální vypočtený kontrast: běžný text 4,76 : 1, velký text 3,18 : 1; filtry včetně obsahu 5,82 : 1 a 7,81 : 1.
- Dekorace ve všech měřených stavech nepřetékají vodorovně mimo viewport.
- Klávesnicový focus formuláře newsletteru a přihlášky na tábor viditelný; při kontrole se neodesílal žádný formulář.
- Vizuálně prohlédnuté všechny barevné varianty v šířce 390 px, včetně pozadí pod textem a zakrytí fotografiemi.

Původní desktopové řešení zůstává zachované. Ve 48 porovnáních s dřívější
ověřenou verzí nebyla strukturální změna rozložení (tolerance 3 px pro
vykreslovací zaokrouhlení).

## Použitelnost a délka stránek

Ve srovnání s verzí před samostatnými grafickými bloky má při 390 × 844 px
homepage opět 2127 px a Program 844 px. Ostatní stránky zachovaly původní
celkovou výšku s odchylkou nejvýše 1 px, kromě newsletteru: odstranění zvláštního
prostoru ilustrace jej zkrátilo o 308 px. Žádná stránka se neprodlužuje kvůli
nové dekorativní sekci. Tlačítka přihlášek a hlavní odkazy mají původní pozice.

## Metoda měření

Prohlížeč poskytl skutečné obdélníky textových řádků, velikosti a váhy písem,
barvy, opacity, neprůhledné podklady předků a rozměry dekorací. V samostatném
výpočtu se původní WebP vrstvy vykreslily do těchto rozměrů s průhledností,
poměrem stran a pořadím vrstev. Kontrast se počítal vůči nejslabšímu bodu
pod celým obdélníkem řádku, nikoli pouze k průměrné barvě obrázku. Čtecí plochy
a neprůhledné povrchy karet byly při výpočtu zohledněné.

Limit je 4,5 : 1; u velkého textu 3 : 1 (24 px, nebo alespoň 18,67 px při
váze minimálně 700). Metoda je konzervativní vůči místům, kde uvnitř obdélníku
řádku není žádný skutečný tah písmena. Jde o kontrolu kontrastu modelovaného
podkladu a konkrétních stavů, nikoli o úplný audit WCAG všech funkcí webu.
Budoucí změny obsahu, šířek sloupců nebo kompozice vyžadují novou kontrolu.

Testovací termíny a nastavení formuláře existují pouze v dočasné izolované
kopii; skutečný obsah ani přihlašovací odkazy se neměnily. Nové řešení
nepřidává klientský JavaScript.

## Odborné východisko

- [W3C: G18 — kontrast přímo mezi textem a pozadím](https://www.w3.org/WAI/WCAG21/Techniques/general/G18).
- [W3C: Understanding Contrast (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html).
- [NN/g: Ensure High Contrast for Text Over Images](https://www.nngroup.com/articles/text-over-images/).

Tyto zdroje podporují kontrolu kontrastu a místní ochranu čitelnosti při
vrstvení. Konkrétní výběr ploch a kompozice je návrhové rozhodnutí pro Zahálku.
