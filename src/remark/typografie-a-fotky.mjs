const jednopismenneSlovo = /(^|[\s(\[{„“"'])([ksvzouai])[ \t]+(?=\S)/giu;
const jednopismenneNaKonci = /(^|[\s(\[{„“"'])([ksvzouai])[ \t]+$/iu;

function upravText(hodnota) {
  return hodnota.replace(
    jednopismenneSlovo,
    (_shoda, zacatek, slovo) => `${zacatek}${slovo}\u00a0`,
  );
}

function jeKod(node) {
  return node?.type === 'code' || node?.type === 'inlineCode';
}

function upravTextoveUzly(node) {
  if (!node || jeKod(node)) return;

  if (node.type === 'text') {
    node.value = upravText(node.value);
    return;
  }

  if (!Array.isArray(node.children)) return;

  node.children.forEach(upravTextoveUzly);

  for (let index = 0; index < node.children.length - 1; index += 1) {
    const aktualni = node.children[index];
    const nasledujici = node.children[index + 1];
    if (aktualni?.type === 'text' && !jeKod(nasledujici)) {
      aktualni.value = aktualni.value.replace(
        jednopismenneNaKonci,
        (_shoda, zacatek, slovo) => `${zacatek}${slovo}\u00a0`,
      );
    }
  }
}

function jeSamostatnyObrazek(node) {
  return node?.type === 'paragraph'
    && Array.isArray(node.children)
    && node.children.length === 1
    && node.children[0]?.type === 'image';
}

function seskupFotografie(root) {
  if (!Array.isArray(root.children)) return;

  const vysledek = [];

  for (let index = 0; index < root.children.length;) {
    if (!jeSamostatnyObrazek(root.children[index])) {
      vysledek.push(root.children[index]);
      index += 1;
      continue;
    }

    const fotografie = [];
    while (index < root.children.length && jeSamostatnyObrazek(root.children[index])) {
      const odstavec = root.children[index];
      const puvodniObrazek = odstavec.children[0];
      const jeFotkaONas = /^\/obrazky\/stranky\/o-nas-\d{2}\.webp$/.test(puvodniObrazek.url);
      const obrazek = {
        ...puvodniObrazek,
        data: {
          ...(puvodniObrazek.data ?? {}),
          hProperties: {
            ...(puvodniObrazek.data?.hProperties ?? {}),
            ...(jeFotkaONas ? { width: 1600, height: 900 } : {}),
            loading: 'lazy',
            decoding: 'async',
          },
        },
      };
      fotografie.push({
        ...odstavec,
        children: [obrazek],
        data: {
          ...(odstavec.data ?? {}),
          hName: 'figure',
          hProperties: { className: ['foto-v-clanku'] },
        },
      });
      index += 1;
    }

    vysledek.push({
      type: 'fotoGroup',
      children: fotografie,
      data: {
        hName: 'section',
        hProperties: {
          className: ['foto-skupina'],
          'aria-label': 'Fotografie z činnosti Zahálky',
          'data-pocet': String(fotografie.length),
        },
      },
    });
  }

  root.children = vysledek;
}

export default function typografieAFotky() {
  return (strom) => {
    upravTextoveUzly(strom);
    seskupFotografie(strom);
  };
}
