"use client";
import React from 'react';
import { Home, Globe, MessageSquare, Settings, Bell, Palette } from 'lucide-react';
import { motion } from 'framer-motion';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex bg-coastal-darkest text-gray-100 overflow-x-hidden relative">
      {/* Sidebar - Slide from right */}
      <motion.aside 
        initial={{ x: "100%", opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 2.2 }}
        className="w-64 bg-coastal-dark fixed right-0 top-0 bottom-0 border-l border-coastal-DEFAULT flex flex-col z-40 shadow-[-10px_0_30px_rgba(0,0,0,0.5)]"
      >
        <div className="p-6 border-b border-coastal-DEFAULT">
          <h2 className="text-xl font-bold text-white">اللوحة الرئيسية</h2>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg bg-coastal hover:bg-coastal-light transition-colors text-white font-medium">
            <Home size={20} />
            الرئيسية
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-coastal-light/50 transition-colors text-gray-300 hover:text-white font-medium">
            <Globe size={20} />
            المواقع
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-coastal-light/50 transition-colors text-gray-300 hover:text-white font-medium">
            <MessageSquare size={20} />
            الرسائل
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-coastal-light/50 transition-colors text-gray-300 hover:text-white font-medium">
            <Settings size={20} />
            الإعدادات
          </a>
        </nav>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 mr-64 flex flex-col min-h-screen">
        {/* Top Navbar - Slide down */}
        <motion.header 
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 2.4 }}
          className="h-16 bg-coastal-dark border-b border-coastal-DEFAULT flex items-center justify-between px-6 sticky top-0 z-30"
        >
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-semibold text-white">إدارة المشاريع</h1>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 rounded-full hover:bg-coastal transition-colors text-coastal-light hover:text-white">
              <Palette size={20} />
            </button>
            <button className="p-2 rounded-full hover:bg-coastal transition-colors text-coastal-light hover:text-white">
              <Bell size={20} />
            </button>
            <div className="w-8 h-8 rounded-full bg-coastal flex items-center justify-center font-bold text-white shadow-lg">
              M
            </div>
          </div>
        </motion.header>

        {/* Page Content - Fade and slide up */}
        <motion.main 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 2.6 }}
          className="p-6 relative z-10"
        >
          {children}
        </motion.main>
      </div>
    </div>
  );
}
