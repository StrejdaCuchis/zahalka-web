import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Pages CMS can temporarily save an empty gallery row while an editor is
// preparing content. Pages filter incomplete rows before rendering.
const fotografie = z.object({
  obrazek: z.string().optional(),
  altText: z.string().optional(),
  popisek: z.string().optional(),
});

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

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    nazev: z.string(),
    datumPublikace: z.coerce.date(),
    autor: z.string().optional(),
    obrazek: z.string(),
    altText: z.string(),
    kratkyPopis: z.string(),
    stitky: z.array(z.string()).default([]),
    publikovano: z.boolean().default(true),
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
    fotky: z.array(fotografie).optional(),
  }),
});

const oNas = defineCollection({
  loader: glob({ pattern: 'o-nas.md', base: './src/content/stranky' }),
  schema: z.object({
    nazev: z.string(),
    metaPopis: z.string(),
    perex: z.string(),
    fotky: z.array(fotografie).optional(),
  }),
});

export const collections = { akce, blog, tabor, oNas };
