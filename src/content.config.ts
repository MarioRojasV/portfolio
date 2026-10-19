import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    order: z.number().default(99),
    status: z.enum(['completed', 'in-progress', 'research']).default('completed'),
    tags: z.array(z.string()).default([]),
    role: z.string().optional(),
    repo: z.string().url().optional(),
    video: z.string().url().optional(),
    demo: z.string().url().optional(),
    paper: z.string().url().optional(),
    preview: z.string().optional(),
  }),
});

export const collections = { projects };
