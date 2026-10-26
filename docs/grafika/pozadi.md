# Autorská pozadí Zahálky

## Výsledné řešení po vizuálních připomínkách, 26. 10. 2026

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
| 3 | Celá obsahová část Programu, detailů akcí, Cookies a 404 | Oranžový a fialový motiv; mobil obsahuje i původní žlutou. |
| 4 | Celá obsahová část přehledu Blogu | Chladnější fialová a modrá se žlutým akcentem. |
| 5 | Celá obsahová část O nás a Kontaktu | Společná modrá, korálová a zelená pro stránky o prostoru. |
| 6 | Samostatná ilustrace newsletteru | Úplná dodaná kompozice vedle informací na desktopu, za nimi na mobilu. Její rozložení se při opravě nemění. |

Na desktopu dekorace rámují obsah ve volných bočních okrajích. Na mobilu mají
velikosti a vodorovné polohy z dodaných mobilních kompozic a vlastní prostor
mezi obsahovými bloky. Díky tomu zůstávají celé, výrazné a nezasahují pod text,
tlačítka ani fotografie. Samostatná ilustrace newsletteru zachovává původní
kompozici. Barvy a bitmapy se při těchto úpravách nemění.

### Mobilní kompozice, 26. 10. 2026

Původní řešení drobnými motivy v bočních okrajích je na telefonu nahrazené.
`MobilniKompozice.astro` odvozuje velikosti, proporce a vodorovné polohy přímo
z mobilních dat v `pozadi.json`. Vrstvy řadí podle původní svislé polohy.
Horní, střední a dolní skupinu lze proložit obsahem; souvislá kompozice slouží
pro krátký prázdný Program a stránku 404. Neprovádí se ořez ani barevná úprava.

Při 390 px mají motivy homepage přibližně 156–248 px; motivy Programu 203–315 px.
Svislý rytmus mobilních stránek se přizpůsobuje velkým tvarům. Obsahové sloupce,
pořadí informací, typografie a desktopové rozložení se nemění. Hlavní odkazy
homepage a přihlašovací tlačítka zůstávají před první dekorací.

Na O nás vkládá `ObsahSKompozici.astro` střední motiv mezi celé kapitoly příběhu
podle nadpisů, bez změny Markdown obsahu. V Programu s akcemi je první motiv až
za první kartou. Ilustrace newsletteru má na telefonu celou dostupnou šířku
místo dřívějšího limitu 10rem. Kompozice mají rezervované rozměry a nepotřebují JS.

Ověření popisuje [kontrola mobilní verze](kontrola-mobilu-2026-10-26.md).

### Větší motivy na desktopu

Od 1101 px mají stránkové motivy limit šířky 26rem místo 14rem. Výpočet využívá
i volné vnitřní odsazení obsahových sloupců. Na homepage dostaly modrý a korálový
tvar samostatné umístění vedle užšího úvodu; korálový motiv má limit 32rem.
Při šířce 1470 px měří modrý motiv přibližně 324 px a korálový 412 px
(oba dříve 162 px). Tato desktopová úprava původně neměnila šířky do 1100 px;
mobilní řešení do 700 px bylo následně přepracované podle popisu výše.

Po zvětšení prošlo všech 16 stránek v šířkách 390, 1024, 1101, 1280, 1470,
1600, 1920 a 2560 px kontrolou průniků dekorací s textem, obrázky a ovládáním:
128 kombinací skutečného obsahu a dalších 128 kombinací v izolované kopii
s budoucími akcemi, aktivními přihláškami na tábor a formulářem newsletteru.
V těchto stavech nebyly nalezené kolize. Produkční build znovu prošel.

## Proč bylo potřeba použít SVG zdroje

PNG exporty už některé tvary ořezávají hranicí původní kreslicí plochy. Samotné
odstranění CSS ořezu nebo přepnutí na `contain` by tuto rovnou hranu neopravilo.
Dodaný SVG export ale obsahuje celé bitmapy tvarů a jejich původní masky.

Skript odstraní pouze vnější obdélníkový klip kreslicí plochy. Původní masky,
barvy, zrnitost, vnitřní klipy a natočení jednotlivých tvarů zachovává. Každý
celý tvar se optimalizuje do WebP. Svislé polohy vycházejí z dodané kompozice
a přizpůsobují se délce stránky; vodorovně tvary rámují obsah v okrajích.
Okolo všech tvarů je odstup od
okraje, takže se nedotýkají hrany hero sekce ani patičky.

## Soubory a obnovení podkladů

- Originály: `/Users/tomaskucera/Downloads/grafika`, varianty 1–6, desktop a mobil.
- `scripts/pripravit-vrstvy-pozadi.py`: příprava celých vrstev z SVG pro varianty 1–6.
- `scripts/vykreslit-vrstvu.mjs`: SVG renderer přes lokální sharp ze závislostí Astro.
- `src/data/pozadi.json`: rozměry a relativní polohy pro obě kompozice.
- `public/obrazky/pozadi/vrstvy/`: 37 optimalizovaných úplných tvarů. Zdrojová SVG o desítkách MB se neposílají do prohlížeče.
- `src/components/PozadiStranky.astro`: jednotlivé vrstvy přes celou obsahovou část, bez JS.
- `src/components/MobilniKompozice.astro`: velké mobilní skupiny vrstev mezi obsahovými bloky.
- `src/components/ObsahSKompozici.astro`: předěl mezi kapitolami delšího Markdown obsahu, pouze při sestavení webu.
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

Aktuální mobilní kontrolu popisuje [protokol z 26. 10.](kontrola-mobilu-2026-10-26.md).
Předchozí desktopová kontrola je v [protokolu z 25. 10.](kontrola-prekryvu-2026-10-25.md).
Dekorace se nepřekrývají s textem, obrázky ani ovládacími prvky v ověřených
stavech. Mobilní tok nyní zahrnuje prostor pro celé velké motivy.

Aktuální skutečný obsah nemá budoucí akce ani aktivní přihlášky na tábor;
newsletter bez nastaveného formuláře zobrazuje kontaktní e-mail. Testovací
obsah vznikl pouze v dočasné kopii a nepatří do publikovaného webu.
