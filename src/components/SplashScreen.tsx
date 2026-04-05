"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Globe } from "lucide-react";

const SPLASH_KEY = "splash_shown";

export default function SplashScreen() {
  // Start hidden — we determine visibility after mount to avoid SSR flash
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Only show if this browser session has not yet seen the splash
    const alreadySeen = sessionStorage.getItem(SPLASH_KEY);
    if (alreadySeen) return;

    // Mark as seen immediately so sub-navigations never show it again
    sessionStorage.setItem(SPLASH_KEY, "1");
    setShow(true);

    const timer = setTimeout(() => setShow(false), 2200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="splash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center text-white"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="flex flex-col items-center gap-6 relative"
          >
            <motion.div
              animate={{
                scale: [1, 1.15, 1],
                boxShadow: [
                  "0px 0px 0px rgba(45, 91, 117, 0)",
                  "0px 0px 50px rgba(45, 91, 117, 0.8)",
                  "0px 0px 0px rgba(45, 91, 117, 0)",
                ],
              }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="w-28 h-28 bg-zinc-950 rounded-full flex items-center justify-center border border-zinc-800 shadow-xl z-10"
            >
              <Globe size={56} className="text-zinc-400" />
            </motion.div>

            <motion.div
              className="absolute -inset-10 bg-zinc-800/20 rounded-full blur-3xl"
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
            />

            <motion.div className="flex flex-col items-center gap-2">
              <motion.h1
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="text-4xl font-bold tracking-tight text-white drop-shadow-md"
              >
                اللوحة المركزية
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.8 }}
                className="text-zinc-500 tracking-widest text-sm font-mono"
              >
                MASTER DASHBOARD CMS
              </motion.p>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
