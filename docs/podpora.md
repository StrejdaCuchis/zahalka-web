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

Kliknutí na odkazy k podpoře používá existující globální analytický listener (`podpora`), stažení QR událost `podpora_qr`. Listener se aktivuje až po analytickém souhlasu a pouze s nastaveným GA ID. Tyto události nepotvrzují přijetí daru; výsledek je nutné vyhodnotit podle příchozích plateb.
