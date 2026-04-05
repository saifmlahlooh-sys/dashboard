// Global loading.tsx — shown for any route that hasn't resolved yet
export default function GlobalLoading() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        {/* Spinner ring */}
        <div className="w-10 h-10 rounded-full border-2 border-white/10 border-t-white/60 animate-spin" />
        <p className="text-xs font-mono text-zinc-600 tracking-widest uppercase">
          جارٍ التحميل...
        </p>
      </div>
    </div>
  );
}
