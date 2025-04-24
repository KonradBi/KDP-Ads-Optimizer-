import React from 'react';
import { motion, Variants } from 'framer-motion';
import { ArrowRightCircle, TrendingUp, TrendingDown } from 'lucide-react'; // Assuming you might use icons

// Define the type for a single bid adjustment item
interface BidAdjustment {
  keyword: string;
  current: number;
  recommended: number;
}

// Mock data - same as before, adjust if needed
const bidAdjustments: BidAdjustment[] = [
  { keyword: 'ai for beginners', current: 0.67, recommended: 0.55 },
  { keyword: 'artificial intelligence', current: 0.65, recommended: 0.52 },
  { keyword: 'the teacher', current: 0.65, recommended: 0.75 }, // Example where bid increases
  { keyword: 'the emotional lives of teenagers', current: 0.65, recommended: 0.48 },
  { keyword: 'atlas of ai', current: 0.65, recommended: 0.50 },
];

// Animation variants
const tableVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1, // Delay between each row animation
    },
  },
};

const rowVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
};

const actionVariants: Variants = {
  hidden: { opacity: 0, scale: 0.5 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      delay: 0.3, // Delay after row appears
      duration: 0.3,
      type: 'spring',
      stiffness: 150,
    },
  },
};

const BidWhispererTable: React.FC = () => {
  return (
    <div className="bg-slate-800/60 rounded-xl backdrop-blur-sm border border-slate-700/60 shadow-lg shadow-indigo-900/10 overflow-hidden">
      <div className="px-4 py-3 border-b border-slate-700/50 bg-gradient-to-r from-slate-800 to-slate-900/50">
        <h4 className="font-semibold text-slate-200 text-base">Top Bid Adjustments</h4>
        <p className="text-xs text-slate-400">Focus on these bid changes for potential ACOS improvements</p>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-700/50 text-sm">
          <thead className="bg-slate-900/30">
            <tr>
              <th scope="col" className="px-4 py-2 text-left font-medium text-slate-400 tracking-wider">Keyword</th>
              <th scope="col" className="px-4 py-2 text-right font-medium text-slate-400 tracking-wider">Current</th>
              <th scope="col" className="px-4 py-2 text-right font-medium text-slate-400 tracking-wider">Recommended</th>
              <th scope="col" className="px-4 py-2 text-center font-medium text-slate-400 tracking-wider">Action</th>
            </tr>
          </thead>
          <motion.tbody
            className="bg-slate-800/80 divide-y divide-slate-700/30"
            variants={tableVariants}
            initial="hidden"
            animate="visible" // Animation controlled by parent's viewport visibility
          >
            {bidAdjustments.map((item, index) => {
              const isIncrease = item.recommended > item.current;
              return (
                <motion.tr key={index} variants={rowVariants} className="hover:bg-slate-700/40 transition-colors duration-150">
                  <td className="px-4 py-2 whitespace-nowrap text-slate-200">{item.keyword}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-right text-slate-300">${item.current.toFixed(2)}</td>
                  <td className={`px-4 py-2 whitespace-nowrap text-right font-semibold ${isIncrease ? 'text-amber-400' : 'text-green-400'}`}>${item.recommended.toFixed(2)}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-center">
                    <motion.div variants={actionVariants} className="inline-block">
                      {isIncrease ? (
                        <TrendingUp className="w-5 h-5 text-amber-500 mx-auto" />
                      ) : (
                        <TrendingDown className="w-5 h-5 text-green-500 mx-auto" />
                      )}
                    </motion.div>
                  </td>
                </motion.tr>
              );
            })}
          </motion.tbody>
        </table>
      </div>
    </div>
  );
};

export default BidWhispererTable;
