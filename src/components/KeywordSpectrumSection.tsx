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

// Profit Boost als Prozentsatz
const STEP_PROFITS_PERCENT = [18, 26, 35, 35];

export default function KeywordActionPlanSection() {
  const controls = useAnimation();
  const [activeStep, setActiveStep] = useState(0);
  const [profitPercent, setProfitPercent] = useState(STEP_PROFITS_PERCENT[0]);
  
  // Auto-Animation durch die Schritte
  useEffect(() => {
    // Starte mit Step 1, gehe durch zu Step 4 in 5s Intervallen
    const autoInterval = setInterval(() => {
      setActiveStep(prev => (prev < STEPS.length - 1 ? prev + 1 : 0));
    }, 5000);
    
    return () => clearInterval(autoInterval);
  }, []);

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
    setProfitPercent(STEP_PROFITS_PERCENT[activeStep]);
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

    eliminate: (i: number) => {
      const isWasteful = wasteful.has(KEYWORDS[i]);
      return {
        backgroundColor: isWasteful ? ["#64748b", "#b91c1c", "#b91c1c"] : "#64748b", 
        opacity: isWasteful ? [1, 1, 0] : 1, 
        scale: isWasteful ? [1, 1, 0] : 1, 
        transition: {
          duration: 2.0, 
          times: [0, 0.3, 1], 
          ease: "easeInOut",
        },
      };
    },

    bids: (i: number) => {
      const kw = KEYWORDS[i];
      const isLowBid = lowBidSet.has(kw);
      const isHighBid = highBidSet.has(kw);

      // Determine target colors based on bid direction
      const startBg = "#64748b"; // Base slate color
      let peakBg: string;
      let endBg: string;
      let targetScale: number;
      let targetShadow: string;

      if (isLowBid) {
        peakBg = "#dc2626"; // Peak red-orange
        endBg = startBg; // Return to slate
        targetScale = 0.9;
        targetShadow = "rgba(220,38,38,0.6)";
      } else if (isHighBid) {
        peakBg = "#16a34a"; // Peak green
        endBg = "#22c55e"; // Stay green
        targetScale = 1.25;
        targetShadow = "rgba(22,163,74,0.7)"; // Green shadow
      } else {
        // Neutral keywords don't change color in this step
        peakBg = startBg;
        endBg = startBg;
        targetScale = 1;
        targetShadow = "transparent";
      }

      return {
        // Animate background color: Start -> Peak -> End
        backgroundColor: [startBg, peakBg, endBg],
        // Animate scale
        scale: [1, targetScale, 1],
        // Animate shadow for emphasis
        boxShadow: [
            "0 0 0px transparent",
            `0 0 10px ${targetShadow}`,
            "0 0 0px transparent"
        ],
        transition: { duration: 1.2, ease: "easeInOut", times: [0, 0.5, 1] },
      };
    },

    flip: (i: number) => {
      const kw = KEYWORDS[i];
      const isWastefulKeyword = wasteful.has(kw);
      const shouldFlip = !isWastefulKeyword && phraseSet.has(kw);
      // Determine persistent color from step 2
      const persistentColor = highBidSet.has(kw) ? "#22c55e" : "#64748b"; // Green if high bid, else slate

      return {
        rotateY: shouldFlip ? [0, 180, 0] : 0,
        transition: { duration: shouldFlip ? 1.2 : 0 },
        // Maintain color from previous step
        backgroundColor: persistentColor,
        scale: 1, // Ensure scale is reset
        boxShadow: "0 0 0px transparent" // Ensure shadow is reset
      };
    },

    reorder: (i: number) => {
      const kw = KEYWORDS[i];
      // Determine final group color for step 4
      let finalColor = "#64748b"; // Default to slate (neutral)
      if (highBidSet.has(kw)) {
        finalColor = "#22c55e"; // Green for increased bids
      } else if (lowBidSet.has(kw)) {
        finalColor = "#3b82f6"; // Blue for decreased bids
      }
      // Wasteful keywords should stay hidden
      const isWastefulKeyword = wasteful.has(kw);

      return {
        opacity: isWastefulKeyword ? 0 : 1,
        scale: isWastefulKeyword ? 0 : 1, // Keep wasteful hidden
        backgroundColor: finalColor,
        rotateY: 0,
        boxShadow: "0 0 0px transparent"
      };
    },
  };

  return (
    // Reverted: Removed negative margins - full width handled by parent
    <section className="w-full py-16 lg:py-24 overflow-hidden">
      <div className="container mx-auto max-w-6xl px-4 md:px-6 relative z-10">
        <motion.h2 
          className="text-4xl md:text-5xl font-bold mb-4 text-center drop-shadow-lg bg-gradient-to-r from-amber-300 via-amber-400 to-orange-500 bg-clip-text text-transparent"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          Guided Action Plan
        </motion.h2>
        <p className="text-lg text-slate-300 mb-12 max-w-3xl mx-auto">Click a step to preview the optimisation phase.</p>

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
                className="relative px-4 py-2 rounded-lg text-sm font-medium shadow-xl bg-slate-600 text-white select-none"
              >
                <span className="invisible">{kw}</span>
                <div style={{ backfaceVisibility: "hidden" }} className="absolute inset-0 flex items-center justify-center">{kw}</div>
                <div style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }} className="absolute inset-0 flex items-center justify-center bg-blue-500 rounded-lg">
                  Phrase Match
                </div>
              </motion.div>
            );
          })}
        </motion.div>

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

        <div className="flex items-center justify-center space-x-2">
          <span className="text-2xl text-slate-300">Profit Boost:</span>
          <motion.span key={profitPercent} className="text-5xl font-black text-green-400 drop-shadow-2xl" initial={{ scale: 1 }} animate={{ scale: [1, 1.25, 1] }} transition={{ duration: 0.6 }}>
            +{profitPercent}%
          </motion.span>
        </div>
      </div>
    </section>
  );
}
