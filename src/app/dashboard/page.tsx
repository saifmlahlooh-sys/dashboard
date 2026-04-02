"use client";

import DashboardLayout from "@/components/DashboardLayout";
import { Terminal, Triangle, Database, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function DashboardHomePage() {
  const links = [
    {
      name: "GitHub",
      description: "Source code repositories & version control",
      icon: <Terminal size={32} className="text-white" />,
      url: "https://github.com/",
      color: "hover:border-white",
      bg: "bg-zinc-900",
    },
    {
      name: "Vercel",
      description: "Frontend deployment & serverless functions",
      icon: <Triangle size={32} className="text-white fill-white" />,
      url: "https://vercel.com/",
      color: "hover:border-white",
      bg: "bg-black",
    },
    {
      name: "Supabase",
      description: "PostgreSQL database & authentication",
      icon: <Database size={32} className="text-emerald-400" />,
      url: "https://supabase.com/",
      color: "hover:border-emerald-500",
      bg: "bg-emerald-950/20",
    }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-white tracking-tight font-mono mb-2">QUICK_LINKS</h2>
            <p className="text-gray-400">روابط المطور السريعة لمنصات العمل الأساسية</p>
          </div>
        </div>

        {/* Dashboard Quick Links Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           {links.map((link, idx) => (
             <motion.a
               href={link.url}
               target="_blank"
               rel="noopener noreferrer"
               key={idx}
               initial={{ opacity: 0, y: 15 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: idx * 0.1 }}
               className={`border border-zinc-800 p-8 rounded-xl shadow-none transition-all duration-300 ease-in-out group ${link.bg} ${link.color} hover:-translate-y-1 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(255,255,255,0.03)] flex flex-col justify-between min-h-[220px] relative overflow-hidden`}
             >
                <div className="absolute top-4 left-4 text-zinc-700 group-hover:text-white transition-colors">
                  <ExternalLink size={20} />
                </div>
                <div className="mb-4">
                  <div className="w-16 h-16 rounded-xl flex items-center justify-center bg-zinc-800/50 border border-zinc-700/50 mb-6 group-hover:scale-110 transition-transform">
                     {link.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2 font-mono">{link.name}</h3>
                  <p className="text-sm text-gray-400">{link.description}</p>
                </div>
                <div className="mt-auto">
                  <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest group-hover:text-zinc-300 transition-colors">Launch Dashboard →</span>
                </div>
             </motion.a>
           ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
