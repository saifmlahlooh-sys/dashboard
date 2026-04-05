// loading.tsx for /projects — shown while the Supabase fetch resolves
import { Layers } from "lucide-react";

function SkeletonCard() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/[0.05] bg-white/[0.02] p-6 min-h-[220px] animate-pulse">
      <div className="flex justify-between items-start mb-5">
        <div className="h-5 w-2/3 bg-white/[0.05] rounded-lg" />
        <div className="h-8 w-8 bg-white/[0.05] rounded-xl" />
      </div>
      <div className="flex items-center gap-2 mb-4">
        <div className="h-2 w-2 rounded-full bg-white/[0.04]" />
        <div className="h-2 w-8 bg-white/[0.04] rounded" />
      </div>
      <div className="h-3 w-1/3 bg-white/[0.03] rounded mb-6" />
      <div className="mt-auto h-11 w-full bg-white/[0.03] rounded-xl" />
      <div className="mt-3 h-3 w-1/4 bg-white/[0.02] rounded" />
    </div>
  );
}

export default function ProjectsLoading() {
  return (
    <div className="min-h-screen bg-black p-6 mr-64">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header skeleton */}
        <div className="flex justify-between items-end animate-pulse">
          <div className="space-y-3">
            <div className="h-2 w-16 bg-white/[0.04] rounded" />
            <div className="h-8 w-48 bg-white/[0.06] rounded-lg" />
            <div className="h-3 w-64 bg-white/[0.03] rounded" />
          </div>
          <div className="h-10 w-36 bg-white/[0.05] rounded-xl" />
        </div>

        {/* Cards skeleton grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <SkeletonCard key={n} />
          ))}
        </div>
      </div>
    </div>
  );
}
