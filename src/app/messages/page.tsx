"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import DashboardLayout from "@/components/DashboardLayout";
import { MessageSquare, Inbox, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

type Message = {
  id: string;
  sender_name?: string;
  sender_email?: string;
  subject?: string;
  content: string;
  created_at?: string;
  read?: boolean;
};

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [dbError, setDbError] = useState<string | null>(null);

  useEffect(() => {
    if (!supabase) {
      setDbError("متغيرات البيئة الخاصة بـ Supabase غير صحيحة.");
      setLoading(false);
      return;
    }
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    if (!supabase) return;
    try {
      setLoading(true);
      const { data, error } = await supabase.from("messages").select("*").order("created_at", { ascending: false });
      
      if (error) {
         if (error.code === '42P01' || error.message?.includes('does not exist')) {
            // Table doesn't exist, which returns empty [] instead of a crash
            setMessages([]);
            return;
         }
         throw error;
      }
      if (data) setMessages(data as Message[]);
    } catch (err: unknown) {
      console.error("Error fetching messages:", err);
      setDbError(err instanceof Error ? err.message : "حدث خطأ غير متوقع");
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
          <h2 className="text-2xl font-bold text-white">الرسائل</h2>
          <button onClick={fetchMessages} className="bg-coastal-darkest hover:bg-coastal border border-coastal text-white px-4 py-2 rounded-lg font-bold transition-colors shadow-sm flex items-center gap-2">
            {loading ? <Loader2 size={18} className="animate-spin" /> : <MessageSquare size={18} />}
            تحديث
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
        ) : messages.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-center justify-center p-20 bg-coastal-dark rounded-xl border border-coastal-DEFAULT shadow-lg text-center"
          >
            <div className="w-16 h-16 bg-coastal/30 flex items-center justify-center rounded-full mb-6 relative">
              <Inbox size={32} className="text-coastal-light" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">صندوق الوارد فارغ</h3>
            <p className="text-gray-400 mb-8 max-w-md">لا توجد رسائل جديدة في الوقت الحالي. سيتم عرض الرسائل الواردة هنا بمجرد استلامها.</p>
          </motion.div>
        ) : (
          <div className="bg-coastal-dark border border-coastal-DEFAULT rounded-xl shadow-sm overflow-hidden">
             <div className="divide-y divide-coastal-DEFAULT/50">
               {messages.map((message) => (
                 <div key={message.id} className={`p-6 hover:bg-coastal-darkest/50 transition-colors ${message.read ? 'opacity-70' : ''}`}>
                    <div className="flex justify-between items-start mb-2">
                       <h4 className="text-lg font-bold text-white">{message.subject || "بدون عنوان"}</h4>
                       <span className="text-xs text-gray-500" dir="ltr">
                         {message.created_at ? new Date(message.created_at).toLocaleDateString() : ""}
                       </span>
                    </div>
                    <div className="text-sm text-coastal-light mb-4 flex items-center gap-2">
                      <span className="font-medium">{message.sender_name || "مجهول"}</span>
                      {message.sender_email && (
                        <>
                          <span className="text-gray-500">•</span>
                          <span className="text-gray-400" dir="ltr">{message.sender_email}</span>
                        </>
                      )}
                    </div>
                    <p className="text-gray-300 leading-relaxed text-sm">
                      {message.content}
                    </p>
                 </div>
               ))}
             </div>
          </div>
        )}
      </motion.div>
    </DashboardLayout>
  );
}
