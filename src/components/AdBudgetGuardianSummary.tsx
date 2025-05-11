import React from 'react';
import { motion } from 'framer-motion';
import {
  Target,
  TrendingDown,
  TrendingUp, // For Profit Boost
  DollarSign,
  Zap, // Keep Zap for potential/speed
  ArrowRight // Used for ACOS comparison
} from 'lucide-react';

// Define consistent styling mimicking FullResults card structure
const highlightCardBaseStyle = "flex items-center p-5 rounded-lg border transition-all duration-300 bg-slate-800/40 backdrop-blur-sm h-full"; // Added h-full for consistent height
const highlightIconContainerBaseStyle = "w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 mr-5 shadow-lg";
const highlightTitleStyle = "text-xs font-medium uppercase tracking-wider opacity-70 mb-1";
const highlightValueStyle = "text-xl md:text-2xl font-semibold mb-1"; // Adjusted size for responsiveness
const highlightDescStyle = "text-xs md:text-sm opacity-60 leading-snug"; // Adjusted size

// NEW COMPONENT NAME: LandingPageHighlights
const LandingPageHighlights: React.FC = () => {

  // Mock KPI data examples for the landing page teaser ("Show, don't tell")
  const highlightsData = [
    {
      id: "current-acos",
      title: "Current ACOS",
      value: "42.3%", // Mock data
      description: "Your current ad cost per $1 of sales.",
      icon: <Target className="w-5 h-5 text-red-300" />,
      iconBgColor: "bg-gradient-to-br from-red-600/50 to-red-800/70",
      borderColor: "border-red-700/30",
      textColor: "text-red-300"
    },
    {
      id: "estimated-acos",
      title: "Estimated ACOS",
      value: "32.5%", // Mock data implying improvement
      description: "Potential ACOS after optimization.",
      icon: <TrendingDown className="w-5 h-5 text-green-300" />,
      iconBgColor: "bg-gradient-to-br from-green-600/50 to-green-800/70",
      borderColor: "border-green-700/30",
      textColor: "text-green-300"
    },
    {
      id: "wasted-spend",
      title: "Wasted Spend Found",
      value: "$237", // Mock data
      description: "Money saved by cutting ineffective keywords.",
      icon: <DollarSign className="w-5 h-5 text-yellow-300" />,
      iconBgColor: "bg-gradient-to-br from-yellow-600/50 to-yellow-800/70",
      borderColor: "border-yellow-700/30",
      textColor: "text-yellow-300"
    },
    {
      id: "profit-boost",
      title: "Profit Boost",
      value: "+28.7%", // Mock data
      description: "Potential increase in profit from ads.",
      icon: <TrendingUp className="w-5 h-5 text-purple-300" />,
      iconBgColor: "bg-gradient-to-br from-purple-600/60 to-purple-800/80",
      borderColor: "border-purple-600/50",
      textColor: "text-purple-300"
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="py-8 px-4 sm:px-6 lg:px-8"
    >
      {/* Update text size to match BidWhispererSection */}
      <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-8 flex items-center justify-center">
        <Zap className="w-7 h-7 mr-3 text-indigo-400" />
        See the Potential Impact
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {highlightsData.map((highlight, index) => (
          <motion.div
            key={highlight.id}
            className={`${highlightCardBaseStyle} ${highlight.borderColor}`}
            whileHover={{ scale: 1.03, y: -5 }} // Adjusted hover effect
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }} // Stagger animation
            style={highlight.id === 'profit-boost' ? { boxShadow: `0 0 15px rgba(168, 85, 247, 0.3)` } : {}} // Example highlight
          >
            <div
              className={`${highlightIconContainerBaseStyle} ${highlight.iconBgColor}`}
            >
              {highlight.icon}
            </div>
            <div className="flex-grow">
              <p className={`${highlightTitleStyle} ${highlight.textColor}`}>{highlight.title}</p>
              <p className={`${highlightValueStyle} ${highlight.id === 'current-acos' ? 'text-red-300' : highlight.id === 'estimated-acos' ? 'text-green-300' : highlight.id === 'wasted-spend' ? 'text-yellow-300' : 'text-purple-300'}`}>
                {highlight.value}
              </p>
              <p className={`${highlightDescStyle} text-slate-400`}>{highlight.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

// REMEMBER TO RENAME THE FILE to LandingPageHighlights.tsx
export default LandingPageHighlights;
