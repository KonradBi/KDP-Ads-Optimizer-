/**
 * Component for displaying the full analysis results after payment
 */
import React, { useState, useRef, useCallback, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { motion } from 'framer-motion';
import { 
  DollarSign, CheckCircle2, Target as TargetIcon, TrendingUp, Eye, ShoppingCart, Zap, PauseCircle, SearchX, 
  HelpCircle, Download, AlertTriangle, BarChart2, CheckCircle, XCircle, 
  TrendingUp as TrendingUpIcon, TrendingDown as TrendingDownIcon, Eye as EyeIcon 
} from 'lucide-react';
import * as XLSX from 'xlsx';
import ActionPlanStepper from './ActionPlanStepper'; 
import PerformanceGauge from './PerformanceGauge'; 
import type { AnalysisResult, AnalyzedKeyword, FullAnalysis, PainPoints, BidRecommendation } from '@/types';

// Style constants adapted from AdBudgetGuardianSummary.tsx
const highlightCardBaseStyle = "flex items-center p-5 rounded-lg border transition-all duration-300 bg-slate-800/40 backdrop-blur-sm h-full hover:shadow-xl";
const highlightIconContainerBaseStyle = "w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 mr-4 shadow-md";
const highlightTitleStyle = "text-xs font-medium uppercase tracking-wider opacity-80 mb-0.5";
const highlightValueStyle = "text-xl md:text-2xl font-bold mb-1";
const highlightDescStyle = "text-xs opacity-70 leading-snug";

// Animation variants for staggering cards
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.07,
      duration: 0.4,
    },
  }),
};

interface FullResultsProps {
  analysisResult: AnalysisResult;
  isProfitOptimized: boolean;
}

// Helper to format relative metrics
const formatRelativeMetric = (value: number | null | undefined, unit: '%' | 'x' = '%'): string => {
  if (value === null || value === undefined || isNaN(value)) return '-';
  if (unit === '%') {
    const percentage = value * 100;
    return `${percentage >= 0 ? '+' : ''}${percentage.toFixed(0)}%`;
  } else {
    return `${value.toFixed(1)}x`;
  }
};

