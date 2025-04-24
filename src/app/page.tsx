"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView, AnimatePresence, Variants } from 'framer-motion';
import Link from 'next/link';
import {
  BarChart3, TrendingDown, TrendingUp, AlertCircle, Check, CheckCircle2, ArrowRight,
  DollarSign, Users, Zap, ShieldCheck, Brain, Activity, PieChart
} from 'lucide-react';
import Image from "next/image";
import KeywordSpectrumSection from "../components/KeywordSpectrumSection";
import BidWhispererTable from '../components/BidWhispererTable';

// Animated ACOS Comparison Component
const AnimatedAcosComparison = () => {
  const [animationStep, setAnimationStep] = useState(0);
  const ref = useRef(null); 
  const isInView = useInView(ref, { once: true, amount: 0.3 }); 

  useEffect(() => {
    if (isInView) {
      const timers = [
        setTimeout(() => setAnimationStep(1), 300), 
        setTimeout(() => setAnimationStep(2), 1300), 
        setTimeout(() => setAnimationStep(3), 2300), 
      ];
      return () => timers.forEach(clearTimeout);
    }
  }, [isInView]);

  const containerVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut", staggerChildren: 0.2 }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  const barVariants: Variants = {
    initial: { width: '0%' },
    animate: (width: string) => ({
      width: width,
      transition: { duration: 1.5, ease: [0.25, 1, 0.5, 1] } 
    })
  };

  const badgeVariants: Variants = {
    hidden: { opacity: 0, scale: 0.8, y: 10 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { delay: 0.5, duration: 0.5, type: 'spring', stiffness: 100 }
    }
  };

  return (
    <motion.div
      ref={ref}
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      className="max-w-lg mx-auto mt-8 mb-10 bg-slate-900/90 rounded-xl backdrop-blur-md border border-slate-700/80 shadow-xl shadow-indigo-900/20 overflow-hidden transform transition-all duration-500 hover:translate-y-[-4px] hover:shadow-2xl hover:shadow-indigo-700/20"
    >
      <motion.div variants={itemVariants} className="px-5 py-4 border-b border-slate-700/80 bg-gradient-to-r from-slate-800 to-slate-900/80">
        <h3 className="text-xl font-bold text-slate-100 flex items-center">
          <span className="bg-[#FF9900]/20 p-1.5 rounded-lg mr-2">
            <BarChart3 className="w-5 h-5 text-[#FF9900]" />
          </span>
          ACOS Comparison
        </h3>
      </motion.div>
      
      <div className="p-5 space-y-4">
        {/* Current ACOS Bar */}
        <motion.div variants={itemVariants}>
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-sm font-medium text-slate-300">Current ACOS</span>
            <motion.span 
              key={`current-${animationStep}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: animationStep >= 1 ? 1 : 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-sm font-semibold text-red-400"
            >
              42.3%
            </motion.span>
          </div>
          <div className="h-10 bg-gradient-to-r from-red-900/30 to-red-700/30 relative rounded overflow-hidden">
            <motion.div
              variants={barVariants}
              initial="initial"
              animate={animationStep >= 1 ? "animate" : "initial"}
              custom="42.3%" 
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-red-500/40 to-red-600/60 flex items-center justify-end pr-3 text-slate-100 font-bold text-sm"
            >
              {/* Text inside bar can be added if needed */}
            </motion.div>
          </div>
        </motion.div>

        {/* Estimated ACOS Bar */}
        <motion.div variants={itemVariants}>
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-sm font-medium text-slate-300">Estimated ACOS (Optimized)</span>
            <motion.span 
              key={`estimated-${animationStep}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: animationStep >= 2 ? 1 : 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-sm font-semibold text-green-400"
            >
              32.5%
            </motion.span>
          </div>
          <div className="h-10 bg-gradient-to-r from-green-900/30 to-green-700/30 relative rounded overflow-hidden">
            <motion.div
              variants={barVariants}
              initial="initial"
              animate={animationStep >= 2 ? "animate" : "initial"}
              custom="32.5%" 
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-green-500/40 to-green-600/60 flex items-center justify-end pr-3 text-slate-100 font-bold text-sm"
            >
              {/* Text inside bar */}
            </motion.div>
          </div>
        </motion.div>
        
        {/* Improvement Badge */}
        <motion.div 
          variants={itemVariants} 
          className="flex justify-between items-center py-3 px-5 bg-gradient-to-r from-indigo-900/40 to-indigo-800/20 rounded-lg border border-indigo-700/40 mt-3 shadow-md shadow-indigo-900/10"
        >
          <span className="text-slate-100 font-medium flex items-center">
            <TrendingDown className="w-4 h-4 mr-1.5 text-[#FF9900]" />
            ACOS Reduction:
          </span>
          <motion.span
            key={`badge-${animationStep}`} 
            variants={badgeVariants}
            initial="hidden"
            animate={animationStep >= 3 ? "visible" : "hidden"}
            className="text-lg font-bold text-indigo-300 bg-indigo-900/50 px-3 py-1 rounded-full shadow-md shadow-indigo-900/30"
          >
            -23.2% 
          </motion.span>
        </motion.div>
      </div>
    </motion.div>
  );
};

