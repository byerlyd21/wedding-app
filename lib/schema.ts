import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const RSVPs = pgTable("rsvps", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  address: text("address").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});
