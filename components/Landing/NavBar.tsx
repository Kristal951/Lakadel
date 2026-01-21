"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";

const NavBar = () => {
  const navLinks = [
    { label: "Home", id: "home" },
    { label: "Products", id: "products" },
    { label: "About Us", id: "about" },
    { label: "Contact Us", id: "contact" },
  ];

  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [activeID, setActiveID] = useState('Home')

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;

    if (latest > previous && latest > 80) {
      setHidden(true);
    } else {
      setHidden(false);
    }
  });

  useEffect(()=> {
    setActiveID('Home')
    document.getElementById('home')?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, [setActiveID])

  const handleScroll = (id: string, label: string) => {
    setActiveID(label)
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <motion.nav
      initial={{ y: 0 }}
      animate={{ y: hidden ? "-100%" : "0%" }}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      className="fixed top-0 left-0 right-0 z-50 bg-white
        "
    >
      <div className="mx-auto flex max-w-full items-center justify-between px-6 py-4">
        <div className="relative h-11 w-35">
          <Image
            src="/Lakadel2.png"
            alt="Lakadel logo"
            fill
            priority
            className="object-contain"
          />
        </div>

        {/* Links */}
        <div className="hidden md:flex items-center gap-10">
          {navLinks.map((nav) => (
            <button
              key={nav.id}
              onClick={() => handleScroll(nav.id, nav.label)}
              className={`relative font-medium hover:text-[#B10E0E]
              after:absolute cursor-pointer ${activeID === nav.label ? 'text-[#B10E0E]' : 'text-[#B10E0E]/50'} transition-all
              hover:after:w-full`}
            >
              {nav.label}
            </button>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button className="px-5 py-2 cursor-pointer text-[#B10E0E] rounded-full hover:bg-[#B10E0E]/10 transition">
            Sign In
          </button>

          <button
            className="px-6 py-2 cursor-pointer rounded-full font-semibold text-white
            bg-linear-to-r from-[#B10E0E] to-[#8E0B0B]
            hover:scale-[1.03] hover:shadow-lg transition-all"
          >
            Shop Now
          </button>
        </div>
      </div>
    </motion.nav>
  );
};

export default NavBar;
