"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { supabase } from "@/lib/supabase";
import { Users, LogIn, Eye, Edit, Trash2, Key, Save, Type, Image as ImageIcon, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function WebsiteDetailsPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [website, setWebsite] = useState<any>(null);
  const [siteData, setSiteData] = useState<any>({});
  const [siteUsers, setSiteUsers] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Form State
  const [welcomeText, setWelcomeText] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [showAds, setShowAds] = useState(true);
  const [savingField, setSavingField] = useState<string | null>(null);
  const [dbError, setDbError] = useState<string | null>(null);

  useEffect(() => {
    setIsMounted(true);
    if (!supabase) {
      setDbError("متغيرات البيئة (Environment Variables) الخاصة بـ Supabase غير صحيحة. يرجى مراجعة ملف .env.local والتحقق من الروابط والمفاتيح.");
      setLoading(false);
      return;
    }
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    if (!supabase) return;
    try {
      setLoading(true);
      const { data: websites, error: siteError } = await supabase.from("websites").select("*").limit(1);
      
      if (siteError) throw siteError;

      if (websites && websites.length > 0) {
        const site = websites[0];
        setWebsite(site);

        const { data: kvData } = await supabase.from("site_data").select("*").eq("website_id", site.id);
        if (kvData) {
          const mapped: any = {};
          kvData.forEach((row: any) => mapped[row.key_name] = row);
          setSiteData(mapped);
          setWelcomeText(mapped["welcome_text"]?.value || "");
          setLogoUrl(mapped["logo_url"]?.value || "");
          setShowAds(mapped["show_ads"]?.value === "true");
        }

        const { data: usersData } = await supabase.from("site_users").select("*").eq("website_id", site.id).order('created_at', { ascending: false });
        if (usersData) setSiteUsers(usersData);

        const { data: analyticsData } = await supabase.from("analytics").select("*").eq("website_id", site.id).single();
        if (analyticsData) setAnalytics(analyticsData);
      }
    } catch (err: any) {
      console.error("Supabase Error:", err);
      setDbError("حدث خطأ في الاتصال بقاعدة البيانات. تأكد من أنك قمت بإنشاء الجداول (SQL).");
    } finally {
      setLoading(false);
    }
  };

  const createTestWebsite = async () => {
    if (!supabase) return;
    try {
      setLoading(true);
      const { data: siteObj, error } = await supabase.from("websites").insert([{ name: "مدرسة النور" }]).select().single();
      
      if (error) throw error;
      
      if (siteObj) {
        await supabase.from("site_data").insert([
          { website_id: siteObj.id, key_name: "welcome_text", value: "مرحباً بكم في مدرسة النور" },
          { website_id: siteObj.id, key_name: "logo_url", value: "https://example.com/logo.png" },
          { website_id: siteObj.id, key_name: "show_ads", value: "true" },
        ]);
        await supabase.from("analytics").insert([{ website_id: siteObj.id, total_visitors: 4289, total_logins: 1842 }]);
        await supabase.from("site_users").insert([
          { website_id: siteObj.id, username: "ahmed_ali", email: "ahmed@school.edu", school_id: "SCH-101", status: "نشط" },
          { website_id: siteObj.id, username: "sara_khalid", email: "sara@school.edu", school_id: "SCH-102", status: "نشط" },
        ]);
        await fetchDashboardData();
      }
    } catch (err) {
      console.error("Supabase Error (Test Site):", err);
      setDbError("فشل إنشاء الموقع التجريبي في قاعدة البيانات.");
      setLoading(false);
    }
  };

  const updateSiteData = async (key_name: string, value: string) => {
    if (!website || !supabase) return;
    setSavingField(key_name);
    try {
      const existing = siteData[key_name];
      if (existing) {
         await supabase.from("site_data").update({ value }).eq("id", existing.id);
      } else {
         await supabase.from("site_data").insert({ website_id: website.id, key_name, value });
      }
      await fetchDashboardData();
    } catch (err) {
      console.error("Data Update Error:", err);
    } finally {
      setSavingField(null);
    }
  };

  const deleteUser = async (userId: string) => {
    if (!supabase) return;
    if (window.confirm("هل أنت متأكد من الحذف؟")) {
      try {
        await supabase.from("site_users").delete().eq("id", userId);
        await fetchDashboardData();
      } catch (err) {
        console.error("Delete Error:", err);
      }
    }
  };

  // HYDRATION FIX
  if (!isMounted) return null;

  // DB CONTEXT ERROR
  if (dbError) {
    return (
      <DashboardLayout>
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }} 
          animate={{ opacity: 1, scale: 1 }} 
          transition={{ duration: 0.3 }}
          className="flex flex-col items-center justify-center p-20 bg-coastal-dark rounded-xl border border-red-500/50 shadow-lg text-center"
        >
          <h2 className="text-3xl font-bold text-red-400 mb-4">يوجد خطأ في النظام</h2>
          <p className="text-gray-300 mb-8 max-w-lg leading-relaxed">{dbError}</p>
        </motion.div>
      </DashboardLayout>
    );
  }

  // LOADING 
  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex h-[60vh] items-center justify-center text-coastal-light">
          <Loader2 className="animate-spin" size={48} />
        </div>
      </DashboardLayout>
    );
  }

  // EMPTY STATE
  if (!website) {
    return (
      <DashboardLayout>
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.4 }}
          className="flex flex-col items-center justify-center p-20 bg-coastal-dark rounded-xl border border-coastal-DEFAULT/50 shadow-lg text-center"
        >
          <h2 className="text-3xl font-bold text-white mb-4">قاعدة البيانات جاهزة!</h2>
          <p className="text-gray-300 mb-8 max-w-lg leading-relaxed">لم يتم العثور على أي مواقع (Websites) في قاعدة البيانات (Supabase). يمكنك توليد بيانات وهمية تلقائياً لاختبار لوحة التحكم فوراً.</p>
          <button 
            onClick={createTestWebsite} 
            className="bg-coastal-DEFAULT hover:bg-coastal-light border border-coastal-light/30 text-white px-8 py-4 rounded-xl font-bold transition-all shadow-lg hover:shadow-coastal-DEFAULT/20 flex flex-col items-center gap-2 group"
          >
            <span className="text-lg">توليد موقع (مدرسة النور)</span>
            <span className="text-xs text-blue-200 font-normal group-hover:text-white transition-colors">سيتم حقن الجداول الوهمية في Supabase</span>
          </button>
        </motion.div>
      </DashboardLayout>
    );
  }

  // MAIN DASHBOARD
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
          <h2 className="text-2xl font-bold text-white">تفاصيل الموقع: {website?.name}</h2>
          <div className="flex items-center gap-3">
             <span className="text-sm font-medium text-gray-400">مفتاح الربط (API Key):</span>
             <code className="text-sm px-4 py-2 bg-coastal-darkest rounded-lg border border-coastal-DEFAULT text-coastal-light font-mono select-all" dir="ltr">
               {website?.api_key}
             </code>
          </div>
        </div>

        {/* Top Section: KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: "عدد الزوار", value: analytics?.total_visitors?.toLocaleString() || 0, icon: <Eye size={24} /> },
            { label: "عمليات تسجيل الدخول", value: analytics?.total_logins?.toLocaleString() || 0, icon: <LogIn size={24} /> },
            { label: "إجمالي المستخدمين", value: siteUsers.length || 0, icon: <Users size={24} /> }
          ].map((stat, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }} 
              transition={{ delay: 0.2 + (i * 0.1), duration: 0.4 }}
              className="bg-coastal-dark border border-coastal-DEFAULT p-6 rounded-xl shadow-sm flex items-center justify-between group hover:border-coastal-light transition-colors"
            >
              <div>
                <p className="text-coastal-light text-sm font-medium mb-1">{stat.label}</p>
                <h3 className="text-3xl font-bold text-white">{stat.value}</h3>
              </div>
              <div className="w-12 h-12 bg-coastal/30 rounded-full flex items-center justify-center text-coastal-light group-hover:text-white group-hover:bg-coastal transition-all">
                {stat.icon}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Middle Section: Controls */}
        <div className="bg-coastal-dark border border-coastal-DEFAULT rounded-xl p-6 shadow-sm">
          <h3 className="text-xl font-bold text-white mb-6">إعدادات الموقع (المحتوى الديناميكي)</h3>
          
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Dynamic Text */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                  <Type size={16} className="text-coastal-light" />
                  نص الترحيب
                </label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={welcomeText}
                    onChange={(e) => setWelcomeText(e.target.value)}
                    className="flex-1 bg-coastal-darkest border border-coastal-DEFAULT rounded-lg px-4 py-2 text-white focus:outline-none focus:border-coastal-light transition-colors"
                  />
                  <button 
                    onClick={() => updateSiteData("welcome_text", welcomeText)}
                    disabled={savingField === "welcome_text"}
                    className="bg-coastal hover:bg-coastal-light text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50"
                  >
                    {savingField === "welcome_text" ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                    حفظ
                  </button>
                </div>
              </div>

              {/* Logo URL */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                  <ImageIcon size={16} className="text-coastal-light" />
                  رابط الشعار (Logo URL)
                </label>
                <div className="flex gap-2">
                  <input 
                    type="url" 
                    value={logoUrl}
                    onChange={(e) => setLogoUrl(e.target.value)}
                    className="flex-1 bg-coastal-darkest border border-coastal-DEFAULT rounded-lg px-4 py-2 text-white focus:outline-none focus:border-coastal-light text-left transition-colors" dir="ltr"
                  />
                  <button 
                    onClick={() => updateSiteData("logo_url", logoUrl)}
                    disabled={savingField === "logo_url"}
                    className="bg-coastal hover:bg-coastal-light text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50"
                  >
                    {savingField === "logo_url" ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                    حفظ
                  </button>
                </div>
              </div>
            </div>

            {/* Feature Toggles */}
            <div className="pt-6 border-t border-coastal-DEFAULT mt-6">
              <div className="flex items-center justify-between bg-coastal-darkest p-4 rounded-lg border border-coastal-DEFAULT/50 hover:border-coastal-DEFAULT transition-colors">
                <div>
                  <h4 className="font-semibold text-white">إظهار الإعلانات</h4>
                  <p className="text-sm text-gray-400 mt-1">تفعيل أو تعطيل قسم الإعلانات في الصفحة الرئيسية للموقع</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer scale-110">
                  <input 
                    type="checkbox" 
                    checked={showAds} 
                    onChange={(e) => {
                      setShowAds(e.target.checked);
                      updateSiteData("show_ads", String(e.target.checked));
                    }}
                    className="sr-only peer" 
                  />
                  <div className="w-11 h-6 bg-coastal border border-coastal-DEFAULT rounded-full peer peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-coastal-light"></div>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section: Users Table */}
        <div className="bg-coastal-dark border border-coastal-DEFAULT rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-coastal-DEFAULT flex justify-between items-center bg-coastal-dark/50">
            <h3 className="text-xl font-bold text-white">مستخدمي الموقع</h3>
            <button className="bg-coastal hover:bg-coastal-light text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              إضافة مستخدم
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-right">
              <thead className="bg-coastal-darkest/80 text-coastal-light text-sm border-b border-coastal-DEFAULT">
                <tr>
                  <th className="px-6 py-4 font-semibold">اسم المستخدم</th>
                  <th className="px-6 py-4 font-semibold">البريد الإلكتروني</th>
                  <th className="px-6 py-4 font-semibold">رقم المدرسة (ID)</th>
                  <th className="px-6 py-4 font-semibold">الحالة</th>
                  <th className="px-6 py-4 font-semibold text-center">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-coastal-DEFAULT/30 relative">
                <AnimatePresence>
                  {siteUsers.length === 0 ? (
                    <motion.tr
                      key="empty"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <td colSpan={5} className="text-center py-8 text-gray-400">لا يوجد مستخدمين مضافين حتى الآن</td>
                    </motion.tr>
                  ) : siteUsers.map((user) => (
                    <motion.tr 
                      layout
                      key={user.id} 
                      initial={{ opacity: 0, scale: 0.95, filter: "blur(4px)" }}
                      animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                      exit={{ opacity: 0, scale: 0.95, x: -50, filter: "blur(4px)", backgroundColor: "rgba(239, 68, 68, 0.15)" }}
                      transition={{ duration: 0.4 }}
                      className="hover:bg-coastal-darkest/50 transition-colors"
                    >
                      <td className="px-6 py-4 text-white font-medium">{user.username}</td>
                      <td className="px-6 py-4 text-gray-300" dir="ltr" style={{ textAlign: "right" }}>{user.email}</td>
                      <td className="px-6 py-4 text-gray-300 font-mono text-sm tracking-widest">{user.school_id}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs flex items-center gap-1.5 w-max ${
                          user.status === "نشط" 
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                            : "bg-red-500/10 text-red-400 border border-red-500/20"
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${user.status === "نشط" ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" : "bg-red-400 shadow-[0_0_8px_rgba(248,113,113,0.8)]"}`}></span>
                          {user.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button className="p-2 text-gray-400 hover:text-white hover:bg-coastal-DEFAULT rounded-lg transition-colors" title="تعديل">
                            <Edit size={16} />
                          </button>
                          <button className="p-2 text-gray-400 hover:text-amber-400 hover:bg-amber-400/10 rounded-lg transition-colors" title="إعادة تعيين كلمة المرور">
                            <Key size={16} />
                          </button>
                          <button 
                            className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors group" 
                            title="حذف"
                            onClick={() => deleteUser(user.id)}
                          >
                            <Trash2 size={16} className="group-active:scale-90 transition-transform" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
}
