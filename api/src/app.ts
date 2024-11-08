import { Hono } from "hono";
import postsRoute from "./routes/posts";

const app = new Hono();

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.route("/", postsRoute);

export default app;