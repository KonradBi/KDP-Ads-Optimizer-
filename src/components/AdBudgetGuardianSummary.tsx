"use client";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

// ---------------- KPI DATA -----------------
const beforeAcos = 42.3;
const afterAcos = 32.5;
const acosDiff = ((beforeAcos - afterAcos) / beforeAcos * 100).toFixed(1);

const CARDS = [
  { title: "Negative Keywords", value: "18", subtitle: "wasteful keywords found", detail: "Identify budget-draining keywords with precision", action: "Add as negative keywords", color: "red", icon: "🔍" },
  { title: "Bid Optimisation", value: "26", subtitle: "bid adjustments recommended", detail: "Get clear, actionable optimization steps", action: "Adjust bids manually in KDP", color: "orange", icon: "⚙️" },
] as const;

type ColorKey = "red" | "orange" | "amber" | "emerald";

// ---------------- Variants -----------------
const containerV = { 
  hidden: { opacity: 0 },
  show: { 
    opacity: 1, 
    transition: { 
      staggerChildren: 0.15, 
      delayChildren: 0.3,
      duration: 0.5
    } 
  } 
};

const cardV = { 
  hidden: { opacity: 0, y: 50, scale: 0.9 }, 
  show: { 
    opacity: 1, 
    y: 0, 
    scale: 1, 
    transition: { 
      duration: 0.7, 
      ease: [0.22, 1, 0.36, 1] 
    } 
  } 
};

const panelV = {
  hidden: { opacity: 0, y: 60 },
  show: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: 0.8, 
      ease: [0.22, 1, 0.36, 1],
      delay: 0.6
    } 
  }
};

// helpers
const gradient = (c: ColorKey) => ({
  red: "from-rose-600/90 to-red-800/90",
  orange: "from-[#FF9900]/90 to-orange-700/90", // Use #FF9900 from Hero
  amber: "from-amber-400/90 to-amber-700/90",
  emerald: "from-emerald-500/90 to-emerald-700/90",
}[c]);

const ring = (c: ColorKey) => ({
  red: "ring-rose-500/40",
  orange: "ring-[#FF9900]/40", // Use #FF9900 from Hero
  amber: "ring-amber-500/40",
  emerald: "ring-emerald-500/40",
}[c]);

