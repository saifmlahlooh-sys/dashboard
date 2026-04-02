"use client";

import DashboardLayout from "@/components/DashboardLayout";
import { Plus, CheckCircle2, Circle } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

export default function TasksPage() {
  const [tasks, setTasks] = useState([
    { id: 1, text: "Fix hydration error on dashboard layout", type: "bug", completed: false },
    { id: 2, text: "Integrate Stripe webhooks", type: "feature", completed: false },
    { id: 3, text: "Update Discord py library to latest version", type: "maintenance", completed: true },
  ]);

  const toggleTask = (id: number) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-white tracking-tight font-mono mb-2">TASKS_&_BUGS</h2>
            <p className="text-gray-400">قائمة المهام وتتبع الأخطاء البرمجية</p>
          </div>
          <button className="bg-zinc-100 hover:bg-white text-zinc-950 px-6 py-3 rounded-lg font-bold transition-colors flex items-center gap-2">
            <Plus size={18} />
            مهمة جديدة
          </button>
        </div>

        <div className="bg-zinc-950 border border-zinc-900 rounded-xl p-6 shadow-sm">
           <div className="space-y-4">
             {tasks.map((task) => (
               <div 
                 key={task.id} 
                 className={`flex items-center gap-4 p-4 rounded-lg border transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:shadow-[0_0_20px_rgba(255,255,255,0.02)] ${task.completed ? 'bg-zinc-900/50 border-zinc-800' : 'bg-black border-zinc-700 hover:border-zinc-500 cursor-pointer'}`}
                 onClick={() => toggleTask(task.id)}
               >
                 <div className="text-zinc-500">
                   {task.completed ? <CheckCircle2 className="text-emerald-500" /> : <Circle />}
                 </div>
                 <div className={`flex-1 ${task.completed ? 'line-through text-zinc-600' : 'text-gray-200'} transition-all`}>
                   {task.text}
                 </div>
                 <div className="text-xs font-mono uppercase tracking-widest px-3 py-1 rounded-full bg-zinc-900 text-zinc-400 border border-zinc-800">
                   {task.type}
                 </div>
               </div>
             ))}
           </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
