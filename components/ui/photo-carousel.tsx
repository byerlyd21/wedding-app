"use client";

import { useEffect, useState, useRef } from "react";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay"; // Import autoplay plugin

interface Photo {
  id: number;
  photo_1: string | null;
  photo_2: string | null;
}

export default function PhotoCarousel() {
  const [photos, setPhotos] = useState<string[]>([]); // Store a list of images
  const plugin = useRef(Autoplay({ delay: 3000 })); // ✅ Initialize with autoplay

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const response = await fetch("/api/photos"); // Fetch from API
        const data: Photo[] = await response.json();
  
        // ✅ Flatten and filter out null values explicitly
        const imageUrls: string[] = data.flatMap((photo) =>
          [photo.photo_1, photo.photo_2].filter((url): url is string => Boolean(url))
        );
  
        setPhotos(imageUrls);
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
          photos.map((photoUrl, index) => (
            <CarouselItem key={index}>
              <div className="p-1">
                <img
                  src={photoUrl}
                  alt={`Photo ${index + 1}`}
                  className="w-full h-full object-cover rounded-lg"
                />
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
