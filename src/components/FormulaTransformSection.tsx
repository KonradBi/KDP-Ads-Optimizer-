"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Euro, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";

export default function FormulaTransformSection() {
  const formulas = [
    "P(A|B)=P(B|A)P(A)/P(B)",
    "y = β₀ + β₁x",
    "σ = √Σ(xᵢ-μ)² / n",
    "ƒ(x) = ax² + bx + c",
  ];

  const [stage, setStage] = useState<"formula" | "profit">("formula");

  useEffect(() => {
    const id = setInterval(() => {
      setStage((prev) => (prev === "formula" ? "profit" : "formula"));
    }, 4000);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="relative py-24 bg-gradient-to-b from-slate-900/70 to-slate-900 overflow-hidden px-4">
      <div className="container mx-auto max-w-6xl text-center relative z-10">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Turning Math into Profit
        </h2>
        <p className="text-lg text-slate-300 mb-12 max-w-3xl mx-auto">
          Complex models seamlessly morph into tangible revenue growth.
        </p>

        <div className="relative h-60">
          {formulas.map((formula, i) => {
            const angle = (i / formulas.length) * Math.PI * 2;
            const radius = 120;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;

            return (
              <AnimatePresence key={`${i}-${stage}`}> {/* Ensure re-render on stage change */}
                {stage === "formula" ? (
                  <motion.span
                    key="formula"
                    initial={{ opacity: 0, scale: 0.8, rotate: -45 }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                      rotate: 360,
                    }}
                    exit={{ opacity: 0, scale: 0.8, rotate: 45 }}
                    transition={{ duration: 0.8, rotate: { duration: 6, repeat: Infinity, ease: "linear" } }}
                    className="absolute text-slate-300 font-mono whitespace-nowrap select-none"
                    style={{ left: `calc(50% + ${x}px)`, top: `calc(50% + ${y}px)` }}
                  >
                    {formula}
                  </motion.span>
                ) : (
                  <motion.span
                    key="profit"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1.2 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    transition={{ duration: 0.8 }}
                    className="absolute text-emerald-400 select-none"
                    style={{ left: `calc(50% + ${x}px)`, top: `calc(50% + ${y}px)` }}
                  >
                    <Euro className="w-8 h-8" />
                  </motion.span>
                )}
              </AnimatePresence>
            );
          })}
        </div>
      </div>
    </section>
  );
}
