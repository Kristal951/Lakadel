"use client";
import React, { useState } from "react";
import ThemeSwitcher from "../ThemeSwitcher";

export default function SidebarFilters() {
  const categories = [
    "T-shirts / Tops",
    "Trousers",
    "Flags",
    "Shorts",
    "Dresses",
  ];
  const sizes = ["XS", "S", "M", "L", "XL"];

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
      className="w-[20%] hidden md:flex flex-col justify-between fixed bottom-0 left-0 p-4"
      style={{
        height: "calc(100vh - 120px)",
        backgroundColor: "var(--background)",
      }}
    >
      <div>
        {/* Categories */}
        <div className="w-full flex flex-col">
          <h3
            className="text-lg font-semibold select-none"
            style={{ color: "var(--foreground)" }}
          >
            Categories
          </h3>
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
                    className="w-5 h-5 rounded transition"
                    style={{
                      accentColor: isChecked
                        ? "var(--accent, #B10E0E)"
                        : "var(--foreground)",
                    }}
                  />
                  <span
                    className="select-none font-medium transition-colors"
                    style={{
                      color: "var(--foreground)",
                      opacity: isChecked ? 1 : 0.7,
                    }}
                  >
                    {cat}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Sizes */}
        <div className="w-full flex flex-col mt-4">
          <h3
            className="text-lg font-semibold select-none"
            style={{ color: "var(--foreground)" }}
          >
            Sizes
          </h3>
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
                    className="w-5 h-5 rounded transition"
                    style={{
                      accentColor: isChecked
                        ? "var(--accent, #B10E0E)"
                        : "var(--foreground)",
                    }}
                  />
                  <span
                    className="select-none font-medium transition-colors"
                    style={{
                      color: "var(--foreground)",
                      opacity: isChecked ? 1 : 0.7,
                    }}
                  >
                    {size}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
      {/* <ThemeSwitcher /> */}
    </aside>
  );
}
