// loading.tsx for /projects/[id] — shown while project details resolve
export default function ProjectDetailLoading() {
  return (
    <div className="min-h-screen bg-black p-6 mr-64">
      <div className="max-w-4xl mx-auto space-y-6 animate-pulse">
        {/* Back link skeleton */}
        <div className="h-4 w-32 bg-white/[0.04] rounded" />

        {/* Header card skeleton */}
        <div className="border border-white/[0.05] bg-white/[0.02] rounded-xl p-8">
          <div className="flex items-start justify-between">
            <div className="space-y-3 flex-1">
              <div className="h-8 w-2/3 bg-white/[0.06] rounded-lg" />
              <div className="flex items-center gap-3">
                <div className="h-2.5 w-2.5 rounded-full bg-white/[0.04]" />
                <div className="h-3 w-16 bg-white/[0.03] rounded" />
              </div>
            </div>
            <div className="w-14 h-14 rounded-xl bg-white/[0.04] shrink-0" />
          </div>
        </div>

        {/* Data fields skeletons */}
        {[1, 2, 3].map((n) => (
          <div
            key={n}
            className="border border-white/[0.05] bg-white/[0.02] rounded-xl p-6"
          >
            <div className="h-3 w-24 bg-white/[0.04] rounded mb-4" />
            <div className="h-12 w-full bg-white/[0.03] rounded-lg" />
          </div>
        ))}

        {/* Users table skeleton */}
        <div className="border border-white/[0.05] bg-white/[0.02] rounded-xl overflow-hidden">
          <div className="px-6 py-5 border-b border-white/[0.05] flex items-center justify-between">
            <div className="h-4 w-28 bg-white/[0.05] rounded" />
            <div className="h-6 w-8 bg-white/[0.03] rounded-full" />
          </div>
          <div className="p-6 space-y-4">
            {[1, 2, 3].map((n) => (
              <div key={n} className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-white/[0.04] shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-1/3 bg-white/[0.04] rounded" />
                  <div className="h-3 w-1/2 bg-white/[0.03] rounded" />
                </div>
                <div className="h-6 w-16 bg-white/[0.03] rounded-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
