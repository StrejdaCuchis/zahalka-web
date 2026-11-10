# Newsletter do Google Sheets

Web zůstává statický. HTML formulář posílá údaje přímo do Google Apps Script,
který je zapíše do [CRM newsletteru](https://docs.google.com/spreadsheets/d/1fs4r_RjF6lAVvmAM-vf6vctGCNK5ilHqvfNyDw5uYKY/edit#gid=0).
Na webu nejsou přístupové údaje k tabulce. Návštěvník nepotřebuje účet Google ani
JavaScript. Při zapnutém JavaScriptu formulář vyčká na potvrzení od Googlu a přejde
ve stejné kartě na `/thank-you-newsletter`. Při chybě zůstane na původní stránce,
zobrazí vysvětlení u formuláře a umožní nový pokus. Bez JavaScriptu zůstává funkční
základní HTML odeslání s textovým potvrzením Google skriptu ve stejné kartě.

Aktuální nasazení je nastavené v `src/data/newsletter.ts`. Produkční sestavení
jej používá automaticky; na hostingu není potřeba přidávat proměnnou prostředí.
Proměnná `PUBLIC_NEWSLETTER_FORM_ACTION` slouží jen jako volitelné přepsání adresy.

## Děkovací stránka a měření

Stránka `/thank-you-newsletter` má `noindex` a není v sitemapě. Formulář přechází
na tuto adresu pouze po přečtení úspěšné odpovědi ze skriptu. Nestačí samotný HTTP
stav 200, protože Google vrací stejný stav také u odmítnutých nebo neuložených přihlášek.
Aktuální nasazený skript je kompatibilní, není potřeba ho měnit ani znovu nasazovat.
Jeho úspěšná odpověď musí začínat samostatným řádkem `Děkujeme za přihlášení`.
Formulář používá standardní čitelný požadavek CORS; nepoužívá `no-cors` ani časovač
považovaný za důkaz úspěchu.

Po potvrzeném přihlášení si prohlížeč zapamatuje pouze čas potvrzení v sessionStorage
pod klíčem `zahalka_newsletter_potvrzeno_v1`. Na děkovací stránce se po souhlasu
s analytikou odešle událost GA4 **`newsletter_prihlaseni`** s parametrem
`method: web_form`. Událost neobsahuje e-mail ani jméno. Bez souhlasu se neposílá.
Přímé otevření stránky ani její obnovení nevyvolá další konverzi. Potvrzení se
spotřebuje jednou a platí nejvýše 30 minut. Při blokovaném úložišti přihlášení
funguje dál, ale speciální konverzní událost se neodešle.

V administraci GA4 ručně označte `newsletter_prihlaseni` jako klíčovou událost.
Pro přehled návštěv lze sledovat i cestu `/thank-you-newsletter`, ale samotná
návštěva této adresy není spolehlivým důkazem přihlášení.

## Jednorázové nasazení v Googlu

1. V uvedené tabulce otevřete **Rozšíření → Apps Script**. Použijte Google účet,
   který má k tabulce právo zápisu.
2. Obsah souboru `Code.gs` nahraďte celým obsahem
   [`integrace/newsletter/Code.gs`](../integrace/newsletter/Code.gs). Projekt pojmenujte
   „Zahálka – newsletter“ a uložte.
3. V nastavení projektu zapněte zobrazení manifestu `appsscript.json` a nahraďte jej
   obsahem [`integrace/newsletter/appsscript.json`](../integrace/newsletter/appsscript.json).
4. Zvolte **Nasadit → Nové nasazení → Webová aplikace**. Spouštět jako: **Já**.
   Kdo má přístup: **Kdokoli** (včetně nepřihlášených návštěvníků).
   Potvrďte nasazení a autorizaci přístupu skriptu k tabulkám. Pokud Google účet
   tuto možnost zakazuje, musí ji povolit správce Workspace.
5. Zkopírujte adresu webové aplikace končící `/exec`, například
   `https://script.google.com/macros/s/DEPLOYMENT_ID/exec`.
   Adresa `/dev` je jen pro vývoj a na web nepatří.
6. Tuto skutečnou adresu nastavte do `odkazFormular` v `src/data/newsletter.ts`.
   Pro dočasné přepsání adresy ji lze volitelně nastavit v `.env` nebo na hostingu:

   ```dotenv
   PUBLIC_NEWSLETTER_FORM_ACTION=https://script.google.com/macros/s/DEPLOYMENT_ID/exec
   ```

7. Proveďte nové sestavení a nasazení webu. Pokud má výsledná adresa chybný tvar,
   web zobrazuje kontaktní e-mail místo nefunkčního formuláře.

Při úpravě skriptu je nutné v **Nasadit → Spravovat nasazení** upravit stávající
nasazení a zvolit novou verzi. Jeho `/exec` adresa pak zůstává stejná.
Projekt nemusí používat clasp ani další závislosti.

## Co se ukládá

| Sloupec | Hodnota |
| --- | --- |
| Email | E-mail zbavený okolních mezer a převedený na malá písmena |
| Jméno | Nepovinné jméno z formuláře |
| Datum přihlášení k newsletteru | Skutečné datum a čas přijetí v Googlu |
| Stav | `Nový` |
| Poznámky | Zdroj web a verze textu souhlasu `newsletter-v1` |

Skript používá ID listu `0`, takže přejmenování listu „Newsletter“ nevadí.
Pořadí a názvy pěti sloupců musí zůstat stejné. Při nesouladu skript vrátí chybu
a nezapíše údaje do nesprávných sloupců.

Opakované přihlášení stejného e-mailu nevytváří nový řádek a nepřepisuje datum,
stav ani poznámky původního záznamu. Souběžné požadavky jsou chráněné zámkem.
Kontakty se do rozesílacího nástroje zatím zařazují ručně a až poté se změní stav
na `Zařazen do newsletteru`. Odhlášení se nyní vyřizuje přes kontaktní e-mail.

Tabulku ponechte soukromou. Veřejná je pouze webová aplikace, která přijímá nové
přihlášky a nikdy nevrací obsah CRM. Skript kontroluje vstupy a skryté pole proti
spamu. Veřejný formulář nemá silnou ochranu proti cílenému automatickému spamu.

## Ověření po nasazení

1. V anonymním okně otevřete stránku `/newsletter` a odešlete vlastní testovací adresu.
   Vyzkoušejte i vypnutý JavaScript.
2. Potvrzení se musí zobrazit bez přihlášení do Googlu a v CRM přibýt jeden řádek
   s datem a stavem `Nový`.
   Se zapnutým JavaScriptem se musí ve stejné kartě otevřít `/thank-you-newsletter`.
   Odmítnutá přihláška musí ponechat formulář na původní stránce s chybovou hláškou.
3. Změňte testovacímu kontaktu stav na `Zařazen do newsletteru`, odešlete stejnou
   adresu s jinou velikostí písmen a ověřte, že nepřibyl řádek a stav zůstal zachovaný.
4. Ověřte formuláře také na homepage a v blogu. Používají společnou komponentu.
5. Testovací kontakt následně odstraňte z CRM.

Lokální ověření přijímacího skriptu bez zápisu do skutečné tabulky:

```sh
node --test tests/*.test.mjs
npm run build
```

Záměrně se neposílá žádný potvrzovací e-mail a skript nevyžaduje přístup do Gmailu.
Samotné lokální testy nepotvrzují funkčnost nasazení, oprávnění Googlu ani hostingu.

Dokumentace: [nasazení webové aplikace Apps Script](https://developers.google.com/apps-script/guides/web).
