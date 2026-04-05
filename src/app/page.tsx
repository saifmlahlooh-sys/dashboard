"use client";

import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  LogIn,
  Shield,
  Globe,
  Zap,
  LayoutDashboard,
  ArrowLeft,
} from "lucide-react";

/* ── Feature data ── */
const features = [
  {
    icon: Shield,
    title: "أمان متقدم",
    desc: "نظام صلاحيات ومصادقة محمي ومبني على أفضل ممارسات الأمان السحابي الحديث.",
    gradient: "from-violet-600/20 via-transparent to-transparent",
    glow: "rgba(139,92,246,0.25)",
    iconColor: "text-violet-400",
    iconBg: "bg-violet-500/10 border-violet-500/20",
    accent: "#8b5cf6",
  },
  {
    icon: Globe,
    title: "إدارة مركزية",
    desc: "أدر جميع مواقع المدارس التابعة لك من شاشة ولوحة تحكم واحدة بدون تعقيد.",
    gradient: "from-cyan-600/20 via-transparent to-transparent",
    glow: "rgba(6,182,212,0.25)",
    iconColor: "text-cyan-400",
    iconBg: "bg-cyan-500/10 border-cyan-500/20",
    accent: "#06b6d4",
  },
  {
    icon: Zap,
    title: "سرعة البرق",
    desc: "تطبيق متجاوب ومبني بأحدث تقنيات Next.js 14 لأداء فائق وتجربة سريعة.",
    gradient: "from-amber-600/20 via-transparent to-transparent",
    glow: "rgba(245,158,11,0.25)",
    iconColor: "text-amber-400",
    iconBg: "bg-amber-500/10 border-amber-500/20",
    accent: "#f59e0b",
  },
];

/* ── Stagger variants ── */
const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15, delayChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};

