# Kontrola barevných překryvů — 25. 10. 2026

> Historický protokol. Podle upřesnění zadání z 26. 10. může obsah grafiku
> překrývat. Aktuálním kritériem je [čitelnost a kontrast](kontrola-mobilu-2026-10-26.md),
> nikoli nulový geometrický průnik.

## Nálezy a opravy

- Sytá korálová dekorace zasahovala pod text a oranžové vlasy postavičky na homepage. Volné polohování také dovolovalo překryvy na dalších stránkách. Všechny stránkové dekorace nyní rámují obsah ve volných bočních okrajích. Celé obrysy, proporce, původní barvy i zdrojové bitmapy zůstávají zachované.
- Úzké displeje mají menší motivy; poslední větší tvar je v existujícím spodním odsazení. Do 340 px se drobné pravé motivy přesouvají vlevo, aby nekolidovaly s kartami filtrovaného programu.
- Cookies a 404 používaly staré generované tvary pod textem. Nyní sdílejí bezpečné umístění dodané varianty 3.
- Oranžový CSS kruh newsletteru zasahoval pod jeho obsah. Karta má jednotný světlý podklad a plnou barvu textu. Samostatná dodaná ilustrace varianty 6 zůstává celá.
- Drobné titulky, odkazy a zpráva o prázdném programu na homepage už nemají sníženou opacity.
- Aktivní přihlášky na tábor měly tmavě zelený nadpis na zelené ploše. Nadpis nyní dědí světlou barvu; tlačítko má čitelný hover a viditelný klávesnicový focus.

Nemění se pořadí sekcí, velikosti obsahových sloupců, mezery, typografie ani logika formulářů.
Na mobilu je velikost dekorací omezená dostupným místem, aby nebylo nutné posouvat obsah.

## Rozsah ověření

Produkční build úspěšně generuje 16 stránek. V prohlížeči byly ověřeny všechny:

- Homepage, Program, Příměšťák, O nás, Kontakt, Newsletter, Blog a článek Voda ve městě.
- Šest detailů akcí: Back to school, beseda architekt, beseda zahradnictví, dílna pro děti, festival podzimu, Voda ve městě.
- Cookies a 404.

Šířky: **320, 390, 600, 700, 701, 768, 1024, 1280, 1470 a 1920 px**.

Kontrola měřila obdélníky všech viditelných dekorací proti skutečným řádkům textu,
obrázkům včetně postavičky, mapě a formulářovým prvkům v celé délce dokumentu.
Průnik větší než 1 px v obou osách se považoval za kolizi. Tato metoda počítá
i s průhlednými částmi obdélníku obrázku a je tak konzervativnější než samotný obrys.

| Kontrolovaný stav | Kombinací | Nalezené kolize po opravě |
| --- | ---: | ---: |
| Skutečný obsah: 16 stránek × 10 šířek | 160 | 0 |
| Dočasná kopie s budoucími akcemi, aktivním táborem a formulářem newsletteru | 160 | 0 |
| Všech pět filtrů programu × 10 šířek | 50 | 0 |

Vizuálně byly prohlédnuté náhledy všech 16 stránek v šířkách 390, 768 a 1470 px.
Kontrola přihlášek zahrnula také hover a focus tlačítka; žádný formulář se neodesílal.
Testovací data a nastavení formuláře vznikly pouze v izolované dočasné kopii,
bez změny skutečných dat webu a bez použití skutečných přihlašovacích odkazů.

Výběrové měření kontrastu: opravený nadpis tábora přibližně 6,23 : 1
(před opravou 1,25 : 1), text newsletteru přibližně 5,2 : 1, text tlačítka
při focusu přibližně 9,32 : 1. Nejde o úplný audit přístupnosti celého webu.

CSS definice rozložení obsahu zůstaly zachované. Kontrolní snímky neukázaly
strukturální přesuny; při opakovaném měření byly drobné rozdíly vykreslení
(do 2 px ve výšce dokumentu). Výsledek není tvrzením o přesné shodě každého pixelu.
Budoucí změny šířek sloupců nebo nových typů obsahu je potřeba zkontrolovat znovu.