// ---------------- Bar ----------------------
function Bar({ label, value, color, delay }: { label: string; value: number; color: ColorKey; delay: number }) {
  const barGrad = color === "red" ? "from-rose-500 to-red-700" : "from-emerald-500 to-emerald-700";
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm text-slate-300">
        <motion.span
          initial={{ opacity: 0, x: -10 }}
          whileInView={{ opacity: 1, x: 0, transition: { delay: delay * 0.8, duration: 0.5 } }}
          viewport={{ once: true }}
        >
          {label}
        </motion.span>
        <motion.span 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1, transition: { delay: delay + 0.8, duration: 0.5 } }}
          viewport={{ once: true }}
          className="font-semibold text-white"
        >
          {value.toFixed(1)}%
        </motion.span>
      </div>
      <div className="relative h-8 rounded-full bg-slate-800/60 overflow-hidden backdrop-blur-sm border border-slate-700/30 shadow-inner">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ 
            width: `${value}%`, 
            transition: { 
              delay, 
              duration: 1.5, 
              ease: [0.34, 1.56, 0.64, 1] 
            } 
          }}
          viewport={{ once: true, amount: 0.4 }}
          className={`absolute inset-0 rounded-full bg-gradient-to-r ${barGrad} shadow-[0_0_15px_rgba(0,0,0,0.3)]`}
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
      className="relative rounded-3xl px-6 lg:px-10 py-12 overflow-hidden ring-1 ring-white/10 shadow-2xl shadow-black/50 bg-gradient-to-b from-slate-900/95 to-slate-950/95"
    >
      {/* Animated background elements */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: [0.2, 0.3, 0.2], 
          transition: { 
            duration: 8, 
            repeat: Infinity, 
            repeatType: "reverse" 
          } 
        }}
        className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-[600px] w-[600px] rounded-full bg-[#1e3a8a]/20 blur-3xl" 
      />
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: [0.1, 0.2, 0.1], 
          scale: [1, 1.05, 1],
          transition: { 
            duration: 10, 
            repeat: Infinity, 
            repeatType: "reverse",
            delay: 1
          } 
        }}
        className="pointer-events-none absolute top-20 -right-20 h-[400px] w-[400px] rounded-full bg-amber-700/10 blur-3xl" 
      />

      {/* Title */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0, transition: { duration: 0.7 } }}
        className="relative z-10 mb-12 text-center"
      >
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white drop-shadow-md">Your Ad Budget Guardian <span className="inline-block animate-bounce">💰</span></h2>
        <p className="mt-3 text-slate-300 max-w-2xl mx-auto">Spot budget-draining keywords instantly. Get fixes that work.</p>
      </motion.div>

      {/* Main content area - Adjusted layout to stack cards above ACOS panel */}
      <div className="w-full space-y-10 lg:space-y-12"> 
        {/* KPI GRID - Now takes full width for card layout */}
        <motion.div className="grid grid-cols-1 sm:grid-cols-2 gap-8 lg:gap-10">
          {CARDS.map(({ color, icon, ...c }, index) => (
            <motion.div
              key={c.title}
              variants={cardV}
              custom={index}
              whileHover={{ y: -8, scale: 1.03, transition: { duration: 0.3 } }}
              className={`relative overflow-hidden rounded-2xl p-8 md:p-10 ring-1 backdrop-blur-2xl shadow-xl ${ring(color as ColorKey)} group`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${gradient(color as ColorKey)}`} />
              <motion.div 
                initial={{ opacity: 0.5 }}
                animate={{ 
                  opacity: [0.5, 0.7, 0.5], 
                  transition: { duration: 3, repeat: Infinity, repeatType: "reverse" } 
                }}
                className="absolute inset-0 bg-white/5 backdrop-blur-[2px]" 
                style={{ maskImage: "linear-gradient(to bottom, rgba(255,255,255,0.8), transparent)" }} 
              />
              
              {/* Decorative elements */}
              <div className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-white/10 blur-3xl opacity-0 group-hover:opacity-30 transition-opacity duration-700"></div>
              <div className="absolute -bottom-16 -left-16 h-32 w-32 rounded-full bg-white/10 blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-700"></div>

              <div className="relative z-10 text-white space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold uppercase tracking-wide opacity-90">{c.title}</p>
                  <span className="text-2xl">{icon}</span>
                </div>
                <motion.p 
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1, transition: { delay: 0.3 + index * 0.1, duration: 0.5 } }}
                  className="text-6xl font-extrabold drop-shadow-lg bg-clip-text text-transparent bg-gradient-to-b from-white to-white/70"
                >
                  {c.value}
                </motion.p>
                <p className="text-sm opacity-90 leading-snug font-medium">{c.subtitle}</p>
                <p className="text-xs italic opacity-70 leading-snug">{c.detail}</p>
                <motion.span 
                  whileHover={{ scale: 1.05, backgroundColor: "rgba(0,0,0,0.5)" }}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase mt-3 px-3 py-1.5 rounded-full bg-black/30 backdrop-blur-md ring-1 ring-white/10 cursor-pointer hover:ring-white/30 transition-all duration-300"
                >
                  <Check className="w-3.5 h-3.5" /> {c.action}
                </motion.span>
              </div>
            </motion.div>
          ))}
        </motion.div> 

        {/* ACOS Improvement Panel - Moved below cards and takes full width */}
        <motion.div 
          variants={panelV} 
          className="relative rounded-2xl overflow-hidden ring-1 ring-[#FF9900]/30 bg-gradient-to-br from-slate-900/90 to-slate-950/90 backdrop-blur-xl shadow-xl"
        >
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#FF9900]/0 via-[#FF9900]/80 to-[#FF9900]/0"></div>
          <div className="absolute -top-40 left-1/3 w-80 h-80 rounded-full bg-[#FF9900]/10 blur-3xl"></div>
          <div className="absolute -bottom-40 right-1/3 w-80 h-80 rounded-full bg-[#FF9900]/10 blur-3xl"></div>
          
          {/* header */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0, transition: { delay: 1.2, duration: 0.5 } }}
            className="px-8 py-6 bg-gradient-to-r from-orange-900/50 to-orange-950/50 border-b border-[#FF9900]/20 flex items-center gap-4"
          >
            <motion.span 
              whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.1, transition: { duration: 0.5 } }}
              className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[#FF9900]/20 font-bold text-[#FFCC80] text-lg shadow-lg shadow-orange-900/50 ring-1 ring-[#FF9900]/30"
            >
              %
            </motion.span>
            <div>
              <h3 className="text-white font-bold text-xl leading-none">ACOS Improvement</h3>
              <p className="text-sm text-[#FFCC80]/80 mt-1">See the difference optimisation makes</p>
            </div>
          </motion.div>
          
          {/* bars */}
          <div className="p-10 space-y-8">
            <Bar label="Before Optimisation" value={beforeAcos} color="red" delay={0.5} />
            <Bar label="After Optimisation" value={afterAcos} color="emerald" delay={1.6} />
            
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              whileInView={{ 
                opacity: 1, 
                y: 0, 
                scale: 1,
                transition: { delay: 2.8, duration: 0.7, ease: [0.22, 1, 0.36, 1] } 
              }}
              whileHover={{ scale: 1.02, transition: { duration: 0.3 } }}
              viewport={{ once: true, amount: 0.3 }}
              className="flex justify-between items-center bg-orange-900/30 border border-[#FF9900]/20 rounded-xl p-6 backdrop-blur-md mt-10 shadow-lg"
            >
              <span className="text-base font-semibold text-[#FFCC80]">↳ ACOS Reduction:</span>
              <motion.span 
                initial={{ scale: 1 }}
                animate={{ 
                  scale: [1, 1.1, 1],
                  transition: { delay: 3.5, duration: 1.5, ease: "easeInOut" }
                }}
                className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FFCC80] to-[#FF9900] drop-shadow-lg"
              >
                -{acosDiff}%
              </motion.span>
            </motion.div>
          </div>
        </motion.div> 
      </div>
    </motion.section>
  );
}
