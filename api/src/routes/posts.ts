import { Hono } from "hono";

const postsRoute = new Hono();

type PostType = {
  id: number;
  content: string;
  date: number;
};

// Sample posts data
const posts: PostType[] = [
  {
    id: 1,
    content: "Do only what only you can do.",
    date: Date.parse("2024-06-24T12:00:00Z"),
  },
  {
    id: 2,
    content:
      "Elegance is not a dispensable luxury but a factor that decides between success and failure.",
    date: Date.parse("2024-06-25T12:00:00Z"),
  },
  {
    id: 3,
    content:
      "The question of whether computers can think is like the question of whether submarines can swim.",
    date: Date.parse("2024-06-26T12:00:00Z"),
  },
];

let nextId = 4;

// Read all posts
postsRoute.get("/posts", (c) => {
  return c.json(posts);
});

// Read a specific post
postsRoute.get("/posts/:id", (c) => {
  const id = parseInt(c.req.param("id"));
  const post = posts.find((p) => p.id === id);
  if (post) {
    return c.json(post);
  }
  return c.json({ error: "Post not found" }, 404);
});

// Delete a post
postsRoute.delete("/posts/:id", (c) => {
  const id = parseInt(c.req.param("id"));
  const postIndex = posts.findIndex((p) => p.id === id);
  if (postIndex !== -1) {
    const deletedPost = posts.splice(postIndex, 1)[0];
    return c.json(deletedPost);
  }
  return c.json({ error: "Post not found" }, 404);
});

// Create a new post
postsRoute.post("/posts", async (c) => {
  const { content } = await c.req.json();
  const newPost = {
    id: nextId++,
    content,
    date: new Date().getTime(),
  };
  posts.push(newPost);
  return c.json(newPost, 201);
});

// Update a post
postsRoute.patch("/posts/:id", async (c) => {
  const id = parseInt(c.req.param("id"));
  const { content } = await c.req.json();
  const postIndex = posts.findIndex((p) => p.id === id);
  if (postIndex !== -1) {
    posts[postIndex] = { ...posts[postIndex], content };
    return c.json(posts[postIndex]);
  }
  return c.json({ error: "Post not found" }, 404);
});

export default postsRoute;