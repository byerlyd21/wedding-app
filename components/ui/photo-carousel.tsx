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
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);

  const fetchPhotos = async (page: number) => {
    if (loading) return; // Prevent multiple simultaneous fetch requests

    setLoading(true);
    try {
      const response = await fetch(`/api/photos?page=${page}&limit=5`); // Fetch photos with pagination
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

      imageDetails.sort((a, b) => {
        const timeA = new Date(a.time);
        const timeB = new Date(b.time);

        if (isNaN(timeA.getTime())) return 1;
        if (isNaN(timeB.getTime())) return -1;

        return timeA.getTime() - timeB.getTime(); // Ascending order (oldest first)
      });

      setPhotos((prevPhotos) => [...prevPhotos, ...imageDetails]); // Append new photos to the existing ones
    } catch (error) {
      console.error("Failed to fetch photos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPhotos(page);
  }, [page]); 


  const handleScroll = (e: React.UIEvent<HTMLElement>) => {
    const target = e.target as HTMLElement; // Type assertion here
    const bottom = target.scrollHeight === target.scrollTop + target.clientHeight;
    if (bottom && !loading) {
      setPage((prevPage) => prevPage + 1); // Load the next page of photos when user scrolls to the bottom
    }
  };
  

  return (
    <Carousel plugins={[plugin.current]} className="w-full" onScroll={handleScroll}>
      <CarouselContent className="mt-8">
        {loading ? (
          <div className="flex justify-center items-center">
            <div className=" ml-44 mb-44 mt-24 animate-spin h-8 w-8 border-4 border-black border-t-transparent rounded-full"></div>
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
