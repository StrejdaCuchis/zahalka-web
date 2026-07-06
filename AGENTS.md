# AGENTS.md — Web kulturního prostoru Zahálka

Tento soubor je závazná specifikace pro AI asistenty pracující na tomto projektu.
Čti ho celý před jakoukoli změnou. Když si nejsi jistý, drž se těchto pravidel, ne obecných zvyklostí.

## Co stavíme

Jednoduchý, rychlý, obsahový web pro kulturní prostor Zahálka (Teplice, Benešovo nám. 3282).
Prostor se otevírá jen na akce. Web není e-shop — nemá platby ani rezervační systém.

**Hlavní cíl (konverze):** dovést návštěvníka k přihlášení na akci/workshop/tábor.
Přihlašování probíhá přes externí Google/Microsoft Forms. Web na ně jen odkazuje.
**Druhotný cíl:** zisk sledujících na sociálních sítích.

Většina návštěvníků přichází z Instagramu nebo Googlu rovnou na konkrétní akci, ne na homepage.
Proto je detail akce nejdůležitější stránka webu.

## Technologie

- **Framework:** Astro (statické generování). Nepoužívej Next.js ani React SPA.
- **Obsah akcí:** Astro content collections. Každá akce = jeden `.md` soubor.
- **Styly:** čisté CSS v `src/styly/global.css` + scoped `<style>` v komponentách. Žádný Tailwind, žádné UI knihovny.
- **Hostování:** statický výstup pro Netlify/Vercel. Žádný server, žádná databáze.
- **JS:** minimum. Web musí fungovat i bez JavaScriptu. JS jen tam, kde je nutný (filtr akcí).

## Zásadní pravidla pro HTML (bez div soup)

Toto je nejdůležitější sekce. Web musí být čitelný pro roboty i asistivní technologie.

- Používej sémantické značky, ne obecné `<div>`: `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`, `<time>`, `<figure>`, `<figcaption>`.
- Každá akce v seznamu je `<article>`. Detail akce má obsah v `<main>` a jednom `<article>`.
- `<div>` použij POUZE jako čistě vizuální obal, když žádná sémantická značka nedává smysl. Nikdy ne pro strukturu, kterou umí vyjádřit sémantická značka.
- **Přesně jeden `<h1>` na stránku** = název akce / stránky. Podnadpisy `<h2>`, `<h3>` v logické hierarchii, nepřeskakuj úrovně.
- Nadpisy jsou skutečné `<h1>`–`<h3>`, ne zvětšený/ztučněný text v `<div>` nebo `<p>`.
- Datum a čas vždy v `<time datetime="...">` se strojově čitelným ISO formátem v atributu.
- Odkazy jsou `<a href>`, tlačítka spouštějící akci jsou `<button>`. Nezaměňuj.
- Obrázky mají vždy `alt`. Dekorativní obrázky `alt=""`. Obrázek s popiskem = `<figure>` + `<figcaption>`.

## Schéma kolekce akcí (frontmatter)

Definuj v `src/content.config.ts` kolekci `akce` s těmito poli:

```
nazev: string            # název akce → <h1> a <title>
datum: date              # datum konání (ISO), např. 2026-02-17
cas: string              # čas, např. "18:00"
typ: enum                # "beseda" | "workshop" | "festival" | "deti"
cena: string             # "zdarma" nebo "od 350 Kč" — text, protože bývá "od"
kapacita: string?        # volitelné, např. "20 míst"
odkazFormular: string?   # URL na Google/MS Form; když chybí, tlačítko se nezobrazí
obrazek: string          # cesta v /public, např. "/obrazky/akce/beseda.png"
altText: string          # alt popis obrázku
kratkyPopis: string      # 1–2 věty, ~150 znaků → meta description + OG
misto: string?           # jen když se liší od Benešova nám. 3282
```

Text pod frontmatterem = obsah detailu akce. Piš v odstavcích s `<h2>` mezinadpisy
(např. "Co vás čeká", "Pro koho", "Co si vzít"). Ne jeden slepený blok.

## Stránky a co generovat

- `index.astro` — nejbližší 3–4 akce (filtruj: `datum >= dnes`, seřaď vzestupně). Nahoře banner na tábor, dokud běží zápis. Dvě věty o Zahálce. Odkazy na sítě.
- `program.astro` — všechny nadcházející akce, filtr podle `typ` (jen tento filtr smí používat JS).
- `akce/[slug].astro` — detail generovaný z každého `.md`. Tlačítko "Přihlásit se" (odkaz na `odkazFormular`, `target="_blank" rel="noopener"`) NAD ohybem. JSON-LD Event.
- `tabor.astro` — samostatná landing stránka pro příměstský tábor. NENÍ v kolekci akcí.
- `o-nas.astro` — příběh prostoru + fotky. Staví důvěru (hlavně rodiče u tábora).
- `kontakt.astro` — adresa, mapa, odkazy na sítě.

Minulé akce nezobrazuj nikde v přehledech.

## SEO — povinné na každé stránce

Řeš centrálně v `layouts/Zaklad.astro`, ať se nezapomene:

- `<title>` a `<meta name="description">` — z props stránky. Pro akci z `nazev` a `kratkyPopis`.
- **Open Graph tagy** na KAŽDÉ stránce (kritické — web žije ze sdílení na IG/FB):
  `og:title`, `og:description`, `og:image` (absolutní URL), `og:type`, `og:url`.
  Pro akci ber obrázek a popis z frontmatteru. Fallback `og-default.png` pro stránky bez obrázku.
- `twitter:card` = `summary_large_image` + odpovídající twitter tagy.
- `<link rel="canonical">` s absolutní URL stránky.
- `lang="cs"` na `<html>`.

## Strukturovaná data (Schema.org)

- Detail akce: JSON-LD `Event` v komponentě `SchemaEvent.astro`, plněný z frontmatteru.
  Pole: `name`, `startDate` (datum+čas v ISO), `location` (Place s adresou), `description`,
  `offers` (cena; u "zdarma" `price: "0"`), `organizer` (Zahálka), `image` (absolutní URL),
  `eventStatus: EventScheduled`, `eventAttendanceMode: OfflineEventAttendanceMode`.
- Kontakt/homepage: JSON-LD `Organization` s názvem, adresou, `sameAs` (odkazy na sítě).

## Analytika (GA4 + Microsoft Clarity)

Obojí řeš centrálně přes komponentu v `<head>` v `layouts/Zaklad.astro`, ne napevno na jednotlivých stránkách.

- ID nikdy natvrdo v kódu — přes proměnné prostředí (`PUBLIC_GA_ID`, `PUBLIC_CLARITY_ID`).
- GA4 i Clarity se smí spustit AŽ PO cookie souhlasu (viz níže). Bez souhlasu se skripty nenačtou.

### Sledování konverze (outbound clicky)

Hlavní mikrokonverze = klik na "Přihlásit se". Neměř každé tlačítko zvlášť, použij datové atributy + jeden listener.

- Odkazy ke sledování dostanou atribut `data-event` a `data-akce`:
  - "Přihlásit se" → `data-event="prihlaseni"`
  - "Více info / Get details" (externí odkaz na akci) → `data-event="detail"`
- Jeden globální listener odchytí klik na cokoli s `data-event` a pošle `gtag('event', ...)` s názvem akce a cílovým odkazem.
- Listener patří do stejného bloku, který se aktivuje po cookie souhlasu.
- V GA4 se pak event `prihlaseni` označí jako klíčová událost (konverze) — ruční krok v administraci, ne v kódu.

Vzor odkazu:
```
<a href={odkazFormular} target="_blank" rel="noopener"
   data-event="prihlaseni" data-akce={nazev}>Přihlásit se</a>
```

## Cookie souhlas (GDPR) — přes Consent Mode v2

Postav řízení souhlasu na Google Consent Mode v2, ne na prostém vložení/nevložení skriptu.
Důvod: bezbolestný pozdější přechod na Cookiebot a připravenost na reklamy.

- GA4 i Clarity se v kódu odkazují vždy, ale čekají na signál souhlasu.
- Výchozí stav před volbou: `gtag('consent', 'default', { ... 'denied' })` — nic se neměří.
- Po odsouhlasení: `gtag('consent', 'update', { ... 'granted' })` — teprve pak měření a tracking listener běží.
- Při odmítnutí zůstává `denied`, nic se nesbírá.
- Lehká cookie lišta, ne korporátní monstrum. Krémové pozadí, zemitá zelená, drž identitu.
- Volbu si pamatuj (localStorage), lištu podruhé nezobrazuj.
- NEstav to jako `if (souhlas) { vlož <script> }` — to by se při migraci na Cookiebot muselo přepisovat.

## Interní prolinky

V textu detailu akce vždy odkaž na příbuznou stránku (z besedy na program pro dospělé,
z workshopu pro děti na tábor). Pomáhá Googlu i drží návštěvníka na webu.

## Vizuální identita

Drž se stávající identity Zahálky:
- Organické, oblé tvary na pozadí (modrá, zelená, fialová, oranžová gradienty).
- Zemitá tmavě zelená pro text a logo.
- Krémově bílé pozadí (#F0EFE9 přibližně).
- Hravé, vzdušné, hodně bílého prostoru. Ne korporátní, ne přeplácané.
- Logo "ZAHÁLKA / KULTURNÍ PROSTOR" vpravo nahoře.

## Výkon a přístupnost

- Obrázky: moderní formáty (WebP/AVIF), `loading="lazy"` mimo první viewport, rozměry `width`/`height` proti posunu layoutu.
- Cíl: funkční bez JS, rychlé načtení, kontrast textu vůči pozadí splňuje WCAG AA.
- Klávesnicová navigace funguje, focus stavy viditelné.

## Čeho se vyvarovat

- Div soup. Napevno vepsané akce v HTML. Platební/rezervační logika. Těžké JS frameworky.
- Nadpisy jako stylovaný text. Datum jako prostý řetězec bez `<time>`. Obrázky bez `alt`.
- Míchání obsahu do kódu — akce žijí výhradně v `.md` souborech.
