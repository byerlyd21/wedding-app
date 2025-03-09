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
  const [photos, setPhotos] = useState<{ url: string; name: string; time: string }[]>([]);
  const plugin = useRef(Autoplay({ delay: 3000, stopOnInteraction: false }));
  const [loading, setLoading] = useState<boolean>(false);

  const fetchPhotos = async () => {
    if (loading) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/photos?random=true&limit=10`); // Fetch 10 random images
      const data: Photo[] = await response.json();

      const imageDetails = data.flatMap((photo) => {
        const images: { url: string; name: string; time: string }[] = [];
        if (photo.photo_1) {
          images.push({
            url: photo.photo_1,
            name: photo.name || "Anonymous",
            time: photo.photo_1_time || "Unknown Time",
          });
        }
        if (photo.photo_2) {
          images.push({
            url: photo.photo_2,
            name: photo.name || "Anonymous",
            time: photo.photo_2_time || "Unknown Time",
          });
        }
        return images;
      });

      // Shuffle images using Fisher-Yates algorithm
      for (let i = imageDetails.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [imageDetails[i], imageDetails[j]] = [imageDetails[j], imageDetails[i]];
      }

      setPhotos(imageDetails); // Replace old photos with new ones
    } catch (error) {
      console.error("Failed to fetch photos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPhotos(); // Fetch initial photos

    const interval = setInterval(() => {
      fetchPhotos(); // Fetch new random photos every 30 seconds
    }, 40000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Carousel plugins={[plugin.current]} className="w-full">
      <CarouselContent className="mt-8">
        {loading ? (
          <div className="flex justify-center items-center">
            <div className="ml-44 mb-44 mt-24 animate-spin h-8 w-8 border-4 border-black border-t-transparent rounded-full"></div>
          </div>
        ) : (
          photos.map((photo, index) => (
            <CarouselItem key={index} className="max-w-[450px]">
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
        )}
      </CarouselContent>
    </Carousel>
  );
}
