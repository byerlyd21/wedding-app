ALTER TABLE "rsvps" ADD COLUMN "email" text NOT NULL;--> statement-breakpoint
ALTER TABLE "rsvps" ADD COLUMN "bringing_guests" boolean NOT NULL;--> statement-breakpoint
ALTER TABLE "rsvps" ADD COLUMN "guest_count" integer NOT NULL;