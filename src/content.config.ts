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

export const collections = { akce };
