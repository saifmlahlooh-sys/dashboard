"use client";

import { useEffect, useState, FormEvent, useRef } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import {
  Plus,
  Globe,
  Loader2,
  Calendar,
  Key,
  Copy,
  Check,
  ChevronLeft,
  FolderOpen,
} from "lucide-react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { supabase } from "@/lib/supabase";
import toast, { Toaster } from "react-hot-toast";
import Link from "next/link";

/* ── Types ── */
type Website = {
  id: string;
  name: string;
  api_key: string;
  created_at: string;
};

/* ── Animation variants ── */
const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
  },
};

/* ── Skeleton card ── */
function SkeletonCard() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/[0.05] bg-white/[0.02] p-6 min-h-[220px] animate-pulse">
      <div className="flex justify-between items-start mb-5">
        <div className="h-5 w-2/3 bg-white/5 rounded-lg" />
        <div className="h-8 w-8 bg-white/5 rounded-lg" />
      </div>
      <div className="h-3 w-1/4 bg-white/[0.03] rounded mb-2" />
      <div className="h-3 w-1/3 bg-white/[0.03] rounded mb-8" />
      <div className="mt-auto h-11 w-full bg-white/[0.03] rounded-xl" />
    </div>
  );
}

/* ── Project card ── */
function ProjectCard({
  site,
  idx,
  copiedId,
  onCopy,
}: {
  site: Website;
  idx: number;
  copiedId: string | null;
  onCopy: (id: string, key: string) => void;
}) {
  const formatDate = (ds: string) =>
    new Intl.DateTimeFormat("ar-EG", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(ds));

  return (
    <motion.div
      variants={cardVariants}
      whileHover={{
        y: -8,
        scale: 1.025,
        boxShadow:
          "0 0 40px rgba(255,255,255,0.04), 0 25px 60px rgba(0,0,0,0.7)",
        transition: { duration: 0.3, ease: "easeOut" },
      }}
      className="group relative overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.025] backdrop-blur-sm flex flex-col justify-between min-h-[220px] cursor-pointer"
    >
      {/* Animated gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      {/* Top accent line */}
      <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Corner glow */}
      <div
        className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at top right, rgba(255,255,255,0.06), transparent 70%)",
        }}
      />

      <Link href={`/projects/${site.id}`} className="flex flex-col h-full p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-3 relative z-10">
          <h3
            className="text-lg font-bold text-white/90 leading-tight group-hover:text-white transition-colors duration-300 flex-1 ml-2"
            dir="auto"
          >
            {site.name}
          </h3>
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">
            <Globe size={16} className="text-emerald-400" />
          </div>
        </div>

        {/* Status badge */}
        <div className="flex items-center gap-2 mb-4 relative z-10">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]" />
          <span className="text-[10px] font-mono text-emerald-500 uppercase tracking-widest">
            نشط
          </span>
        </div>

        {/* Date */}
        <div className="flex items-center gap-2 text-gray-600 text-xs font-mono mb-5 relative z-10">
          <Calendar size={12} />
          <span>{site.created_at ? formatDate(site.created_at) : "—"}</span>
        </div>

        {/* API Key row */}
        <div className="mt-auto relative z-10">
          <div className="flex items-center justify-between bg-black/40 border border-white/[0.06] rounded-xl px-3.5 py-2.5 gap-3 group-hover:border-white/10 transition-colors duration-300">
            <div className="flex items-center gap-2 overflow-hidden">
              <Key size={13} className="text-gray-600 shrink-0" />
              <span
                className="text-[11px] text-gray-600 font-mono truncate"
                dir="ltr"
              >
                {site.api_key ? `${site.api_key.slice(0, 14)}•••` : "—"}
              </span>
            </div>
            {site.api_key && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onCopy(site.id, site.api_key);
                }}
                className="p-1.5 rounded-lg hover:bg-white/5 text-gray-600 hover:text-gray-300 transition-colors shrink-0"
              >
                {copiedId === site.id ? (
                  <Check size={13} className="text-emerald-400" />
                ) : (
                  <Copy size={13} />
                )}
              </button>
            )}
          </div>
        </div>

        {/* View details hint */}
        <div className="mt-3 flex items-center gap-1 text-gray-700 group-hover:text-gray-400 text-[11px] font-mono transition-colors duration-300 relative z-10">
          <ChevronLeft size={11} />
          <span>عرض التفاصيل</span>
        </div>
      </Link>
    </motion.div>
  );
}

