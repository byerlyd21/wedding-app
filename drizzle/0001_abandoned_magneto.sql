CREATE TABLE "photos" (
	"id" serial PRIMARY KEY NOT NULL,
	"ip_address" text NOT NULL,
	"photo_1" text,
	"photo_2" text,
	"created_at" timestamp DEFAULT now()
);
