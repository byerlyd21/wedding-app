"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Autoplay from "embla-carousel-autoplay";

import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

export default function PhotosPage() {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false); // Modal visibility
  const [photo, setPhoto] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Handle opening the modal
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  // Handle closing the modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Handle taking a photo using the camera
  const handleTakePhoto = () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          const video = document.createElement("video");
          video.srcObject = stream;
          video.play();

          const canvas = document.createElement("canvas");
          const context = canvas.getContext("2d");

          video.onloadedmetadata = () => {
            if (context && video.videoWidth && video.videoHeight) {
              canvas.width = video.videoWidth;
              canvas.height = video.videoHeight;
              context.drawImage(video, 0, 0, canvas.width, canvas.height);
              const photoUrl = canvas.toDataURL("image/png");
              setPhoto(photoUrl); // Set the photo state without closing the modal
              // Don't stop the camera stream until the user submits
            }
          };
        })
        .catch((err) => {
          console.error("Error accessing the camera: ", err);
        });
    }
  };

  // Handle uploading a photo from the library
  const handleUploadPhoto = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          setPhoto(reader.result as string); // Set the photo state without closing the modal
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const fileInputRef = React.createRef<HTMLInputElement>();

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const plugin = React.useRef(
    Autoplay({ delay: 4000, stopOnInteraction: true })
  );

  const getUserIP = async () => {
    try {
      const response = await fetch("https://api.ipify.org?format=json");
      const data = await response.json();
      return data.ip; // This is the user's IP address
    } catch (error) {
      console.error("Error fetching IP address:", error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Placeholder function for submitting the photo
  const handleSubmit = async () => {
    setLoading(true);
    const userIP = await getUserIP(); // Get the IP address first
  
    if (!userIP) {
      alert("Unable to get IP address");
      return;
    }
  
    try {
      const response = await fetch('/api/photos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ photo: photo, ipAddress: userIP }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        alert('Photo uploaded successfully!');
      } else {
        alert(data.error || 'Something went wrong!');
      }
    } catch (error) {
      console.error('Error uploading photo:', error);
    }
  
    setIsModalOpen(false); // Close the modal after submitting
  };

  return (
    <>
      <div className="photos-container relative w-full h-full overflow-hidden">
        <div className="rsvp-header text-center">
          <h1 className="header-primary mt-16">Help us remember our special day!</h1>
          <p className="secondary-text mt-4">
            Take 2 photos throughout the event and share them with us!
          </p>
        </div>

        <Carousel
          plugins={[plugin.current]}
          className="w-full"
          onMouseEnter={plugin.current.stop}
          onMouseLeave={plugin.current.reset}
        >
          <CarouselContent className="mt-8">
            {Array.from({ length: 5 }).map((_, index) => (
              <CarouselItem key={index}>
                <div className="p-1">
                  <Card className="custom-card">
                    <CardContent className="flex aspect-square items-center justify-center p-6">
                      <span className="text-4xl font-semibold">{index + 1}</span>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
        <div className="btn-primary" onClick={handleOpenModal}>
          Submit a photo
        </div>
        {isModalOpen && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <button onClick={handleTakePhoto} className="btn-primary">
                  Take Photo
                </button>
                <p className="text-secondary">or</p>
                <div onClick={handleClick} className="btn-secondary mt-2!">
                  Upload from Library
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleUploadPhoto}
                  className="input-btn"
                  ref={fileInputRef}
                  style={{ display: "none" }} // Hide the input
                />
              </div>
              <div className="photo-preview">
                {photo ? (
                  <img src={photo} alt="Uploaded preview" />
                ) : (
                  <p className="text-secondary">No photo selected</p>
                )}
              </div>
              <div className="flex flex-row gap-24 mt-8">
                <button onClick={handleCloseModal} className="btn-secondary">
                  Close
                </button>
                <button onClick={handleSubmit} className="btn-primary flex flex-row gap-2">
                    {loading ? (
                        <>
                            <div className="spinner"></div>
                            Submitting...
                        </>
                    ) : (
                        "Upload"
                    )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
