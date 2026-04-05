// loading.tsx for /dashboard
export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-black p-6 mr-64 animate-pulse">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Title */}
        <div className="space-y-3">
          <div className="h-2 w-12 bg-white/[0.04] rounded" />
          <div className="h-8 w-56 bg-white/[0.06] rounded-lg" />
          <div className="h-3 w-72 bg-white/[0.03] rounded" />
        </div>
        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div
              key={n}
              className="rounded-2xl border border-white/[0.05] bg-white/[0.02] p-6 h-40"
            >
              <div className="h-5 w-1/2 bg-white/[0.05] rounded mb-3" />
              <div className="h-3 w-3/4 bg-white/[0.03] rounded mb-2" />
              <div className="h-3 w-1/2 bg-white/[0.03] rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
