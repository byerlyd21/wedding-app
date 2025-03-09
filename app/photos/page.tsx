"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { toast } from "sonner";


import PhotoCarousel from "@/components/ui/photo-carousel";

export default function PhotosPage() {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false); // Modal visibility
    const [photo, setPhoto] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [hideBtn, setHideBtn] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    const getNameCookie = (name: string): string | null => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
        return null;
    };

    useEffect(() => {
        const nameFromCookie = getNameCookie("name");
        if (nameFromCookie === "Dallin Byerly" || nameFromCookie === "Maya Stevenson") {
            setIsAdmin(true);
            if (nameFromCookie === "Maya Stevenson") {
                toast("Welcome my beautiful and wonderful fiance" + nameFromCookie || "Admin")
            } else {
                toast("Welcome " + nameFromCookie || "Admin")
            }
            console.log("Admin user detected:", nameFromCookie);
        } else {
            setIsAdmin(false);
            console.log("Regular user detected:", nameFromCookie);
            checkUploadCount();
        }
    }, []);

    const checkUploadCount = () => {
        const uploadCount = parseInt(getCookie("uploadCount") || "0");
        if (uploadCount >= 2 && !isAdmin) {
            setHideBtn(true);
        }
    }

    // Handle opening the modal
    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    // Handle closing the modal
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setPhoto(null); 
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

  const getUserIP = async () => {
    try {
      const response = await fetch("https://api.ipify.org?format=json");
      const data = await response.json();
      return data.ip; // This is the user's IP address
    } catch (error) {
      console.error("Error fetching IP address:", error);
      return null;
    }
  };

  const setCookie = (name: string, value: string, days: number) => {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000); // Set expiration to 'days' days
    const expires = "expires=" + date.toUTCString();
    document.cookie = name + "=" + (value || "") + ";" + expires + ";path=/";
  };
  
  const getCookie = (name: string) => {
    const nameEQ = name + "=";
    const ca = document.cookie.split(";");
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === " ") c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  };
  

  // Placeholder function for submitting the photo
  const handleSubmit = async () => {
    setLoading(true);
    const userIP = await getUserIP(); // Get the IP address first

    const uploadCount = parseInt(getCookie("uploadCount") || "0");
    
    if (!isAdmin && uploadCount >= 2) {
      toast('You have already uploaded two photos.');
      setLoading(false);
      return;
    }
  
    if (!userIP) {
        setLoading(false);
        return;
    }

    
    const nameFromCookie = getNameCookie('name');
    const photoTime = new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });
    try {

        const response = await fetch('/api/photos', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ photo, photoTime: photoTime, ipAddress: userIP, name: nameFromCookie }),
        });
    
        if (!response.ok) {
          const errorMessage = await response.text();
          throw new Error(errorMessage || 'Something went wrong!');
        }
    
        // If the photo upload is successful, increment the upload count and set the cookie
        const newCount = uploadCount + 1;
        setCookie("uploadCount", newCount.toString(), 3650); 
        checkUploadCount();
        toast('Photo uploaded successfully!');
      } catch (error) {
        toast(`${error instanceof Error ? error.message.replace(/['"]+/g, '') : String(error).replace(/['"]+/g, '')}`);
      } finally {
        setIsModalOpen(false); 
        setPhoto(null); 
        setLoading(false);
      }
  
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="photos-container relative w-full h-full overflow-hidden">
        <div className="rsvp-header text-center">
          <h1 className="header-primary mt-4">Help us remember our special day!</h1>
          <p className="text-secondary">
            Take 2 photos throughout the event and share them with us!
          </p>
        </div>
        <PhotoCarousel/>
        {!hideBtn ? (
            <div className="btn-primary" onClick={handleOpenModal}>
                Submit a photo
            </div>
        ) : null}
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
              <div className="flex flex-row justify-between mt-8 w-full">
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
