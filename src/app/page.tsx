"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { LogIn, ArrowLeft, Shield, Globe, Flashlight, LayoutDashboard } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-coastal-darkest text-white flex flex-col font-sans" dir="rtl">
      {/* Navbar */}
      <nav className="border-b border-coastal-DEFAULT bg-coastal-dark/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-coastal-light/20 text-coastal-light rounded-xl flex items-center justify-center font-bold text-xl">
               M
             </div>
             <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
               المحطة المركزية
             </span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-300">
             <Link href="#" className="hover:text-white transition-colors">المميزات</Link>
             <Link href="#" className="hover:text-white transition-colors">عن النظام</Link>
             <Link href="#" className="hover:text-white transition-colors">الأسعار</Link>
             <Link href="#" className="hover:text-white transition-colors">تواصل معنا</Link>
          </div>

          <div className="flex items-center gap-4">
            <Link 
              href="/login" 
              className="bg-coastal hover:bg-coastal-light text-white px-5 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 transition-all shadow-lg hover:shadow-coastal/30"
            >
              <LogIn size={18} />
              تسجيل الدخول
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-6 py-20 relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-coastal-DEFAULT/20 rounded-full blur-[120px] -z-10 pointer-events-none"></div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl"
        >
          <span className="inline-block py-1.5 px-4 rounded-full bg-coastal/20 text-coastal-light text-sm font-semibold mb-6 border border-coastal-DEFAULT/50">
             الإصدار 2.0 متاح الآن 🚀
          </span>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-tight">
            نظام إدارة متكامل <br/> للمدارس <span className="text-coastal-light">والمؤسسات</span>
          </h1>
          <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
            المنصة المركزية الحديثة لبناء وإدارة مواقع المدارس بسهولة. لوحة تحكم سحابية سريعة، متجاوبة، ومطورة لتعزيز إنتاجيتك في الإدارة.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
             <Link 
               href="/login" 
               className="h-14 bg-white text-coastal-darkest px-8 rounded-xl font-bold flex items-center gap-3 transition-all hover:scale-105 shadow-[0_0_40px_rgba(255,255,255,0.2)]"
             >
               الوصول للوحة التحكم
               <LayoutDashboard size={20} />
             </Link>
             <Link 
               href="#features" 
               className="h-14 bg-coastal-dark border border-coastal-DEFAULT text-white px-8 rounded-xl font-bold flex items-center gap-3 hover:bg-coastal transition-all"
             >
               تصفح المميزات
             </Link>
          </div>
        </motion.div>

        {/* Features / Highlights */}
        <motion.div 
           initial={{ opacity: 0, y: 40 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.8, delay: 0.2 }}
           className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl mt-32"
        >
           {[
              { icon: <Shield size={28} />, title: "أمان متقدم", desc: "نظام صلاحيات ومصادقة محمي ومبني على أفضل ممارسات الأمان." },
              { icon: <Globe size={28} />, title: "إدارة مركزية", desc: "أدر جميع مواقع المدارس التابعة لك من شاشة ولوحة تحكم واحدة." },
              { icon: <Flashlight size={28} />, title: "سرعة البرق", desc: "تطبيق متجاوب ومبني بأحدث تقنيات Next.js لتقديم تجربة فائقة." }
           ].map((feat, idx) => (
             <div key={idx} className="bg-coastal-dark/30 border border-coastal-DEFAULT/50 p-8 rounded-2xl text-right backdrop-blur-sm hover:border-coastal-light/50 transition-colors">
                <div className="w-14 h-14 bg-coastal/30 text-coastal-light rounded-xl flex items-center justify-center mb-6">
                   {feat.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feat.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feat.desc}</p>
             </div>
           ))}
        </motion.div>
      </main>
    </div>
  );
}
