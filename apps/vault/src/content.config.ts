import { defineCollection, z } from "astro:content"
import { glob } from "astro/loaders"

const vault = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/vault" }),
  schema: z.object({
    title: z.string(),
  }),
})

export const collections = { vault }
