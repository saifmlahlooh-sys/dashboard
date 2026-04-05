"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertCircle, RefreshCcw, Home } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Global application error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6" dir="rtl" style={{ fontFamily: "'Cairo', 'Tajawal', system-ui, sans-serif" }}>
      <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-8 max-w-md w-full text-center shadow-2xl relative overflow-hidden">
        
        {/* Glow effect */}
        <div className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-red-500/20 blur-3xl rounded-full pointer-events-none" />

        <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6 relative z-10">
          <AlertCircle className="text-red-500" size={32} />
        </div>
        
        <h2 className="text-2xl font-bold mb-3 tracking-tight">حدث خطأ غير متوقع</h2>
        <p className="text-zinc-400 text-sm mb-8 leading-relaxed">
          نعتذر، واجهنا مشكلة أثناء محاولة تحميل هذه الصفحة. {error.message ? `(${error.message})` : "يرجى المحاولة مرة أخرى لاحقاً."}
        </p>

        <div className="flex flex-col gap-3 relative z-10">
          <button
            onClick={() => reset()}
            className="w-full flex items-center justify-center gap-2 bg-white text-black font-bold py-3.5 px-4 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <RefreshCcw size={18} />
            إعادة المحاولة
          </button>
          
          <Link
            href="/dashboard"
            className="w-full flex items-center justify-center gap-2 border border-zinc-800 bg-zinc-900/50 text-white font-medium py-3.5 px-4 rounded-xl hover:bg-zinc-900 transition-colors"
          >
            <Home size={18} className="text-zinc-400" />
            العودة للوحة المركزية
          </Link>
        </div>
      </div>
    </div>
  );
}
