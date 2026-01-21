import Logo3D from "@/components/Logo3D";
import React from "react";

export const Hero = () => {
  return (
    <section
      id="home"
      className="relative h-screen w-screen flex flex-col justify-center items-center bg-linear-to-br from-[#FFFFFF] via-[#FFF5F5]/50 to-[#F8D7D7]/50 overflow-hidden"
    >
      

      <div className="absolute bottom-20 w-full text-center z-10">
        <p className="uppercase tracking-[0.5em] text-gray-400">
          Redefining Modern Elegance
        </p>
      </div>
    </section>
  );
};
