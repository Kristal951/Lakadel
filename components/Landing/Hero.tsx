"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const slides = [
  {
    id: 1,
    image: "/assets/Slide_1.jpg", // Replace with your image paths
    title: "Timeless Sophistication",
  },
  {
    id: 2,
    image: "/assets/Slide_2.jpg",
    title: "Modern Minimalist",
  },
];

export const Hero = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 5000); // Change slide every 5 seconds
    return () => clearInterval(timer);
  }, []);

  return (
    <section
      className="relative h-screen w-screen flex flex-col justify-center items-center overflow-hidden bg-background"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={slides[index].id}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute z-0 inset-0"
        >
          {/* Overlay for readability */}
          <div className="absolute inset-0 bg-black/20 z-10" />
          
          <img
            src={slides[index].image}
            alt={slides[index].title}
            className="h-full w-full object-cover"
          />
        </motion.div>
      </AnimatePresence>

      {/* Content Overlay */}
      {/* <div className="relative z-20 text-center text-white px-6">
        <motion.p
          key={`text-${index}`}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="uppercase tracking-[0.5em] text-xs md:text-sm font-light mb-4"
        >
          {slides[index].title}
        </motion.p>
        <h1 className="text-4xl md:text-6xl font-serif font-bold">Lakadel</h1>
      </div> */}

      {/* Optional: Slide Indicators */}
      <div className="absolute bottom-10 flex gap-3 z-20">
        {slides.map((_, i) => (
          <div
            key={i}
            className={`h-[2px] w-8 transition-all duration-500 ${
              i === index ? "bg-white" : "bg-white/30"
            }`}
          />
        ))}
      </div>
    </section>
  );
};