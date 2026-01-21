import { BiSort } from "react-icons/bi";
import BreadCrumbs from "./BreadCrumbs";

export default function TopBar() {
  return (
    <div className=" fixed left-[20%] top-17.5 justify-between z-100 right-0 h-12.5 px-10 items-center bg-white p-2 border-0 flex border-t border-l">
      <div>
        <BreadCrumbs />
      </div>
      <div>
        <button className="px-2 py-1 items-center bg-gray-300 rounded-lg cursor-pointer flex gap-1 text-black">
            <BiSort />

    <p className="text-sm">Sort by</p>
            
        </button>
      </div>
    </div>
  );
}
