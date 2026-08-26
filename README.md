# Zahálka

Statický web kulturního prostoru Zahálka v Teplicích. Je postavený v Astro a obsah lze spravovat přes Pages CMS.

## Správa obsahu přes Pages CMS

Administrace umožňuje upravovat:

- akce a jejich detailní texty,
- obrázky akcí a stránek,
- obsah stránky Tábor včetně stavu přihlašování,
- obsah a fotogalerii stránky O nás.

### První připojení

1. Otevřete [app.pagescms.org](https://app.pagescms.org/).
2. Přihlaste se GitHub účtem, který spravuje repozitář `StrejdaCuchis/zahalka-web`.
3. Nainstalujte Pages CMS GitHub App pouze pro tento repozitář.
4. Vyberte repozitář. Pages CMS načte nastavení z `.pages.yml`.

Další lidé mohou být v Pages CMS pozváni e-mailem jako spolupracovníci. Mohou upravovat obsah a obrázky, ale nemohou měnit konfiguraci administrace.

Po uložení změny Pages CMS zapíše nový obsah do GitHubu. Připojený hosting pak automaticky sestaví a zveřejní novou verzi webu.

## Obsahové soubory

- `src/content/akce/` — jednotlivé akce
- `src/content/stranky/tabor.md` — stránka Tábor
- `src/content/stranky/o-nas.md` — stránka O nás
- `public/obrazky/` — obrázky spravované v administraci

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
