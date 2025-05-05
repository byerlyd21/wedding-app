// app/api/rsvp/route.ts
import { NextResponse } from "next/server";
import { db } from "../../../lib/db";
import { RSVPs } from "../../../lib/schema";

export async function POST(request: Request) {
  try {
    const { name, phone, email, address, numGuests } = await request.json();
    console.log('Received data:', { name, phone, email, address, numGuests });
    
    await db.insert(RSVPs).values({ 
      name, 
      phone, 
      email,
      address,
      num_guests: numGuests || 0
    });
    return NextResponse.json({ message: "RSVP submitted successfully" }, { status: 200 });
  } catch (error: any) {
    console.error("Database error details:", {
      message: error?.message,
      code: error?.code,
      detail: error?.detail,
      stack: error?.stack
    });
    return NextResponse.json({ 
      error: "Database error", 
      details: error?.message 
    }, { status: 500 });
  }
}
