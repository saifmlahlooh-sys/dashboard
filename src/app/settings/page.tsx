"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DashboardLayout from "@/components/DashboardLayout";
import { Settings, Save, Loader2, Moon, AlertCircle, CheckCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function SettingsPage() {
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Theme Toggle state
  const [darkMode, setDarkMode] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    setDarkMode(localStorage.getItem("theme_mode") !== "light");
    if (localStorage.getItem("theme_mode") === "light") document.documentElement.classList.add("light-theme-simulation");
  }, []);

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const toggleTheme = () => {
    const nextTheme = !darkMode;
    setDarkMode(nextTheme);
    localStorage.setItem("theme_mode", nextTheme ? "dark" : "light");
    if (nextTheme) {
       document.documentElement.classList.remove("light-theme-simulation");
    } else {
       document.documentElement.classList.add("light-theme-simulation");
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (supabase && newPassword && newPassword.length >= 6) {
         const { error } = await supabase.auth.updateUser({ password: newPassword });
         if (error) throw error;
      }
      setNewPassword("");
      showToast("Settings Updated Successfully", "success");
    } catch (err: unknown) {
      console.error(err);
      showToast(err instanceof Error ? err.message : "Error saving settings", "error");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <DashboardLayout>
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }} className={`fixed bottom-6 left-6 right-6 md:left-auto md:right-6 md:w-96 p-4 rounded-xl shadow-2xl flex items-center gap-3 z-50 text-white font-mono border ${toast.type === "success" ? "bg-emerald-950 border-emerald-900" : "bg-red-950 border-red-900"}`}>
            {toast.type === "success" ? <CheckCircle size={20} className="text-emerald-500" /> : <AlertCircle size={20} className="text-red-500" />}
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-6 max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-white tracking-tight font-mono mb-2">SETTINGS_</h2>
            <p className="text-gray-400">إعدادات النظام والحماية الخاصة بالمطور</p>
          </div>
        </div>

        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-zinc-950 border border-zinc-900 rounded-xl p-8 shadow-sm relative">
          
          {loading && <div className="absolute inset-0 flex items-center justify-center bg-zinc-950/80 rounded-xl z-10"><Loader2 className="animate-spin text-zinc-500" size={40} /></div>}

          {/* Profile Settings */}
          <section className="mb-10">
            <h3 className="text-xl font-bold text-white mb-6 font-mono tracking-widest text-zinc-300">SECURITY/PIN</h3>
            <div className="space-y-2">
               <label className="text-xs font-mono text-zinc-500 uppercase tracking-widest">Update PIN Code / Password</label>
               <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="••••••••" className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-zinc-500 transition-colors text-left font-mono" dir="ltr" />
            </div>
          </section>

          {/* System preferences */}
          <section className="mb-10">
            <h3 className="text-xl font-bold text-white mb-6 font-mono tracking-widest text-zinc-300">APPEARANCE</h3>
            <div className="flex justify-between items-center p-5 bg-black rounded-lg border border-zinc-800 font-medium text-white transition-colors duration-300">
               <div className="flex items-center gap-4">
                  <Moon size={24} className={darkMode ? "text-white" : "text-zinc-600"} />
                  <div className="flex flex-col">
                     <span className="font-mono">Pitch Black Theme</span>
                     <span className="text-xs text-zinc-500 font-mono">Pure #000000 developer workspace</span>
                  </div>
               </div>
               
               <label className="relative inline-flex items-center cursor-pointer scale-110">
                 <input type="checkbox" checked={darkMode} onChange={toggleTheme} className="sr-only peer" />
                 <div className="w-11 h-6 bg-zinc-800 rounded-full peer peer-checked:bg-white peer-checked:after:border-black after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-zinc-400 peer-checked:after:bg-black after:border-zinc-800 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
               </label>
            </div>
          </section>

          <div className="pt-6 border-t border-zinc-900 flex justify-end">
            <button onClick={handleSave} disabled={isSaving || !newPassword} className="bg-white hover:bg-zinc-200 text-black px-8 py-3 rounded-xl font-bold font-mono transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider">
              {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
              Apply
            </button>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
