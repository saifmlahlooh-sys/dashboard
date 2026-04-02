"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import DashboardLayout from "@/components/DashboardLayout";
import { Globe, Plus, Loader2, Link as LinkIcon, Edit } from "lucide-react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

type Website = {
  id: string;
  name: string;
  api_key?: string;
  created_at?: string;
};

export default function SitesPage() {
  const [websites, setWebsites] = useState<Website[]>([]);
  const [loading, setLoading] = useState(true);
  const [dbError, setDbError] = useState<string | null>(null);

  useEffect(() => {
    if (!supabase) {
      setDbError("متغيرات البيئة الخاصة بـ Supabase غير صحيحة.");
      setLoading(false);
      return;
    }
    fetchWebsites();
  }, []);

  const fetchWebsites = async () => {
    if (!supabase) return;
    try {
      setLoading(true);
      const { data, error } = await supabase.from("websites").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      if (data) setWebsites(data);
    } catch (err: unknown) {
      console.error("Error fetching websites:", err);
      // Suppress specific error details depending on what goes wrong, just generic
      setDbError(err instanceof Error ? err.message : "حدث خطأ غير متوقع أثناء الجلب من قاعدة البيانات");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">المواقع</h2>
          <button className="bg-coastal hover:bg-coastal-light text-white px-4 py-2 rounded-lg font-bold transition-colors shadow flex items-center gap-2">
            <Plus size={18} />
            إضافة موقع
          </button>
        </div>

        {dbError && (
          <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400">
            {dbError}
          </div>
        )}

        {loading ? (
          <div className="flex h-64 items-center justify-center text-coastal-light">
            <Loader2 className="animate-spin" size={40} />
          </div>
        ) : websites.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-center justify-center p-20 bg-coastal-dark rounded-xl border border-coastal-DEFAULT shadow-lg text-center"
          >
            <div className="w-16 h-16 bg-coastal/30 flex items-center justify-center rounded-full mb-6">
              <Globe size={32} className="text-coastal-light" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">لا توجد مواقع حالياً</h3>
            <p className="text-gray-400 mb-8 max-w-md">لم تقم بإضافة أي مواقع حتى الآن. ابدأ بإضافة موقع جديد لإدارته من لوحة التحكم.</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {websites.map((website) => (
              <Link key={website.id} href={`/sites/${website.id}`}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-coastal-dark border border-coastal-DEFAULT rounded-xl p-6 shadow-sm hover:border-coastal-light transition-colors group cursor-pointer h-full"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 bg-coastal/30 flex items-center justify-center rounded-lg text-coastal-light group-hover:bg-coastal group-hover:text-white transition-colors">
                      <Globe size={24} />
                    </div>
                    <button className="text-gray-400 hover:text-white transition-colors p-2 bg-coastal-darkest rounded-lg">
                      <Edit size={16} />
                    </button>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-1">{website.name}</h3>
                  <div className="text-sm text-gray-400 mb-4 flex items-center gap-2">
                    <LinkIcon size={14} />
                    ID: {website.id.slice(0, 8)}...
                  </div>
                  {website.api_key && (
                    <div className="mt-4 pt-4 border-t border-coastal-DEFAULT">
                      <span className="text-xs text-gray-500 block mb-1">API Key</span>
                      <code className="text-xs px-2 py-1 bg-coastal-darkest rounded border border-coastal-DEFAULT text-coastal-light font-mono block truncate" dir="ltr">
                        {website.api_key}
                      </code>
                    </div>
                  )}
                </motion.div>
              </Link>
            ))}
          </div>
        )}
      </motion.div>
    </DashboardLayout>
  );
}
