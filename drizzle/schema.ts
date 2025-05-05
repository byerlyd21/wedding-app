import { integer, pgTable, serial, text, timestamp, boolean } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const rsvps = pgTable("rsvps", {
	id: serial().primaryKey().notNull(),
	name: text().notNull(),
	phone: text().notNull(),
	address: text().notNull(),
	email: text().notNull(),
	bringingGuests: boolean("bringing_guests").notNull(),
	guestCount: integer("guest_count").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	numGuests: integer().notNull(),
});

export const photos = pgTable("photos", {
	id: serial().primaryKey().notNull(),
	ipAddress: text("ip_address").notNull(),
	photo1: text("photo_1"),
	photo2: text("photo_2"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	name: text(),
	photo1Time: text("photo_1_time"),
	photo2Time: text("photo_2_time"),
});
