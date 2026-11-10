// Nasazení: docs/newsletter.md. Tento soubor běží v Google Apps Script, ne na webu.
const NEWSLETTER = Object.freeze({
  spreadsheetId: '1fs4r_RjF6lAVvmAM-vf6vctGCNK5ilHqvfNyDw5uYKY',
  sheetId: 0,
  headers: ['Email', 'Jméno', 'Datum přihlášení k newsletteru', 'Stav', 'Poznámky'],
  consentVersion: 'newsletter-v1',
});

function doGet() {
  return newsletterPage_('Newsletter Zahálky', 'K odběru se přihlásíte ve formuláři na webu Zahálky.');
}

function doPost(event) {
  const params = event && event.parameter ? event.parameter : {};
  const email = String(params.email || '').trim().toLowerCase();
  const name = String(params.jmeno || '').trim();
  const success = () => newsletterPage_('Děkujeme za přihlášení', 'Váš zájem o novinky Zahálky máme uložený. Těšíme se na viděnou!');

  // Skryté pole proti automatickému spamu. Nezapisujeme jej ani jiné údaje o návštěvníkovi.
  if (String(params.web || '').trim()) {
    return newsletterPage_('Formulář se nepodařilo odeslat', 'Vraťte se prosím na web a zkuste formulář vyplnit znovu.');
  }
  if (params.souhlas !== NEWSLETTER.consentVersion) {
    return newsletterPage_('Přihlášení se nepodařilo uložit', 'Použijte prosím aktuální formulář na webu Zahálky.');
  }
  if (email.length > 254 || !/^[^\s@\x00-\x1f\x7f]+@[^\s@\x00-\x1f\x7f]+\.[^\s@\x00-\x1f\x7f]+$/.test(email) || name.length > 120 || /[\x00-\x1f\x7f]/.test(name)) {
    return newsletterPage_('Zkontrolujte zadané údaje', 'Zadejte prosím platný e-mail a jméno dlouhé nejvýše 120 znaků.');
  }

  const lock = LockService.getScriptLock();
  let locked = false;
  try {
    locked = lock.tryLock(10000);
    if (!locked) {
      return newsletterPage_('Zkuste to prosím znovu', 'Právě zpracováváme další přihlášení. Vraťte se prosím na web a odešlete formulář za chvíli.');
    }

    const sheet = SpreadsheetApp.openById(NEWSLETTER.spreadsheetId).getSheetById(NEWSLETTER.sheetId);
    if (!sheet) throw new Error('Chybí list newsletteru.');
    const headers = sheet.getRange(1, 1, 1, NEWSLETTER.headers.length).getDisplayValues()[0];
    if (NEWSLETTER.headers.some((header, index) => headers[index] !== header)) {
      throw new Error('Sloupce newsletteru neodpovídají očekávanému pořadí.');
    }

    const lastRow = sheet.getLastRow();
    if (lastRow > 1) {
      const emails = sheet.getRange(2, 1, lastRow - 1, 1).getDisplayValues();
      // Opakovaný pokus nezmění datum, poznámky ani ručně zvolený stav kontaktu.
      if (emails.some(row => String(row[0]).trim().toLowerCase() === email)) return success();
    }

    if (lastRow === sheet.getMaxRows()) sheet.insertRowsAfter(lastRow, 1);
    sheet.getRange(lastRow + 1, 1, 1, 5).setValues([[
      newsletterText_(email),
      newsletterText_(name),
      new Date(),
      'Nový',
      'Zdroj: web Zahálky; souhlas se zasíláním novinek (newsletter-v1).',
    ]]);
    SpreadsheetApp.flush();
    return success();
  } catch (_error) {
    // Úspěch zobrazujeme teprve po úspěšném zápisu. Technické chyby ani osobní údaje nezveřejňujeme.
    return newsletterPage_('Přihlášení se nepodařilo uložit', 'Zkuste to prosím později nebo nám napište na jsme@zahalkateplice.cz.');
  } finally {
    if (locked) lock.releaseLock();
  }
}

function newsletterText_(value) {
  // Vstup návštěvníka se nikdy nesmí spustit jako vzorec v tabulce.
  return /^[=+\-@']/.test(value) ? "'" + value : value;
}

function newsletterPage_(title, message) {
  // Prostý text funguje i bez JavaScriptu a bez iframe obálky Google HTML Service.
  return ContentService.createTextOutput(
    title + '\n\n' + message + '\n\nTuto kartu můžete zavřít a vrátit se na web Zahálky.'
  ).setMimeType(ContentService.MimeType.TEXT);
}
