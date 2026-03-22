import { defineCollection, z } from "astro:content";

const planGoalItem = z
  .union([
    z.string(),
    z.object({
      text: z.string(),
      done: z.boolean().default(false)
    })
  ])
  .transform((item) => (typeof item === "string" ? { text: item, done: false } : item));

const articles = defineCollection({
  schema: () =>
    z.object({
      title: z.string(),
      description: z.string(),
      date: z.coerce.date(),
      tags: z.array(z.string()).default([]),
      cover: z.string().optional(),
      draft: z.boolean().default(false)
    })
});

const essays = defineCollection({
  schema: () =>
    z.object({
      title: z.string(),
      description: z.string(),
      date: z.coerce.date(),
      tags: z.array(z.string()).default([]),
      cover: z.string().optional(),
      draft: z.boolean().default(false)
    })
});

const plans = defineCollection({
  schema: z
    .object({
      title: z.string(),
      week: z.string().optional(),
      status: z.enum(["planned", "active", "done"]),
      goal: z.array(planGoalItem).optional(),
      goals: z.array(planGoalItem).optional(),
      review: z.array(z.string()).optional(),
      draft: z.boolean().default(false)
    })
    .transform(({ goal, goals, review, ...rest }) => ({
      ...rest,
      goal: goal ?? goals ?? [],
      review: review ?? []
    }))
});

export const collections = {
  articles,
  essays,
  plans
};
