"use client";

import { useState } from "react";

export function RoomImagePreview({ images }: { images: string[] }) {
  const [active, setActive] = useState(images[0]);

  if (images.length === 0) {
    return (
      <img
        src="/room-placeholder.jpg"
        className="w-full h-80 object-cover rounded-lg"
      />
    );
  }

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <img src={active} className="w-full h-80 object-cover rounded-lg" />

      {/* Thumbnails */}
      <div className="flex gap-3 overflow-x-auto">
        {images.map((img, idx) => (
          <img
            key={idx}
            src={img}
            onClick={() => setActive(img)}
            className={`h-20 w-28 object-cover rounded cursor-pointer border 
              ${active === img ? "border-primary" : "border-transparent"}`}
          />
        ))}
      </div>
    </div>
  );
}
