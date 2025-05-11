"use client";
import Link from "next/link";
import { Check, ArrowRight, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { motion } from "framer-motion";

// Mock data für die Bid-Empfehlungen
const BID_RECOMMENDATIONS = [
  { 
    keyword: "kindle self publishing", 
    currentBid: 0.48, 
    suggestedBid: 0.67, 
    change: "increase",
    reasoning: "High conversion potential"
  },
  { 
    keyword: "book marketing", 
    currentBid: 0.72, 
    suggestedBid: 0.55, 
    change: "decrease",
    reasoning: "Overspending"
  },
  { 
    keyword: "how to write a novel", 
    currentBid: 0.65, 
    suggestedBid: 0.64, 
    change: "maintain",
    reasoning: "Performing well"
  },
  { 
    keyword: "self publishing amazon", 
    currentBid: 0.40, 
    suggestedBid: 0.58, 
    change: "increase",
    reasoning: "Under-bidding"
  },
  { 
    keyword: "ebook marketing", 
    currentBid: 0.89, 
    suggestedBid: 0.60, 
    change: "decrease",
    reasoning: "Low conversion rate"
  }
];

export default function BidWhispererSection() {
  // Animation variants für die Tabelle
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
    <section className="w-full py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="max-w-7xl mx-auto bg-gradient-to-br from-slate-800/70 via-slate-900/80 to-amber-950/50 backdrop-blur-sm rounded-xl p-8 shadow-lg border border-slate-700/80">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <motion.h2 
                className="text-4xl md:text-5xl font-bold text-center mb-6 bg-gradient-to-r from-amber-300 via-amber-400 to-orange-500 bg-clip-text text-transparent"
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                The Bid Whisperer
              </motion.h2>
              <p className="text-lg text-slate-300 mb-8">
                Perfect bids, every time. More sales, less waste.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <div className="flex-shrink-0 p-1 bg-[#FF9900]/20 rounded-full mr-3">
                    <Check className="h-5 w-5 text-[#FF9900]" />
                  </div>
                  <p className="text-slate-300">Custom bid recommendations for every keyword</p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 p-1 bg-[#FF9900]/20 rounded-full mr-3">
                    <Check className="h-5 w-5 text-[#FF9900]" />
                  </div>
                  <p className="text-slate-300">Redistribute budget to high-performing ad groups</p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 p-1 bg-[#FF9900]/20 rounded-full mr-3">
                    <Check className="h-5 w-5 text-[#FF9900]" />
                  </div>
                  <p className="text-slate-300">Reduce ACOS by up to 31% within 30 days</p>
                </li>
              </ul>
              <div className="mt-8">
                <Link href="/upload" className="btn-primary">
                  Upload CSV – Free Preview
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </div>
            </div>
            
            {/* Animated Bid Recommendations Table */}
            <div className="bg-slate-900/70 rounded-xl border border-slate-700/60 overflow-hidden shadow-xl">
              <div className="bg-gradient-to-r from-slate-800 to-slate-900 px-4 py-3 border-b border-slate-700/60">
                <h3 className="text-lg font-bold text-white flex items-center">
                  <span className="bg-blue-600/30 p-1.5 rounded-lg mr-2 flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-blue-400" />
                  </span>
                  Keyword Bid Recommendations
                </h3>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="text-left bg-slate-800/80">
                    <tr>
                      <th className="py-3 px-4 text-slate-400 font-medium">Keyword</th>
                      <th className="py-3 px-4 text-slate-400 font-medium text-right">Current Bid</th>
                      <th className="py-3 px-4 text-slate-400 font-medium text-right">Suggested Bid</th>
                      <th className="py-3 px-4 text-slate-400 font-medium">Action</th>
                    </tr>
                  </thead>
                  <motion.tbody 
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.3 }}
                  >
                    {BID_RECOMMENDATIONS.map((rec, index) => (
                      <motion.tr 
                        key={index} 
                        className={`border-t border-slate-700/30 ${index % 2 === 0 ? 'bg-slate-800/30' : 'bg-slate-800/10'}`}
                        variants={rowVariants}
                      >
                        <td className="py-3 px-4 font-medium text-white">{rec.keyword}</td>
                        <td className="py-3 px-4 text-right text-slate-300">${rec.currentBid.toFixed(2)}</td>
                        <td className="py-3 px-4 text-right">
                          <span className={`font-medium ${
                            rec.change === 'increase' ? 'text-green-400' : 
                            rec.change === 'decrease' ? 'text-red-400' : 
                            'text-blue-400'
                          }`}>
                            ${rec.suggestedBid.toFixed(2)}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <motion.div 
                            className={`inline-flex items-center justify-center rounded-full px-2 py-1 text-xs font-medium ${
                              rec.change === 'increase' ? 'bg-green-900/30 text-green-400 border border-green-700/30' : 
                              rec.change === 'decrease' ? 'bg-red-900/30 text-red-400 border border-red-700/30' : 
                              'bg-blue-900/30 text-blue-400 border border-blue-700/30'
                            }`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            {rec.change === 'increase' ? (
                              <><TrendingUp className="w-3 h-3 mr-1" /> Increase</>
                            ) : rec.change === 'decrease' ? (
                              <><TrendingDown className="w-3 h-3 mr-1" /> Decrease</>
                            ) : (
                              <><Minus className="w-3 h-3 mr-1" /> Maintain</>
                            )}
                          </motion.div>
                        </td>
                      </motion.tr>
                    ))}
                  </motion.tbody>
                </table>
              </div>
              <div className="bg-gradient-to-r from-slate-900 to-slate-800 px-4 py-3 border-t border-slate-700/30 text-xs text-slate-400 flex justify-between items-center">
                <span>Showing 5 of 26 recommendations</span>
                <motion.button 
                  className="text-indigo-400 hover:text-indigo-300 flex items-center"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  View all recommendations <ArrowRight className="w-3 h-3 ml-1" />
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
