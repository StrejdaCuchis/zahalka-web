export const kontakty = {
  nazev: 'Zahálka • kulturní prostor',
  pravniNazev: 'Zahálka Teplice, z. s.',
  email: 'jsme@zahalkateplice.cz',
  ico: '10762434',
  datovaSchranka: 'zq3yckt',
  sidlo: {
    ulice: '28. října 420/4',
    mesto: 'Teplice',
    psc: '415 01',
    zeme: 'CZ',
  },
  prostor: {
    nazev: 'Zahálka • kulturní prostor',
    ulice: 'Benešovo nám. 3282',
    mesto: 'Teplice',
    psc: '415 01',
    zeme: 'CZ',
  },
  telefony: [
    { jmeno: 'Maro', zobrazene: '721 258 386', odkaz: 'tel:+420721258386' },
    { jmeno: 'Jakub', zobrazene: '731 165 932', odkaz: 'tel:+420731165932' },
  ],
  instagram: 'https://www.instagram.com/zahalkateplice/',
  facebook: 'https://www.facebook.com/zahalkateplice',
} as const;

export function schemaOrganizace(siteUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: kontakty.nazev,
    legalName: kontakty.pravniNazev,
    url: siteUrl,
    email: kontakty.email,
    identifier: {
      '@type': 'PropertyValue',
      propertyID: 'IČO',
      value: kontakty.ico,
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: kontakty.sidlo.ulice,
      addressLocality: kontakty.sidlo.mesto,
      postalCode: kontakty.sidlo.psc,
      addressCountry: kontakty.sidlo.zeme,
    },
    sameAs: [kontakty.instagram, kontakty.facebook],
  };
}
