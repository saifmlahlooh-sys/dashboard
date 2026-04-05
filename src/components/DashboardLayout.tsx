"use client";
import React from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { LayoutGrid, Layers, Bug, Code, Settings, Bell, Palette, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { logoutPin } from '@/app/actions/auth';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    if (supabase) await supabase.auth.signOut();
    await logoutPin();
    router.push('/login');
  };

  return (
    <div className="min-h-screen flex bg-black text-gray-100 overflow-x-hidden relative">
      {/* Sidebar - Slide from right */}
      <aside
        className="w-64 bg-zinc-950 fixed right-0 top-0 bottom-0 border-l border-zinc-900 flex flex-col z-40 shadow-[-10px_0_30px_rgba(0,0,0,0.5)]"
      >
        <div className="p-6 border-b border-zinc-900">
          <h2 className="text-xl font-bold text-white tracking-widest font-mono">WORKSPACE_</h2>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link href="/dashboard" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium ${pathname === '/dashboard' ? 'bg-zinc-900 text-white' : 'hover:bg-zinc-900/50 text-gray-400 hover:text-white'}`}>
            <LayoutGrid size={20} />
            روابط المطور
          </Link>
          <Link href="/projects" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium ${pathname.startsWith('/projects') ? 'bg-zinc-900 text-white' : 'hover:bg-zinc-900/50 text-gray-400 hover:text-white'}`}>
            <Layers size={20} />
            المشاريع
          </Link>
          <Link href="/tasks" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium ${pathname.startsWith('/tasks') ? 'bg-zinc-900 text-white' : 'hover:bg-zinc-900/50 text-gray-400 hover:text-white'}`}>
            <Bug size={20} />
            المهام البرمجية
          </Link>
          <Link href="/snippets" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium ${pathname.startsWith('/snippets') ? 'bg-zinc-900 text-white' : 'hover:bg-zinc-900/50 text-gray-400 hover:text-white'}`}>
            <Code size={20} />
            أكواد جاهزة
          </Link>
          <Link href="/settings" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium ${pathname.startsWith('/settings') ? 'bg-zinc-900 text-white' : 'hover:bg-zinc-900/50 text-gray-400 hover:text-white'}`}>
            <Settings size={20} />
            الإعدادات
          </Link>
        </nav>
        
        {/* Logout Button */}
        <div className="p-4 border-t border-zinc-900">
           <button 
             onClick={handleLogout}
             className="w-full flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 hover:text-red-400 px-4 py-3 rounded-lg transition-colors font-bold font-mono"
           >
              <LogOut size={18} />
              تسجيل الخروج
           </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 mr-64 flex flex-col min-h-screen">
        {/* Top Navbar - Slide down */}
        <header
          className="h-16 bg-zinc-950 border-b border-zinc-900 flex items-center justify-between px-6 sticky top-0 z-30"
        >
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-bold text-white font-mono tracking-widest">{pathname === '/dashboard' ? 'روابط المطور' : pathname.replace('/', '').toUpperCase()}</h1>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 rounded-full hover:bg-zinc-900 transition-colors text-gray-400 hover:text-white">
              <Palette size={20} />
            </button>
            <button className="p-2 rounded-full hover:bg-zinc-900 transition-colors text-gray-400 hover:text-white">
              <Bell size={20} />
            </button>
            <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center font-bold text-white shadow-lg border border-zinc-700">
              U
            </div>
          </div>
        </header>

        {/* Page Content - Fade and slide up */}
        <motion.main
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="p-6 relative z-10"
        >
          {children}
        </motion.main>
      </div>
    </div>
  );
}
