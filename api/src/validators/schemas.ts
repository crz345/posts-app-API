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

export const queryParamsSchema = z.object({
    sort: z.enum(["asc", "desc"]).optional(),
    search: z.string().optional(),
    page: z.coerce.number().int().positive().optional(),
    limit: z.coerce.number().int().positive().optional(),
  });

  export const createCommentSchema = z.object({
    content: z
      .string()
      .min(1, "Content is required")
      .max(120, "Content must be 120 characters or less"),
  });
  
  export const updateCommentSchema = createCommentSchema.partial();
  
  export const getCommentsSchema = z.object({
    postId: z.coerce.number().int().positive(),
  });
  
  export const getCommentSchema = z.object({
    postId: z.coerce.number().int().positive(),
    commentId: z.coerce.number().int().positive(),
  });