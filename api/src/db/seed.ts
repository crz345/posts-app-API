import { db, connection } from "./index";
import { posts } from "./schema";

async function seed() {
  console.log("Seeding the database...");

  // Clean the tables
  console.log("Cleaning existing data...");
  await db.delete(posts);

  console.log("Inserting new seed data...");
  // Insert sample posts
  const [post1] = await db
    .insert(posts)
    .values({
      content: "Do only what only you can do.",
      date: new Date(),
    })
    .returning({ id: posts.id });

  const [post2] = await db
    .insert(posts)
    .values({
      content:
        "Elegance is not a dispensable luxury but a factor that decides between success and failure.",
      date: new Date(),
    })
    .returning({ id: posts.id });

  const [post3] = await db
    .insert(posts)
    .values({
      content:
        "The question of whether computers can think is like the question of whether submarines can swim.",
      date: new Date(),
    })
    .returning({ id: posts.id });

  console.log("Seeding completed successfully.");
}

seed()
  .catch((e) => {
    console.error("Seeding failed:");
    console.error(e);
  })
  .finally(() => {
    connection.close();
  });