import { parse, serialize, type DefaultTreeAdapterTypes } from 'parse5';

type Element = DefaultTreeAdapterTypes.Element;
type Node = DefaultTreeAdapterTypes.Node;
type ParentNode = DefaultTreeAdapterTypes.ParentNode;
type TextNode = DefaultTreeAdapterTypes.TextNode;

const BLOKOVE_PRVKY = new Set([
  'address', 'article', 'aside', 'blockquote', 'body', 'caption', 'dd', 'details',
  'dialog', 'div', 'dl', 'dt', 'fieldset', 'figcaption', 'figure', 'footer',
  'form', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'header', 'legend', 'li', 'main',
  'nav', 'ol', 'option', 'p', 'section', 'summary', 'table', 'tbody', 'td', 'tfoot',
  'th', 'thead', 'title', 'tr', 'ul',
]);

const PRESKOCIT = new Set([
  'code', 'kbd', 'math', 'pre', 'samp', 'script', 'style', 'svg', 'textarea',
]);

const PRERUSENI_RADKU = new Set(['br', 'hr', 'wbr']);
const JEDNOPISMENNE_SLOVO = /(?<![\p{L}\p{N}_])([ksvzouai])([\t\n\f\r ]+)(?=\S)/giu;

function jeElement(node: Node): node is Element {
  return 'tagName' in node;
}

function jeText(node: Node): node is TextNode {
  return node.nodeName === '#text';
}

/**
 * Vrátí souvislé běhy textových uzlů uvnitř jednoho blokového prvku.
 * Vnořený blok a explicitní zalomení běh ukončí, inline prvky nikoli.
 */
function najdiTextoveBehy(koren: ParentNode): TextNode[][] {
  const behy: TextNode[][] = [];
  let aktualni: TextNode[] = [];

  const ukonciBeh = () => {
    if (aktualni.length > 0) behy.push(aktualni);
    aktualni = [];
  };

  const projdi = (rodic: ParentNode) => {
    for (const dite of rodic.childNodes) {
      if (jeText(dite)) {
        aktualni.push(dite);
        continue;
      }

      if (!jeElement(dite)) continue;

      if (
        PRESKOCIT.has(dite.tagName)
        || PRERUSENI_RADKU.has(dite.tagName)
        || BLOKOVE_PRVKY.has(dite.tagName)
      ) {
        ukonciBeh();
        continue;
      }

      projdi(dite);
    }
  };

  projdi(koren);
  ukonciBeh();
  return behy;
}

/** Sváže jednopísmenná česká slova s následujícím slovem i přes inline HTML. */
function upravBeh(uzly: TextNode[]): void {
  const znaky = uzly.map((uzel) => Array.from(uzel.value));
  const pozice: Array<{ uzel: number; znak: number }> = [];
  let text = '';

  znaky.forEach((hodnota, uzel) => {
    hodnota.forEach((znak, index) => {
      text += znak;
      pozice.push({ uzel, znak: index });
    });
  });

  for (const shoda of text.matchAll(JEDNOPISMENNE_SLOVO)) {
    if (shoda.index === undefined) continue;

    const zacatekMezer = shoda.index + shoda[1].length;
    const konecMezer = zacatekMezer + shoda[2].length;

    for (let index = zacatekMezer; index < konecMezer; index += 1) {
      const poziceZnaku = pozice[index];
      znaky[poziceZnaku.uzel][poziceZnaku.znak] = index === zacatekMezer ? '\u00a0' : '';
    }
  }

  uzly.forEach((uzel, index) => {
    uzel.value = znaky[index].join('');
  });
}

function projdiBloky(node: ParentNode): void {
  for (const dite of node.childNodes) {
    if (!jeElement(dite) || PRESKOCIT.has(dite.tagName)) continue;

    // Každý prvek zpracujeme i samostatně. Díky tomu funguje například „O nás“
    // uvnitř odkazu, zatímco běh rodiče současně pokryje „v <strong>Zahálce</strong>“.
    najdiTextoveBehy(dite).forEach(upravBeh);

    projdiBloky(dite);
  }
}

/**
 * Typograficky upraví hotový HTML dokument. Parsování zajišťuje, že se úprava
 * nikdy nedotkne atributů, CSS, JavaScriptu ani ukázek kódu.
 */
export function upravHtmlTypografii(html: string): string {
  const dokument = parse(html);
  projdiBloky(dokument);
  return serialize(dokument);
}
