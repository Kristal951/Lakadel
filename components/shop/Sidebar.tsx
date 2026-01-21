"use client";
import React, { useState } from "react";

export default function SidebarFilters() {
  const categories = ["T-shirts / Tops", "Trousers", "Flags", "Shorts", "Dresses"];
  const sizes = ["XS", 'S', 'M', 'L', 'XL']
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);

  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat],
    );
  };

  const toggleSizes = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((c) => c !== size) : [...prev, size],
    );
  };

  return (
    <aside
      className="w-[20%] hidden fixed border-0 border-r bottom-0 z-100 left-0 md:flex bg-white flex-col p-4"
      style={{ height: "calc(100vh - 70px)" }}
    >
      <div className="w-full flex flex-col">
        <h3 className="text-lg text-[#B10E0E] font-semibold">Categories</h3>
        <ul className="flex flex-col gap-2 p-4">
          {categories.map((cat) => {
            const isChecked = selectedCategories.includes(cat);
            return (
              <li
                key={cat}
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => toggleCategory(cat)}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  readOnly
                  className={`w-5 h-5 rounded border-gray-300 transition-all ${
                    isChecked ? "accent-[#B10E0E]" : "bg-white"
                  }`}
                />
                <span
                  className={`select-none font-medium transition-colors ${
                    isChecked ? "text-[#B10E0E]" : "text-[#B10E0E]/70"
                  }`}
                >
                  {cat}
                </span>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="w-full flex flex-col mt-4">
        <h3 className="text-lg text-[#B10E0E] font-semibold">Sizes</h3>
        <ul className="flex flex-col gap-2 p-4">
          {sizes.map((size) => {
            const isChecked = selectedSizes.includes(size);
            return (
              <li
                key={size}
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => toggleSizes(size)}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  readOnly
                  className={`w-5 h-5 rounded border-gray-300 transition-all ${
                    isChecked ? "accent-[#B10E0E]" : "bg-white"
                  }`}
                />
                <span
                  className={`select-none font-medium transition-colors ${
                    isChecked ? "text-[#B10E0E]" : "text-[#B10E0E]/70"
                  }`}
                >
                  {size}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </aside>
  );
}

{
  /* <aside className="flex flex-col gap-8"> */
}
{
  /* Categories */
}
{
  /* <div>
        <h3 className="text-lg font-semibold mb-2">Categories</h3>
        <ul className="flex flex-col gap-1">
          {["Dresses", "Handbags", "Shoes", "Accessories"].map((cat) => (
            <li
              key={cat}
              className="cursor-pointer hover:text-pink-500 transition-colors"
            >
              {cat}
            </li>
          ))}
        </ul>
      </div> */
}

{
  /* Price Range */
}
{
  /* <div>
        <h3 className="text-lg font-semibold mb-2">Price Range</h3>
        <input
          type="range"
          min={50}
          max={2000}
          className="w-full accent-pink-500"
        />
        <div className="flex justify-between text-sm text-gray-500 mt-1">
          <span>$50</span>
          <span>$2000</span>
        </div>
      </div> */
}

{
  /* Color / Material */
}
{
  /* <div>
        <h3 className="text-lg font-semibold mb-2">Color / Material</h3>
        <div className="flex flex-wrap gap-2">
          {["Black", "White", "Beige", "Leather", "Silk"].map((item) => (
            <span
              key={item}
              className="px-3 py-1 border border-gray-300 rounded-full cursor-pointer hover:bg-pink-50 transition"
            >
              {item}
            </span>
          ))}
        </div>
      </div> */
}

{
  /* Collections */
}
{
  /* <div>
        <h3 className="text-lg font-semibold mb-2">Collection</h3>
        <ul className="flex flex-col gap-1">
          {["Summer 2026", "Limited Edition", "New Arrivals"].map((col) => (
            <li
              key={col}
              className="cursor-pointer hover:text-pink-500 transition-colors"
            >
              {col}
            </li>
          ))}
        </ul>
      </div> */
}

{
  /* Sort By */
}
{
  /* <div>
        <h3 className="text-lg font-semibold mb-2">Sort By</h3>
        <select className="w-full border border-gray-300 rounded px-2 py-1">
          <option>Price: Low → High</option>
          <option>Price: High → Low</option>
          <option>New Arrivals</option>
          <option>Popular</option>
        </select>
      </div> */
}
// </aside>
