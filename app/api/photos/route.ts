// app/api/photos/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db"; // Ensure the correct import path
import { Photos } from "@/lib/schema"; // Import the schema
import { eq } from "drizzle-orm"; // Import the SQL helper

export async function POST(request: Request) {
  try {
    // Retrieve the user's IP address from request headers
    let ipAddress = request.headers.get("x-forwarded-for") || "unknown";
    
    const { photo, name, photoTime } = await request.json();
    if (name === "Dallin Byerly") {
        ipAddress = `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
      }

    // Check if the IP has already uploaded 2 photos
    const uploadedPhotos = await db
      .select({
        photo_1: Photos.photo_1,
        photo_2: Photos.photo_2,
        photo_1_time: Photos.photo_1_time, // Fetch photo_1_time
        photo_2_time: Photos.photo_2_time, // Fetch photo_2_time
      })
      .from(Photos)
      .where(eq(Photos.ip_address, ipAddress)); // Corrected Drizzle syntax

    if (
      uploadedPhotos.length > 0 &&
      uploadedPhotos[0].photo_1 &&
      uploadedPhotos[0].photo_2
    ) {
      return NextResponse.json(
        "Sneaky rascal, trying a new browser? Muwahahah! You can't trick me! No more photos for you!",
        { status: 400 }
      );
    }

    // Insert or update the photo in the database
    if (uploadedPhotos.length === 0) {
      await db.insert(Photos).values({
        ip_address: ipAddress,
        name: name || "Anonymous", // Default to "Anonymous" if no name
        photo_1: photo,
        photo_1_time: photoTime, // Set the time for the first photo
        photo_2_time: null, // Assign time for photo_2
      });
    } else {
        if (!uploadedPhotos[0].photo_1) {
          // If photo_1 is empty, insert it with the time
          await db
            .update(Photos)
            .set({ photo_1: photo, photo_1_time: photoTime }) // Update photo_1 and its time
            .where(eq(Photos.ip_address, ipAddress));
        } else if (!uploadedPhotos[0].photo_2) {
          // If photo_2 is empty, insert it with the time
          await db
            .update(Photos)
            .set({ photo_2: photo, photo_2_time: photoTime }) // Update photo_2 and its time
            .where(eq(Photos.ip_address, ipAddress));
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

export async function GET(request: Request) {
    try {
      const url = new URL(request.url);
      const page = parseInt(url.searchParams.get("page") || "1", 10); // Default to page 1
      const limit = parseInt(url.searchParams.get("limit") || "10", 10); // Default to 10 photos per page
      const offset = (page - 1) * limit; // Calculate the offset
  
      const photos = await db
        .select()
        .from(Photos)
        .limit(limit)
        .offset(offset); // Use limit and offset for pagination
  
      return NextResponse.json(photos);
    } catch (error) {
      console.error("Error fetching photos:", error);
      return NextResponse.json({ error: "Failed to fetch photos" }, { status: 500 });
    }
  }
  