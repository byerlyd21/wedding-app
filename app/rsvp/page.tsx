"use client";

import { useState, useEffect } from "react";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
  } from "@/components/ui/input-otp"
  import { toast } from "sonner"
import { Switch } from "@/components/ui/switch"

export default function RSVPPage() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [bringingGuests, setBringingGuests] = useState(false);
  const [guestCount, setGuestCount] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [nameError, setNameError] = useState("");

  const getNameCookie = (name: string): string | null => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
    return null;
    };

    useEffect(() => {
        const nameFromCookie = getNameCookie("name");
        if (nameFromCookie) {
            toast("RSVP already submitted")
            setSubmitted(true)
        }
    }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!name) {
        toast.error("Please enter your name.");
        return;
    }
    if (!phone || phone.length < 10) {
        toast.error("Please enter a valid phone number.");
        return;
    }
    if (!streetAddress || !city || !state || !postalCode) {
        toast.error("Please enter your complete address.");
        return;
    }
    setLoading(true);

    const response = await fetch("/api/rsvp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        name, 
        phone, 
        address: {
          street: streetAddress,
          city,
          state,
          postalCode
        },
        bringingGuests,
        guestCount: bringingGuests ? guestCount : 0
      }),
    });

    setLoading(false);
    if (response.ok) {
        document.cookie = `name=${name}; expires=${new Date(Date.now() + 10 * 365 * 24 * 60 * 60 * 1000).toUTCString()}; path=/`;
        setSubmitted(true);
    } else {
        toast("Something went wrong!");
    }
  };

  const handleOTPChange = (newValue: string) => {
    setPhone(newValue); 
  }

  const handleInvalid = (event: React.FormEvent<HTMLInputElement>) => {
    event.currentTarget.setCustomValidity("This field cannot be empty.");
  };

  return (
    <>
    <div className={submitted ? "border m-4" : ""}>
      <div className="rsvp-container">
          {submitted ? (
          <div className="flex flex-col items-center">
              <h1 className="header-primary mt-24">Thank you!</h1>
              <p className="header-secondary">We look forward to seeing you!</p>
              <a
                  href="https://amazon.com"
                  className="btn-primary mt-12!"
                  >
                  View our registry
              </a>
          </div>
          ) : (
          <>
          <div className="rsvp-header">
              <h1 className="header-primary">Reserve your spot!</h1>
              <p className="text-secondary">We'd love to see you at our wedding on August 16th at 5:00 pm</p>
          </div>
              <form onSubmit={handleSubmit} className="rsvp-form">
                  <label className="text-secondary w-full">Name</label>
                  <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="rsvp-input"
                      placeholder="Your full name"
                  />
                  <label className="text-secondary w-full">Phone</label>
                  <div className="phone-input-container">
                      <InputOTP maxLength={10} value={phone} onChange={handleOTPChange}>
                          <InputOTPGroup className="phone-group-3">
                              <InputOTPSlot index={0} className="phone-input"/>
                              <InputOTPSlot index={1} className="phone-input"/>
                              <InputOTPSlot index={2} className="phone-input"/>
                          </InputOTPGroup>
                          <InputOTPGroup className="phone-group-3">
                              <InputOTPSlot index={3} className="phone-input"/>
                              <InputOTPSlot index={4} className="phone-input"/>
                              <InputOTPSlot index={5} className="phone-input"/>
                          </InputOTPGroup>
                          <InputOTPGroup className="phone-group-4">
                              <InputOTPSlot index={6} className="phone-input"/>
                              <InputOTPSlot index={7} className="phone-input"/>
                              <InputOTPSlot index={8} className="phone-input"/>
                              <InputOTPSlot index={9} className="phone-input"/>
                          </InputOTPGroup>
                      </InputOTP>
                  </div>
                  <label className="text-secondary w-full">Street Address</label>
                  <input
                      type="text"
                      value={streetAddress}
                      onChange={(e) => setStreetAddress(e.target.value)}
                      className="rsvp-input"
                      placeholder="123 Main St"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-secondary w-full">City</label>
                      <input
                          type="text"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          className="rsvp-input"
                          placeholder="City"
                      />
                    </div>
                    <div>
                      <label className="text-secondary w-full">State</label>
                      <input
                          type="text"
                          value={state}
                          onChange={(e) => setState(e.target.value)}
                          className="rsvp-input"
                          placeholder="State"
                          maxLength={2}
                      />
                    </div>
                  </div>
                  <label className="text-secondary w-full">Postal Code</label>
                  <input
                      type="text"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      className="rsvp-input"
                      placeholder="12345"
                      maxLength={5}
                  />
                  <div className="flex items-center space-x-4 mt-4">
                    <label className="text-secondary">Bringing Guests?</label>
                    <Switch
                      checked={bringingGuests}
                      onCheckedChange={setBringingGuests}
                    />
                  </div>
                  {bringingGuests && (
                    <div className="mt-4">
                      <label className="text-secondary w-full">Number of Guests</label>
                      <input
                        type="number"
                        min="1"
                        max="5"
                        value={guestCount}
                        onChange={(e) => setGuestCount(parseInt(e.target.value))}
                        className="rsvp-input"
                      />
                    </div>
                  )}
                  {nameError && <span className="text-red-500 text-sm">{nameError}</span>}
                  <button type="submit" className="btn-primary mt-6" disabled={loading}>
                  {loading ? (
                      <>
                          <div className="spinner"></div>
                          Submitting...
                      </>
                  ) : (
                      "Submit RSVP"
                  )}
                  </button>
              </form>
          </>
          )}
      </div>
    </div>
    </>
  );
}
