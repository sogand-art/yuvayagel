// components/hero.tsx
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
    <div className="relative w-full h-125 md:h-150 overflow-hidden">
      {/* Slides */}
      <div
        className="flex h-full transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
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

      {/* Overlay + content */}
      <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center gap-6">
        <h1 className="text-white text-4xl md:text-6xl font-extrabold tracking-tight">
          Yuvaya Gel
        </h1>
        <p className="text-white/90 text-lg md:text-xl max-w-xl text-center">
          Find your new best friend – every pet deserves a loving home.
        </p>
        <a
          href="#pets"
          className="inline-block bg-[#e98b33] hover:bg-[#e4aa3f] text-white px-8 py-3 rounded-full font-semibold transition-colors"
        >
          Meet Our Pets
        </a>
      </div>

      {/* Dot indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`w-3 h-3 rounded-full transition-colors ${
              current === index
                ? "bg-[#e98b33]"
                : "bg-white/50 hover:bg-white/80"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
