"use client";

import { useEffect, useState, FormEvent } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Plus, Activity, ServerOff, Server, Loader2, Calendar } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import toast, { Toaster } from "react-hot-toast";

type Project = {
  id: string;
  name: string;
  status: "online" | "development" | "offline";
  updated_at: string;
};

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectStatus, setNewProjectStatus] = useState<"online" | "development" | "offline">("development");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("updated_at", { ascending: false });

      if (error) {
         // Fallback if table doesn't exist yet for demonstration based on user request
         if (error.code === '42P01') {
            setProjects([{ id: '1', name: 'مدرسة المفرق الأساسية الأولى للبنين', status: 'online', updated_at: new Date().toISOString() }]);
         } else {
            throw error;
         }
      } else {
         setProjects(data as Project[]);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch projects");
    } finally {
      setLoading(false);
    }
  };

  const handleAddProject = async (e: FormEvent) => {
    e.preventDefault();
    if (!newProjectName.trim()) {
      toast.error("Project name is required");
      return;
    }

    try {
      setIsSubmitting(true);
      const newEntry = {
        name: newProjectName.trim(),
        status: newProjectStatus,
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from("projects")
        .insert([newEntry])
        .select()
        .single();

      if (error) {
         // Mock update if table missing during dev
         if (error.code === '42P01') {
             setProjects(prev => [ { id: Math.random().toString(), ...newEntry }, ...prev ]);
             toast.success("Project added successfully (Mock)");
         } else {
             throw error;
         }
      } else {
         setProjects(prev => [data as Project, ...prev]);
         toast.success("Project added successfully");
      }
      
      setNewProjectName("");
      setNewProjectStatus("development");
      setShowAddForm(false);
    } catch (error: any) {
      toast.error(error.message || "Error adding project");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ar-EG', { month: 'short', day: 'numeric', year: 'numeric' }).format(date);
  };

  return (
    <DashboardLayout>
      <Toaster position="bottom-right" toastOptions={{
        style: { background: '#18181b', color: '#fff', border: '1px solid #27272a' }
      }} />
      <div className="space-y-6 max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-white tracking-tight font-mono mb-2">PROJECTS_</h2>
            <p className="text-gray-400">إدارة وعرض المشاريع المتصلة بقاعدة البيانات</p>
          </div>
          <button 
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-white hover:bg-zinc-200 text-black px-6 py-3 rounded-lg font-bold transition-all flex items-center gap-2 shadow-lg"
          >
            <Plus size={18} className={showAddForm ? "rotate-45 transition-transform" : "transition-transform"} />
            {showAddForm ? 'إلغاء' : 'إضافة مشروع'}
          </button>
        </div>

        <AnimatePresence>
          {showAddForm && (
            <motion.form 
              initial={{ opacity: 0, height: 0, y: -20 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={{ opacity: 0, height: 0, y: -20, overflow: 'hidden' }}
              onSubmit={handleAddProject}
              className="bg-black border border-zinc-800 p-6 rounded-xl mb-8 shadow-[0_0_30px_rgba(255,255,255,0.02)]"
            >
              <h3 className="text-xl font-bold text-white mb-6 font-mono">NEW_PROJECT.config</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-2">
                  <label className="text-xs font-mono text-zinc-500 uppercase tracking-widest">Project Name</label>
                  <input 
                    type="text" 
                    value={newProjectName}
                    onChange={(e) => setNewProjectName(e.target.value)}
                    placeholder="Enter project name..."
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-zinc-500 transition-colors font-mono"
                    dir="auto"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-mono text-zinc-500 uppercase tracking-widest">Initial Status</label>
                  <select 
                    value={newProjectStatus}
                    onChange={(e) => setNewProjectStatus(e.target.value as any)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-zinc-500 transition-colors font-mono appearance-none"
                    dir="ltr"
                  >
                    <option value="online">ONLINE</option>
                    <option value="development">DEVELOPMENT</option>
                    <option value="offline">OFFLINE</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end">
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="bg-zinc-800 hover:bg-zinc-700 text-white px-8 py-3 rounded-lg font-bold font-mono transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Plus size={18} />}
                  DEPLOY
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {loading ? (
             // Skeleton Loader
             [1, 2, 3].map((n) => (
               <div key={n} className="bg-zinc-950 border border-zinc-900 rounded-xl p-6 h-[200px] animate-pulse">
                 <div className="flex justify-between items-start mb-4">
                   <div className="h-6 w-3/4 bg-zinc-800 rounded"></div>
                   <div className="h-6 w-6 bg-zinc-800 rounded-full"></div>
                 </div>
                 <div className="h-4 w-1/4 bg-zinc-800 rounded mb-8"></div>
                 <div className="mt-auto h-12 w-full bg-zinc-900 rounded-lg"></div>
               </div>
             ))
           ) : projects.length === 0 ? (
              <div className="col-span-full py-12 text-center border border-zinc-900 rounded-xl bg-black border-dashed">
                <span className="text-zinc-500 font-mono tracking-widest">NO_PROJECTS_FOUND</span>
                <p className="text-zinc-400 mt-2">Start by adding your first project to the database.</p>
              </div>
           ) : (
             projects.map((proj, idx) => (
               <motion.div
                 key={proj.id}
                 initial={{ opacity: 0, y: 15 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: idx * 0.1 }}
                 className="bg-zinc-950 border border-zinc-900 rounded-xl p-6 transition-all duration-300 ease-in-out hover:-translate-y-1 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(255,255,255,0.03)] flex flex-col justify-between min-h-[200px]"
               >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-white leading-tight" dir="auto">{proj.name}</h3>
                    {proj.status === "online" && <Activity size={24} className="text-emerald-500 shrink-0 shadow-emerald-500/20 drop-shadow-lg" />}
                    {proj.status === "development" && <Server size={24} className="text-amber-500 shrink-0 shadow-amber-500/20 drop-shadow-lg" />}
                    {proj.status === "offline" && <ServerOff size={24} className="text-red-500 shrink-0 shadow-red-500/20 drop-shadow-lg" />}
                  </div>
                  
                  <div className="flex items-center gap-2 text-zinc-500 font-mono text-xs mb-6">
                    <Calendar size={14} />
                    <span>{proj.updated_at ? formatDate(proj.updated_at) : 'Unknown'}</span>
                  </div>
                  
                  <div className="mt-auto flex justify-between items-center bg-black p-3 rounded-lg border border-zinc-800/50">
                    <span className="text-xs text-zinc-500 font-mono uppercase tracking-widest">State</span>
                    <div className="flex items-center gap-2">
                      <span className={`h-2 w-2 rounded-full ${
                        proj.status === 'online' ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 
                        proj.status === 'development' ? 'bg-amber-500 shadow-[0_0_8px_#f59e0b]' : 'bg-red-500 shadow-[0_0_8px_#ef4444]'
                      }`}></span>
                      <span className={`text-xs font-bold font-mono tracking-widest uppercase ${
                        proj.status === 'online' ? 'text-white' : 
                        proj.status === 'development' ? 'text-zinc-300' : 'text-zinc-400'
                      }`}>
                        {proj.status}
                      </span>
                    </div>
                  </div>
               </motion.div>
             ))
           )}
        </div>
      </div>
    </DashboardLayout>
  );
}
