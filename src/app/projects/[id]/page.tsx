"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
import { ArrowRight, Globe, Key, Hash, Calendar, Copy, Check, Loader2, Users, UserCircle } from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import toast, { Toaster } from "react-hot-toast";
import Link from "next/link";

type Website = {
  id: string;
  name: string;
  api_key: string;
  created_at: string;
};

type SiteUser = {
  id: string;
  name: string | null;
  email: string | null;
  role: string | null;
  created_at: string;
};

export default function ProjectDetailPage() {
  const params = useParams();
  const projectId = typeof params.id === "string" ? params.id : "";

  const [site, setSite] = useState<Website | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [siteUsers, setSiteUsers] = useState<SiteUser[]>([]);
  const [usersLoading, setUsersLoading] = useState(true);

  useEffect(() => {
    if (projectId) {
      fetchSite();
      fetchSiteUsers();
    }
  }, [projectId]);

  const fetchSite = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!supabase) {
        setError("Supabase client is not configured.");
        return;
      }

      const { data, error: dbError } = await supabase
        .from("websites")
        .select("id, name, api_key, created_at")
        .eq("id", projectId)
        .single();

      if (dbError) throw dbError;

      setSite(data as Website);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to load project";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const fetchSiteUsers = async () => {
    try {
      setUsersLoading(true);
      if (!supabase) return;

      // NOTE: The foreign key column linking site_users to websites is assumed
      // to be "website_id". If your column is named differently (e.g. "site_id"),
      // change the string below.
      const { data, error: dbError } = await supabase
        .from("site_users")
        .select("id, name, email, role, created_at")
        .eq("website_id", projectId)
        .order("created_at", { ascending: false });

      if (dbError) throw dbError;

      setSiteUsers(data as SiteUser[]);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to load users";
      console.warn("site_users fetch:", message);
    } finally {
      setUsersLoading(false);
    }
  };

  const copyToClipboard = (field: string, value: string) => {
    navigator.clipboard.writeText(value);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
    toast.success("تم النسخ");
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("ar-EG", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZoneName: "short",
    }).format(date);
  };

  return (
    <DashboardLayout>
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: "#18181b",
            color: "#fff",
            border: "1px solid #27272a",
          },
        }}
      />

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Back Navigation */}
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors font-mono text-sm group"
        >
          <ArrowRight
            size={16}
            className="group-hover:translate-x-1 transition-transform"
          />
          العودة للمشاريع
        </Link>

        {/* Loading Skeleton */}
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            {/* Title skeleton */}
            <div className="bg-zinc-950 border border-zinc-900 rounded-xl p-8 animate-pulse">
              <div className="h-8 w-2/3 bg-zinc-800 rounded mb-4" />
              <div className="h-4 w-1/3 bg-zinc-800 rounded" />
            </div>
            {/* Fields skeleton */}
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="bg-zinc-950 border border-zinc-900 rounded-xl p-6 animate-pulse"
              >
                <div className="h-3 w-20 bg-zinc-800 rounded mb-4" />
                <div className="h-12 w-full bg-zinc-900 rounded-lg" />
              </div>
            ))}
          </motion.div>
        )}

        {/* Error State */}
        {!loading && error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-950/30 border border-red-900/50 rounded-xl p-8 text-center"
          >
            <p className="text-red-400 font-mono text-lg mb-2">ERROR</p>
            <p className="text-zinc-400">{error}</p>
            <Link
              href="/projects"
              className="mt-6 inline-block text-sm text-white bg-zinc-800 hover:bg-zinc-700 px-6 py-2 rounded-lg font-mono transition-colors"
            >
              ← العودة
            </Link>
          </motion.div>
        )}

        {/* Project Detail */}
        {!loading && site && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            {/* Header Card */}
            <div className="bg-zinc-950 border border-zinc-900 rounded-xl p-8 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-l from-emerald-950/10 via-transparent to-transparent pointer-events-none" />
              <div className="relative z-10 flex items-start justify-between">
                <div>
                  <h1
                    className="text-3xl font-bold text-white mb-3 leading-tight"
                    dir="auto"
                  >
                    {site.name}
                  </h1>
                  <div className="flex items-center gap-3">
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981]" />
                    <span className="text-sm text-emerald-400 font-mono uppercase tracking-widest">
                      ACTIVE
                    </span>
                  </div>
                </div>
                <div className="w-14 h-14 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                  <Globe size={28} className="text-emerald-500" />
                </div>
              </div>
            </div>

            {/* Data Fields */}
            <div className="grid grid-cols-1 gap-5">
              {/* Project ID */}
              <DataField
                label="PROJECT_ID"
                icon={<Hash size={16} className="text-zinc-500" />}
                value={site.id}
                dir="ltr"
                onCopy={() => copyToClipboard("id", site.id)}
                copied={copiedField === "id"}
              />

              {/* API Key */}
              <DataField
                label="API_KEY"
                icon={<Key size={16} className="text-amber-500" />}
                value={site.api_key || "—"}
                dir="ltr"
                onCopy={
                  site.api_key
                    ? () => copyToClipboard("api_key", site.api_key)
                    : undefined
                }
                copied={copiedField === "api_key"}
                sensitive
              />

              {/* Created At */}
              <div className="bg-zinc-950 border border-zinc-900 rounded-xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Calendar size={16} className="text-blue-400" />
                  <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest">
                    CREATED_AT
                  </span>
                </div>
                <div className="bg-black border border-zinc-800 rounded-lg px-4 py-3 font-mono text-sm text-zinc-300" dir="auto">
                  {formatDateTime(site.created_at)}
                </div>
                <div className="mt-2 text-xs font-mono text-zinc-600" dir="ltr">
                  RAW: {site.created_at}
                </div>
              </div>
            </div>

            {/* Quick Copy Bar */}
            <div className="bg-zinc-950 border border-zinc-900 rounded-xl p-5">
              <h3 className="text-xs font-mono text-zinc-500 uppercase tracking-widest mb-4">
                QUICK_ACTIONS
              </h3>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => copyToClipboard("id", site.id)}
                  className="bg-black border border-zinc-800 hover:border-zinc-600 text-zinc-300 hover:text-white px-4 py-2.5 rounded-lg font-mono text-xs transition-all flex items-center gap-2"
                >
                  <Hash size={14} />
                  نسخ المعرّف
                  {copiedField === "id" && (
                    <Check size={14} className="text-emerald-500" />
                  )}
                </button>
                {site.api_key && (
                  <button
                    onClick={() =>
                      copyToClipboard("api_key", site.api_key)
                    }
                    className="bg-black border border-zinc-800 hover:border-zinc-600 text-zinc-300 hover:text-white px-4 py-2.5 rounded-lg font-mono text-xs transition-all flex items-center gap-2"
                  >
                    <Key size={14} />
                    نسخ مفتاح API
                    {copiedField === "api_key" && (
                      <Check size={14} className="text-emerald-500" />
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* ── Site Users Section ── */}
            <div className="bg-zinc-950 border border-zinc-900 rounded-xl overflow-hidden">
              <div className="px-6 py-5 border-b border-zinc-900 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Users size={18} className="text-blue-400" />
                  <h3 className="text-sm font-mono text-zinc-300 uppercase tracking-widest">
                    SITE_USERS
                  </h3>
                </div>
                <span className="text-xs font-mono text-zinc-600 bg-zinc-900 px-3 py-1 rounded-full border border-zinc-800">
                  {usersLoading ? "..." : siteUsers.length}
                </span>
              </div>

              {usersLoading ? (
                <div className="p-6 space-y-3">
                  {[1, 2, 3].map((n) => (
                    <div key={n} className="flex items-center gap-4 animate-pulse">
                      <div className="h-10 w-10 bg-zinc-800 rounded-full shrink-0" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 w-1/3 bg-zinc-800 rounded" />
                        <div className="h-3 w-1/2 bg-zinc-900 rounded" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : siteUsers.length === 0 ? (
                <div className="py-16 px-6 text-center">
                  <UserCircle size={48} className="text-zinc-800 mx-auto mb-4" />
                  <p className="text-zinc-500 font-medium mb-1">
                    لا يوجد مستخدمين مسجلين في هذا الموقع حتى الآن
                  </p>
                  <p className="text-zinc-600 text-xs font-mono">
                    NO_USERS_REGISTERED
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-zinc-900">
                  {/* Table Header */}
                  <div className="grid grid-cols-12 gap-4 px-6 py-3 text-xs font-mono text-zinc-600 uppercase tracking-widest bg-zinc-900/30">
                    <div className="col-span-1">#</div>
                    <div className="col-span-4">المستخدم</div>
                    <div className="col-span-3">الصلاحية</div>
                    <div className="col-span-4">تاريخ الانضمام</div>
                  </div>

                  {/* Table Rows */}
                  {siteUsers.map((user, idx) => (
                    <div
                      key={user.id}
                      className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-zinc-900/30 transition-colors"
                    >
                      <div className="col-span-1 text-xs font-mono text-zinc-600">
                        {idx + 1}
                      </div>
                      <div className="col-span-4 flex items-center gap-3 overflow-hidden">
                        <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center shrink-0">
                          <span className="text-xs font-bold text-zinc-400">
                            {(user.name || user.email || "?").charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="overflow-hidden">
                          <p className="text-sm text-white truncate" dir="auto">
                            {user.name || "—"}
                          </p>
                          <p className="text-xs text-zinc-500 font-mono truncate" dir="ltr">
                            {user.email || "—"}
                          </p>
                        </div>
                      </div>
                      <div className="col-span-3">
                        <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-zinc-900 text-zinc-400 border border-zinc-800">
                          {user.role || "user"}
                        </span>
                      </div>
                      <div className="col-span-4 text-xs text-zinc-500 font-mono" dir="ltr">
                        {user.created_at
                          ? new Intl.DateTimeFormat("ar-EG", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            }).format(new Date(user.created_at))
                          : "—"}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  );
}

/* ── Reusable Data Field Component ─── */
function DataField({
  label,
  icon,
  value,
  dir,
  onCopy,
  copied,
  sensitive,
}: {
  label: string;
  icon: React.ReactNode;
  value: string;
  dir: "ltr" | "rtl" | "auto";
  onCopy?: () => void;
  copied: boolean;
  sensitive?: boolean;
}) {
  const [revealed, setRevealed] = useState(!sensitive);

  return (
    <div className="bg-zinc-950 border border-zinc-900 rounded-xl p-6">
      <div className="flex items-center gap-2 mb-4">
        {icon}
        <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest">
          {label}
        </span>
      </div>
      <div className="flex items-center gap-3">
        <div
          className="flex-1 bg-black border border-zinc-800 rounded-lg px-4 py-3 font-mono text-sm text-zinc-300 overflow-x-auto select-all"
          dir={dir}
        >
          {sensitive && !revealed
            ? "•".repeat(Math.min(value.length, 40))
            : value}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {sensitive && (
            <button
              onClick={() => setRevealed(!revealed)}
              className="p-2 rounded-md bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors text-xs font-mono"
            >
              {revealed ? "إخفاء" : "عرض"}
            </button>
          )}
          {onCopy && (
            <button
              onClick={onCopy}
              className="p-2 rounded-md bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
            >
              {copied ? (
                <Check size={16} className="text-emerald-500" />
              ) : (
                <Copy size={16} />
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
