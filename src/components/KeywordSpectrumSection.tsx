"use client";

import { useEffect, useState, useMemo } from "react";
import { motion, Variants, useAnimation } from "framer-motion";
import { Check } from "lucide-react";

/**
 * Keyword Action Plan – refined visuals
 * -------------------------------------------------
 * STEP 1  Stop Money Drains   → wasteful keywords fade + shrink (slower), others stay; base color = indigo
 * STEP 2  Fine‑tune Bids      → low‑bid (even) cool blue shrink | high‑bid (odd) lime pop
 * STEP 3  Increase Precision  → only high‑bid cards flip to Phrase Match
 * STEP 4  Optimise Groups     → reorder: high‑bid (green) ➜ low‑bid (blue) ➜ neutral (indigo)
 * -------------------------------------------------
 */

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

const STEPS = [
  { title: "Stop Money Drains", description: "18 wasteful keywords eliminated" },
  { title: "Fine‑tune Your Bids", description: "Dynamic bid adjustments visualised" },
  { title: "Increase Keyword Precision", description: "Broad → Phrase (subset)" },
  { title: "Optimise Ad Group Structure", description: "Sort by bid category" },
];

const TOTAL_PROFIT = 120;
const PROFIT_PER_STEP = Math.floor(TOTAL_PROFIT / STEPS.length);

export default function KeywordActionPlanSection() {
  const controls = useAnimation();
  const [activeStep, setActiveStep] = useState(0);
  const [profit, setProfit] = useState(PROFIT_PER_STEP);

  // CATEGORY INDICES -------------------------------------
  const wasteful = useMemo(() => new Set(KEYWORDS.filter((_, i) => i % 3 === 0)), []);
  const lowBidSet = useMemo(() => new Set(KEYWORDS.filter((_, i) => !wasteful.has(KEYWORDS[i]) && i % 2 === 0)), [wasteful]);
  const highBidSet = useMemo(() => new Set(KEYWORDS.filter((_, i) => !wasteful.has(KEYWORDS[i]) && i % 2 === 1)), [wasteful]);
  const phraseSet = useMemo(() => new Set(KEYWORDS.filter((_, i) => highBidSet.has(KEYWORDS[i]) && i % 4 === 1)), [highBidSet]);
  // -------------------------------------------------------

  // initial animation
  useEffect(() => {
    controls.start(stepKey(0));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // handle step change
  useEffect(() => {
    controls.start(stepKey(activeStep));
    setProfit(PROFIT_PER_STEP * (activeStep + 1));
  }, [activeStep, controls]);

  // helper
  const stepKey = (s: number) => (s === 0 ? "eliminate" : s === 1 ? "bids" : s === 2 ? "flip" : "reorder");

  // order for step4
  const ordered = useMemo(() => {
    if (activeStep !== 3) return KEYWORDS;
    const high = KEYWORDS.filter(k => highBidSet.has(k));
    const low = KEYWORDS.filter(k => lowBidSet.has(k));
    const neutral = KEYWORDS.filter(k => !highBidSet.has(k) && !lowBidSet.has(k) && !wasteful.has(k));
    return [...high, ...low, ...neutral];
  }, [activeStep, highBidSet, lowBidSet, wasteful]);

  // variants
  const cardVariants: Variants = {
    initial: { opacity: 1, rotateY: 0, scale: 1 },

    eliminate: (i: number) => ({
      opacity: wasteful.has(KEYWORDS[i]) ? 0 : 1,
      scale: wasteful.has(KEYWORDS[i]) ? 0 : 1,
      transition: { duration: 2.5, ease: "easeInOut" },
    }),

    bids: (i: number) => {
      const kw = KEYWORDS[i];
      if (wasteful.has(kw)) return { opacity: 0, scale: 0 };
      const lower = lowBidSet.has(kw);
      return {
        y: lower ? [0, 6, 0] : [0, -6, 0],
        scale: lower ? [1, 0.9, 1] : [1, 1.25, 1],
        backgroundColor: lower
          ? ["#38bdf8", "#0ea5e9", "#38bdf8"] // cyan shades for lower bids
          : ["#4ade80", "#22c55e", "#4ade80"], // green shades for higher bids
        boxShadow: lower
          ? ["0 0 0px transparent", "0 0 6px rgba(14,165,233,0.6)", "0 0 0px transparent"]
          : ["0 0 0px transparent", "0 0 10px rgba(34,197,94,0.7)", "0 0 0px transparent"],
        transition: { duration: 1 },
      };
    },

    flip: (i: number) => ({
      rotateY: phraseSet.has(KEYWORDS[i]) ? [0, 180, 0] : 0,
      transition: { duration: phraseSet.has(KEYWORDS[i]) ? 1.2 : 0 },
    }),

    reorder: { opacity: 1 },
  };

  return (
    // Apply standard section styling: full width, gradient background, padding
    <section className="w-full py-16 lg:py-24 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-900/60 via-amber-950/80 to-slate-900 overflow-hidden">
      {/* Container for content alignment and max-width */}
      <div className="container mx-auto max-w-6xl px-4 md:px-6 relative z-10">
        <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4 drop-shadow-lg">Keyword Action Plan</h2>
        <p className="text-lg text-slate-300 mb-12 max-w-3xl mx-auto">Click a step to preview the optimisation phase.</p>

        {/* Keyword Grid */}
        <motion.div layout className="flex flex-wrap justify-center gap-3 mb-12">
          {ordered.map((kw) => {
            const i = KEYWORDS.indexOf(kw);
            return (
              <motion.div
                key={kw}
                custom={i}
                variants={cardVariants}
                initial="initial"
                animate={controls}
                layout
                style={{ transformStyle: "preserve-3d" }}
                className="relative px-4 py-2 rounded-lg text-sm font-medium shadow-md bg-indigo-600 text-white select-none"
              >
                {/* spacer */}
                <span className="invisible">{kw}</span>
                <div style={{ backfaceVisibility: "hidden" }} className="absolute inset-0 flex items-center justify-center">{kw}</div>
                <div style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }} className="absolute inset-0 flex items-center justify-center bg-blue-800 rounded-lg">
                  Phrase Match
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Steps */}
        <ul className="space-y-4 mb-12 max-w-md mx-auto text-left">
          {STEPS.map(({ title, description }, idx) => (
            <motion.li
              key={title}
              initial={false}
              animate={{ opacity: activeStep === idx ? 1 : 0.4, x: activeStep === idx ? 0 : -15 }}
              transition={{ duration: 0.4 }}
              className="flex items-start space-x-3 cursor-pointer"
              onClick={() => setActiveStep(idx)}
            >
              <span className="mt-1 text-lg font-bold text-white">
                {activeStep >= idx ? <Check className="inline w-5 h-5 text-green-400" /> : <span className="inline-block w-5 h-5 rounded-full bg-gray-700 text-center text-xs text-gray-400">{idx + 1}</span>}
              </span>
              <div>
                <h3 className="text-xl font-semibold text-white">{title}</h3>
                <p className="text-sm text-slate-300">{description}</p>
              </div>
            </motion.li>
          ))}
        </ul>

        {/* Profit */}
        <div className="flex items-center justify-center space-x-2">
          <span className="text-2xl text-slate-300">Total Profit:</span>
          <motion.span key={profit} className="text-5xl font-black text-green-400 drop-shadow-2xl" initial={{ scale: 1 }} animate={{ scale: [1, 1.25, 1] }} transition={{ duration: 0.6 }}>
            ${profit}
          </motion.span>
        </div>
      </div>
    </section>
  );
}
