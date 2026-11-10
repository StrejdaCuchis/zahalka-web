// Nasazený Google Apps Script vrací tento nadpis až po potvrzeném zápisu do CRM.
// HTTP 200 samotné nestačí: skript jím vrací také chyby validace nebo zápisu.
export async function odeslatNewsletter(action, data, fetchImpl = fetch) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20000);
  try {
    const response = await fetchImpl(action, {
      method: 'POST',
      body: new URLSearchParams(data),
      credentials: 'omit',
      signal: controller.signal,
    });
    const text = await response.text();
    if (!response.ok || text.trim().split(/\r?\n/, 1)[0] !== 'Děkujeme za přihlášení') {
      throw new Error('Přihlášení nebylo potvrzeno.');
    }
  } finally {
    clearTimeout(timeout);
  }
}
