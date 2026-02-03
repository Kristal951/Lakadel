"use client";
import { categories, genders, sizes } from "@/lib";
import { Check, Image, Plus, X } from "lucide-react";
import { useState, KeyboardEvent } from "react";

export default function AddNewProductPage() {
  const [availableSizes, setAvailableSizes] = useState<string[]>([]);
  const [availableGender, setAvailableGender] = useState<string>("");
  
  // Color State
  const [colors, setColors] = useState<{ name: string; hex: string }[]>([]);
  const [currentHex, setCurrentHex] = useState("#000000");
  const [currentName, setCurrentName] = useState("");

  // Tags/Filters State
  const [tags, setTags] = useState<string[]>(["Vintage", "Cotton"]);
  const [tagInput, setTagInput] = useState("");

  function toggleSize(size: string) {
    setAvailableSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  }

  function toggleGender(gender: string) {
    setAvailableGender(gender);
  }

  const addColor = () => {
    if (!currentName.trim()) return;
    setColors([...colors, { name: currentName.trim(), hex: currentHex }]);
    setCurrentName("");
  };

  const handleTagKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput("");
    }
  };

  return (
    <div className="flex w-full flex-col px-10 py-5 bg-background min-h-screen text-foreground">
      {/* Header */}
      <div className="w-full h-16 flex items-center justify-end sticky top-0 bg-background/80 backdrop-blur-md z-10">
        <button className="bg-foreground text-background gap-2 px-6 py-2.5 rounded-full font-bold flex items-center transition-opacity hover:opacity-90 shadow-sm">
          <Check className="w-4 h-4" />
          Add Product
        </button>
      </div>

      <div className="w-full flex justify-between gap-12">
        <div className="w-full lg:w-1/2 flex flex-col gap-8 pb-20">
          <section className="w-full space-y-6">
            <h2 className="text-2xl font-bold tracking-tight">General Information</h2>

            <div className="group relative flex flex-col h-72 w-full border-2 border-dashed border-foreground/20 hover:border-foreground/40 hover:bg-muted/5 rounded-3xl items-center justify-center gap-3 transition-all cursor-pointer overflow-hidden">
              <div className="p-4 rounded-full bg-muted transition-transform group-hover:scale-110">
                <Image className="w-8 h-8 text-foreground/50" />
              </div>
              <div className="text-center">
                <p className="font-semibold text-sm">Click to upload product images</p>
                <p className="text-xs text-muted-foreground mt-1">Up to 5 images. PNG, JPG or WebP.</p>
              </div>
            </div>

            <div className="flex flex-col gap-5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Product Name</label>
                <input
                  type="text"
                  placeholder="e.g. Essential Oversized Tee"
                  className="p-3 w-full rounded-xl border border-foreground/20 outline-none focus:border-foreground focus:ring-1 focus:ring-foreground/10 transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Description</label>
                <textarea
                  rows={5}
                  className="p-3 w-full rounded-xl border border-foreground/20 outline-none focus:border-foreground focus:ring-1 focus:ring-foreground/10 transition-all resize-none"
                  placeholder="Describe the fit, fabric, and style..."
                ></textarea>
              </div>

              <div className="flex w-full justify-between items-start pt-2 gap-8">
                <div className="flex-1 space-y-3">
                  <h3 className="font-bold text-sm">Available Sizes</h3>
                  <div className="flex flex-wrap gap-2">
                    {sizes.map((size, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => toggleSize(size)}
                        className={`h-11 w-12 rounded-xl border font-bold text-xs transition-all ${
                          availableSizes.includes(size)
                            ? "bg-foreground text-background border-foreground shadow-md"
                            : "border-foreground/20 hover:border-foreground/40"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex-1 space-y-3">
                  <h3 className="font-bold text-sm">Gender</h3>
                  <div className="flex gap-2.5">
                    {genders.map((g, i) => (
                      <div key={i} className="flex gap-3 items-center group cursor-pointer" onClick={() => toggleGender(g)}>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${availableGender === g ? "border-foreground bg-foreground" : "border-foreground/20"}`}>
                          {availableGender === g && <div className="w-1.5 h-1.5 rounded-full bg-background" />}
                        </div>
                        <p className="capitalize text-sm font-medium">{g}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Pricing & Stock */}
          <section className="space-y-6 border-t border-foreground/10 pt-8">
            <h2 className="text-2xl font-bold tracking-tight">Pricing & Stock</h2>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-1.5 relative group">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Price</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40 group-focus-within:text-foreground font-bold">₦</span>
                  <input
                    type="text"
                    className="w-full pl-10 pr-4 py-3 border border-foreground/20 rounded-xl outline-none focus:border-foreground focus:ring-1 focus:ring-foreground/10 transition-all font-semibold"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Stock Quantity</label>
                <input
                  type="number"
                  placeholder="e.g. 50"
                  className="w-full p-3 border border-foreground/20 rounded-xl outline-none focus:border-foreground focus:ring-1 focus:ring-foreground/10 transition-all font-semibold"
                />
              </div>
            </div>
          </section>

          {/* Shipping Details */}
          <section className="space-y-6 border-t border-foreground/10 pt-8">
            <h2 className="text-2xl font-bold tracking-tight">Shipping Details</h2>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Weight (kg)</label>
                <input
                  type="text"
                  placeholder="0.5"
                  className="p-3 w-full rounded-xl border border-foreground/20 outline-none focus:border-foreground transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Fulfillment Service</label>
                <select className="p-3 w-full rounded-xl border border-foreground/20 bg-background outline-none focus:border-foreground appearance-none transition-all cursor-pointer">
                  <option>Manual / Self-Ship</option>
                  <option>Logistics Partner</option>
                </select>
              </div>
            </div>
          </section>

          {/* Search & Organization */}
          <section className="space-y-6 border-t border-foreground/10 pt-8">
            <h2 className="text-2xl font-bold tracking-tight">Search & Organization</h2>
            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Category</label>
                <select className="p-3 w-full rounded-xl border border-foreground/20 bg-background outline-none focus:border-foreground transition-all cursor-pointer">
                  <option value="">Select a category</option>
                  {categories.map((cat, i) => (
                    <option value={cat} key={i}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Search Filters (Tags)</label>
                <div className="flex flex-wrap gap-2 p-3 min-h-[50px] border border-foreground/20 rounded-xl bg-muted/5 focus-within:border-foreground/40 transition-colors">
                  {tags.map((tag) => (
                    <span key={tag} className="flex items-center gap-1.5 bg-foreground text-background px-3 py-1 rounded-lg text-xs font-bold">
                      {tag}
                      <button type="button" onClick={() => setTags(tags.filter(t => t !== tag))} className="hover:text-red-400 transition-colors"><X className="w-3 h-3" /></button>
                    </span>
                  ))}
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleTagKeyDown}
                    placeholder="Add tag and press Enter..."
                    className="bg-transparent outline-none text-xs flex-1 min-w-[120px]"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Inventory Logistics */}
          <section className="space-y-6 border-t border-foreground/10 pt-8">
            <h2 className="text-2xl font-bold tracking-tight">Inventory Logistics</h2>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Product SKU</label>
                <input
                  type="text"
                  placeholder="LKD-OG-TEE-001"
                  className="p-3 w-full rounded-xl border border-foreground/20 outline-none focus:border-foreground transition-all font-mono text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Visibility Status</label>
                <select className="p-3 w-full rounded-xl border border-foreground/20 bg-background outline-none focus:border-foreground transition-all font-bold text-sm cursor-pointer">
                  <option value="ACTIVE">Active (Live on Store)</option>
                  <option value="DRAFT">Draft (Hidden)</option>
                  <option value="ARCHIVED">Archived</option>
                </select>
              </div>
            </div>
          </section>

          {/* Color Picker */}
          <section className="space-y-6 border-t border-foreground/10 pt-8">
            <h2 className="text-xl font-bold">Product Colors</h2>
            <div className="flex flex-col gap-4">
              <div className="flex items-end gap-3">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Color</label>
                  <input
                    type="color"
                    value={currentHex}
                    onChange={(e) => setCurrentHex(e.target.value)}
                    className="w-12 h-12 rounded-xl border border-foreground/20 cursor-pointer bg-background p-1"
                  />
                </div>
                <div className="flex-1 space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Color Name</label>
                  <input
                    type="text"
                    value={currentName}
                    onChange={(e) => setCurrentName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addColor()}
                    placeholder="e.g. Midnight Black"
                    className="p-2.5 h-12 w-full rounded-xl border border-foreground/50 outline-0 focus:ring-1 focus:ring-foreground transition-all"
                  />
                </div>
                <button
                  type="button"
                  onClick={addColor}
                  className="h-12 px-4 bg-foreground text-background rounded-xl font-bold hover:opacity-90 transition-all flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" /> Add
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {colors.map((color, i) => (
                  <div key={i} className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-foreground/20 bg-muted/5 animate-in fade-in zoom-in duration-200">
                    <div className="w-4 h-4 rounded-full border border-foreground/10" style={{ backgroundColor: color.hex }} />
                    <span className="text-sm font-medium">{color.name}</span>
                    <button onClick={() => setColors(colors.filter((_, idx) => idx !== i))} className="hover:text-red-500 transition-colors">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>

        {/* Right Column (Preview) */}
        <div className="hidden lg:flex w-1/2 sticky top-5 h-[calc(100vh-40px)] bg-muted/10 border border-foreground/5 rounded-[2.5rem] items-center justify-center">
          <p className="text-muted-foreground font-medium italic">Live Preview will appear here</p>
        </div>
      </div>
    </div>
  );
}