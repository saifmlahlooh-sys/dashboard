"use client";

import { useEffect } from "react";
import { AlertCircle, RefreshCcw } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";

export default function ProjectsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Projects routing/fetching error:", error);
  }, [error]);

  return (
    <DashboardLayout>
      <div className="flex flex-col items-center justify-center py-24 text-center min-h-[500px]">
        <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 flex items-center justify-center rounded-2xl mx-auto mb-6">
           <AlertCircle className="text-red-500" size={32} />
        </div>
        
        <h2 className="text-2xl font-bold text-white mb-3">خطأ في جلب بيانات المشاريع</h2>
        <p className="text-zinc-400 max-w-sm mx-auto text-sm mb-8 leading-relaxed">
          {error.message && error.message !== "Failed to fetch" 
            ? error.message 
            : "فشل الاتصال بقاعدة البيانات. يرجى التحقق من إعدادات Supabase الخاصة بك وحالة الشبكة."}
        </p>

        <button
          onClick={() => reset()}
          className="flex items-center gap-2 px-6 py-3 bg-white hover:bg-gray-100 text-black font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:scale-105"
        >
          <RefreshCcw size={16} />
          إعادة المحاولة
        </button>
      </div>
    </DashboardLayout>
  );
}