// Overall Dashboard Mockup Component
const OverallDashboardMockup = () => {
  return (
    <div className="max-w-lg mx-auto p-4 bg-slate-900/80 rounded-xl backdrop-blur-sm border border-slate-700/80 shadow-lg shadow-amber-500/10 space-y-3">
      <div className="grid grid-cols-2 gap-3">
        {/* Current ACOS */}
        <div className="bg-slate-800/90 p-3 rounded-lg border border-slate-700/50 flex items-center justify-between hover:border-slate-600/70 transition-colors duration-300">
          <div className="flex items-center">
            <div className="w-9 h-9 rounded-full bg-slate-700/80 flex items-center justify-center mr-2 text-blue-300">
              <TrendingDown className="w-5 h-5" />
            </div>
            <span className="text-xs font-medium text-slate-300">Current ACOS</span>
          </div>
          <span className="text-base font-bold text-slate-100">42.3%</span>
        </div>
        {/* Estimated ACOS */}
        <div className="bg-slate-800/90 p-3 rounded-lg border border-slate-700/50 flex items-center justify-between hover:border-slate-600/70 transition-colors duration-300">
          <div className="flex items-center">
            <div className="w-9 h-9 rounded-full bg-slate-700/80 flex items-center justify-center mr-2 text-green-300">
              <TrendingUp className="w-5 h-5" />
            </div>
            <span className="text-xs font-medium text-slate-300">Estimated ACOS</span>
          </div>
          <span className="text-base font-bold text-slate-100">32.5%</span>
        </div>
        {/* Total Spend */}
        <div className="bg-slate-800/90 p-3 rounded-lg border border-slate-700/50 flex items-center justify-between hover:border-slate-600/70 transition-colors duration-300">
          <div className="flex items-center">
            <div className="w-9 h-9 rounded-full bg-slate-700/80 flex items-center justify-center mr-2 text-purple-300">
              <DollarSign className="w-5 h-5" />
            </div>
            <span className="text-xs font-medium text-slate-300">Total Spend</span>
          </div>
          <span className="text-base font-bold text-slate-100">$1,234</span>
        </div>
        {/* Conversion Rate */}
        <div className="bg-slate-800/90 p-3 rounded-lg border border-slate-700/50 flex items-center justify-between hover:border-slate-600/70 transition-colors duration-300">
          <div className="flex items-center">
            <div className="w-9 h-9 rounded-full bg-slate-700/80 flex items-center justify-center mr-2 text-pink-300">
              <Activity className="w-5 h-5" />
            </div>
            <span className="text-xs font-medium text-slate-300">Conv. Rate</span>
          </div>
          <span className="text-base font-bold text-slate-100">5.8%</span>
        </div>
      </div>
      {/* Chart placeholder */}
      <div className="h-20 bg-slate-800/70 rounded-lg border border-slate-700/50 flex items-center justify-center text-slate-500 text-xs italic">
        Performance Chart Area
      </div>
    </div>
  );
};

export default function Home() {
  const bidWhispererRef = useRef(null);
  const bidWhispererInView = useInView(bidWhispererRef, { once: true, amount: 0.2 });

  const sectionVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const bidWhispererContainerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2, 
        delayChildren: 0.3, 
      }
    }
  };

  const textSectionVariants: Variants = {
    hidden: { opacity: 0, x: -30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  const tableSectionVariants: Variants = {
    hidden: { opacity: 0, x: 30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  const bulletPointVariants: Variants = {
    hidden: { opacity: 0, x: -15 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.4, ease: "easeOut" }
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between bg-gradient-to-b from-slate-950 via-slate-950 to-indigo-950 text-slate-100 overflow-x-hidden">
      {/* Bid Whisperer Section */}
      <motion.section 
        ref={bidWhispererRef}
        variants={sectionVariants}
        initial="hidden"
        animate={bidWhispererInView ? "visible" : "hidden"}
        className="w-full max-w-6xl px-4 py-20 md:py-32 bg-gradient-radial from-amber-900/30 via-amber-950/40 to-transparent to-70% rounded-t-3xl border-t border-x border-amber-800/30 shadow-xl shadow-amber-900/10"
      >
        <motion.div 
          variants={bidWhispererContainerVariants}
          initial="hidden"
          animate={bidWhispererInView ? "visible" : "hidden"}
          className="grid md:grid-cols-2 gap-12 items-center"
        >
          {/* Left Text Content */}
          <motion.div variants={textSectionVariants}>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-orange-400">
              The Bid Whisperer <span role="img" aria-label="brain">🧠</span>
            </h2>
            <p className="text-lg text-slate-300 mb-6">
              Perfect bids, every time. More sales, less waste.
            </p>
            <motion.ul 
              className="space-y-3 mb-8"
              variants={{ 
                hidden: { opacity: 0 }, 
                visible: { 
                  opacity: 1,
                  transition: { staggerChildren: 0.15 } 
                }
              }}
              initial="hidden" 
              animate={bidWhispererInView ? "visible" : "hidden"}
            >
              <motion.li variants={bulletPointVariants} className="flex items-center text-slate-200">
                <CheckCircle2 className="w-5 h-5 mr-2 text-amber-400 flex-shrink-0" />
                Custom bid recommendations for every keyword
              </motion.li>
              <motion.li variants={bulletPointVariants} className="flex items-center text-slate-200">
                <CheckCircle2 className="w-5 h-5 mr-2 text-amber-400 flex-shrink-0" />
                Redistribute budget to high-performing ad groups
              </motion.li>
              <motion.li variants={bulletPointVariants} className="flex items-center text-slate-200">
                <CheckCircle2 className="w-5 h-5 mr-2 text-amber-400 flex-shrink-0" />
                Reduce ACOS by up to 31% within 30 days
              </motion.li>
            </motion.ul>
            <motion.div variants={bulletPointVariants}> 
              <Link href="/dashboard">
                <button className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-900 font-semibold rounded-lg shadow-md hover:from-amber-600 hover:to-orange-600 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-amber-400">
                  Optimize Your Bids
                  <ArrowRight className="w-5 h-5 ml-2" />
                </button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Right Table Content - New Component */}
          <motion.div variants={tableSectionVariants}>
            {bidWhispererInView && <BidWhispererTable />} 
          </motion.div>
        </motion.div>
      </motion.section>

    </main>
  );
}