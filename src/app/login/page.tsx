"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Fingerprint, AlertCircle } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { loginWithPin } from "@/app/actions/auth";

export default function LoginPage() {
  const router = useRouter();
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      const result = await loginWithPin(pin);
      if (result.success) {
        // Successful PIN authentication
        router.push("/dashboard");
      } else {
        // Failed
        setErrorMsg(result.error || "رمز الدخول غير صالح, يرجى المحاولة مرة أخرى.");
      }
    } catch (error: unknown) {
      setErrorMsg("حدث خطأ غير متوقع");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-coastal-darkest flex flex-col justify-center items-center p-6 text-white" dir="rtl">
      {/* Basic Navbar for Login representation */}
      <nav className="absolute top-0 w-full p-6 flex justify-between items-center max-w-7xl mx-auto">
         <Link href="/" className="text-xl font-bold">بوابة المدرسة</Link>
         <Link href="/" className="text-gray-400 hover:text-white transition-colors">العودة للرئيسية</Link>
      </nav>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md bg-coastal-dark border border-coastal-DEFAULT p-8 rounded-2xl shadow-2xl">
        <div className="text-center mb-8">
           <div className="w-16 h-16 bg-coastal/20 text-coastal-light rounded-2xl flex items-center justify-center mx-auto mb-4 border border-coastal-DEFAULT">
              <Fingerprint size={32} />
           </div>
           <h1 className="text-2xl font-bold">لوحة الإدارة</h1>
           <p className="text-gray-400 mt-2">يرجى إدخال رمز الدخول (PIN Code) الخاص بك</p>
        </div>

        <AnimatePresence>
           {errorMsg && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mb-6 bg-red-500/10 border border-red-500/50 p-4 rounded-lg flex items-center gap-3 text-red-400 text-sm overflow-hidden">
                 <AlertCircle size={18} />
                 {errorMsg}
              </motion.div>
           )}
        </AnimatePresence>

        <form onSubmit={handleLogin} className="space-y-5">
           <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">رمز الدخول السرّي</label>
              <input 
                type="password" 
                required 
                value={pin} 
                onChange={e => setPin(e.target.value)} 
                className="w-full bg-coastal-darkest border border-coastal-DEFAULT rounded-xl px-4 py-4 focus:outline-none focus:border-coastal-light transition-colors text-center text-3xl font-mono tracking-widest shadow-inner placeholder:text-sm placeholder:tracking-normal placeholder:font-sans placeholder:opacity-40" 
                dir="ltr" 
                placeholder="••••"
                maxLength={4}
                autoFocus
              />
           </div>
           
           <button type="submit" disabled={loading || pin.length < 4} className="w-full bg-coastal hover:bg-coastal-light text-white py-3.5 rounded-xl font-bold transition-all shadow-lg flex items-center justify-center gap-2 mt-4 disabled:opacity-50 border border-coastal-light/30">
              {loading ? <Loader2 className="animate-spin" size={20} /> : "تسجيل الدخول"}
           </button>
        </form>
      </motion.div>
    </div>
  );
}
