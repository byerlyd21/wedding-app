"use client";

import { useEffect, useState, useRef } from "react";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay"; // Import autoplay plugin

interface Photo {
  id: number;
  photo_1: string | null;
  photo_2: string | null;
  name: string | null;
  photo_1_time: string | null;
  photo_2_time: string | null;
}

export default function PhotoCarousel() {
  const [photos, setPhotos] = useState<{ url: string; name: string; time: string }[]>([]); // Store a list of images
  const plugin = useRef(Autoplay({ delay: 3000, stopOnInteraction: false })); // Autoplay plugin instance

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const response = await fetch("/api/photos"); // Fetch from API
        const data: Photo[] = await response.json();
  
        // ✅ Flatten and filter out null values explicitly, and include the name
        const imageDetails = data.flatMap((photo) => {
          const images: { url: string; name: string; time: string }[] = [];
          if (photo.photo_1) {
            images.push({ 
              url: photo.photo_1, 
              name: photo.name || "Anonymous",
              time: photo.photo_1_time || "Unknown Time"
             });
          }
          if (photo.photo_2) {
            images.push({ 
              url: photo.photo_2, 
              name: photo.name || "Anonymous",
              time: photo.photo_2_time || "Unknown Time"
             });
          }
          return images;
        });
  
        setPhotos(imageDetails);
      } catch (error) {
        console.error("Failed to fetch photos:", error);
      }
    };
  
    fetchPhotos();
  }, []);
  

  return (
    <Carousel plugins={[plugin.current]} className="w-full">
      <CarouselContent className="mt-8">
        {photos.length > 0 ? (
          photos.map((photo, index) => (
            <CarouselItem key={index}>
              <div className="p-1">
                <img
                  src={photo.url}
                  alt={`Photo ${index + 1}`}
                  className="w-full max-h-[300px] object-cover rounded-lg"
                />
                <div className="photo-info-bar">
                  <span>~ {photo.name}</span>
                  <span>{photo.time}</span>
                </div>
              </div>
            </CarouselItem>
          ))
        ) : (
          <p>Loading...</p>
        )}
      </CarouselContent>
    </Carousel>
  );
}
