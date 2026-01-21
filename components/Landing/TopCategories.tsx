import { GiHoodie, GiTrousers } from "react-icons/gi";
import { IoShirtOutline } from "react-icons/io5";
import { PiBaseballCap } from "react-icons/pi";
import SelectionBar from "./CategorySelectionBar";

export default function TopCategories() {
  const icons = [
    { icon: <IoShirtOutline />, label: "Shirt" },
    { icon: <GiTrousers />, label: "Trousers" },
    { icon: <GiHoodie />, label: "Settings" },
    { icon: <PiBaseballCap />, label: "Caps" },
  ];

  return (
    <div className="w-full h-screen flex flex-col px-20 py-10">
      <h1 className="text-[#B10E0E] text-3xl font-medium">Top Products</h1>

      <div className="w-full">
      <SelectionBar iconObject={icons}/>
      </div>
    </div>
  );
}
