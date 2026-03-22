import { defineCollection, z } from "astro:content";

const articles = defineCollection({
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      date: z.coerce.date(),
      tags: z.array(z.string()).default([]),
      cover: image().optional(),
      draft: z.boolean().default(false)
    })
});

const plans = defineCollection({
  schema: z.object({
    title: z.string(),
    week: z.string(),
    status: z.enum(["planned", "active", "done"]),
    summary: z.string(),
    goals: z.array(z.string()).default([]),
    review: z.array(z.string()).default([]),
    draft: z.boolean().default(false)
  })
});

export const collections = {
  articles,
  plans
};
