import Image from "next/image";
import React from "react";
import { CgProfile } from "react-icons/cg";
import { IoBagOutline, IoSearchOutline } from "react-icons/io5";

const Header = () => {
  return (
    <div className="fixed top-0 z-100 left-0 right-0 h-17.5 bg-white flex items-center justify-between px-6 ">
      <div className="relative h-11 w-35">
        <Image
          src="/Lakadel2.png"
          alt="Lakadel logo"
          fill
          priority
          className="object-contain"
        />
      </div>

      <div className="w-max h-max px-10 items-center gap-2 flex">
        <button className="p-1 hover:bg-gray-100 rounded cursor-pointer">
          <IoSearchOutline className="text-black w-6 h-6"/>
        </button>
        <button className="p-1 hover:bg-gray-100 rounded cursor-pointer">
          <IoBagOutline className="text-black w-6 h-6"/>
        </button>
        <button className="p-1 hover:bg-gray-100 rounded cursor-pointer">
          <CgProfile className="text-black w-6 h-6"/>
        </button>
      </div>
    </div>
  );
};

export default Header;
