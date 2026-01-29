import { FiSun, FiMoon, FiMonitor, FiCheck, FiLayout, FiType } from "react-icons/fi";
import { useState } from "react";
import clsx from "clsx";

export default function AppearanceTab() {
  const [theme, setTheme] = useState("system");
  const [accent, setAccent] = useState("indigo");

  const themes = [
    { id: "light", name: "Light Mode", icon: FiSun, colors: "bg-white border-slate-200" },
    { id: "dark", name: "Dark Mode", icon: FiMoon, colors: "bg-slate-900 border-slate-800" },
    { id: "system", name: "System", icon: FiMonitor, colors: "bg-gradient-to-r from-white to-slate-900 border-slate-200" },
  ];

  const accents = [
    { id: "indigo", bg: "bg-indigo-600" },
    { id: "rose", bg: "bg-rose-600" },
    { id: "emerald", bg: "bg-emerald-600" },
    { id: "amber", bg: "bg-amber-600" },
    { id: "slate", bg: "bg-slate-900" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      
      {/* Theme Selector */}
      <section className="bg-background rounded-4xl border border-foreground/30 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-foreground/30 bg-background">
          <h2 className="text-xl font-bold text-foreground">Interface Theme</h2>
          <p className="text-sm text-foreground/60 font-medium">Customize how Lakadel looks on your device.</p>
        </div>

        <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          {themes.map((t) => (
            <button
              key={t.id}
              onClick={() => setTheme(t.id)}
              className="flex flex-col gap-3 group text-left focus:outline-none"
            >
              <div className={clsx(
                "relative h-32 w-full rounded-2xl border-2 transition-all duration-300 overflow-hidden",
                t.colors,
                theme === t.id ? "ring-4 ring-indigo-500/10 border-indigo-600 shadow-lg" : "border-transparent group-hover:border-slate-300"
              )}>
                {/* Visual Preview Elements */}
                <div className="p-3 space-y-2">
                  <div className={clsx("h-2 w-2/3 rounded-full opacity-20", t.id === 'light' ? 'bg-slate-900' : 'bg-white')} />
                  <div className={clsx("h-2 w-1/2 rounded-full opacity-10", t.id === 'light' ? 'bg-slate-900' : 'bg-white')} />
                  <div className="mt-4 grid grid-cols-3 gap-1">
                    <div className="h-6 rounded-md bg-indigo-600/40" />
                    <div className="h-6 rounded-md bg-indigo-600/40" />
                  </div>
                </div>
                {theme === t.id && (
                  <div className="absolute inset-0 bg-indigo-600/5 flex items-center justify-center">
                    <div className="bg-white text-indigo-600 p-1.5 rounded-full shadow-md">
                      <FiCheck size={14} />
                    </div>
                  </div>
                )}
              </div>
              <div className="px-1 flex items-center justify-between">
                <span className={clsx("text-sm font-bold transition-colors", theme === t.id ? "text-indigo-600" : "text-slate-600")}>
                  {t.name}
                </span>
                <t.icon size={14} className={theme === t.id ? "text-indigo-600" : "text-slate-400"} />
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Accent Color & Typography */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Accent Picker */}
        <section className="bg-background rounded-4xl border border-foreground/30 shadow-sm p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-indigo-50 rounded-xl text-indigo-600">
              <FiLayout size={20} />
            </div>
            <h3 className="text-lg font-bold text-foreground">Accent Color</h3>
          </div>
          <div className="flex flex-wrap gap-4">
            {accents.map((a) => (
              <button
                key={a.id}
                onClick={() => setAccent(a.id)}
                className={clsx(
                  "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95",
                  a.bg,
                  accent === a.id ? "ring-4 ring-offset-2 ring-indigo-500/30 shadow-lg" : ""
                )}
              >
                {accent === a.id && <FiCheck className="text-white" />}
              </button>
            ))}
          </div>
        </section>

        {/* Font Scaling */}
        <section className="bg-background rounded-4xl border border-foreground/30 shadow-sm p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-foreground/10 rounded-xl text-foreground">
              <FiType size={20} />
            </div>
            <h3 className="text-lg font-bold text-foreground">Font Scaling</h3>
          </div>
          <input 
            type="range" 
            min="1" 
            max="3" 
            step="1" 
            className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
          />
          <div className="flex justify-between mt-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
            <span>Compact</span>
            <span>Standard</span>
            <span>Large</span>
          </div>
        </section>
      </div>
    </div>
  );
}