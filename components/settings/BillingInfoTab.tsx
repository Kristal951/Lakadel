import {
  FiCreditCard,
  FiMapPin,
  FiPhone,
  FiGlobe,
  FiPlus,
} from "react-icons/fi";
import BillingInput from "./BillingInput";
import useUserStore from "@/store/userStore";
import React from "react";

export default function BillingInfoTab() {
  const { user } = useUserStore();
  const [name, setName] = React.useState(user?.name || "");
  const [phone, setPhone] = React.useState(user?.phone || "");

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <section className="bg-background rounded-4xl border border-foreground/30 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-foreground/30 bg-background flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-foreground">
              Payment Methods
            </h2>
            <p className="text-sm text-foreground/60 font-medium">
              Manage your saved cards and payment preferences.
            </p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 text-xs font-bold bg-background border border-foreground/20 rounded-md hover:bg-foreground/5 transition shadow-sm">
            <FiPlus /> Add Card
          </button>
        </div>

        <div className="p-8">
          {/* Visual Card Preview */}
          <div className="relative w-full max-w-sm h-48 bg-linear-to-br from-indigo-600 to-violet-700 rounded-3xl p-6 text-white  mb-8 overflow-hidden group cursor-pointer hover:scale-[1.02] transition-transform">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <FiCreditCard size={120} />
            </div>
            <div className="flex justify-between items-start">
              <span className="text-xs font-black tracking-widest uppercase opacity-80">
                Primary Card
              </span>
              <div className="w-10 h-6 bg-white/20 rounded-md backdrop-blur-md" />
            </div>
            <div className="mt-8">
              <p className="text-lg font-mono tracking-[0.2em]">
                **** **** **** 4242
              </p>
            </div>
            <div className="mt-auto flex justify-between items-end">
              <div>
                <p className="text-[10px] uppercase tracking-widest opacity-60">
                  Card Holder
                </p>
                <p className="text-sm font-bold uppercase">John Doe</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest opacity-60">
                  Expires
                </p>
                <p className="text-sm font-bold">12/26</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-background rounded-4xl border border-foreground/30 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-foreground/30 bg-background">
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <FiMapPin className="text-indigo-600" /> Billing Address
          </h2>
        </div>

        <div className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <BillingInput
              label="Full Name"
              placeholder="John Doe"
              icon={<FiUser className="w-4 h-4" />}
              value={name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setName(e.target.value)
              }
            />
            <BillingInput
              label="Phone Number"
              placeholder="+234 801 234 5678"
              icon={<FiPhone className="w-4 h-4" />}
              value={phone}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setPhone(e.target.value)
              }
            />
          </div>

          <BillingInput label="Street Address" placeholder="123 Main Street" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <BillingInput label="City" placeholder="Lagos" />
            <BillingInput label="State" placeholder="Lagos State" />
            <BillingInput label="Postal Code" placeholder="100001" />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-black uppercase tracking-widest text-foreground/60 flex items-center gap-2">
              <FiGlobe className="w-3 h-3" /> Country
            </label>
            <select className="w-full px-4 py-3 rounded-xl border border-foreground/20 bg-background focus:ring-1 focus:ring-foreground/10 focus:border-foreground transition-all outline-none text-sm font-medium appearance-none cursor-pointer">
              <option>Nigeria</option>
              <option>United States</option>
              <option>United Kingdom</option>
            </select>
          </div>

          <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100 mt-4">
            <input
              type="checkbox"
              className="w-5 h-5 rounded-md accent-indigo-600"
              id="default-billing"
            />
            <label
              htmlFor="default-billing"
              className="text-sm font-bold text-slate-600 cursor-pointer"
            >
              Use as my primary billing address
            </label>
          </div>
        </div>
      </section>
    </div>
  );
}

function FiUser(props: any) {
  return (
    <svg
      {...props}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}
