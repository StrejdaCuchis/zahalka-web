import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const akce = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/akce' }),
  schema: z.object({
    nazev: z.string(),
    datum: z.coerce.date(),
    cas: z.string(),
    typ: z.enum(['beseda', 'workshop', 'festival', 'deti']),
    cena: z.string(),
    kapacita: z.string().optional(),
    odkazFormular: z.string().optional(),
    obrazek: z.string(),
    altText: z.string(),
    kratkyPopis: z.string(),
    misto: z.string().optional(),
  }),
});

const tabor = defineCollection({
  loader: glob({ pattern: 'tabor.md', base: './src/content/stranky' }),
  schema: z.object({
    nazev: z.string(),
    metaPopis: z.string(),
    znacka: z.string(),
    perex: z.string(),
    datumOd: z.coerce.date(),
    datumDo: z.coerce.date(),
    datumText: z.string(),
    vek: z.string(),
    cena: z.string(),
    cenaCiselne: z.number().optional(),
    kapacita: z.string(),
    odkazFormular: z.string().optional(),
    prihlaseniAktivni: z.boolean(),
    upozorneni: z.string().optional(),
    hlavniObrazek: z.string().optional(),
    hlavniObrazekAlt: z.string().optional(),
    fotky: z
      .array(
        z.object({
          obrazek: z.string(),
          altText: z.string(),
          popisek: z.string().optional(),
        }),
      )
      .optional(),
  }),
});

const oNas = defineCollection({
  loader: glob({ pattern: 'o-nas.md', base: './src/content/stranky' }),
  schema: z.object({
    nazev: z.string(),
    metaPopis: z.string(),
    perex: z.string(),
    fotky: z
      .array(
        z.object({
          obrazek: z.string(),
          altText: z.string(),
          popisek: z.string().optional(),
        }),
      )
      .optional(),
  }),
});

export const collections = { akce, tabor, oNas };
