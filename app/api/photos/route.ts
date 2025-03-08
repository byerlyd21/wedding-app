// app/api/photos/route.ts
import { NextResponse } from "next/server";
import { db } from "../../../lib/db"; // Import the database client
import { Photos } from "../../../lib/schema"; // Your table schema for storing photo data

export async function POST(request: Request) {
  try {
    // Retrieve the user's IP address from request headers
    const ipAddress = request.headers.get("x-forwarded-for") || "unknown";

    const { photo } = await request.json();

    // Check if the IP has already uploaded 2 photos
    const uploadedPhotos = await db
      .select('photo_1', 'photo_2')
      .from(Photos)
      .where({ ip_address: ipAddress });

    if (uploadedPhotos.length > 0 && (uploadedPhotos[0].photo_1 && uploadedPhotos[0].photo_2)) {
      return NextResponse.json(
        { error: "You can only upload 2 photos." },
        { status: 400 }
      );
    }

    // Insert or update the photo in the database
    if (uploadedPhotos.length === 0) {
      await db.insert(Photos).values({ ip_address: ipAddress, photo_1: photo });
    } else {
      if (!uploadedPhotos[0].photo_1) {
        await db.update(Photos)
          .set({ photo_1: photo })
          .where({ ip_address: ipAddress });
      } else if (!uploadedPhotos[0].photo_2) {
        await db.update(Photos)
          .set({ photo_2: photo })
          .where({ ip_address: ipAddress });
      }
    }

    return NextResponse.json(
      { message: "Photo uploaded successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Database error" },
      { status: 500 }
    );
  }
}