/* ── Main page ── */
export default function ProjectsPage() {
  const [websites, setWebsites] = useState<Website[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const gridRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(gridRef, { once: true, amount: 0.1 });

  useEffect(() => {
    fetchWebsites();
  }, []);

  const fetchWebsites = async () => {
    try {
      setLoading(true);
      if (!supabase) {
        toast.error("Supabase not configured");
        return;
      }
      const { data, error } = await supabase
        .from("websites")
        .select("id, name, api_key, created_at")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setWebsites(data as Website[]);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to fetch websites";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddWebsite = async (e: FormEvent) => {
    e.preventDefault();
    const trimmed = newName.trim();
    if (!trimmed) {
      toast.error("اسم المشروع مطلوب");
      return;
    }
    try {
      setIsSubmitting(true);
      if (!supabase) {
        toast.error("Supabase not configured");
        return;
      }
      const { data, error } = await supabase
        .from("websites")
        .insert([{ name: trimmed }])
        .select("id, name, api_key, created_at")
        .single();

      if (error) throw error;
      setWebsites((prev) => [data as Website, ...prev]);
      toast.success("تم إضافة المشروع بنجاح ✨");
      setNewName("");
      setShowAddForm(false);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "خطأ في إضافة المشروع";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyApiKey = (id: string, key: string) => {
    navigator.clipboard.writeText(key);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
    toast.success("تم نسخ مفتاح API");
  };

  return (
    <DashboardLayout>
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: "#111",
            color: "#fff",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "12px",
            fontSize: "14px",
          },
        }}
      />

      <div className="space-y-8 max-w-6xl mx-auto">
        {/* ── Page Header ── */}
        <div className="flex justify-between items-end">
          <div>
            <p className="text-[10px] font-mono text-gray-600 uppercase tracking-[0.3em] mb-3">
              المشاريع
            </p>
            <h2 className="text-3xl font-bold text-white tracking-tight mb-1">
              مركز المشاريع
            </h2>
            <p className="text-gray-500 text-sm">
              إدارة وعرض المشاريع المتصلة بقاعدة البيانات
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-2 bg-white hover:bg-gray-100 text-black px-5 py-2.5 rounded-xl text-sm font-bold transition-colors shadow-lg"
          >
            <motion.span
              animate={{ rotate: showAddForm ? 45 : 0 }}
              transition={{ duration: 0.2 }}
              className="inline-block"
            >
              <Plus size={16} />
            </motion.span>
            {showAddForm ? "إلغاء" : "إضافة مشروع"}
          </motion.button>
        </div>

        {/* ── Add Project Form ── */}
        <AnimatePresence>
          {showAddForm && (
            <motion.form
              initial={{ opacity: 0, height: 0, y: -10 }}
              animate={{ opacity: 1, height: "auto", y: 0 }}
              exit={{ opacity: 0, height: 0, y: -10, overflow: "hidden" }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              onSubmit={handleAddWebsite}
              className="border border-white/[0.07] bg-white/[0.02] rounded-2xl p-6 backdrop-blur-sm overflow-hidden"
            >
              <h3 className="text-base font-bold text-white mb-5 flex items-center gap-2">
                <FolderOpen size={16} className="text-gray-400" />
                مشروع جديد
              </h3>
              <div className="mb-5">
                <label className="block text-[10px] font-mono text-gray-600 uppercase tracking-[0.2em] mb-2">
                  اسم المشروع
                </label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="مثال: مدرسة المفرق الأساسية..."
                  className="w-full bg-black/50 border border-white/[0.07] rounded-xl px-4 py-3 text-white text-sm placeholder-gray-700 focus:outline-none focus:border-white/20 transition-colors"
                  dir="auto"
                  autoFocus
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-white hover:bg-gray-100 text-black px-6 py-2.5 rounded-xl text-sm font-bold transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <Loader2 size={15} className="animate-spin" />
                  ) : (
                    <Plus size={15} />
                  )}
                  نشر المشروع
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        {/* ── Cards Grid ── */}
        <div ref={gridRef}>
          {loading ? (
            /* Skeleton state */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {[1, 2, 3].map((n) => (
                <SkeletonCard key={n} />
              ))}
            </div>
          ) : websites.length === 0 ? (
            /* Empty state */
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-24 border border-dashed border-white/[0.06] rounded-2xl text-center"
            >
              <div className="w-16 h-16 bg-white/[0.03] border border-white/[0.06] rounded-2xl flex items-center justify-center mb-5">
                <FolderOpen size={28} className="text-gray-700" />
              </div>
              <p className="text-white font-semibold mb-2">لا توجد مشاريع بعد</p>
              <p className="text-gray-600 text-sm mb-6">
                ابدأ بإضافة أول مشروع إلى قاعدة البيانات
              </p>
              <button
                onClick={() => setShowAddForm(true)}
                className="text-sm font-semibold text-white border border-white/10 px-5 py-2 rounded-full hover:bg-white/5 transition-all"
              >
                إضافة مشروع ←
              </button>
            </motion.div>
          ) : (
            /* Projects grid */
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
            >
              {websites.map((site, idx) => (
                <ProjectCard
                  key={site.id}
                  site={site}
                  idx={idx}
                  copiedId={copiedId}
                  onCopy={copyApiKey}
                />
              ))}
            </motion.div>
          )}
        </div>

        {/* Project count footer */}
        {!loading && websites.length > 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-[11px] font-mono text-gray-700 text-left"
            dir="ltr"
          >
            {websites.length} project{websites.length !== 1 ? "s" : ""} synced
            from Supabase
          </motion.p>
        )}
      </div>
    </DashboardLayout>
  );
}
