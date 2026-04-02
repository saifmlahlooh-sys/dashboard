"use client";

import DashboardLayout from "@/components/DashboardLayout";
import { Plus, Copy, Check } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

export default function SnippetsPage() {
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const snippets = [
    {
      id: 1,
      title: "Docker Compose PostgreSQL",
      language: "yaml",
      code: `version: '3.8'\nservices:\n  db:\n    image: postgres:15\n    environment:\n      POSTGRES_USER: dev\n      POSTGRES_PASSWORD: devpassword\n      POSTGRES_DB: backend_db\n    ports:\n      - "5432:5432"\n    volumes:\n      - pgdata:/var/lib/postgresql/data\nvolumes:\n  pgdata:`
    },
    {
      id: 2,
      title: "FastAPI Boilerplate",
      language: "python",
      code: `from fastapi import FastAPI\n\napp = FastAPI()\n\n@app.get("/")\ndef read_root():\n    return {"Hello": "World"}`
    }
  ];

  const copyToClipboard = (id: number, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-white tracking-tight font-mono mb-2">SNIPPETS_</h2>
            <p className="text-gray-400">مكتبة الأكواد الجاهزة للاستخدام السريع</p>
          </div>
          <button className="bg-zinc-100 hover:bg-white text-zinc-950 px-6 py-3 rounded-lg font-bold transition-colors flex items-center gap-2">
            <Plus size={18} />
            كود جديد
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
           {snippets.map((snippet) => (
             <motion.div
               key={snippet.id}
               initial={{ opacity: 0, y: 15 }}
               animate={{ opacity: 1, y: 0 }}
               className="bg-zinc-950 border border-zinc-900 rounded-xl overflow-hidden flex flex-col transition-all duration-300 ease-in-out hover:-translate-y-1 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(255,255,255,0.03)] hover:border-zinc-800"
             >
                <div className="flex justify-between items-center px-4 py-3 bg-zinc-900/50 border-b border-zinc-900">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest">{snippet.language}</span>
                    <h3 className="text-sm font-bold text-white font-mono">{snippet.title}</h3>
                  </div>
                  <button 
                    onClick={() => copyToClipboard(snippet.id, snippet.code)}
                    className="p-1.5 rounded-md hover:bg-zinc-800 text-zinc-400 transition-colors"
                  >
                    {copiedId === snippet.id ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
                  </button>
                </div>
                <div className="p-4 bg-black overflow-x-auto relative group">
                  <pre className="text-sm text-zinc-300 font-mono">
                    <code>{snippet.code}</code>
                  </pre>
                  {/* Subtle hover glow inside the code block */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none"></div>
                </div>
             </motion.div>
           ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
