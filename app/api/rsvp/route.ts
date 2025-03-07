// app/api/rsvp/route.ts
import { NextResponse } from "next/server";
import { db } from "../../../lib/db";
import { RSVPs } from "../../../lib/schema";

export async function POST(request: Request) {
  try {
    const { name, phone, address } = await request.json();
    await db.insert(RSVPs).values({ name, phone, address });
    return NextResponse.json({ message: "RSVP submitted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
