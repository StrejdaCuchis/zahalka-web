import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';
import { odeslatNewsletter } from '../src/utils/newsletter-odeslani.mjs';

test('only confirmed success completes the signup request', async () => {
  let request;
  await odeslatNewsletter('https://example.com/exec', new FormData(), async (url, options) => {
    request = { url, options };
    return { ok: true, text: async () => 'Děkujeme za přihlášení\n\nUloženo.' };
  });
  assert.equal(request.url, 'https://example.com/exec');
  assert.equal(request.options.method, 'POST');
  assert.equal(request.options.credentials, 'omit');
  assert.ok(request.options.body instanceof URLSearchParams);
  assert.notEqual(request.options.mode, 'no-cors');
});

test('business errors with HTTP 200, login HTML and bad HTTP status never count as success', async () => {
  for (const response of [
    { ok: true, text: async () => 'Přihlášení se nepodařilo uložit' },
    { ok: true, text: async () => 'Zkontrolujte zadané údaje' },
    { ok: true, text: async () => '<html>Přihlaste se do Googlu</html>' },
    { ok: true, text: async () => '' },
    { ok: false, text: async () => 'Děkujeme za přihlášení' },
  ]) {
    await assert.rejects(odeslatNewsletter('https://example.com/exec', new FormData(), async () => response));
  }
});

test('network failure rejects and form payload retains the required fields', async () => {
  const data = new FormData();
  data.set('email', 'test@example.invalid');
  data.set('jmeno', 'Test');
  data.set('souhlas', 'newsletter-v1');
  data.set('web', '');
  await assert.rejects(odeslatNewsletter('https://example.com/exec', data, async (_url, options) => {
    assert.equal(options.body.get('email'), 'test@example.invalid');
    assert.equal(options.body.get('souhlas'), 'newsletter-v1');
    throw new TypeError('Network unavailable');
  }), /Network unavailable/);
});

const analyticsSource = readFileSync(new URL('../src/components/Analytika.astro', import.meta.url), 'utf8');
const analyticsCode = analyticsSource.match(/<script define:vars=\{\{ gaId \}\}>([\s\S]*?)<\/script>/)[1];

function analytics({ consent = null, receipt = null, path = '/thank-you-newsletter', storageBlocked = false, gaId = 'G-TEST' } = {}) {
  const handlers = {};
  const session = new Map(receipt === null ? [] : [['zahalka_newsletter_potvrzeno_v1', receipt]]);
  const storage = {
    getItem(key) { if (storageBlocked) throw new Error('Storage blocked'); return session.get(key) ?? null; },
    removeItem(key) { if (storageBlocked) throw new Error('Storage blocked'); session.delete(key); },
  };
  const context = vm.createContext({
    gaId,
    sessionStorage: storage,
    localStorage: { getItem: () => consent, setItem() {} },
    requestAnimationFrame: callback => callback(),
    window: { location: { pathname: path } },
    document: {
      createElement: () => ({}),
      head: { appendChild() {} },
      addEventListener() {}, removeEventListener() {},
      getElementById: id => id === 'cookie-lista'
        ? { hidden: true, querySelector: () => ({ focus() {} }) }
        : { addEventListener: (event, fn) => { handlers[id + ':' + event] = fn; } },
    },
  });
  // Prohlížeč zpřístupňuje vlastnosti window také jako globální proměnné.
  context.dataLayer = [];
  context.window.dataLayer = context.dataLayer;
  vm.runInContext(analyticsCode, context);
  return {
    events: () => context.dataLayer.filter(args => args[0] === 'event' && args[1] === 'newsletter_prihlaseni'),
    accept: () => handlers['cookie-prijmout:click'](),
    deny: () => handlers['cookie-odmitnout:click'](),
    session,
  };
}

test('successful arrival measures once after existing consent without personal data', () => {
  const state = analytics({ consent: 'granted', receipt: String(Date.now()) });
  assert.equal(state.events().length, 1);
  assert.equal(JSON.stringify(state.events()[0][2]), '{"method":"web_form"}');
  assert.equal(state.session.size, 0);
  state.accept();
  assert.equal(state.events().length, 1);
});

test('receipt waits for consent and rejection never sends a newsletter event', () => {
  const state = analytics({ receipt: String(Date.now()) });
  assert.equal(state.events().length, 0);
  state.deny();
  assert.equal(state.events().length, 0);
  state.accept();
  assert.equal(state.events().length, 1);
});

test('direct visit, reload, stale or future receipt, other pages and missing GA ID do not count', () => {
  for (const options of [
    {},
    { receipt: String(Date.now() - 31 * 60 * 1000) },
    { receipt: String(Date.now() + 60000) },
    { receipt: 'not-a-time' },
    { receipt: String(Date.now()), path: '/newsletter' },
    { receipt: String(Date.now()), gaId: '' },
    { receipt: String(Date.now()), storageBlocked: true },
  ]) {
    assert.equal(analytics({ consent: 'granted', ...options }).events().length, 0);
  }
  const first = analytics({ consent: 'granted', receipt: String(Date.now()), path: '/thank-you-newsletter/' });
  assert.equal(first.events().length, 1);
  assert.equal(analytics({ consent: 'granted', receipt: first.session.get('zahalka_newsletter_potvrzeno_v1') ?? null }).events().length, 0);
});