// Helper to display data confidence - Adjusted for dark theme
const DataConfidenceDisplay: React.FC<{ confidence: AnalyzedKeyword['dataConfidence'] }> = ({ confidence }) => {
  if (!confidence) return <span className="text-slate-500">-</span>; // Darker placeholder
  let colorClass = 'bg-slate-600 text-slate-200'; // Default dark theme
  if (confidence === 'Low') colorClass = 'bg-red-500/20 text-red-300 ring-1 ring-inset ring-red-500/30';
  if (confidence === 'Medium') colorClass = 'bg-yellow-500/20 text-yellow-300 ring-1 ring-inset ring-yellow-500/30';
  if (confidence === 'High') colorClass = 'bg-green-500/20 text-green-300 ring-1 ring-inset ring-green-500/30';
  return <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass}`}>{confidence}</span>;
};

// --- REVAMPED TOOLTIP COMPONENT USING PORTAL & JS POSITIONING --- 
interface TooltipProps {
  text: string;
  children: React.ReactElement; // Expect a single element child to attach refs and listeners
}

const Tooltip: React.FC<TooltipProps> = ({ text, children }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLSpanElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const portalRootRef = useRef<HTMLElement | null>(null);
  const tooltipId = React.useId(); // Call useId unconditionally at the top level

  useEffect(() => {
    // Ensure portal root exists only on client-side
    portalRootRef.current = document.getElementById('tooltip-portal-root');
    if (!portalRootRef.current) {
      portalRootRef.current = document.createElement('div');
      portalRootRef.current.id = 'tooltip-portal-root';
      document.body.appendChild(portalRootRef.current);
    }
    // Cleanup portal root on component unmount
    return () => {
       if (portalRootRef.current && portalRootRef.current.parentElement === document.body && portalRootRef.current.childElementCount === 0) {
          // Only remove if it was created by this instance and is empty
          // document.body.removeChild(portalRootRef.current); \n          // ^-- Commenting out removal for now to avoid race conditions if multiple tooltips unmount
       }
    };
  }, []);

  const calculatePosition = useCallback(() => {
    if (!triggerRef.current || !tooltipRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();

    let top = triggerRect.top - tooltipRect.height - 8;
    let left = triggerRect.left + (triggerRect.width / 2) - (tooltipRect.width / 2);

    if (left < 8) left = 8;
    if (left + tooltipRect.width > window.innerWidth - 8) left = window.innerWidth - tooltipRect.width - 8;
    
    if (top < 8) {
        top = triggerRect.bottom + 8;
    }

    setPosition({ top, left });
  }, []);

  const showTooltip = useCallback(() => {
    setIsVisible(true);
    requestAnimationFrame(calculatePosition);
  }, [calculatePosition]);

  const hideTooltip = useCallback(() => {
    setIsVisible(false);
  }, []);

  const tooltipContent = (
    <div
      ref={tooltipRef}
      id={tooltipId} // Add id to the tooltip content for aria-describedby
      className={`fixed z-50 w-max max-w-xs px-3 py-1.5 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-lg transition-opacity duration-300 pointer-events-none ${isVisible ? 'opacity-100' : 'opacity-0'}`}
      style={{ top: `${position.top}px`, left: `${position.left}px` }}
      role="tooltip"
    >
      {text}
      {/* Arrow: position needs adjustment based on potential flipping */}
       <div className="absolute left-1/2 top-full -mt-1 w-3 h-3 bg-gray-900 transform -translate-x-1/2 rotate-45"></div>
    </div>
  );

  return (
    <>
      <span
        ref={triggerRef}
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        onFocus={showTooltip}
        onBlur={hideTooltip}
        className="inline-block"
        aria-describedby={isVisible ? tooltipId : undefined} // Use the generated id conditionally
      >
        {children}
      </span>
      {portalRootRef.current && isVisible ? ReactDOM.createPortal(tooltipContent, portalRootRef.current) : null}
    </>
  );
};

// --- END REVAMPED TOOLTIP --- 

export default function FullResults({ analysisResult, isProfitOptimized }: FullResultsProps) {
  console.log('FullResults component rendered with props:', { analysisResult, isProfitOptimized }); // <-- Add log here
  const { fullAnalysis, painPoints } = analysisResult;
  const netOpt: number = (fullAnalysis as any).netOptimizationPotential || 0;
  const totalRevenue = fullAnalysis.totalSales + (fullAnalysis.data.reduce((sum, kw) => sum + (kw.estimatedKenpRoyalties || 0), 0)); // Recalculate totalRevenue if not directly available

  // Detect if there are absolutely no sales (including KENP royalties)
  const noSalesDetected = totalRevenue === 0;

  // Calculate current profit from ads and percentage improvement
  const currentProfitFromAds = totalRevenue - fullAnalysis.totalSpend;
  let percentageImprovementText = "";
  let tooltipExplanation = "Estimated net impact from following all bid recommendations (potential revenue gain + potential cost savings).";

  if (currentProfitFromAds > 0 && netOpt > 0) {
    const percentageImprovement = (netOpt / currentProfitFromAds) * 100;
    percentageImprovementText = `(+${percentageImprovement.toFixed(1)}% Profit Boost)`;
    tooltipExplanation += ` This represents a potential +${percentageImprovement.toFixed(1)}% increase to your current profit from advertising (Revenue - Ad Spend).`;
  } else if (netOpt > 0) { // Potential exists, but current profit is zero or negative
    percentageImprovementText = `(Improves Profitability)`;
     tooltipExplanation += ` Your current advertising yields no profit or a loss, so a percentage increase cannot be shown. This optimization aims to improve profitability or reduce loss.`;
  }
  // If netOpt is 0, no text is needed and the base tooltipExplanation is fine.

  const currency = 'USD';
  const [showInactiveKeywords, setShowInactiveKeywords] = useState(false);
  const [copiedNegatives, setCopiedNegatives] = useState(false);
  const [reminderDateString, setReminderDateString] = useState(''); // State for the reminder date
  
  // --- Calculate Reminder Date on Mount --- 
  useEffect(() => {
    const reminderDate = new Date();
    reminderDate.setDate(reminderDate.getDate() + 14);
    const formattedDate = reminderDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    setReminderDateString(formattedDate);
  }, []); // Empty dependency array: runs only once on mount
  
  // --- Calculate Overall Metrics for Gauges ---
  const totalClicks = fullAnalysis.data.reduce((sum, kw) => sum + (kw.clicks || 0), 0);
  const totalImpressions = fullAnalysis.data.reduce((sum, kw) => sum + (kw.impressions || 0), 0);
  const totalOrders = fullAnalysis.data.reduce((sum, kw) => sum + (kw.orders || 0), 0);
  
  const overallCtr = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;
  const overallCvr = totalClicks > 0 ? (totalOrders / totalClicks) * 100 : 0;
  // --- End Calculate Overall Metrics ---
  
  // --- Calculate Additional Pain Points & Counts ---
  const HIGH_ACOS_THRESHOLD = 0.5; // e.g., ACOS > 50% above average
  const inefficientKeywordsCount = fullAnalysis.data.filter(
    kw => kw.relativeAcos !== null && kw.relativeAcos !== undefined && kw.relativeAcos > HIGH_ACOS_THRESHOLD
  ).length;
  // Count ALL keywords with recommended bid decrease
  const bidDecreaseCount = fullAnalysis.bidRecommendations.filter(
      rec => rec.action === 'decrease'
  ).length;
  // --- End Calculate Additional Pain Points ---
  
  // --- Copy to Clipboard Functionality ---
  const handleCopyNegatives = useCallback(() => {
    if (fullAnalysis.negativeKeywordSuggestions && fullAnalysis.negativeKeywordSuggestions.length > 0) {
      const keywordsString = fullAnalysis.negativeKeywordSuggestions.join('\n');
      navigator.clipboard.writeText(keywordsString).then(() => {
        setCopiedNegatives(true);
        setTimeout(() => setCopiedNegatives(false), 2000);
      }).catch(err => {
        console.error('Failed to copy negative keywords: ', err);
      });
    }
  }, [fullAnalysis.negativeKeywordSuggestions]);
  
  // Separate active and inactive keywords
  const activeKeywords = fullAnalysis.data.filter(item => item.clicks > 0 || item.orders > 0);
  const inactiveKeywords = fullAnalysis.data.filter(item => item.clicks === 0 && item.orders === 0);
  
  // Function to export data to Excel
  const exportToExcel = () => {
    // Convert data to Excel format
    const workbook = XLSX.utils.book_new();
    
    // Format data for Excel
    const worksheetData = fullAnalysis.data.map((item: AnalyzedKeyword) => ({
      Keyword: item.keyword,
      'Match Type': item.matchType,
      Clicks: item.clicks,
      Spend: `$${item.spend.toFixed(2)}`,
      Sales: `$${item.sales.toFixed(2)}`,
      Orders: item.orders,
      'ACOS (%)': `${(item.acos * 100).toFixed(1)}%`,
      Recommendation: item.recommendation,
      'New Bid': item.newBid ? `$${item.newBid.toFixed(2)}` : '-',
      'Rel ACOS': formatRelativeMetric(item.relativeAcos, '%'),
      'Rel CTR': formatRelativeMetric(item.relativeCtr, 'x'),
      'Rel CVR': formatRelativeMetric(item.relativeCvr, 'x'),
      'Data Confidence': item.dataConfidence || '-',
      'Priority Score': item.priorityScore
    }));
    
    // Add negative keywords to worksheet data
    if (fullAnalysis.negativeKeywordSuggestions.length > 0) {
      // Add empty row
      worksheetData.push({
        Keyword: '',
        'Match Type': '',
        Clicks: 0,
        Spend: '',
        Sales: '',
        Orders: 0,
        'ACOS (%)': '',
        Recommendation: '',
        'New Bid': '',
        'Rel ACOS': '',
        'Rel CTR': '',
        'Rel CVR': '',
        'Data Confidence': '',
        'Priority Score': 0
      });
      
      // Add header row
      worksheetData.push({
        Keyword: 'Negative Keyword Suggestions:',
        'Match Type': '',
        Clicks: 0,
        Spend: '',
        Sales: '',
        Orders: 0,
        'ACOS (%)': '',
        Recommendation: '',
        'New Bid': '',
        'Rel ACOS': '',
        'Rel CTR': '',
        'Rel CVR': '',
        'Data Confidence': '',
        'Priority Score': 0
      });
      
      // Add each keyword
      fullAnalysis.negativeKeywordSuggestions.forEach(keyword => {
        worksheetData.push({
          Keyword: keyword,
          'Match Type': '',
          Clicks: 0,
          Spend: '',
          Sales: '',
          Orders: 0,
          'ACOS (%)': '',
          Recommendation: '',
          'New Bid': '',
          'Rel ACOS': '',
          'Rel CTR': '',
          'Rel CVR': '',
          'Data Confidence': '',
          'Priority Score': 0
        });
      });
    }
    
    // Create worksheet
    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    
    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'KDP Ads Analysis');
    
    // Generate Excel file
    XLSX.writeFile(workbook, 'kdp_ads_analysis_enhanced.xlsx');
  };
  
  const renderTableRow = (item: AnalyzedKeyword, index: number, isActive: boolean) => (
    <tr key={`${isActive ? 'active' : 'inactive'}-${index}`} className={!isActive ? "bg-slate-800/50" : "hover:bg-slate-700/40 transition-colors duration-150"}>
      <td className="px-5 py-3 whitespace-nowrap text-sm text-slate-300">
        <span className="inline-flex items-center justify-center h-7 w-7 rounded-full bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-white font-bold shadow">
          {item.priorityScore}
        </span>
      </td>
      <td className="px-5 py-3 text-sm text-slate-200 max-w-xs w-64 truncate">
        {item.keyword}
      </td>
      <td className="px-5 py-3 whitespace-nowrap text-sm text-slate-400">
        {item.matchType}
      </td>
      <td className="px-5 py-3 whitespace-nowrap text-sm text-slate-300 text-right">
        {item.impressions.toLocaleString()}
      </td>
      <td className="px-5 py-3 whitespace-nowrap text-sm text-slate-300 text-right">
        {item.clicks}
      </td>
      <td className="px-5 py-3 whitespace-nowrap text-sm text-slate-300 text-right">
        ${item.spend.toFixed(2)}
      </td>
      <td className="px-5 py-3 whitespace-nowrap text-sm text-slate-300 text-right">
        ${item.sales.toFixed(2)}
      </td>
      <td className="px-5 py-3 whitespace-nowrap text-sm text-slate-300 text-right">
        {item.orders}
      </td>
      <td className="px-5 py-3 whitespace-nowrap text-sm text-slate-300 text-right">
        {(item.acos * 100).toFixed(1)}%
      </td>
      <td className="px-5 py-3 whitespace-nowrap text-sm text-slate-300 text-right">
        {item.effectiveAcos !== null && item.effectiveAcos !== undefined ? `${(item.effectiveAcos * 100).toFixed(1)}%` : <span className="text-slate-500">-</span>}
      </td>
      <td className="px-5 py-3 whitespace-nowrap text-sm text-center">
        <DataConfidenceDisplay confidence={item.dataConfidence} /> 
      </td>
      <td className="px-5 py-3 whitespace-nowrap text-sm text-right">
         <span className={item.relativeAcos && item.relativeAcos > 0 ? 'text-red-400' : 'text-green-400'}>
            {formatRelativeMetric(item.relativeAcos, '%')}
         </span>
      </td>
      <td className="px-5 py-3 whitespace-nowrap text-sm text-right">
          <span className={item.relativeCtr && item.relativeCtr < 1 ? 'text-red-400' : 'text-green-400'}>
             {formatRelativeMetric(item.relativeCtr, 'x')}
          </span>
      </td>
      <td className="px-5 py-3 whitespace-nowrap text-sm text-right">
          <span className={item.relativeCvr && item.relativeCvr < 1 ? 'text-red-400' : 'text-green-400'}>
             {formatRelativeMetric(item.relativeCvr, 'x')}
          </span>
      </td>
      <td className="px-5 py-3 whitespace-nowrap text-sm">
        <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold
          ${item.color === 'red' ? 'bg-red-500/20 text-red-300 ring-1 ring-inset ring-red-500/30' : 
            item.color === 'green' ? 'bg-green-500/20 text-green-300 ring-1 ring-inset ring-green-500/30' : 
            'bg-yellow-500/20 text-yellow-300 ring-1 ring-inset ring-yellow-500/30'}`}>
          {item.recommendation}
        </span>
      </td>
      <td className="px-5 py-3 whitespace-nowrap text-sm text-right">
        {/* Check if profit optimized bid exists and royalty is set */}
        {isProfitOptimized && item.profitOptimizedBid !== undefined && item.profitOptimizedBid !== null ? (
          <span className="inline-flex items-center space-x-1">
            {/* Show profit optimized bid with arrow based on current bid */}
            {item.keywordBid && item.profitOptimizedBid > item.keywordBid ? (
              <>
                <span className="text-green-400 font-semibold text-xs">↑</span>
                <span className="text-green-400 font-medium">{`$${item.profitOptimizedBid.toFixed(2)}`}</span>
              </>
            ) : item.keywordBid && item.profitOptimizedBid < item.keywordBid ? (
              <>
                <span className="text-red-400 font-semibold text-xs">↓</span>
                <span className="text-red-400 font-medium">{`$${item.profitOptimizedBid.toFixed(2)}`}</span>
              </>
            ) : (
              <span className="text-slate-300">{`$${item.profitOptimizedBid.toFixed(2)}`}</span> 
            )}
          </span>
        ) : /* Fallback to rule-based newBid */ item.newBid !== undefined && item.newBid !== null ? (
          <span className="inline-flex items-center space-x-1">
            {item.keywordBid && item.newBid > item.keywordBid ? (
              <>
                <span className="text-green-400 font-semibold text-xs">↑</span>
                <span className="text-green-400 font-medium">{`$${item.newBid.toFixed(2)}`}</span>
              </>
            ) : item.keywordBid && item.newBid < item.keywordBid ? (
              <>
                <span className="text-red-400 font-semibold text-xs">↓</span>
                <span className="text-red-400 font-medium">{`$${item.newBid.toFixed(2)}`}</span>
              </>
            ) : (
              <span className="text-slate-300">{`$${item.newBid.toFixed(2)}`}</span> 
            )}
             {/* Add a small indicator that this is not profit-optimized */}
             {!isProfitOptimized && <span className="text-xs text-amber-400 ml-1" title="Enter royalty for profit optimization">*</span>} 
          </span>
        ) : (
          <span className="text-slate-500">-</span>
        )}
      </td>
      <td className="px-5 py-3 whitespace-nowrap text-sm text-slate-400 text-right">
        {item.keywordBid ? `$${item.keywordBid.toFixed(2)}` : <span className="text-slate-500">-</span>}
      </td>
      <td className="px-5 py-3 whitespace-nowrap text-sm text-slate-300 text-right">
        {item.kenpRead ?? <span className="text-slate-500">-</span>}
      </td>
      <td className="px-5 py-3 whitespace-nowrap text-sm text-slate-300 text-right">
        {item.estimatedKenpRoyalties !== null && item.estimatedKenpRoyalties !== undefined ? `$${item.estimatedKenpRoyalties.toFixed(2)}` : <span className="text-slate-500">-</span>}
      </td>
    </tr>
  );
  
  return (
    <>
      {/* Banner for scenarios where the data contains zero sales */}
      {noSalesDetected && (
        <div className="mb-6 p-4 rounded-lg border border-yellow-500/40 bg-yellow-600/20 text-yellow-200 shadow-lg">
          <h4 className="text-lg font-semibold mb-1">No Sales Detected</h4>
          <p className="text-sm leading-relaxed">
            We could not find any sales in the uploaded date range. This may mean your ads have not converted yet or the period is too short. Consider widening the
            timeframe or reviewing your campaigns for conversion opportunities.
          </p>
        </div>
      )}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-slate-200 shadow-xl rounded-xl overflow-hidden border border-slate-700/50 p-1"> 
        {/* Slightly inner container for padding */}
        <div className="bg-slate-800/50 rounded-lg p-6">
          {/* Summary section */}
          <div className="px-6 py-5 border-b border-slate-700 bg-gradient-to-r from-indigo-900/30 to-fuchsia-900/20 rounded-t-lg -mx-6 -mt-6 mb-6">
            <h3 className="text-xl font-semibold text-indigo-200 drop-shadow-sm">Analysis Summary</h3>
            <p className="mt-1 text-sm text-indigo-300/80">
          Here's a summary of your Amazon Ads performance
        </p>
      </div>
      
          {/* --- NEW Top Stats Layout --- */}
          
          {/* Core 2x2 Financial Grid & Engagement Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
            {/* Total Spend */}
            <motion.div custom={0} variants={cardVariants} initial="hidden" animate="visible" whileHover={{ scale: 1.03, y: -4 }} className={`${highlightCardBaseStyle} border-indigo-700/30 hover:shadow-indigo-500/20`}>
              <div className={`${highlightIconContainerBaseStyle} bg-gradient-to-br from-indigo-500 to-blue-600`}>
                <DollarSign className="w-5 h-5 text-indigo-100" />
              </div>
              <div className="flex-grow">
                <p className={`${highlightTitleStyle} text-indigo-300`}>Total Spend</p>
                <p className={`${highlightValueStyle} text-slate-50`}>${fullAnalysis.totalSpend.toFixed(2)}</p>
                <p className={`${highlightDescStyle} text-slate-400`}>The amount you've invested in your Amazon ads campaign</p>
              </div>
            </motion.div>

            {/* Total Sales */}
            <motion.div custom={1} variants={cardVariants} initial="hidden" animate="visible" whileHover={{ scale: 1.03, y: -4 }} className={`${highlightCardBaseStyle} border-green-700/30 hover:shadow-green-500/20`}>
              <div className={`${highlightIconContainerBaseStyle} bg-gradient-to-br from-green-500 to-emerald-600`}>
                <CheckCircle2 className="w-5 h-5 text-green-100" />
              </div>
              <div className="flex-grow">
                <p className={`${highlightTitleStyle} text-green-300`}>Total Sales</p>
                <p className={`${highlightValueStyle} text-slate-50`}>${fullAnalysis.totalSales.toFixed(2)}</p>
                <p className={`${highlightDescStyle} text-slate-400`}>Revenue generated through your Amazon ads</p>
              </div>
            </motion.div>

            {/* Average ACOS */}
            <motion.div custom={2} variants={cardVariants} initial="hidden" animate="visible" whileHover={{ scale: 1.03, y: -4 }} className={`${highlightCardBaseStyle} border-blue-700/30 hover:shadow-blue-500/20`}>
              <div className={`${highlightIconContainerBaseStyle} bg-gradient-to-br from-blue-500 to-cyan-600`}>
                <TargetIcon className="w-5 h-5 text-blue-100" />
              </div>
              <div className="flex-grow">
                <p className={`${highlightTitleStyle} text-blue-300`}>Average ACOS</p>
                <p className={`${highlightValueStyle} text-slate-50`}>{(fullAnalysis.averageAcos * 100).toFixed(1)}%</p>
                <p className={`${highlightDescStyle} text-slate-400`}>Your ad cost per $1 of sales (lower is better)</p>
              </div>
            </motion.div>

            {/* Effective ROAS */}
            {fullAnalysis.effectiveRoas !== undefined ? (
              <motion.div custom={3} variants={cardVariants} initial="hidden" animate="visible" whileHover={{ scale: 1.03, y: -4 }} className={`${highlightCardBaseStyle} border-teal-700/30 hover:shadow-teal-500/20`}>
                <div className={`${highlightIconContainerBaseStyle} bg-gradient-to-br from-teal-500 to-emerald-600`}>
                  <TrendingUp className="w-5 h-5 text-teal-100" />
                </div>
                <div className="flex-grow">
                  <p className={`${highlightTitleStyle} text-teal-300`}>Effective ROAS</p>
                  {/* PerformanceGauge is kept as per screenshot, value displayed by it */}
                  <PerformanceGauge value={fullAnalysis.effectiveRoas} label="" min={0} max={3} thresholds={[1, 2]} unit="x" />
                  <p className={`${highlightDescStyle} text-slate-400 mt-1`}>Return on Ad Spend: $1 spent brings in ${fullAnalysis.effectiveRoas.toFixed(2)}</p> 
                </div>
              </motion.div>
            ) : (
              <div className="bg-slate-800/20 rounded-lg p-5 border border-slate-700/20 h-full flex items-center justify-center"><p className={`${highlightDescStyle} text-slate-500`}>ROAS data not available</p></div>
            )}

            {/* Overall CTR */}
            <motion.div custom={4} variants={cardVariants} initial="hidden" animate="visible" whileHover={{ scale: 1.03, y: -4 }} className={`${highlightCardBaseStyle} border-sky-700/30 hover:shadow-sky-500/20`}>
              <div className={`${highlightIconContainerBaseStyle} bg-gradient-to-br from-sky-500 to-cyan-600`}>
                <Eye className="w-5 h-5 text-sky-100" />
              </div>
              <div className="flex-grow">
                <p className={`${highlightTitleStyle} text-sky-300`}>Overall CTR</p>
                <PerformanceGauge value={overallCtr} label="" min={0} max={2} thresholds={[0.5, 1]} unit="%" />
                <p className={`${highlightDescStyle} text-slate-400 mt-1`}>How often people click on your ads when they see them</p>
              </div>
            </motion.div>

            {/* Overall CVR */}
            <motion.div custom={5} variants={cardVariants} initial="hidden" animate="visible" whileHover={{ scale: 1.03, y: -4 }} className={`${highlightCardBaseStyle} border-lime-700/30 hover:shadow-lime-500/20`}>
              <div className={`${highlightIconContainerBaseStyle} bg-gradient-to-br from-lime-500 to-green-600`}>
                <ShoppingCart className="w-5 h-5 text-lime-100" />
              </div>
              <div className="flex-grow">
                <p className={`${highlightTitleStyle} text-lime-300`}>Overall CVR</p>
                <PerformanceGauge value={overallCvr} label="" min={0} max={20} thresholds={[5, 10]} unit="%" />
                <p className={`${highlightDescStyle} text-slate-400 mt-1`}>How often ad clicks lead to actual book purchases</p>
              </div>
            </motion.div>
          </div>
          
          {/* Net Optimization Potential Row - Highlighted & Centered */}
          <motion.div custom={6} variants={cardVariants} initial="hidden" animate="visible" whileHover={{ scale: 1.02, y: -3 }} className="mb-10">
             <div className={`${highlightCardBaseStyle} !p-6 border-purple-600/40 hover:shadow-purple-500/25 bg-gradient-to-br from-purple-700/50 via-indigo-700/40 to-purple-700/50 !flex-row`}> 
               <div className={`${highlightIconContainerBaseStyle} !w-12 !h-12 bg-gradient-to-br from-purple-500 to-indigo-600 !mr-5`}> 
                 <Zap className="w-6 h-6 text-purple-100" />
               </div>
               <div className="text-center flex-grow"> 
                 <p className={`${highlightTitleStyle} !text-base text-purple-200`}>Net Optimization Potential</p> 
                  <Tooltip text={tooltipExplanation}>
                     <div className="flex items-center justify-center">
                       <span className={`${highlightValueStyle} !text-3xl text-slate-50 cursor-help underline decoration-dashed decoration-purple-400/60 underline-offset-2`}>${netOpt.toFixed(2)}</span> 
                       {percentageImprovementText && (
                         <span className="text-sm font-medium text-purple-200/90 ml-2.5 bg-slate-50/10 px-2.5 py-1 rounded-lg">
                           {percentageImprovementText}
                         </span>
                       )}
                     </div>
                 </Tooltip>
                 <p className={`${highlightDescStyle} !text-sm text-purple-200/90 mt-1.5`}>Estimated profit increase by implementing our recommendations</p> 
               </div>
             </div>
           </motion.div>

          {/* --- NEW Top Stats Layout --- */}
          
          {/* Pain Points Summary - ENHANCED DESIGN */}
          <div className="bg-slate-800/60 rounded-xl shadow-lg p-6 border border-slate-700/40 mb-10">
            <h3 className="text-xl font-semibold text-slate-100 mb-5 flex items-center">
              <svg className="w-6 h-6 mr-3 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              Campaign Pain Points
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Keywords to Pause Card */}
              <motion.div custom={7} variants={cardVariants} initial="hidden" animate="visible" whileHover={{ scale: 1.03, y: -4 }} className={`${highlightCardBaseStyle} !flex-col !items-start !justify-between border-orange-600/40 hover:shadow-orange-500/25 bg-gradient-to-br from-orange-700/40 to-amber-800/50 min-h-[170px]`}>
                <div className="w-full">
                  <div className="flex items-center mb-2">
                    <div className={`${highlightIconContainerBaseStyle} !mr-3 bg-gradient-to-br from-orange-500 to-amber-600`}>
                      <PauseCircle className="w-5 h-5 text-orange-100" />
                    </div>
                    <p className={`${highlightTitleStyle} text-orange-200 !text-sm`}>Keywords to Pause</p>
                  </div>
                  <p className={`${highlightValueStyle} !text-4xl text-slate-50`}>{painPoints.keywordsWithNoSales}</p>
                  <p className={`${highlightDescStyle} text-orange-200/90`}>Wasted Spend: <span className="font-semibold text-slate-100">${painPoints.wastedSpend.toFixed(2)}</span></p>
                </div>
                <p className={`${highlightDescStyle} text-orange-200/80 mt-2 self-start`}>Action: Pause or add as Negative Exact.</p>
              </motion.div>

              {/* Savings Potential (Bid Cuts) Card */}
              <motion.div custom={8} variants={cardVariants} initial="hidden" animate="visible" whileHover={{ scale: 1.03, y: -4 }} className={`${highlightCardBaseStyle} !flex-col !items-start !justify-between border-rose-600/40 hover:shadow-rose-500/25 bg-gradient-to-br from-rose-700/40 to-red-800/50 min-h-[170px]`}>
                <div className="w-full">
                  <div className="flex items-center mb-2">
                    <div className={`${highlightIconContainerBaseStyle} !mr-3 bg-gradient-to-br from-rose-500 to-red-600`}>
                      <DollarSign className="w-5 h-5 text-rose-100" />
                    </div>
                    <p className={`${highlightTitleStyle} text-rose-200 !text-sm`}>Savings Potential (Bid Cuts)</p>
                  </div>
                  <p className={`${highlightValueStyle} !text-4xl text-slate-50`}>${fullAnalysis.potentialSavings.toFixed(2)}</p>
                  <p className={`${highlightDescStyle} text-rose-200/90`}>On {bidDecreaseCount} keywords</p>
                </div>
                <p className={`${highlightDescStyle} text-rose-200/80 mt-2 self-start`}>Action: Lower bids as recommended.</p>
              </motion.div>

              {/* Keywords with Low CTR Card */}
              <motion.div custom={9} variants={cardVariants} initial="hidden" animate="visible" whileHover={{ scale: 1.03, y: -4 }} className={`${highlightCardBaseStyle} !flex-col !items-start !justify-between border-yellow-600/40 hover:shadow-yellow-500/25 bg-gradient-to-br from-amber-700/40 to-yellow-800/50 min-h-[170px]`}>
                <div className="w-full">
                  <div className="flex items-center mb-2">
                    <div className={`${highlightIconContainerBaseStyle} !mr-3 bg-gradient-to-br from-amber-500 to-yellow-600`}>
                      <SearchX className="w-5 h-5 text-yellow-100" />
                    </div>
                    <p className={`${highlightTitleStyle} text-yellow-200 !text-sm`}>Keywords with Low CTR</p>
                  </div>
                  <p className={`${highlightValueStyle} !text-4xl text-slate-50`}>{painPoints.keywordsWithLowCtr}</p>
                </div>
                <p className={`${highlightDescStyle} text-yellow-200/80 mt-2 self-start`}>Action: Check search terms, improve copy, or lower bids.</p>
              </motion.div>
            </div>
          </div>
          
          {/* --- NEW: Wrapper for Action Plan Stepper to give it a full-width background --- */}
          <div className="-mx-6 px-6 py-10 my-10 bg-gradient-to-b from-slate-900 to-slate-800/80 border-t border-b border-slate-700/60 shadow-inner">
            {/* Original Action Plan Stepper rendering */}
            <ActionPlanStepper 
              fullAnalysis={fullAnalysis}
              painPoints={painPoints}
              onCopyNegatives={handleCopyNegatives}
              copiedNegatives={copiedNegatives}
            />
          </div>
          {/* --- END: Wrapper for Action Plan Stepper --- */}
          
          {/* --- NEW: Data Freshness Reminder --- */}
          <div className="mt-6 bg-gradient-to-r from-indigo-900/50 to-purple-900/50 rounded-lg border border-indigo-500/30 p-5 shadow-lg">
            <div className="flex items-start">
              <div className="flex-shrink-0 mt-1">
                <svg className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-semibold text-white">Data Freshness Reminder</h3>
                <p className="mt-1 text-base text-slate-300">
                  This analysis represents a snapshot of your campaign performance. For optimal results:
                </p>
                <ul className="mt-2 space-y-1 text-slate-300">
                  <li className="flex items-start">
                    <span className="text-indigo-400 mr-2">•</span>
                    Return every <span className="font-medium text-white mx-1">14 days</span> to refresh your analysis
                  </li>
                  <li className="flex items-start">
                    <span className="text-indigo-400 mr-2">•</span>
                    Amazon ads typically need <span className="font-medium text-white mx-1">7-10 days</span> to stabilize after changes
                  </li>
                </ul>
              </div>
            </div>
            {/* Display the calculated date directly in a new, styled container below */}
            {reminderDateString && (
              <div className="mt-4 p-4 bg-slate-700/50 border border-indigo-500/40 rounded-lg text-center">
                <p className="text-lg text-indigo-200">
                  Refresh your analysis around:
                </p>
                <p className="text-3xl font-bold text-white mt-1">
                  {reminderDateString}
                </p>
              </div>
            )}
          </div>
          {/* --- END: Data Freshness Reminder --- */}
          
          {/* Export button */}
          <div className="flex justify-end mb-6">
            <button
              onClick={exportToExcel}
              className="inline-flex items-center px-6 py-2.5 text-sm font-bold rounded-full bg-gradient-to-r from-fuchsia-500 via-indigo-500 to-blue-500 text-white shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-fuchsia-400/40 border-0"
            >
              <svg className="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              Export Enhanced Data
            </button>
          </div>
          
          {/* Table of results */}
          <h4 className="text-lg font-semibold text-slate-200 mb-4">
            Complete Analysis with Recommendations
          </h4>
          
          {/* Optimized container for the wide table */}
          <div className="overflow-x-auto overflow-y-auto w-full rounded-lg border border-slate-700 shadow-md" style={{ maxHeight: '80vh', width: '100%' }}>
            <table className="w-full min-w-[2200px] divide-y divide-slate-700 relative">
              <thead className="bg-slate-700/60 sticky top-0 z-10 backdrop-blur-sm">
                <tr>
                  {/* Re-add Tooltips specifically */}
                  <th scope="col" className="px-5 py-3.5 text-center text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    <Tooltip text="Priority score based on potential impact. Higher numbers indicate more important actions."><span className="cursor-help">Priority</span></Tooltip>
                  </th>
                  <th scope="col" className="px-5 py-3.5 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    <Tooltip text="The target keyword."><span className="cursor-help">Keyword</span></Tooltip>
                  </th>
                  <th scope="col" className="px-5 py-3.5 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    <Tooltip text="The match type used for this keyword."><span className="cursor-help">Match Type</span></Tooltip>
                  </th>
                  <th scope="col" className="px-5 py-3.5 text-right text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    <Tooltip text="Number of impressions this keyword received."><span className="cursor-help">Impressions</span></Tooltip>
                  </th>
                  <th scope="col" className="px-5 py-3.5 text-right text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    <Tooltip text="Number of clicks this keyword received."><span className="cursor-help">Clicks</span></Tooltip>
                  </th>
                  <th scope="col" className="px-5 py-3.5 text-right text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    <Tooltip text="Total spend on this keyword."><span className="cursor-help">Spend</span></Tooltip>
                  </th>
                  <th scope="col" className="px-5 py-3.5 text-right text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    <Tooltip text="Total sales revenue attributed to this keyword."><span className="cursor-help">Sales</span></Tooltip>
                  </th>
                  <th scope="col" className="px-5 py-3.5 text-right text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    <Tooltip text="Number of sales attributed to this keyword."><span className="cursor-help">Orders</span></Tooltip>
                  </th>
                  <th scope="col" className="px-5 py-3.5 text-right text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    <Tooltip text="Advertising Cost of Sale - how much you spent on ads for every dollar in sales (lower is better)."><span className="cursor-help">ACOS</span></Tooltip>
                  </th>
                  <th scope="col" className="px-5 py-3.5 text-right text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    <Tooltip text="Effective ACOS including KENP sales (when available) - a more accurate picture of true ad profitability."><span className="cursor-help">Eff. ACOS</span></Tooltip>
                  </th>
                  <th scope="col" className="px-5 py-3.5 text-center text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    <Tooltip text="Confidence in the recommendations based on available data. More data = higher confidence."><span className="cursor-help">Data Conf.</span></Tooltip>
                  </th>
                  <th scope="col" className="px-5 py-3.5 text-right text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    <Tooltip text="ACOS compared to the ad group's average ACOS."><span className="cursor-help">Rel. ACOS</span></Tooltip>
                  </th>
                  <th scope="col" className="px-5 py-3.5 text-right text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    <Tooltip text="Click-Through Rate compared to the average CTR of its ad group."><span className="cursor-help">Rel. CTR</span></Tooltip>
                  </th>
                  <th scope="col" className="px-5 py-3.5 text-right text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    <Tooltip text="Conversion Rate compared to the average CVR of its ad group."><span className="cursor-help">Rel. CVR</span></Tooltip>
                  </th>
                  <th scope="col" className="px-5 py-3.5 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    <Tooltip text="Recommended action based on performance analysis."><span className="cursor-help">Recommendation</span></Tooltip>
                  </th>
                  <th scope="col" className="px-5 py-3.5 text-right text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    {isProfitOptimized ? (
                        <Tooltip text="The recommended bid aiming to maximize your profit based on your entered royalty.">
                          <span className="cursor-help">Profit Opt. Bid</span>
                        </Tooltip>
                    ) : (
                        <Tooltip text="Suggested bid based on performance analysis. Enter royalty for profit optimization.">
                          <span className="cursor-help">Suggested Bid *</span>
                        </Tooltip>
                    )}
                  </th>
                  <th scope="col" className="px-5 py-3.5 text-right text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    <Tooltip text="Your current set keyword bid."><span className="cursor-help">Your Bid</span></Tooltip>
                  </th>
                  <th scope="col" className="px-5 py-3.5 text-right text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    <Tooltip text="Kindle Edition Normalized Pages read via Kindle Unlimited / Lending Library attributed to this ad."><span className="cursor-help">KENP Read</span></Tooltip>
                  </th>
                  <th scope="col" className="px-5 py-3.5 text-right text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    <Tooltip text="Estimated royalty earnings from KENP reads attributed to this ad."><span className="cursor-help">Est. KENP Royalty</span></Tooltip>
                  </th>
                </tr>
              </thead>
                <tbody className="bg-slate-800 divide-y divide-slate-700">
                  {activeKeywords.map((item, index) => renderTableRow(item, index, true))}
                  {showInactiveKeywords && inactiveKeywords.map((item, index) => renderTableRow(item, index, false))}
              </tbody>
            </table>
          </div>
          
          {/* Toggle Button for Inactive Keywords */}
          {inactiveKeywords.length > 0 && (
            <div className="mt-6 text-center">
              <button
                onClick={() => setShowInactiveKeywords(!showInactiveKeywords)}
                 className="text-sm font-medium text-indigo-400 hover:text-indigo-300 focus:outline-none transition-colors"
              >
                {showInactiveKeywords 
                  ? 'Hide keywords with no activity' 
                  : `Show ${inactiveKeywords.length} keywords with no activity`}
                {showInactiveKeywords ? (
                   <svg className="inline-block ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" /></svg>
                ) : (
                   <svg className="inline-block ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                )}
              </button>
            </div>
          )}
          
          {/* --- NEW: Understanding Your Results Section --- */}
          <div className="mt-10 bg-slate-800/40 rounded-xl shadow-lg p-6 border border-slate-700/50">
            <h3 className="text-lg font-semibold text-slate-200 mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Understanding Your Results (Simple Guide)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 text-sm text-slate-300/90">
                <div>
                    <p className="font-semibold text-slate-100">ACOS (Advertising Cost of Sales):</p>
                    <p className="text-xs text-slate-400">How much you spent on ads for every dollar made from sales (Lower is better).</p>
                </div>
                <div>
                    <p className="font-semibold text-slate-100">Effective ROAS (Return on Ad Spend):</p>
                    <p className="text-xs text-slate-400">How much revenue (Sales + KENP) you made for every dollar spent on ads (Higher is better).</p>
                </div>
                 <div>
                    <p className="font-semibold text-slate-100">CTR (Click-Through Rate):</p>
                    <p className="text-xs text-slate-400">How often people click your ad after seeing it (Higher means your ad is relevant).</p>
                </div>
                <div>
                    <p className="font-semibold text-slate-100">CVR (Conversion Rate):</p>
                    <p className="text-xs text-slate-400">How often clicks turn into orders (Higher means your book page converts well).</p>
                </div>
                 <div>
                    <p className="font-semibold text-slate-100">Rel. ACOS / CTR / CVR:</p>
                    <p className="text-xs text-slate-400">Compares a keyword's metric to the average of its Ad Group (Helps spot outliers).</p>
                </div>
                <div>
                    <p className="font-semibold text-slate-100">Data Confidence:</p>
                    <p className="text-xs text-slate-400">How much data (clicks/orders) we have for a keyword (High confidence means more reliable recommendations).</p>
                </div>
            </div>
             <p className="text-xs text-slate-500 mt-5 text-center">Use the recommendations below to optimize your campaigns. Focus on high-priority actions first!</p>
          </div>
          {/* --- End NEW Section --- */}
          
          {/* Advanced Recommendations Sections - Dark Theme */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
          {/* Negative Keywords Section */}
          {fullAnalysis.negativeKeywordSuggestions.length > 0 && (
              <div className="bg-slate-800/50 shadow-lg rounded-xl overflow-hidden border border-red-500/30">
                <div className="px-5 py-4 border-b border-red-500/30 bg-gradient-to-r from-red-900/40 to-red-800/30">
                  <h3 className="text-lg font-semibold text-red-200">Negative Keyword Suggestions</h3>
                  <p className="mt-1 text-sm text-red-300/80">
                    Add these as negative exact keywords to eliminate wasted spend
                </p>
              </div>
                <div className="p-5">
                  <div className="flex flex-wrap gap-2 mb-3">
                  {fullAnalysis.negativeKeywordSuggestions.map((keyword, index) => (
                      <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-500/20 text-red-300 ring-1 ring-inset ring-red-500/30">
                      {keyword}
                    </span>
                  ))}
                </div>
                  <p className="text-sm text-slate-400">
                    These keywords have generated clicks but no sales, costing you <span className="font-medium text-red-400">${painPoints.wastedSpend.toFixed(2)}</span>.
                </p>
              </div>
            </div>
          )}
          
            {/* Match Type Recommendations - Ensure this section is correctly placed and rendered */}
            {fullAnalysis.matchTypeRecommendations && fullAnalysis.matchTypeRecommendations.length > 0 && (
               <div className="bg-slate-800/50 shadow-lg rounded-xl overflow-hidden border border-yellow-500/30">
                <div className="px-5 py-4 border-b border-yellow-500/30 bg-gradient-to-r from-yellow-900/40 to-yellow-800/30">
                  <h3 className="text-lg font-semibold text-yellow-200">Match Type Optimizations</h3>
                  <p className="mt-1 text-sm text-yellow-300/80">
                    Consider adjusting match types to improve ACOS
                </p>
              </div>
                <div className="p-5">
                  <ul className="space-y-4">
                  {fullAnalysis.matchTypeRecommendations.map((rec, index) => (
                    <li key={index} className="flex items-start">
                        <div className="flex-shrink-0 mt-1">
                          <svg className="h-5 w-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                      </div>
                      <div className="ml-3 text-sm">
                          <p className="font-medium text-slate-300">"{rec.keyword}"</p>
                          <p className="text-slate-400">Change from <span className="font-semibold text-red-400">{rec.currentMatchType}</span> to <span className="font-semibold text-green-400">{rec.recommendedMatchType}</span></p>
                          <p className="text-xs text-slate-500 mt-1">Reason: {rec.reason}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
        
      </div>

      {/* ---- NEW SECTION: Suggested Negative Keywords ---- */}
      {fullAnalysis.negativeKeywordSuggestions && fullAnalysis.negativeKeywordSuggestions.length > 0 && (
        <div className="mb-10 bg-slate-800/60 p-6 rounded-lg border border-slate-700 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-xl font-bold text-slate-100 flex items-center">
              <svg className="w-6 h-6 text-purple-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Money-Draining Keywords <span className="text-slate-400 text-lg ml-2">(Consider Negating)</span>
            </h4>
            <button 
              onClick={handleCopyNegatives}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors duration-150 ${copiedNegatives ? 'bg-green-600 text-white' : 'bg-indigo-600 hover:bg-indigo-700 text-white'}`}
            >
              {copiedNegatives ? 'Copied!' : 'Copy List'}
            </button>
          </div>
          <p className="text-sm text-slate-300 mb-4">
            These keywords generated clicks and costs but resulted in no significant revenue (sales or KENP). Consider adding them as <span className="font-semibold text-purple-300">Negative Exact</span> in your campaigns to stop wasted spend.
          </p>
          <div className="flex flex-wrap gap-2">
            {fullAnalysis.negativeKeywordSuggestions.map((keyword, index) => (
              <span key={index} className="bg-purple-900/70 text-purple-200 text-xs font-medium px-2.5 py-1 rounded-full border border-purple-700">
                          {keyword}
                        </span>
                      ))}
          </div>
        </div>
      )}
      {/* ---- END NEW SECTION ---- */}
      </div> {/* Closing tag for the inner container */} 
    </>
  );
}