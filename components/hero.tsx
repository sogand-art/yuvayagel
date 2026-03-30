"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

type Slide = {
  src: string;
  alt: string;
};

const slides: Slide[] = [
  { src: "/hero1.jpg", alt: "Happy dog" },
  { src: "/hero2.jpeg", alt: "Cute cat" },
  { src: "/hero3.jpg", alt: "Pet care" },
];

export default function Hero() {
  const [current, setCurrent] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-125 overflow-hidden">
      <div
        className="flex h-full transition-transform duration-700 ease-in-out"
        style={{
          transform: `translateX(-${current * 100}%)`,
        }}
      >
        {slides.map((slide, index) => (
          <div key={index} className="relative min-w-full h-full">
            <Image
              src={slide.src}
              alt={slide.alt}
              fill
              className="object-cover"
              priority={index === 0}
            />
          </div>
        ))}
      </div>

      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
        <h1 className="text-white text-3xl md:text-5xl font-bold">
          Yuvaya Gel
        </h1>
      </div>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`w-3 h-3 rounded-full ${
              current === index ? "bg-white" : "bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
