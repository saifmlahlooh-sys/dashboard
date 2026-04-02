"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { supabase } from "@/lib/supabase";
import { Users, LogIn, Eye, Edit, Trash2, Key, Save, Type, Image as ImageIcon, Loader2, Plus, X, CheckCircle, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams } from "next/navigation";

type UserData = { id: string; username: string; email: string; school_id: string; status: string };

export default function SiteDetailsPage() {
  const params = useParams();
  const [isMounted, setIsMounted] = useState(false);
  const [website, setWebsite] = useState<{ id: string; name: string; api_key?: string } | null>(null);
  const [siteData, setSiteData] = useState<Record<string, { id: string; value: string }>>({});
  const [siteUsers, setSiteUsers] = useState<UserData[]>([]);
  const [analytics, setAnalytics] = useState<{ total_visitors: number; total_logins: number } | null>(null);
  const [loading, setLoading] = useState(true);

  // Form State
  const [welcomeText, setWelcomeText] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [showAds, setShowAds] = useState(true);
  const [savingField, setSavingField] = useState<string | null>(null);
  const [dbError, setDbError] = useState<string | null>(null);

  // Add User State
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUser, setNewUser] = useState({ username: "", email: "", school_id: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    setIsMounted(true);
    if (!supabase) {
      setDbError("متغيرات البيئة (Environment Variables) الخاصة بـ Supabase غير صحيحة.");
      setLoading(false);
      return;
    }
    fetchDashboardData();
  }, [params.id]);

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchDashboardData = async () => {
    if (!supabase || !params.id) return;
    try {
      setLoading(true);
      const { data: siteObj, error: siteError } = await supabase.from("websites").select("*").eq("id", params.id).single();
      
      if (siteError) throw siteError;

      if (siteObj) {
        setWebsite(siteObj);

        const { data: kvData } = await supabase.from("site_data").select("*").eq("website_id", siteObj.id);
        if (kvData) {
          const mapped: Record<string, { id: string; value: string }> = {};
          kvData.forEach((row: { id: string; key_name: string; value: string }) => mapped[row.key_name] = row);
          setSiteData(mapped);
          setWelcomeText(mapped["welcome_text"]?.value || "");
          setLogoUrl(mapped["logo_url"]?.value || "");
          setShowAds(mapped["show_ads"]?.value === "true");
        }

        const { data: usersData } = await supabase.from("site_users").select("*").eq("website_id", siteObj.id).order('created_at', { ascending: false });
        if (usersData) setSiteUsers(usersData);

        const { data: analyticsData } = await supabase.from("analytics").select("*").eq("website_id", siteObj.id).single();
        if (analyticsData) setAnalytics(analyticsData);
      }
    } catch (err) {
      console.error("Supabase Error:", err);
      // Fallback handle
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!website || !supabase) return;
    
    if (!newUser.username || !newUser.email || !newUser.school_id) {
       showToast("يرجى ملء جميع الحقول", "error");
       return;
    }

    setIsSubmitting(true);
    try {
      // It can insert to site_users or users table. Requirements mentioned profiles or users, but display table lists site_users.
      const { error } = await supabase.from("site_users").insert([
        { 
          website_id: website.id, 
          username: newUser.username, 
          email: newUser.email, 
          school_id: newUser.school_id, 
          status: "نشط" 
        }
      ]);

      if (error) throw error;
      
      showToast("تمت إضافة المستخدم بنجاح", "success");
      setShowAddUserModal(false);
      setNewUser({ username: "", email: "", school_id: "" });
      await fetchDashboardData();
    } catch (err: unknown) {
      console.error("Add user error:", err);
      showToast(err instanceof Error ? err.message : "حدث خطأ أثناء إضافة المستخدم", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateSiteData = async (key_name: string, value: string) => { /* logic */ };
  const deleteUser = async (userId: string) => { /* logic */ };

  if (!isMounted) return null;

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex h-[60vh] items-center justify-center text-coastal-light">
          <Loader2 className="animate-spin" size={48} />
        </div>
      </DashboardLayout>
    );
  }

  // Toast Notification Overlay
  const ToastComponent = () => (
    <AnimatePresence>
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className={`fixed bottom-6 left-6 right-6 md:left-auto md:right-6 md:w-96 p-4 rounded-xl shadow-2xl flex items-center gap-3 z-50 text-white font-medium border ${toast.type === "success" ? "bg-emerald-600 border-emerald-500" : "bg-red-600 border-red-500"}`}
        >
          {toast.type === "success" ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
          {toast.message}
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <DashboardLayout>
      <ToastComponent />
      
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="space-y-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">تفاصيل الموقع: {website?.name || "جار التحميل"}</h2>
        </div>

        {/* Info Cards... */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="bg-coastal-dark border border-coastal-DEFAULT p-6 rounded-xl shadow-sm">
             <h3 className="text-coastal-light mb-2">إجمالي المستخدمين</h3>
             <p className="text-3xl font-bold text-white">{siteUsers.length}</p>
           </div>
        </div>

        {/* Users Table */}
        <div className="bg-coastal-dark border border-coastal-DEFAULT rounded-xl shadow-sm overflow-hidden mt-6 relative">
          <div className="p-6 border-b border-coastal-DEFAULT flex justify-between items-center bg-coastal-dark/50">
            <h3 className="text-xl font-bold text-white">مستخدمي الموقع</h3>
            <button 
              onClick={() => setShowAddUserModal(true)}
              className="bg-coastal hover:bg-coastal-light text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
            >
              <Plus size={16} /> إضافة مستخدم
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-right">
              {/* Table headers & rows mapping siteUsers */}
              <thead className="bg-coastal-darkest text-coastal-light border-b border-coastal-DEFAULT">
                 <tr>
                    <th className="p-4">الاسم</th>
                    <th className="p-4">البريد</th>
                    <th className="p-4">المعرف</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-coastal-DEFAULT/30">
                 {siteUsers.map(u => (
                    <tr key={u.id}>
                       <td className="p-4 text-white">{u.username}</td>
                       <td className="p-4 text-gray-400" dir="ltr">{u.email}</td>
                       <td className="p-4 text-gray-500">{u.school_id}</td>
                    </tr>
                 ))}
              </tbody>
            </table>
          </div>
        </div>

      </motion.div>

      {/* Add User Modal */}
      <AnimatePresence>
         {showAddUserModal && (
            <motion.div 
               initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
               className="fixed inset-0 bg-black/60 flex flex-col items-center justify-center p-4 z-50 backdrop-blur-sm"
            >
               <motion.div 
                  initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
                  className="bg-coastal-dark border border-coastal-DEFAULT p-6 rounded-xl w-full max-w-md shadow-2xl relative"
               >
                  <button onClick={() => setShowAddUserModal(false)} className="absolute top-4 left-4 text-gray-400 hover:text-white">
                     <X size={20} />
                  </button>
                  <h3 className="text-xl font-bold text-white mb-6">إضافة مستخدم جديد</h3>
                  
                  <form onSubmit={handleAddUser} className="space-y-4">
                     <div className="space-y-2">
                        <label className="text-sm text-gray-300">اسم المستخدم</label>
                        <input required value={newUser.username} onChange={e => setNewUser(prev => ({...prev, username: e.target.value}))} className="w-full bg-coastal-darkest rounded border border-coastal-DEFAULT p-3 text-white focus:outline-none focus:border-coastal-light" />
                     </div>
                     <div className="space-y-2">
                        <label className="text-sm text-gray-300">البريد الإلكتروني</label>
                        <input type="email" required value={newUser.email} onChange={e => setNewUser(prev => ({...prev, email: e.target.value}))} className="w-full bg-coastal-darkest rounded border border-coastal-DEFAULT p-3 text-white focus:outline-none focus:border-coastal-light" dir="ltr" />
                     </div>
                     <div className="space-y-2">
                        <label className="text-sm text-gray-300">رقم المدرسة (School ID)</label>
                        <input required value={newUser.school_id} onChange={e => setNewUser(prev => ({...prev, school_id: e.target.value}))} className="w-full bg-coastal-darkest rounded border border-coastal-DEFAULT p-3 text-white focus:outline-none focus:border-coastal-light text-left" dir="ltr" />
                     </div>
                     
                     <div className="pt-4">
                        <button type="submit" disabled={isSubmitting} className="w-full bg-coastal hover:bg-coastal-light text-white p-3 rounded font-bold transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                           {isSubmitting && <Loader2 size={18} className="animate-spin" />}
                           حفظ البيانات
                        </button>
                     </div>
                  </form>
               </motion.div>
            </motion.div>
         )}
      </AnimatePresence>
    </DashboardLayout>
  );
}
