# Finanční podpora Zahálky

Sekce je na `/o-nas#podpora`. Vede na ni zelené CTA tlačítko z úvodu stránky O nás a zelené CTA tlačítko na homepage. Funguje bez JavaScriptu.

Obsah se upravuje v Pages CMS: **O nás → Finanční podpora Zahálky**, případně ve frontmatteru `src/content/stranky/o-nas.md` v poli `podpora`.

Do dodání podkladů se zobrazuje označené místo pro QR kód, informace o připravovaných platebních údajích a přehledu podporovatelů. Nejde o funkční platební údaje.

Pro spuštění darování doplňte:

- `cisloUctu`: ověřený účet pro dary včetně kódu banky.
- `prijemce`: přesný název příjemce tohoto účtu.
- `qrObrazek`: cestu k dodanému QR kódu v `public`, například `/obrazky/podpora/qr-platba.png`. QR musí uvádět stejný účet; pro libovolné dary nemá mít přednastavenou částku.

Účet a příjemce se zobrazí pouze po vyplnění obou polí. QR lze doplnit později; pak se automaticky zobrazí i odkaz ke stažení a návod pro mobil. Před zveřejněním načtěte dodaný kód v bankovní aplikaci a ověřte údaje.

Do seznamu `podporovatele` patří název, logo a případně projekt nebo rok podpory. Neúplné položky bez názvu nebo loga se nezobrazují. Prázdný seznam zobrazí text „Přehled podporovatelů připravujeme.“

Kliknutí na odkazy k podpoře používá existující globální analytický listener (`podpora`), stažení QR událost `podpora_qr`. Listener se aktivuje až po analytickém souhlasu a pouze s nastaveným GA ID. Tyto události nepotvrzují přijetí daru; výsledek je nutné vyhodnotit podle příchozích plateb.
