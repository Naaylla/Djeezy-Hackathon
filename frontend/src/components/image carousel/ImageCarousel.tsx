"use client";

import { useState, useEffect } from "react";

interface ImageCarouselProps {
  images: string[];
  interval?: number;
  className?: string;
}

export default function ImageCarousel({
  images,
  interval = 5000,
  className = "",
}: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoaded, setIsLoaded] = useState<boolean[]>([]);

  // Track which images have loaded
  useEffect(() => {
    setIsLoaded(new Array(images.length).fill(false));
  }, [images.length]);

  const handleImageLoad = (index: number) => {
    setIsLoaded((prev) => {
      const newLoaded = [...prev];
      newLoaded[index] = true;
      return newLoaded;
    });
  };

  // Handle image rotation
  useEffect(() => {
    if (images.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, interval);

    return () => clearInterval(timer);
  }, [images.length, interval]);

  if (images.length === 0) {
    return (
      <div className={`${className} bg-gray-200`}>No images available</div>
    );
  }

  return (
    <div className={`${className} relative overflow-hidden`}>
      {images.map((image, index) => {
        // Use a placeholder if the image path is empty
        const imgSrc = image || "/placeholder.svg?height=500&width=800";

        return (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentIndex ? "opacity-100" : "opacity-0"
            }`}
            style={{
              zIndex: index === currentIndex ? 1 : 0,
              width: "100%",
              height: "100%",
            }}
          >
            <img
              src={imgSrc || "/placeholder.svg"}
              alt={`Hero ${index + 1}`}
              className="w-full h-full object-cover"
              onLoad={() => handleImageLoad(index)}
              onError={() => console.error(`Failed to load image: ${imgSrc}`)}
            />

            {/* Debug overlay to show image path */}
            <div className="absolute bottom-0 left-0 bg-black bg-opacity-50 text-white text-xs p-1">
              {imgSrc} (Index: {index}, Current: {currentIndex})
            </div>
          </div>
        );
      })}
    </div>
  );
}
