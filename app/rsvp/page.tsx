"use client";

import { useState } from "react";

export default function RSVPPage() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    const response = await fetch("/api/rsvp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, phone, address }),
    });

    if (response.ok) {
      // Redirect or show success message
      alert("RSVP submitted successfully!");
    } else {
      alert("Something went wrong!");
    }
  };

  return (
    <div className="rsvp-container">
        <h1>Reserve your spot!</h1>
        <form onSubmit={handleSubmit} className="rsvp-form">
        <input
            type="text"
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="rsvp-input"
        />
        <input
            type="text"
            placeholder="Your Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            className="rsvp-input"
        />
        <input
            type="text"
            placeholder="Your Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
            className="rsvp-input"
        />
        <button type="submit" className="btn-primary">Submit RSVP</button>
        </form>
    </div>
  );
}
