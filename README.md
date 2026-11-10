# Zahálka

Statický web kulturního prostoru Zahálka v Teplicích. Je postavený v Astro a obsah lze spravovat přes Pages CMS.

## Správa obsahu přes Pages CMS

Administrace umožňuje upravovat:

- akce a jejich detailní texty,
- blogové články včetně titulního obrázku, témat a stavu publikování,
- obrázky akcí a stránek,
- obsah stránky Příměšťák včetně stavu přihlašování,
- obsah a fotografie stránky O nás.

### První připojení

1. Otevřete [app.pagescms.org](https://app.pagescms.org/).
2. Přihlaste se GitHub účtem, který spravuje repozitář `StrejdaCuchis/zahalka-web`.
3. Nainstalujte Pages CMS GitHub App pouze pro tento repozitář.
4. Vyberte repozitář. Pages CMS načte nastavení z `.pages.yml`.

Další lidé mohou být v Pages CMS pozváni e-mailem jako spolupracovníci. Mohou upravovat obsah a obrázky, ale nemohou měnit konfiguraci administrace.

Po uložení změny Pages CMS zapíše nový obsah do GitHubu. Připojený hosting pak automaticky sestaví a zveřejní novou verzi webu.

## Obsahové soubory

U akcí lze v poli **Formáty akce** vybrat více labelů: Koncert, Kino, Přednáška,
Workshop, Beseda, Procházka, Pro děti, Výstava a Design market. Ve frontmatteru
se ukládají jako seznam, například `typ: [workshop, deti]`. Akce se zobrazí pod
každým přiřazeným filtrem programu.

- `src/content/akce/` — jednotlivé akce
- `src/content/blog/` — blogové články
- `src/content/stranky/tabor.md` — stránka Příměšťák
- `src/content/stranky/o-nas.md` — stránka O nás
- `public/obrazky/` — obrázky spravované v administraci

Náhledový obrázek akce nebo článku připravujte v rozměru **1080 × 1350 px
(4:5)**, jako celý plakát bez ořezu. Ideální je WebP přibližně do 250–350 kB.
Karty zachovávají skutečný poměr obrázku: starší podklady na šířku se zobrazí
bez ořezu i bez doplňovaných prázdných pásů, text navazuje přímo pod obrázkem.

## Propojení newsletteru s Google Sheets

Formulář ukládá e-mail, nepovinné jméno, datum přihlášení a stav `Nový` do CRM
v Google Sheets přes Google Apps Script. Web zůstává statický a formulář funguje
i bez JavaScriptu. Opakované přihlášení nevytváří duplicitní kontakt.

Po potvrzeném odeslání formulář při zapnutém JavaScriptu přejde ve stejné kartě
na `/thank-you-newsletter`. Chyby zobrazuje přímo u formuláře. Úspěšné přihlášení
se po cookie souhlasu měří událostí GA4 `newsletter_prihlaseni`.

Přijímací skript je v `integrace/newsletter/`. Adresa nasazené webové aplikace je
uložená v `src/data/newsletter.ts`, takže funguje i sestavení na hostingu.
Volitelně ji lze přepsat proměnnou `PUBLIC_NEWSLETTER_FORM_ACTION` a znovu sestavit
web. Neplatná adresa zobrazí kontaktní e-mail místo formuláře.

Celý postup nasazení a ověření je v [docs/newsletter.md](docs/newsletter.md).

## Lokální vývoj

Požadavky: Node.js 22.12 nebo novější.

```sh
npm install
npm run dev
```

Produkční sestavení:

```sh
npm run build
```
