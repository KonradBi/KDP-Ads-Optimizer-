"use client"

import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';
import { 
  ArrowUpRight, 
  ArrowDown, 
  ArrowRight,
  Check, 
  Star, 
  AlertTriangle, 
  AlertCircle, 
  AlertOctagon,
  TrendingUp,    
  ChevronUp,
  ChevronDown,
  Target,
  BarChart3,
  LineChart,
  Wallet,
  Activity,
  Rocket,
  Unlock,
  ArrowDownToLine,
  TrendingDown,  
  CircleDollarSign, 
  ShoppingCart, 
  Lightbulb,
  ListChecks,
  Minus          
} from 'lucide-react';
import Image from "next/image";
import KeywordSpectrumSection from "../components/KeywordSpectrumSection";
import BidWhispererSection from "../components/BidWhispererSection";
import AdBudgetGuardianSummary from "../components/AdBudgetGuardianSummary";
import JourneyTimeline from "../components/JourneyTimeline";
import { motion, AnimatePresence } from 'framer-motion';
import PricingSection from '@/components/PricingSection';

const OverallDashboardMockup = () => {
  return (
    <div className="max-w-lg mx-auto p-4 bg-slate-900/80 rounded-xl backdrop-blur-sm border border-slate-700/80 shadow-lg shadow-indigo-500/10 space-y-3">
      <div className="grid grid-cols-2 gap-3">
        {/* Current ACOS */}
        <div className="bg-slate-800/90 p-3 rounded-lg border border-slate-700/50 flex items-center justify-between hover:border-slate-600/70 transition-colors duration-300">
          <div className="flex items-center">
            <div className="w-9 h-9 rounded-full bg-slate-700/80 flex items-center justify-center mr-2 text-blue-300">
              <TrendingDown className="w-5 h-5" />
            </div>
            <span className="text-xs font-medium text-slate-300">Current ACOS</span>
          </div>
          <span className="text-base font-bold text-white">42.3%</span>
        </div>
        {/* Estimated ACOS */}
        <div className="bg-slate-800/90 p-3 rounded-lg border border-green-800/30 flex items-center justify-between hover:border-green-600/40 transition-colors duration-300">
          <div className="flex items-center">
            <div className="w-9 h-9 rounded-full bg-green-900/30 flex items-center justify-center mr-2 text-green-400">
              <TrendingUp className="w-5 h-5" />
            </div>
            <span className="text-xs font-medium text-slate-300">Estimated ACOS</span>
          </div>
          <span className="text-base font-bold text-green-400">32.5%</span>
        </div>
        {/* Wasted Spend */}
        <div className="bg-slate-800/90 p-3 rounded-lg border border-red-800/30 flex items-center justify-between hover:border-red-600/40 transition-colors duration-300">
          <div className="flex items-center">
            <div className="w-9 h-9 rounded-full bg-red-900/30 flex items-center justify-center mr-2 text-red-400">
              <CircleDollarSign className="w-5 h-5" />
            </div>
            <span className="text-xs font-medium text-slate-300">Wasted Spend</span>
          </div>
          <span className="text-base font-bold text-red-400">$237</span>
        </div>
        {/* Conversion Rate */}
        <div className="bg-slate-800/90 p-3 rounded-lg border border-purple-800/30 flex items-center justify-between hover:border-purple-600/40 transition-colors duration-300">
          <div className="flex items-center">
            <div className="w-9 h-9 rounded-full bg-purple-900/30 flex items-center justify-center mr-2 text-purple-400">
              <ShoppingCart className="w-5 h-5" />
            </div>
            <span className="text-xs font-medium text-slate-300">Conversion Rate</span>
          </div>
          <span className="text-base font-bold text-purple-400">4.2%</span>
        </div>
      </div>
      {/* Profit Boost */}
      <div className="bg-gradient-to-r from-indigo-600/40 to-purple-600/40 p-4 rounded-lg border border-indigo-400/50 flex items-center justify-between shadow-lg hover:shadow-indigo-500/30 transition-all duration-300">
        <div className="flex items-center">
          <div className="w-12 h-12 rounded-full bg-indigo-500/30 flex items-center justify-center mr-3 text-indigo-200 shadow-inner shadow-indigo-700/50">
            <TrendingUp className="w-7 h-7" />
          </div>
          <div>
            <span className="text-base font-bold text-white">Profit Boost</span>
            <p className="text-xs text-indigo-200">Potential improvement</p>
          </div>
        </div>
        <span className="text-2xl font-extrabold text-white drop-shadow-md">+28.7%</span>
      </div>
    </div>
  );
};