/* ── FeatureCard ── */
function FeatureCard({
  icon: Icon,
  title,
  desc,
  gradient,
  glow,
  iconColor,
  iconBg,
  accent,
}: (typeof features)[number]) {
  return (
    <motion.div
      variants={cardVariants}
      whileHover={{
        y: -8,
        scale: 1.03,
        boxShadow: `0 0 40px ${glow}, 0 20px 60px rgba(0,0,0,0.6)`,
        transition: { duration: 0.3, ease: "easeOut" },
      }}
      className="relative group overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-sm p-8 cursor-default"
      style={{
        boxShadow: `0 0 0px ${glow}`,
        transition: "box-shadow 0.3s ease",
      }}
    >
      {/* Gradient bleed from top-right corner */}
      <div
        className={`absolute inset-0 bg-gradient-to-bl ${gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`}
      />

      {/* Animated border glow on hover */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `linear-gradient(135deg, ${accent}22, transparent 60%)`,
          border: `1px solid ${accent}40`,
        }}
      />

      {/* Top accent line */}
      <div
        className="absolute top-0 left-8 right-8 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `linear-gradient(90deg, transparent, ${accent}80, transparent)`,
        }}
      />

      {/* Content */}
      <div className="relative z-10">
        <div
          className={`w-14 h-14 rounded-xl border ${iconBg} flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}
        >
          <Icon size={26} className={iconColor} />
        </div>

        <h3 className="text-xl font-bold text-white mb-3 leading-snug">{title}</h3>
        <p className="text-gray-500 leading-relaxed text-sm">{desc}</p>

        {/* Bottom arrow hint */}
        <div className="mt-6 flex items-center gap-2 text-xs font-medium opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0" style={{ color: accent }}>
          <span>تعرف أكثر</span>
          <ArrowLeft size={12} />
        </div>
      </div>
    </motion.div>
  );
}

export default function Home() {
  const featuresRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(featuresRef, { once: true, amount: 0.2 });

  return (
    <div
      className="min-h-screen bg-black text-white flex flex-col"
      dir="rtl"
      style={{ fontFamily: "'Cairo', 'Tajawal', system-ui, sans-serif" }}
    >
      {/* ── Navbar ── */}
      <nav className="border-b border-white/[0.06] bg-black/60 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-white/10 rounded-xl flex items-center justify-center font-bold text-lg border border-white/10">
              M
            </div>
            <span className="text-xl font-bold tracking-tight">المحطة المركزية</span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
            <Link href="#features" className="hover:text-white transition-colors">المميزات</Link>
            <Link href="#" className="hover:text-white transition-colors">عن النظام</Link>
            <Link href="#" className="hover:text-white transition-colors">الأسعار</Link>
            <Link href="#" className="hover:text-white transition-colors">تواصل معنا</Link>
          </div>

          <Link
            href="/login"
            className="flex items-center gap-2 bg-white text-black px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-gray-100 transition-all shadow-lg hover:shadow-white/20 hover:scale-[1.02]"
          >
            <LogIn size={16} />
            تسجيل الدخول
          </Link>
        </div>
      </nav>

      {/* ── Hero ── */}
      <main className="flex-1">
        <section className="relative flex flex-col items-center justify-center text-center px-6 py-28 overflow-hidden">
          {/* Radial background orb */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full pointer-events-none -z-10"
            style={{ background: "radial-gradient(ellipse, rgba(255,255,255,0.04) 0%, transparent 70%)" }}
          />
          {/* Grid texture */}
          <div className="absolute inset-0 -z-10 opacity-[0.02]"
            style={{
              backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
              backgroundSize: "64px 64px",
            }}
          />

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-4xl"
          >
            <motion.span
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-white/5 text-gray-400 text-xs font-semibold mb-8 border border-white/10"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]" />
              الإصدار 2.0 متاح الآن
            </motion.span>

            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-[1.1]">
              نظام إدارة متكامل{" "}
              <br />
              <span className="bg-gradient-to-r from-white via-gray-200 to-gray-500 bg-clip-text text-transparent">
                للمدارس والمؤسسات
              </span>
            </h1>

            <p className="text-lg text-gray-500 mb-12 max-w-2xl mx-auto leading-relaxed">
              المنصة المركزية الحديثة لبناء وإدارة مواقع المدارس بسهولة. لوحة تحكم سحابية سريعة، متجاوبة، ومطورة لتعزيز إنتاجيتك.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/login"
                className="h-13 bg-white text-black px-8 py-3.5 rounded-xl font-bold flex items-center gap-3 transition-all hover:scale-[1.03] hover:shadow-[0_0_40px_rgba(255,255,255,0.15)] shadow-lg"
              >
                <LayoutDashboard size={18} />
                الوصول للوحة التحكم
              </Link>
              <Link
                href="#features"
                className="h-13 border border-white/10 text-gray-300 px-8 py-3.5 rounded-xl font-bold flex items-center gap-3 hover:border-white/30 hover:text-white transition-all"
              >
                تصفح المميزات
              </Link>
            </div>
          </motion.div>
        </section>

        {/* ── Features Section ── */}
        <section id="features" className="px-6 pb-32">
          <div className="max-w-6xl mx-auto">
            {/* Section header */}
            <motion.div
              ref={featuresRef}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <p className="text-xs font-mono text-gray-600 uppercase tracking-[0.3em] mb-4">
                المميزات
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
                كل ما تحتاجه في مكان واحد
              </h2>
              <p className="text-gray-500 max-w-lg mx-auto text-sm leading-relaxed">
                منصة متكاملة مبنية بأحدث التقنيات لتمنحك تحكماً كاملاً بلا تعقيد.
              </p>
            </motion.div>

            {/* Cards grid */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              className="grid grid-cols-1 md:grid-cols-3 gap-5"
            >
              {features.map((feat) => (
                <FeatureCard key={feat.title} {...feat} />
              ))}
            </motion.div>

            {/* Bottom divider with CTA */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="mt-20 flex flex-col items-center gap-5 text-center"
            >
              <div className="w-px h-16 bg-gradient-to-b from-transparent via-white/20 to-transparent" />
              <p className="text-gray-500 text-sm">جاهز للبدء؟</p>
              <Link
                href="/login"
                className="text-sm font-semibold text-white border border-white/15 px-6 py-2.5 rounded-full hover:bg-white/5 transition-all hover:border-white/30"
              >
                ابدأ الآن مجاناً ←
              </Link>
            </motion.div>
          </div>
        </section>
      </main>
    </div>
  );
}
