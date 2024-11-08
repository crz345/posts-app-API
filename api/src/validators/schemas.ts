import { z } from "zod";

export const createPostSchema = z.object({
  content: z
    .string()
    .min(1, "Content is required")
    .max(240, "Content must be 240 characters or less"),
});

export const updatePostSchema = createPostSchema.partial();

export const getPostSchema = z.object({
    id: z.coerce.number().int().positive(),
  });