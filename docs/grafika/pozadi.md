# Autorská pozadí Zahálky

## Výsledné řešení po vizuální připomínce, 25. 10. 2026

Zadání: původní barvy, celé tvary bez rovných spodních řezů, rozprostření po celé
obsahové části stránky a zachování dosavadního rozložení obsahu.

Původní pokus o zeslabené pozadí v hero sekcích je nahrazený. Grafika se nyní
nezesvětluje, nemá sníženou opacity, barevný filtr ani přidaný gradient. Tvary
zůstávají ve svých proporcích; neroztahují se do výšky spolu s dlouhou stránkou.

![Přehled původních dodaných kompozic](prehled.webp)

| Varianta | Použití | Kompoziční role |
| --- | --- | --- |
| 1 | Celá obsahová část homepage | Modrá, korálová a fialová rámují jednotlivé části stránky. |
| 2 | Celá obsahová část Příměšťáku | Pestřejší hravá paleta pro dětský program. |
| 3 | Celá obsahová část Programu a detailů akcí | Oranžový a fialový motiv; mobil obsahuje i původní žlutou. |
| 4 | Celá obsahová část přehledu Blogu | Chladnější fialová a modrá se žlutým akcentem. |
| 5 | Celá obsahová část O nás a Kontaktu | Společná modrá, korálová a zelená pro stránky o prostoru. |
| 6 | Samostatná ilustrace newsletteru | Úplná dodaná kompozice vedle informací na desktopu, za nimi na mobilu. Její rozložení se při opravě nemění. |

Tmavě zelené tvary variant 2 a 5 jsou menším akcentem na pravém okraji. Na mobilu
jsou dole v okrajovém prostoru, aby neležely pod zeleným textem. Jejich barvy se
kvůli čitelnosti neupravují.

## Proč bylo potřeba použít SVG zdroje

PNG exporty už některé tvary ořezávají hranicí původní kreslicí plochy. Samotné
odstranění CSS ořezu nebo přepnutí na `contain` by tuto rovnou hranu neopravilo.
Dodaný SVG export ale obsahuje celé bitmapy tvarů a jejich původní masky.

Skript odstraní pouze vnější obdélníkový klip kreslicí plochy. Původní masky,
barvy, zrnitost, vnitřní klipy a natočení jednotlivých tvarů zachovává. Každý
celý tvar se optimalizuje do WebP. Polohy vycházejí z dodané kompozice, pouze
svislé rozestupy se přizpůsobují délce stránky. Okolo všech tvarů je odstup od
okraje, takže se nedotýkají hrany hero sekce ani patičky.

## Soubory a obnovení podkladů

- Originály: `/Users/tomaskucera/Downloads/grafika`, varianty 1–6, desktop a mobil.
- `scripts/pripravit-vrstvy-pozadi.py`: příprava celých vrstev z SVG pro varianty 1–6.
- `scripts/vykreslit-vrstvu.mjs`: SVG renderer přes lokální sharp ze závislostí Astro.
- `src/data/pozadi.json`: rozměry a relativní polohy pro obě kompozice.
- `public/obrazky/pozadi/vrstvy/`: 37 optimalizovaných úplných tvarů. Zdrojová SVG o desítkách MB se neposílají do prohlížeče.
- `src/components/PozadiStranky.astro`: jednotlivé vrstvy přes celou obsahovou část, bez JS.
- `src/layouts/Zaklad.astro`: prop `pozadi`, společná vrstva za obsahem. Hlavička a patička zachovávají dosavadní tok.
- `src/components/GrafickePozadi.astro`: samostatná kompozice newsletteru z úplných tvarů, v původních rozměrech a barevnosti.
- Starší WebP celých kreslicích ploch jsou zachované jako podklady předchozí verze. Původní skript pro převod PNG zůstává pro jejich obnovení.

Obnovení celých vrstev (Pillow + nainstalované závislosti projektu):

```sh
python3 scripts/pripravit-vrstvy-pozadi.py /cesta/ke/grafika
```

Kompozice se přepínají při 700 px. Skrytá kompozice má v `picture` průhledný
fallback a nenačítá bitmapy pro druhé zařízení. Dekorace mají prázdný alt,
`aria-hidden`, rozměry a neodchytávají kliknutí. Vrstvy ve spodní části stránky
se načítají lazy. Nepoužívá se `cover`, opakování pozadí, barevné úpravy ani JS
pro polohování.

## Ověření opravy

- Produkční build: 16 stránek, úspěšný.
- Osm cest: `/`, `/tabor/`, `/program/`, `/akce/voda-ve-meste/`, `/blog/`, `/o-nas/`, `/kontakt/`, `/newsletter/`.
- Šířky 1280, 390 a 320 px, dohromady 24 kombinací.
- Před úpravou byly uložené rozměry a absolutní polohy hlavních nadpisů, podnadpisů, odkazů, obrázků, main, hlavičky a patičky; následné porovnání potvrzuje stejné hodnoty i stejnou celkovou výšku dokumentu.
- Ověření celých obrysů a původní sytosti na desktopu i mobilu; nový podklad už nekončí v pevné výšce hero sekce.
- Z homepage bylo odstraněné tónované pozadí sekce Blog, které by při překrytí opět měnilo barvu procházejícího tvaru. Rozměry sekce se nemění.
- Čitelnost tmavě zelených tvarů řeší jejich umístění. Dřívější tabulka kontrastu počítaná se zeslabenými obrázky už pro tento návrh neplatí a není tvrzením o shodě celého webu s WCAG.

Obsah a logika přihlášek nejsou součástí opravy. Aktuální obsah nemá budoucí
akce ani aktivní přihlášky na tábor; newsletter zobrazuje kontaktní e-mail.
