import { boolean, integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const RSVPs = pgTable("rsvps", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  address: text("address").notNull(),
  email: text("email"),
  num_guests: integer("num_guests").notNull().default(0),
  created_at: timestamp("created_at").defaultNow(),
});


export const Photos = pgTable("photos", {
    id: serial("id").primaryKey(),
    ip_address: text("ip_address").notNull(), 
    photo_1: text("photo_1"), 
    photo_1_time: text("photo_1_time"),                  
    photo_2: text("photo_2"),  
    photo_2_time: text("photo_2_time"),
    name: text("name"),               
    createdAt: timestamp("created_at").defaultNow(), 
});