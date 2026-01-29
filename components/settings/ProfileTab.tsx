import { FiUser } from "react-icons/fi";
import Input from "./Input";
import useUserStore from "@/store/userStore";
import React from "react";

export default function ProfileTab() {
    const {user} = useUserStore()
    const [displayName, setDisplayName] = React.useState(user?.name || "")
    const [email, setEmail] = React.useState(user?.email || "")
  return (
    <section className="bg-background rounded-4xl border border-foreground/30 shadow-sm overflow-hidden">
      <div className="p-8 border-b border-foreground/30 bg-background">
        <h2 className="text-xl font-bold text-foreground">Public Profile</h2>
        <p className="text-sm text-foreground/60">
          How others will see you on the platform.
        </p>
      </div>
      <div className="p-8 space-y-6">
        <div className="flex items-center gap-6 mb-8">
          <div className="w-20 h-20 rounded-full bg-slate-200 border-4 border-white shadow-md flex items-center justify-center text-slate-400">
            <FiUser size={32} />
          </div>
          <button className="px-4 py-2 text-xs font-bold border border-slate-200 rounded-lg hover:bg-slate-50 transition">
            Change Avatar
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input label="Display Name" placeholder="Lakadel Admin" value={displayName} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDisplayName(e.target.value)} />
          <Input
            label="Email Address"
            placeholder="admin@lakadel.com"
            type="email"
            value={email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
          />
        </div>
      </div>
    </section>
  );
}
