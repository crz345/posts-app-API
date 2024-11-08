import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const posts = sqliteTable("posts", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  content: text("content").notNull(),
  date: integer("date", { mode: "timestamp" }).notNull(),
});