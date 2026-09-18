// @ts-check
import { defineConfig } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';
import typografieAFotky from './src/remark/typografie-a-fotky.mjs';

// https://astro.build/config
export default defineConfig({
  markdown: {
    processor: unified({
      remarkPlugins: [typografieAFotky],
    }),
  },
});
