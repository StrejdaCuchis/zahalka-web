import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';

const code = readFileSync(new URL('../integrace/newsletter/Code.gs', import.meta.url), 'utf8');
const headers = ['Email', 'Jméno', 'Datum přihlášení k newsletteru', 'Stav', 'Poznámky'];

function setup({ contacts = [], sheetHeaders = headers, lockAvailable = true, failWrite = false, maxRows = 1000 } = {}) {
  const rows = contacts.map(row => [...row]);
  const calls = { lock: 0, release: 0, write: 0, flush: 0, extend: 0 };
  const sheet = {
    getLastRow: () => rows.length + 1,
    getMaxRows: () => maxRows,
    insertRowsAfter: () => { calls.extend++; },
    getRange(row, col, height, width) {
      return {
        getDisplayValues: () => row === 1 ? [sheetHeaders] : rows.slice(row - 2, row - 2 + height).map(record => [record[0]]),
        setValues(values) {
          calls.write++;
          if (failWrite) throw new Error('Write unavailable');
          assert.equal(col, 1);
          assert.equal(width, 5);
          assert.equal(height, 1);
          rows[row - 2] = Array.from(values[0]);
        },
      };
    },
  };
  const context = vm.createContext({
    LockService: { getScriptLock: () => ({
      tryLock: () => { calls.lock++; return lockAvailable; },
      releaseLock: () => { calls.release++; },
    }) },
    SpreadsheetApp: {
      openById(id) {
        assert.equal(id, '1fs4r_RjF6lAVvmAM-vf6vctGCNK5ilHqvfNyDw5uYKY');
        return { getSheetById: id => { assert.equal(id, 0); return sheet; } };
      },
      flush: () => { calls.flush++; },
    },
    ContentService: {
      MimeType: { TEXT: 'text/plain' },
      createTextOutput: body => ({ body, setMimeType() { return this; } }),
    },
  });
  vm.runInContext(code, context);
  const post = params => context.doPost({ parameter: { email: 'test@example.com', souhlas: 'newsletter-v1', ...params } }).body;
  return { post, rows, calls, context };
}

test('new signup writes the five CRM columns with server date and consent source', () => {
  const { post, rows, calls } = setup();
  assert.match(post({ email: '  Jana@Example.com ', jmeno: ' Jana Nováková ' }), /Děkujeme za přihlášení/);
  assert.equal(rows.length, 1);
  assert.equal(rows[0][0], 'jana@example.com');
  assert.equal(rows[0][1], 'Jana Nováková');
  assert.equal(Object.prototype.toString.call(rows[0][2]), '[object Date]');
  assert.ok(Math.abs(Date.now() - rows[0][2].getTime()) < 5000);
  assert.equal(rows[0][3], 'Nový');
  assert.match(rows[0][4], /newsletter-v1/);
  assert.equal(calls.flush, 1);
  assert.equal(calls.release, 1);
});

test('name is optional', () => {
  const { post, rows } = setup();
  post();
  assert.equal(rows[0][1], '');
});

test('duplicate preserves existing date, name, status and notes', () => {
  const contact = ['TEST@example.com', 'Původní jméno', '2026-11-01', 'Zařazen do newsletteru', 'Ruční poznámka'];
  const { post, rows, calls } = setup({ contacts: [contact] });
  assert.match(post({ jmeno: 'Nové jméno' }), /Děkujeme za přihlášení/);
  assert.deepEqual(rows, [contact]);
  assert.equal(calls.write, 0);
  assert.equal(calls.release, 1);
});

test('repeated requests do not add duplicate rows', () => {
  const { post, rows } = setup();
  post();
  post({ email: 'TEST@EXAMPLE.COM' });
  assert.equal(rows.length, 1);
});

test('invalid email, control characters and oversized name never write', () => {
  for (const params of [{ email: '' }, { email: 'not-an-email' }, { email: 'a@b' }, { email: 'a b@example.com' }, { email: 'a\u0000@example.com' }, { email: 'a'.repeat(250) + '@example.com' }, { jmeno: 'x'.repeat(121) }, { jmeno: 'Name\n=1' }]) {
    const { post, calls } = setup();
    assert.match(post(params), /Zkontrolujte zadané údaje/);
    assert.equal(calls.write, 0);
    assert.equal(calls.lock, 0);
  }
});

test('missing consent and honeypot do not access the spreadsheet', () => {
  for (const params of [{ souhlas: '' }, { souhlas: 'old-version' }, { web: 'spam.example' }]) {
    const { post, calls } = setup();
    assert.doesNotMatch(post(params), /Děkujeme za přihlášení/);
    assert.equal(calls.lock, 0);
    assert.equal(calls.write, 0);
  }
});

test('formula-like email and name are stored as literal text', () => {
  const { post, rows } = setup();
  post({ email: '=formula@example.com', jmeno: '=IMPORTXML("https://example.com", "//x")' });
  assert.equal(rows[0][0], "'=formula@example.com");
  assert.equal(rows[0][1][0], "'");
});

test('unexpected CRM headers fail safely without a write', () => {
  const { post, calls } = setup({ sheetHeaders: ['Jméno', 'Email', ...headers.slice(2)] });
  assert.match(post(), /Přihlášení se nepodařilo uložit/);
  assert.equal(calls.write, 0);
  assert.equal(calls.release, 1);
});

test('busy lock does not write or release a lock owned by another request', () => {
  const { post, calls } = setup({ lockAvailable: false });
  assert.match(post(), /Zkuste to prosím znovu/);
  assert.equal(calls.write, 0);
  assert.equal(calls.release, 0);
});

test('storage failure never returns success and releases the lock', () => {
  const { post, calls } = setup({ failWrite: true });
  assert.match(post(), /Přihlášení se nepodařilo uložit/);
  assert.equal(calls.flush, 0);
  assert.equal(calls.release, 1);
});

test('full sheet gets space for a new signup', () => {
  const { post, rows, calls } = setup({ maxRows: 1 });
  post();
  assert.equal(calls.extend, 1);
  assert.equal(rows.length, 1);
});

test('GET and empty requests disclose no CRM content or submitted values', () => {
  const { context, post } = setup();
  assert.match(context.doGet().body, /K odběru se přihlásíte ve formuláři/);
  assert.doesNotMatch(context.doPost().body, /Děkujeme za přihlášení/);
  assert.doesNotMatch(post({ email: 'private@example.com', jmeno: '<script>alert(1)</script>' }), /private@example.com|<script>|spreadsheetId/);
});
