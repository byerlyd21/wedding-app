CREATE TABLE "photos" (
	"id" serial PRIMARY KEY NOT NULL,
	"ip_address" text NOT NULL,
	"photo_1" text,
	"photo_1_time" text,
	"photo_2" text,
	"photo_2_time" text,
	"name" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "rsvps" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"phone" text NOT NULL,
	"address" text NOT NULL,
	"created_at" timestamp DEFAULT now()
);
