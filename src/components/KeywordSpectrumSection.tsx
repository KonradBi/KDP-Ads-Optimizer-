"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const KEYWORDS = [
  "machine learning",
  "self publishing",
  "kdp ads",
  "amazon kindle",
  "ai for writers",
  "book marketing",
  "keyword research",
  "passive income",
  "digital marketing",
  "regression analysis",
  "bayesian model",
  "long tail keywords",
];

export default function KeywordSpectrumSection() {
  const [optimized, setOptimized] = useState<number[]>([]);

  useEffect(() => {
    let idx = 0;
    const id = setInterval(() => {
      setOptimized((prev) => {
        // reset if all optimized
        if (prev.length === KEYWORDS.length) {
          return [0];
        }
        return [...prev, idx];
      });
      idx = (idx + 1) % KEYWORDS.length;
    }, 800);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="relative py-24 overflow-hidden bg-gradient-to-b from-slate-900/70 to-slate-900 px-4">
      {/* moving spectral scan */}
      <motion.div
        className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
        animate={{ x: ["-100%", "100%"] }}
        transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
        aria-hidden="true"
      />
      <div className="relative z-10 container mx-auto max-w-6xl text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Keyword Optimisation Spectrum
        </h2>
        <p className="text-lg text-slate-300 mb-12 max-w-3xl mx-auto">
          Watch how our algorithm shifts keywords from costly red to profitable green in real&nbsp;time.
        </p>
        <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
          {KEYWORDS.map((kw, i) => {
            const isOptimized = optimized.includes(i);
            return (
              <motion.span
                key={kw}
                className="px-3 py-1 rounded-full text-xs font-semibold shadow-md border border-white/10 select-none"
                initial={{ backgroundColor: "#dc2626" }}
                animate={
                  isOptimized
                    ? {
                        backgroundColor: ["#dc2626", "#facc15", "#4ade80"],
                        scale: [1, 1.1, 1],
                        boxShadow: [
                          "0 0 0px rgba(0,0,0,0)",
                          "0 0 8px rgba(250,204,21,0.6)",
                          "0 0 12px rgba(74,222,128,0.8)",
                        ],
                      }
                    : {}
                }
                transition={{ duration: 1.2 }}
                style={{ color: "white" }}
              >
                {kw}
              </motion.span>
            );
          })}
        </div>
      </div>
    </section>
  );
}
