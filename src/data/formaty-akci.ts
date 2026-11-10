export const typyAkci = [
  'koncert',
  'kino',
  'prednaska',
  'workshop',
  'beseda',
  'prochazka',
  'deti',
  'vystava',
  'design-market',
] as const;

export const formatyAkci: Record<(typeof typyAkci)[number], { nazev: string; barva: string }> = {
  koncert: { nazev: 'Koncert', barva: 'var(--fialova-l)' },
  kino: { nazev: 'Kino', barva: 'var(--levandule-l)' },
  prednaska: { nazev: 'Přednáška', barva: 'var(--limetka-l)' },
  workshop: { nazev: 'Workshop', barva: 'var(--oranzova-l)' },
  beseda: { nazev: 'Beseda', barva: 'var(--levandule)' },
  prochazka: { nazev: 'Procházka', barva: 'var(--limetka-l)' },
  deti: { nazev: 'Pro děti', barva: 'var(--limetka)' },
  vystava: { nazev: 'Výstava', barva: 'var(--fialova)' },
  'design-market': { nazev: 'Design market', barva: 'var(--oranzova-l)' },
};
