# Finanční podpora Zahálky

Sekce je na `/o-nas#podpora`. Vede na ni zelené CTA tlačítko z úvodu stránky O nás a zelené CTA tlačítko na homepage. Funguje bez JavaScriptu.

Obsah se upravuje v Pages CMS: **O nás → Finanční podpora Zahálky**, případně ve frontmatteru `src/content/stranky/o-nas.md` v poli `podpora`.

Dodaný QR kód je uložený v `public/obrazky/podpora/qr-platba.webp`. Obsahuje pouze kód s bílým ochranným okrajem; číslo účtu se zobrazuje samostatně pod ním. Kód má předvyplněnou částku 100 Kč, kterou uvádějí pokyny k darování.

Platební podklady:

- `cisloUctu`: ověřený účet pro dary včetně kódu banky.
- `prijemce`: volitelný přesný název příjemce tohoto účtu.
- `qrObrazek`: cesta k dodanému QR kódu v `public`, nyní `/obrazky/podpora/qr-platba.webp`. QR musí uvádět stejný účet. Případnou přednastavenou částku uveďte v `pokyny`.

Účet, příjemce a QR se zobrazují podle vyplnění jednotlivých polí. Příjemce se zobrazuje pouze spolu s účtem. S QR se automaticky zobrazí i odkaz ke stažení a návod pro mobil.

Do seznamu `podporovatele` patří název, logo a případně projekt nebo rok podpory. Neúplné položky bez názvu nebo loga se nezobrazují. Prázdný seznam zobrazí text „Přehled podporovatelů připravujeme.“

Loga se pomalu posouvají zprava doleva v plynulé smyčce (75 sekund na jeden průchod). Posun funguje čistě přes CSS i bez JavaScriptu. Lze ho pozastavit najetím myši na pás nebo zaměřením pásu klávesnicí. Při `prefers-reduced-motion: reduce` se místo animace zobrazí statická mřížka se všemi podporovateli. Kopie seznamu pro smyčku je skrytá před čtečkami obrazovky. Bílé pozadí zdrojového loga Nadace Via při zobrazení splývá s podkladem díky CSS `mix-blend-mode: multiply`.

Podporovatelé a popisy podpory vycházejí z podkladu dodaného 10. 11. 2026. Donio je uvedeno jako poděkování lidem, kteří přispěli prostřednictvím sbírky. Den Braven je upřesněním podpory Ústecké komunitní nadace.

### Zdroje log

Loga jsou uložená lokálně v `public/obrazky/podpora/`; SVG zůstávají vektorová, rastrové podklady jsou převedené do WebP. Zdrojové stránky a soubory ověřeny 10. 11. 2026:

| Soubor | Oficiální zdroj |
| --- | --- |
| `teplice.svg` | [Web města Teplice](https://www.teplice.cz/), [logo](https://www.teplice.cz/images/local/v-202608311040/logo.svg) |
| `nadace-via.webp` | [Web Nadace Via](https://www.nadacevia.cz/), [logo](https://www.nadacevia.cz/wp-content/uploads/2015/11/logo.png) |
| `nadace-cez.svg` | [Pro média Nadace ČEZ](https://www.nadacecez.cz/cs/pro-media), [logo](https://www.nadacecez.cz/webpublic/file/edee/ndce/ndce-logo.svg) |
| `ustecka-komunitni-nadace.svg` | [Logo ke stažení](https://www.komunitninadace.cz/o-nas/logo-ke-stazeni/), [logo z webu nadace](https://www.komunitninadace.cz/wp-content/uploads/2023/12/logo.svg) |
| `nadace-divoke-husy.webp` | [Dokumenty nadace](https://divokehusy.cz/dokumenty-nadace/), [logo](https://divokehusy.cz/wp-content/uploads/2026/10/01_NDH_logo_dvoubarevne_ZAKLADNI_VERZE-scaled.png) |
| `donio.svg` | [Pro média Donio](https://donio.sk/pre-media), [logo](https://donio.sk/build/frontend/images/donio-logo.beecb268.svg); atribut `viewBox` opraven na správnou velikost písmen pro škálování SVG |

Kliknutí na odkazy k podpoře používá existující globální analytický listener (`podpora`), stažení QR událost `podpora_qr`. Listener se aktivuje až po analytickém souhlasu a pouze s nastaveným GA ID. Tyto události nepotvrzují přijetí daru; výsledek je nutné vyhodnotit podle příchozích plateb.
