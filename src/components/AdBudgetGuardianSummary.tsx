"use client";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

// ---------------- KPI DATA -----------------
const beforeAcos = 42.3;
const afterAcos = 32.5;
const acosDiff = +(beforeAcos - afterAcos).toFixed(1); // 9.8

const CARDS = [
  { title: "Negative Keywords", value: "18", subtitle: "wasteful keywords found", detail: "$237.50 spent with no conversions", action: "Add as negative keywords", color: "red" },
  { title: "Bid Optimisation", value: "26", subtitle: "bid adjustments recommended", detail: "14 decreases & 12 increases", action: "Adjust bids manually in KDP", color: "orange" },
  { title: "Match Types", value: "8", subtitle: "match type improvements", detail: "Broad → Phrase / Exact", action: "Update match types in KDP", color: "amber" },
  { title: "ACOS Improvement", value: `-${acosDiff}%`, subtitle: "potential ACOS reduction", detail: `${beforeAcos}% → ${afterAcos}%`, action: "Follow optimisation plan", color: "emerald" },
] as const;

type ColorKey = "red" | "orange" | "amber" | "emerald";

// ---------------- Variants -----------------
const containerV = { show: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } } };
const cardV = { hidden: { opacity: 0, y: 35, scale: 0.94 }, show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.55, ease: "easeOut" } } };

// helpers
const gradient = (c: ColorKey) => ({
  red: "from-[#b91c1c]/80 to-[#7f1d1d]/80",
  orange: "from-[#eb6a00]/80 to-[#c2410c]/80",
  amber: "from-[#d97706]/80 to-[#92400e]/80",
  emerald: "from-[#059669]/80 to-[#065f46]/80",
}[c]);

const ring = (c: ColorKey) => ({
  red: "ring-red-500/40",
  orange: "ring-orange-500/40",
  amber: "ring-amber-500/40",
  emerald: "ring-emerald-500/40",
}[c]);

// ---------------- Bar ----------------------
function Bar({ label, value, color, delay }: { label: string; value: number; color: ColorKey; delay: number }) {
  const barGrad = color === "red" ? "from-red-500 to-red-700" : "from-emerald-500 to-emerald-700";
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs text-slate-300">
        <span>{label}</span>
        <span className="font-semibold text-white">{value.toFixed(1)}%</span>
      </div>
      <div className="relative h-5 rounded bg-slate-700/40 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${value}%`, transition: { delay, duration: 1.2, ease: "easeInOut" } }}
          viewport={{ once: true, amount: 0.4 }}
          className={`absolute inset-0 rounded bg-gradient-to-r ${barGrad} shadow-[0_0_10px_2px_rgba(0,0,0,0.25)]`}
        />
      </div>
    </div>
  );
}

// ---------------- Component ----------------
export default function AdBudgetGuardianSummary() {
  useEffect(() => {
    document.documentElement.style.setProperty("--tw-ring-offset-shadow", "0 0 #0000");
  }, []);

  return (
    <motion.section
      variants={containerV}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.25 }}
      className="relative rounded-3xl px-4 lg:px-8 py-10 lg:py-16 overflow-hidden ring-1 ring-white/5 shadow-2xl shadow-black/50 bg-gradient-to-br from-[#0a0f1a] via-[#0b1321] to-[#05070c]"
    >
      {/* radial spotlight */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-[600px] w-[600px] rounded-full bg-[#1e3a8a]/20 blur-3xl" />

      {/* KPI GRID */}
      <motion.div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-12">
        {CARDS.map(({ color, ...c }) => (
          <motion.div
            key={c.title}
            variants={cardV}
            whileHover={{ y: -5, scale: 1.04 }}
            className={`relative overflow-hidden rounded-2xl p-8 ring-1 backdrop-blur-2xl ${ring(color as ColorKey)}`}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${gradient(color as ColorKey)}`} />
            <div className="absolute inset-0 bg-white/5 backdrop-blur-[2px]" style={{ maskImage: "linear-gradient(to bottom, rgba(255,255,255,0.8), transparent)" }} />

            <div className="relative z-10 text-white space-y-1">
              <p className="text-[13px] font-semibold uppercase tracking-wide opacity-90">{c.title}</p>
              <p className="text-5xl font-extrabold drop-shadow-lg">{c.value}</p>
              <p className="text-xs opacity-90 leading-snug">{c.subtitle}</p>
              <p className="text-[11px] italic opacity-70 leading-snug">{c.detail}</p>
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase mt-3 px-2 py-0.5 rounded bg-black/30 backdrop-blur ring-1 ring-white/10">
                <Check className="w-3 h-3" /> {c.action}
              </span>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* ACOS PANEL */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }}
        viewport={{ once: true, amount: 0.25 }}
        className="relative z-10 rounded-2xl overflow-hidden ring-1 ring-indigo-700/50 shadow-xl shadow-black/40 bg-gradient-to-br from-[#0f172a] via-[#111827] to-black"
      >
        {/* header */}
        <div className="px-6 py-5 bg-gradient-to-r from-indigo-950/70 to-indigo-900/60 border-b border-indigo-800/40 flex items-center gap-3">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600/40 font-bold text-indigo-100 text-sm">%</span>
          <div>
            <h3 className="text-white font-bold leading-none">ACOS Improvement</h3>
            <p className="text-xs text-indigo-200/80">See the difference optimisation makes</p>
          </div>
        </div>
        {/* bars */}
        <div className="p-8 space-y-6">
          <Bar label="Before Optimisation" value={beforeAcos} color="red" delay={0.3} />
          <Bar label="After Optimisation" value={afterAcos} color="emerald" delay={1.4} />
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0, transition: { delay: 2.6, duration: 0.6 } }}
            viewport={{ once: true, amount: 0.3 }}
            className="flex justify-between items-center bg-indigo-800/50 border border-indigo-700/40 rounded-lg p-3 backdrop-blur-md"
          >
            <span className="text-sm font-semibold text-indigo-100">↳ ACOS Reduction:</span>
            <span className="text-2xl font-black text-indigo-50 drop-shadow-sm">-{acosDiff}%</span>
          </motion.div>
        </div>
      </motion.div>
    </motion.section>
  );
}
