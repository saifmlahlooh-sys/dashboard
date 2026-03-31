"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Globe } from "lucide-react";

export default function SplashScreen() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    // 2.2 seconds display + 0.8s fade out = Total ~3s
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
          className="fixed inset-0 z-[100] bg-coastal-darkest flex flex-col items-center justify-center text-white"
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
                  "0px 0px 0px rgba(45, 91, 117, 0)"
                ]
              }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="w-28 h-28 bg-coastal-dark rounded-full flex items-center justify-center border border-coastal-DEFAULT shadow-xl z-10"
            >
              <Globe size={56} className="text-coastal-light" />
            </motion.div>
            
            <motion.div 
              className="absolute -inset-10 bg-coastal-DEFAULT/20 rounded-full blur-3xl"
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
            />

            <motion.div className="flex flex-col items-center gap-2">
              <motion.h1 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="text-4xl font-bold font-sans tracking-tight text-white drop-shadow-md"
              >
                اللوحة المركزية
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.8 }}
                className="text-coastal-light tracking-widest text-sm"
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