/* Redesigned Testimonial Component with enhanced visuals */
const TestimonialSection = () => {
  const testimonials = [
    {
      quote: "My book sales increased by 32% in just three weeks after implementing the recommendations!",
      author: "J.M.",
      genre: "Fantasy Publisher",
      image: "/user-1.svg",
      color: "amber",
      highlight: "32% Sales Increase"
    },
    {
      quote: "Finally achieved positive ROI on my thriller series after 3 months of negative returns. This tool pays for itself.",
      author: "R.C.",
      genre: "Mystery & Thriller Publisher",
      image: "/user-2.svg",
      color: "blue",
      highlight: "Positive ROI"
    },
    {
      quote: "I discovered 4 high-converting keywords I'd never have thought of. My KENP reads doubled in just a month.",
      author: "M.D.",
      genre: "Sci-Fi Publisher",
      image: "/user-3.svg",
      color: "purple",
      highlight: "2x KENP Reads"
    },
    {
      quote: "Cut my wasted ad spend by 47% while maintaining the same number of sales. Incredible ROI on this tool.",
      author: "A.K.",
      genre: "Non-Fiction Publisher",
      image: "/user-4.svg",
      color: "green",
      highlight: "47% Less Waste"
    },
    {
      quote: "Found the perfect bid sweet spot for my children's books. My impressions went up 3x with better targeting.",
      author: "L.B.",
      genre: "Children's Book Publisher",
      image: "/user-5.svg",
      color: "pink",
      highlight: "3x Impressions"
    },
    {
      quote: "As a coloring book creator, I was skeptical, but my ACOS dropped from 54% to 29% in just two weeks!",
      author: "T.W.",
      genre: "Coloring Book Creator",
      image: "/user-6.svg",
      color: "orange",
      highlight: "25% Lower ACOS"
    }
  ];
  
  // Animation variants for staggered animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };
  
  return (
    <div className="relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-amber-500/5 blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-80 h-80 rounded-full bg-blue-500/5 blur-3xl"></div>
        <div className="absolute top-40 right-1/4 w-40 h-40 rounded-full bg-purple-500/5 blur-3xl"></div>
      </div>
      
      {/* Content with z-index to appear above background */}
      <div className="container mx-auto px-4 relative z-10 max-w-6xl">
        <div className="text-center mb-16">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold text-amber-500 mb-3"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            What Our Beta Testers Are Saying
          </motion.h2>
          <motion.p 
            className="text-lg text-slate-400 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Real results from early access KDP publishers
          </motion.p>
        </div>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {testimonials.map((item, index) => (
            <motion.div 
              key={index} 
              variants={itemVariants}
              whileHover={{ 
                y: -8,
                boxShadow: `0 15px 30px -10px rgba(${item.color === 'amber' ? '245, 158, 11' : item.color === 'blue' ? '59, 130, 246' : item.color === 'purple' ? '139, 92, 246' : item.color === 'green' ? '34, 197, 94' : item.color === 'pink' ? '236, 72, 153' : '249, 115, 22'}, 0.15)`,
                borderColor: `${item.color === 'amber' ? 'rgb(245, 158, 11, 0.3)' : item.color === 'blue' ? 'rgb(59, 130, 246, 0.3)' : item.color === 'purple' ? 'rgb(139, 92, 246, 0.3)' : item.color === 'green' ? 'rgb(34, 197, 94, 0.3)' : item.color === 'pink' ? 'rgb(236, 72, 153, 0.3)' : 'rgb(249, 115, 22, 0.3)'}`
              }}
              transition={{ duration: 0.3 }}
              className={`
                bg-slate-800/60 backdrop-blur-sm rounded-xl p-8 border border-slate-700/60 
                shadow-lg relative overflow-hidden
                ${item.color === 'amber' ? 'hover:bg-gradient-to-br hover:from-slate-800/80 hover:to-amber-900/20' : 
                  item.color === 'blue' ? 'hover:bg-gradient-to-br hover:from-slate-800/80 hover:to-blue-900/20' : 
                  item.color === 'purple' ? 'hover:bg-gradient-to-br hover:from-slate-800/80 hover:to-purple-900/20' :
                  item.color === 'green' ? 'hover:bg-gradient-to-br hover:from-slate-800/80 hover:to-green-900/20' :
                  item.color === 'pink' ? 'hover:bg-gradient-to-br hover:from-slate-800/80 hover:to-pink-900/20' :
                  'hover:bg-gradient-to-br hover:from-slate-800/80 hover:to-orange-900/20'}
              `}
            >
              {/* Decorative corner accent */}
              <div className={`
                absolute top-0 right-0 w-20 h-20 -mt-10 -mr-10 rounded-full opacity-20
                ${item.color === 'amber' ? 'bg-amber-500' : 
                  item.color === 'blue' ? 'bg-blue-500' : 
                  item.color === 'purple' ? 'bg-purple-500' :
                  item.color === 'green' ? 'bg-green-500' :
                  item.color === 'pink' ? 'bg-pink-500' :
                  'bg-orange-500'}
              `}></div>
              
              {/* Highlight badge */}
              <div className={`
                absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold
                ${item.color === 'amber' ? 'bg-amber-500/20 text-amber-300 ring-1 ring-amber-500/30' : 
                  item.color === 'blue' ? 'bg-blue-500/20 text-blue-300 ring-1 ring-blue-500/30' : 
                  item.color === 'purple' ? 'bg-purple-500/20 text-purple-300 ring-1 ring-purple-500/30' :
                  item.color === 'green' ? 'bg-green-500/20 text-green-300 ring-1 ring-green-500/30' :
                  item.color === 'pink' ? 'bg-pink-500/20 text-pink-300 ring-1 ring-pink-500/30' :
                  'bg-orange-500/20 text-orange-300 ring-1 ring-orange-500/30'}
              `}>
                {item.highlight}
              </div>
              
              {/* Star rating */}
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-4 h-4 fill-current ${
                    item.color === 'amber' ? 'text-amber-400' : 
                    item.color === 'blue' ? 'text-blue-400' : 
                    item.color === 'purple' ? 'text-purple-400' :
                    item.color === 'green' ? 'text-green-400' :
                    item.color === 'pink' ? 'text-pink-400' :
                    'text-orange-400'
                  }`} />
                ))}
              </div>
              
              {/* Quote */}
              <p className="text-slate-200 mb-8 relative z-10 text-lg italic leading-relaxed">"{item.quote}"</p>
              
              {/* Author info */}
              <div className="flex items-center mt-auto">
                <div className={`
                  w-12 h-12 rounded-full flex items-center justify-center mr-4 
                  ${item.color === 'amber' ? 'bg-amber-900/30 text-amber-300 ring-1 ring-amber-500/30' : 
                    item.color === 'blue' ? 'bg-blue-900/30 text-blue-300 ring-1 ring-blue-500/30' : 
                    item.color === 'purple' ? 'bg-purple-900/30 text-purple-300 ring-1 ring-purple-500/30' :
                    item.color === 'green' ? 'bg-green-900/30 text-green-300 ring-1 ring-green-500/30' :
                    item.color === 'pink' ? 'bg-pink-900/30 text-pink-300 ring-1 ring-pink-500/30' :
                    'bg-orange-900/30 text-orange-300 ring-1 ring-orange-500/30'}
                `}>
                  <span className="text-lg font-bold">{item.author[0]}</span>
                </div>
                <div>
                  <p className="font-semibold text-white">{item.author}</p>
                  <p className="text-sm text-slate-400">{item.genre}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
        
        <motion.div 
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Link 
            href="/upload" 
            className="group relative overflow-hidden inline-flex items-center justify-center px-10 py-5 text-xl font-bold text-white bg-gradient-to-r from-amber-500 to-amber-600 rounded-xl shadow-xl hover:shadow-amber-500/40 transform hover:-translate-y-1 transition-all duration-300"
          >
            <span className="relative z-10 flex items-center">
              Upload CSV – Free Preview 
              <ArrowRight className="ml-2 w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" />
            </span>
            <span className="absolute inset-0 bg-gradient-to-r from-amber-600 to-amber-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            <span className="absolute -inset-px bg-gradient-to-r from-amber-400 to-amber-500 opacity-30 rounded-xl blur-sm group-hover:opacity-40 transition-opacity duration-300"></span>
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

const BID_RECOMMENDATIONS_DATA = [
  { 
    keyword: "kindle self publishing", 
    currentBid: 0.48, 
    suggestedBid: 0.67, 
    change: "increase",
  },
  { 
    keyword: "book marketing", 
    currentBid: 0.72, 
    suggestedBid: 0.55, 
    change: "decrease",
  },
  { 
    keyword: "how to write a novel", 
    currentBid: 0.65, 
    suggestedBid: 0.64, 
    change: "maintain",
  },
  { 
    keyword: "self publishing amazon", 
    currentBid: 0.40, 
    suggestedBid: 0.58, 
    change: "increase",
  },
  { 
    keyword: "ebook marketing", 
    currentBid: 0.89, 
    suggestedBid: 0.60, 
    change: "decrease",
  }
];

const HeroBidRecommendationsPreview = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const rowVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }
  };

  return (
    <motion.div 
      className="bg-slate-900/80 rounded-xl border border-slate-700/70 overflow-hidden shadow-2xl shadow-indigo-500/10 backdrop-blur-md w-full max-w-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.2, type: "spring", stiffness: 60}}
    >
      <div className="bg-gradient-to-r from-slate-800/90 to-slate-800/70 px-4 py-3 border-b border-slate-700/50">
        <h3 className="text-md font-semibold text-white flex items-center">
          <span className="bg-indigo-600/40 p-1.5 rounded-lg mr-2.5 flex items-center justify-center ring-1 ring-indigo-500/30">
            <TrendingUp className="w-4 h-4 text-indigo-300" />
          </span>
          Example: Bid Recommendations
        </h3>
      </div>
      
      <div className="overflow-x-auto p-1 md:p-2">
        <table className="w-full text-sm">
          <thead className="text-left bg-slate-800/50">
            <tr>
              <th className="py-2.5 px-3 text-slate-400 font-medium text-xs">Keyword</th>
              <th className="py-2.5 px-3 text-slate-400 font-medium text-xs text-right">Current</th>
              <th className="py-2.5 px-3 text-slate-400 font-medium text-xs text-right">Suggested</th>
              <th className="py-2.5 px-3 text-slate-400 font-medium text-xs">Action</th>
            </tr>
          </thead>
          <motion.tbody 
            variants={containerVariants}
            initial="hidden"
            animate="show" 
          >
            {BID_RECOMMENDATIONS_DATA.map((rec, index) => (
              <motion.tr 
                key={index} 
                className={`border-t border-slate-700/40 ${index % 2 === 0 ? 'bg-slate-800/40' : 'bg-slate-800/20'}`}
                variants={rowVariants}
              >
                <td className="py-2.5 px-3 font-medium text-slate-200 text-xs whitespace-nowrap">{rec.keyword}</td>
                <td className="py-2.5 px-3 text-right text-slate-300 text-xs">${rec.currentBid.toFixed(2)}</td>
                <td className="py-2.5 px-3 text-right text-xs">
                  <span className={`font-semibold ${ 
                    rec.change === 'increase' ? 'text-green-400' : 
                    rec.change === 'decrease' ? 'text-red-400' : 
                    'text-sky-400' 
                  }`}>
                    ${rec.suggestedBid.toFixed(2)}
                  </span>
                </td>
                <td className="py-2.5 px-3">
                  <motion.div 
                    className={`inline-flex items-center justify-center rounded-full px-2 py-0.5 text-[11px] font-medium leading-tight ${ 
                      rec.change === 'increase' ? 'bg-green-500/15 text-green-400 border border-green-500/30' : 
                      rec.change === 'decrease' ? 'bg-red-500/15 text-red-400 border border-red-500/30' : 
                      'bg-sky-500/15 text-sky-400 border border-sky-500/30' 
                    }`}
                  >
                    {rec.change === 'increase' ? (
                      <><TrendingUp className="w-2.5 h-2.5 mr-1" /> Increase</>
                    ) : rec.change === 'decrease' ? (
                      <><TrendingDown className="w-2.5 h-2.5 mr-1" /> Decrease</>
                    ) : (
                      <><Minus className="w-2.5 h-2.5 mr-1" /> Maintain</>
                    )}
                  </motion.div>
                </td>
              </motion.tr>
            ))}
          </motion.tbody>
        </table>
      </div>
      <div className="bg-gradient-to-r from-slate-800/70 to-slate-800/90 px-4 py-2.5 border-t border-slate-700/50 text-[11px] text-slate-400 flex justify-between items-center">
        <span>Showing 5 of 26 example recommendations</span>
        <Link href="#bid-whisperer-section" className="text-indigo-400 hover:text-indigo-300 flex items-center font-medium">
          More Details <ArrowRight className="w-3 h-3 ml-1" />
        </Link>
      </div>
    </motion.div>
  );
};

export default function Home() {
  // State for FAQ accordion
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  
  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  useEffect(() => {
    // Product carousel animation
    const interval = setInterval(() => {
      const carousel = document.querySelector('.product-carousel');
      if (carousel) {
        const currentTop = parseInt((carousel as HTMLElement).style.top || '0', 10);
        const nextTop = currentTop <= -96 ? 0 : currentTop - 32; 
        (carousel as HTMLElement).style.top = `${nextTop}px`;
      }
    }, 3000); 
    
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <main className="min-h-screen w-full">
        {/* Hero Section */}
        <motion.section initial={{opacity:0,y:40}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:0.6}} className="w-full py-20 px-4 bg-transparent">
          <div className="absolute inset-0 z-0 bg-[url('/bg-grid.svg')] bg-center opacity-5"></div>
          <div className="container mx-auto max-w-6xl relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-amber-300 via-amber-400 to-orange-500">
                  KDP Ad Ninja
                </h1>
                
                <p className="text-xl md:text-2xl text-white font-medium mb-8">
                  Turn Ad Spend <span className="text-amber-400 font-bold">Disasters</span> into Publishing <span className="text-amber-400 font-bold">Profit Machines</span>
                </p>
                
                <div className="space-y-4 text-lg text-slate-300 mb-8">
                  <div className="flex items-start">
                    <svg className="h-6 w-6 text-amber-500 mr-3 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span><span className="text-amber-400 font-semibold">Stop Money Drains</span> - Find and eliminate wasteful keywords that eat up your budget</span>
                  </div>
                  <div className="flex items-start">
                    <svg className="h-6 w-6 text-amber-500 mr-3 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span><span className="text-amber-400 font-semibold">Boost Your ROI</span> - Get smart bid recommendations that increase sales while lowering ACOS</span>
                  </div>
                  <div className="flex items-start">
                    <svg className="h-6 w-6 text-amber-500 mr-3 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span><span className="text-amber-400 font-semibold">Unlock Hidden Gems</span> - Discover high-converting keywords your competitors are missing</span>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/upload" className="btn-primary">
                    Upload CSV – Free Preview <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                  <Link href="#pricing" className="btn-secondary">
                    See Pricing
                  </Link>
                </div>
                <p className="text-sm text-slate-400 mt-4">Free preview – zero cost, no credit card required</p>
              </div>
              {/* Right Column - Bid Recommendations Preview */}
              <div className="relative flex items-center justify-center min-h-[360px] md:min-h-[380px] w-full md:w-auto">
                <HeroBidRecommendationsPreview />
              </div>
            </div>
          </div>
        </motion.section>

        {/* Feature Section 1 */}
        <motion.section id="features" initial={{opacity:0,y:40}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:0.6}} className="w-full py-20 px-4 bg-transparent">
          <div className="absolute inset-0 z-0 bg-[url('/bg-grid.svg')] bg-center opacity-5"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-indigo-950/10 via-transparent to-transparent"></div>
          <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-slate-900/40 to-transparent"></div>
          
          <div className="container mx-auto max-w-6xl relative z-10">
            <div className="max-w-6xl mx-auto p-0">
              <div className="transform hover:scale-105 transition-transform duration-500">
                <AdBudgetGuardianSummary />
              </div>
              <div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Feature Section 2 */}
        <motion.section initial={{opacity:0,y:40}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:0.6}} className="w-full py-20 px-4 bg-transparent">
          <BidWhispererSection />
        </motion.section>

        {/* Corrected: Replaced the entire 'Profit Acceleration' section with KeywordSpectrumSection */}
        <motion.section initial={{opacity:0,y:40}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:0.6}} className="w-full py-20 bg-gradient-to-b from-amber-600/15 via-slate-700/15 to-transparent">
          <KeywordSpectrumSection />
        </motion.section>

        <motion.section initial={{opacity:0,y:40}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:0.6}} className="w-full py-0 bg-transparent">
          <JourneyTimeline />
        </motion.section>

        <motion.section initial={{opacity:0,y:40}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:0.6}} className="w-full pt-0 pb-20 px-4 bg-transparent"> 
          <PricingSection />
        </motion.section>

        {/* Testimonials */}
        <motion.section initial={{opacity:0,y:40}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:0.6}} className="w-full py-20 px-4 bg-transparent">
          <TestimonialSection />
        </motion.section>

        {/* FAQ Section */}
        <motion.section id="faq" initial={{opacity:0,y:40}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:0.6}} className="w-full py-20 px-4 bg-transparent">
          <div className="container mx-auto max-w-4xl">
            <h2 className="text-3xl font-bold text-amber-500 text-center mb-12">
              Frequently Asked Questions
            </h2>

            <div className="space-y-6">
              {/* FAQ Item 1 */}
              <div className="bg-slate-800/40 backdrop-blur-sm rounded-xl border border-slate-700/50 overflow-hidden">
                <button 
                  className="w-full flex items-center justify-between p-6 text-left"
                  onClick={() => toggleFAQ(0)}
                >
                  <span className="text-xl font-semibold text-white">What mathematical models power your analysis?</span>
                  {openFAQ === 0 ? (
                    <ChevronUp className="h-5 w-5 text-slate-400" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-slate-400" />
                  )}
                </button>
                <div className={`px-6 pb-6 ${openFAQ === 0 ? "block" : "hidden"}`}>
                  <p className="text-slate-300">
                    We employ sophisticated Bayesian statistical methods to analyze your keyword performance. Unlike simple averages, Bayesian inference allows us to accurately estimate the *true underlying potential* of each keyword, even those with few clicks or initial sales. By calculating the probability that a keyword's conversion rate (including KENP) is truly above a minimum profitability threshold, we can identify underperformers with high statistical confidence (typically 95%) and recommend pausing them to cut wasted spend.
                  </p>
                </div>
              </div>
              
              {/* FAQ Item 2 */}
              <div className="bg-slate-800/40 backdrop-blur-sm rounded-xl border border-slate-700/50 overflow-hidden">
                <button 
                  className="w-full flex items-center justify-between p-6 text-left"
                  onClick={() => toggleFAQ(1)}
                >
                  <span className="text-xl font-semibold text-white">How accurate are your recommendations?</span>
                  {openFAQ === 1 ? (
                    <ChevronUp className="h-5 w-5 text-slate-400" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-slate-400" />
                  )}
                </button>
                <div className={`px-6 pb-6 ${openFAQ === 1 ? "block" : "hidden"}`}>
                  <p className="text-slate-300">Our recommendations consistently outperform manual optimization with over 94% confidence.</p>
                </div>
              </div>
              
              {/* FAQ Item 3 */}
              <div className="bg-slate-800/40 backdrop-blur-sm rounded-xl border border-slate-700/50 overflow-hidden">
                <button 
                  className="w-full flex items-center justify-between p-6 text-left"
                  onClick={() => toggleFAQ(2)}
                >
                  <span className="text-xl font-semibold text-white">Do you offer a free preview?</span>
                  {openFAQ === 2 ? (
                    <ChevronUp className="h-5 w-5 text-slate-400" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-slate-400" />
                  )}
                </button>
                <div className={`px-6 pb-6 ${openFAQ === 2 ? "block" : "hidden"}`}>
                  <p className="text-slate-300">Yes, enjoy a free preview with no credit card required.</p>
                </div>
              </div>
              
              {/* FAQ Item 4 */}
              <div className="bg-slate-800/40 backdrop-blur-sm rounded-xl border border-slate-700/50 overflow-hidden">
                <button 
                  className="w-full flex items-center justify-between p-6 text-left"
                  onClick={() => toggleFAQ(3)}
                >
                  <span className="text-xl font-semibold text-white">What data do I need to provide?</span>
                  {openFAQ === 3 ? (
                    <ChevronUp className="h-5 w-5 text-slate-400" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-slate-400" />
                  )}
                </button>
                <div className={`px-6 pb-6 ${openFAQ === 3 ? "block" : "hidden"}`}>
                  <p className="text-slate-300">Just upload your KDP CSV with impressions, clicks, conversions, and spend data.</p>
                </div>
              </div>
              
              {/* FAQ Item 5 */}
              <div className="bg-slate-800/40 backdrop-blur-sm rounded-xl border border-slate-700/50 overflow-hidden">
                <button 
                  className="w-full flex items-center justify-between p-6 text-left"
                  onClick={() => toggleFAQ(4)}
                >
                  <span className="text-xl font-semibold text-white">Is my data secure?</span>
                  {openFAQ === 4 ? (
                    <ChevronUp className="h-5 w-5 text-slate-400" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-slate-400" />
                  )}
                </button>
                <div className={`px-6 pb-6 ${openFAQ === 4 ? "block" : "hidden"}`}>
                  <p className="text-gray-400">
                    Your data security is paramount. While the core analysis calculations run directly in *your* browser to maximize privacy for the raw performance metrics, your uploaded report data is securely stored in our robust backend infrastructure powered by Supabase. This allows you to access your analysis history. We utilize industry-standard security practices for data storage and transmission, and your raw data isn't processed on external servers beyond secure storage.
                  </p>
                </div>
              </div>
              
              {/* FAQ Item 6 */}
              <div className="bg-slate-800/40 backdrop-blur-sm rounded-xl border border-slate-700/50 overflow-hidden">
                <button 
                  className="w-full flex items-center justify-between p-6 text-left"
                  onClick={() => toggleFAQ(5)}
                >
                  <span className="text-xl font-semibold text-white">How does your AI detect unprofitable keywords?</span>
                  {openFAQ === 5 ? (
                    <ChevronUp className="h-5 w-5 text-slate-400" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-slate-400" />
                  )}
                </button>
                <div className={`px-6 pb-6 ${openFAQ === 5 ? "block" : "hidden"}`}>
                  <p className="text-gray-400">
                    Our system uses Bayesian statistics to calculate the probability that a keyword's true conversion rate (considering both sales and KENP royalties) falls below a minimum acceptable threshold, even with limited click/order data. If this probability is high (e.g., 95% confident it's unprofitable), we flag it for pausing.
                  </p>
                </div>
              </div>
              
              {/* FAQ Item 7 - NEW */}
              <div className="bg-slate-800/40 backdrop-blur-sm rounded-xl border border-slate-700/50 overflow-hidden">
                <button 
                  className="w-full flex items-center justify-between p-6 text-left"
                  onClick={() => toggleFAQ(6)}
                >
                  <span className="text-xl font-semibold text-white">Why is this better than Amazon's Dynamic Campaigns?</span>
                  {openFAQ === 6 ? (
                    <ChevronUp className="h-5 w-5 text-slate-400" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-slate-400" />
                  )}
                </button>
                <div className={`px-6 pb-6 ${openFAQ === 6 ? "block" : "hidden"}`}>
                  <p className="text-gray-400">
                    While Amazon's Dynamic Campaigns offer convenience, consider this: as you save time, Amazon profits from your ad spend – regardless of your actual profitability.
                  </p>
                  <p className="text-gray-400 mt-2">
                    Our specialized tool, on the other hand, was engineered with one goal: maximizing YOUR profitability. Through sophisticated statistical keyword analysis powered by advanced mathematical principles, we pinpoint exactly where your advertising budget should be deployed for maximum impact. Our cutting-edge Bayesian inference engine identifies underperforming keywords with remarkable precision (95% confidence), even with limited data points - a level of statistical rigor most analytics tools simply cannot match.
                  </p>
                  <p className="text-gray-400 mt-2">
                    Instead of opaque automation, you gain crystal-clear insights and complete control over your advertising strategy – delivering superior returns and long-term success.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

      </main>

      {/* Footer is now a global component in layout.tsx */}
    </>
  );
}