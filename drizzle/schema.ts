import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const rsvps = pgTable("rsvps", {
	id: serial().primaryKey().notNull(),
	name: text().notNull(),
	phone: text().notNull(),
	address: text().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
});
