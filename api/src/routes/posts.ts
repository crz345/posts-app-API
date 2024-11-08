import { Hono } from "hono";
import { db } from "../db";
import { posts } from "../db/schema";
import {
  createPostSchema,
  updatePostSchema,
  getPostSchema,
  queryParamsSchema
} from "../validators/schemas";
import { zValidator } from "@hono/zod-validator";
import { HTTPException } from "hono/http-exception";
import { eq, asc, desc, like, count, SQL, and } from "drizzle-orm";

const postRoutes = new Hono();

// Get all posts with optional sorting, filtering, searching, and pagination
postRoutes.get("/posts", zValidator("query", queryParamsSchema), async (c) => {
    const { sort, search, page = 1, limit = 10 } = c.req.valid("query");
  
    const whereClause: (SQL | undefined)[] = [];
    if (search) {
      whereClause.push(like(posts.content, `%${search}%`));
    }
  
    const orderByClause: SQL[] = [];
    if (sort === "desc") {
      orderByClause.push(desc(posts.date));
    } else if (sort === "asc") {
      orderByClause.push(asc(posts.date));
    }
  
    const offset = (page - 1) * limit;
  
    const [allPosts, [{ totalCount }]] = await Promise.all([
      db
        .select()
        .from(posts)
        .where(and(...whereClause))
        .orderBy(...orderByClause)
        .limit(limit)
        .offset(offset),
      db
        .select({ totalCount: count() })
        .from(posts)
        .where(and(...whereClause)),
    ]);
  
    return c.json({
      posts: allPosts,
      page,
      limit,
      total: totalCount,
    });
  });
// Get a single post by id
postRoutes.get(
  "/posts/:id", 
  zValidator("param", getPostSchema), 
  async (c) => {
    const id = parseInt(c.req.param("id"));
    const post = await db.select().from(posts).where(eq(posts.id, id)).get(); 
    if (!post) {
      throw new HTTPException(404, { message: "Post not found" });
    }
    return c.json(post); 
  }
);

// Delete a post by id
postRoutes.delete(
  "/posts/:id",
  zValidator("param", getPostSchema),
  async (c) => {
    const id = parseInt(c.req.param("id"));
    const deletedPost = await db
      .delete(posts)
      .where(eq(posts.id, id))
      .returning()
      .get();
    if (!deletedPost) {
      throw new HTTPException(404, { message: "Post not found" });
    }
    return c.json(deletedPost);
  },
);

// Create a new post
postRoutes.post(
  "/posts", 
  zValidator("json", createPostSchema), 
  async (c) => {
    const { content } = await c.req.json();
    const newPost = await db
      .insert(posts)
      .values({
        content,
        date: new Date(),
      })
      .returning()
      .get();

    return c.json(newPost); 
  }
);

// Update a post by id
postRoutes.patch(
  "/posts/:id",
  zValidator("param", getPostSchema),
  zValidator("json", updatePostSchema),
  async (c) => {
    const id = parseInt(c.req.param("id"));
    const { content } = await c.req.json();
    const updatedPost = await db
      .update(posts)
      .set({ content })
      .where(eq(posts.id, id))
      .returning()
      .get();

    if (!updatedPost) {
      throw new HTTPException(404, { message: "Post not found" });
    }
    return c.json(updatedPost);
  },
);

export default postRoutes;