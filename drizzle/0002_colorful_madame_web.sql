ALTER TABLE "rsvps" ALTER COLUMN "email" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "rsvps" ALTER COLUMN "bringing_guests" SET DEFAULT false;--> statement-breakpoint
ALTER TABLE "rsvps" ALTER COLUMN "guest_count" SET DEFAULT 0;