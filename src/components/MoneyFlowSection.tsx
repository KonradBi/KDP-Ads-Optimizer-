"use client";

import { motion, animate } from "framer-motion";
import { useEffect, useState } from "react";
import { CircleDollarSign, Filter, Trash2 } from "lucide-react";

const TOTAL_PROFIT = 123; // demo amount

export default function MoneyFlowSection() {
  const [profit, setProfit] = useState(0);

  useEffect(() => {
    // simple counter animation
    const controls = animate(0, TOTAL_PROFIT, {
      duration: 4,
      onUpdate: (latest: number) => setProfit(Math.round(latest))
    });
    return () => controls.stop();
  }, []);

  const coins = Array.from({ length: 10 });
  // for demo: even indices accepted, odd rejected

  // Define animation variants outside the map for clarity
  const acceptedAnimation = {
    x: ["-50%", "180%"], // Move across
    y: -10,
    opacity: [0, 1, 1, 0], // Fade in, stay visible, fade out at end
    backgroundColor: ["#f87171", "#facc15", "#4ade80"], // Red -> Yellow -> Green
    scale: [1, 1, 1, 0.5] // Optional: shrink slightly on fade out
  };

  const rejectedAnimation = {
    // Keyframes for bounce effect
    x: ["-50%", "50%", "48%", "50%"], // Move to filter -> Bounce back X -> Settle X for fall
    y: [-10,    -10,  -15,    60],    // Move to filter -> Bounce up Y -> Fall down
    opacity: [0, 1, 1, 1, 0.5],    // Fade in -> Hit -> Bounce -> Falling -> Fade out near bottom
    backgroundColor: ["#f87171", "#dc2626"], // Red -> Darker Red
    rotate: [0, 0, -10, 5],           // Optional: add slight rotation during bounce/fall
    scale: [1, 1, 1.1, 1]           // Optional: slightly bigger on bounce
  };

  const baseTransition = {
    duration: 4, // Slightly increased duration for more detail
    ease: "easeInOut",
    repeat: Infinity, 
    repeatType: "loop",
  };

  return (
    <section className="w-full py-24 relative overflow-hidden px-4 bg-gradient-to-b from-slate-900/70 to-slate-900">
      <div className="absolute inset-0 bg-[url('/bg-grid.svg')] opacity-5" />
      <div className="container mx-auto max-w-6xl relative z-10 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Turn Wasted Ad Spend into Pure Profit</h2>
        <p className="text-lg text-slate-300 mb-12 max-w-3xl mx-auto">
          Watch how our state‑of‑the‑art algorithm filters out wasteful spend and channels every cent into profit.
        </p>

        {/* Animation rail */}
        <div className="relative mx-auto max-w-4xl h-40">
          {/* Labels */}
          <span className="absolute -left-4 top-1/2 -translate-y-1/2 text-sm text-red-400 rotate-[-7deg]">Ad Spend</span>
          <span className="absolute right-0 top-1/2 -translate-y-1/2 text-sm text-emerald-400 rotate-[7deg]">Profit</span>
          {/* Waste bin */}
          <Trash2 className="absolute left-1/2 -translate-x-1/2 bottom-0 text-red-500 w-8 h-8" />
          {/* Smart filter icon */}
          <Filter className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 text-indigo-400 w-8 h-8 animate-pulse" />

          {/* Coins */}
          {coins.map((_, i) => {
            const accepted = i % 2 === 0;
            const delay = i * 0.3;
            // Define specific transition per coin
            const transitionConfig = {
              ...baseTransition,
              repeatType: baseTransition.repeatType as "loop" | "reverse" | "mirror" | undefined, // Fix TS error
              delay,
              // Times needs to match the longest keyframe array (opacity for rejected has 5 values)
              times: accepted ? [0, 0.1, 0.9, 1] : [0, 0.4, 0.5, 0.8, 1],
              // Scale repeat delay based on new duration and number of coins
              repeatDelay: coins.length * 0.3 * (baseTransition.duration / 3.5)
            };

            return (
              <motion.div
                key={i}
                initial={{ x: -50, y: -10, opacity: 0 }}
                animate={accepted ? acceptedAnimation : rejectedAnimation} // Use defined variants
                transition={transitionConfig} // Use coin-specific transition
                className="absolute w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-slate-800 shadow-md"
                style={{ top: "40%" }}
              >
                <CircleDollarSign className="w-4 h-4" />
              </motion.div>
            );
          })}
        </div>

        {/* Profit Counter */}
        <div className="mt-12 flex items-center justify-center space-x-3">
          <span className="text-2xl text-slate-300">Profit:&nbsp;</span>
          <motion.span
            className="text-4xl font-extrabold text-emerald-400 drop-shadow-lg"
            key={profit}
          >
            ${profit}
          </motion.span>
        </div>
      </div>
    </section>
  );
}
