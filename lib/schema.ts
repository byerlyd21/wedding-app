import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const RSVPs = pgTable("rsvps", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  address: text("address").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});


export const Photos = pgTable("photos", {
    id: serial("id").primaryKey(),
    ip_address: text("ip_address").notNull(), 
    photo_1: text("photo_1"),                   
    photo_2: text("photo_2"),                  
    createdAt: timestamp("created_at").defaultNow(), 
});