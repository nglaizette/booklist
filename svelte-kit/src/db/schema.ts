import { int, datetime, tinyint, json, mysqlTable, varchar, longtext } from "drizzle-orm/mysql-core";

export const books = mysqlTable("books", {
  id: int("id").primaryKey().autoincrement(),
  userId: varchar("userId", { length: 50 }).notNull(),
  dateAdded: datetime("dateAdded").notNull(),
  title: varchar("title", { length: 250 }).notNull(),
  authors: json("authors"),
  isbn: varchar("isbn", { length: 25 }),
  pages: int("pages"),
  isRead: tinyint("isRead").notNull(),

  similarBooks: json("similarBooks"),
  similarBooksLastSync: datetime("similarBooksLastSync"),
  similarBooksLastSyncSuccess: tinyint("similarBooksLastSyncSuccess"),
  similarBooksLastSyncFailureReason: longtext("similarBooksLastSyncFailureReason"),
  mobileImage: varchar("mobileImage", { length: 250 }),
  mobileImagePreview: json("mobileImagePreview"),
  smallImage: varchar("smallImage", { length: 250 }),
  smallImagePreview: json("smallImagePreview"),
  mediumImage: varchar("mediumImage", { length: 250 }),
  mediumImagePreview: json("mediumImagePreview"),
  publicationDate: varchar("publicationDate", { length: 30 }),
  publisher: varchar("publisher", { length: 100 }),
  editorialReviews: json("editorialReviews")
});

export const tags = mysqlTable("tags", {
  id: int("id").primaryKey().autoincrement(),
  userId: varchar("userId", { length: 50 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  textColor: varchar("textColor", { length: 255 }),
  backgroundColor: varchar("backgroundColor", { length: 255 })
});

export const booksTags = mysqlTable("books_tags", {
  id: int("id").notNull().autoincrement(),
  book: int("book").notNull(),
  tag: int("tag").notNull()
});
