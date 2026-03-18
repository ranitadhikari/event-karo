'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, ArrowRight, Zap } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export const FloatingBanner = () => {
  const [isVisible, setIsVisible] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Show banner after 2 seconds
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  // Don't show on the event page itself or in admin/college dashboards
  const isExcludedPage = pathname.includes('/event/codesphere-hackathon') || 
                         pathname.includes('/admin') || 
                         pathname.includes('/college/dashboard');

  if (isExcludedPage) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] w-[95%] max-w-2xl"
        >
          <div className="relative group">
            {/* Glow Effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-primary via-purple-500 to-amber-500 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-1000 group-hover:duration-200 animate-pulse" />
            
            <div className="relative bg-slate-900/90 backdrop-blur-2xl border border-white/10 rounded-2xl p-4 md:p-5 flex items-center justify-between gap-6 shadow-2xl">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
                  <Zap className="h-6 w-6 text-primary fill-current" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Live Now</p>
                  </div>
                  <h4 className="text-white font-black text-sm md:text-base uppercase tracking-tight">CodeSphere Hackathon 2026</h4>
                  <p className="text-slate-400 text-xs font-medium hidden md:block">₹1.5 Lakh Prize Pool • SGT University • Register Today!</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Link href="/event/codesphere-hackathon">
                  <button className="bg-primary hover:bg-primary/90 text-white font-bold uppercase tracking-widest text-[10px] px-5 h-10 rounded-xl transition-all shadow-lg shadow-primary/20 flex items-center gap-2 group/btn whitespace-nowrap">
                    Join Now
                    <ArrowRight className="h-3 w-3 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </Link>
                <button 
                  onClick={() => setIsVisible(false)}
                  className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors text-slate-500"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
