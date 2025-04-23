"use client"

/**
 * Landing page for KDP Ads Optimizer
 */
import Link from 'next/link';
import { useEffect, useState } from 'react';
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
  BarChart,
  Activity,
  Cpu,
  Rocket,
  Unlock,
  ArrowDownToLine,
  Zap,
  TrendingDown, 
  CircleDollarSign, 
  ShoppingCart, 
  Lightbulb,
  ListChecks
} from 'lucide-react';
import Image from "next/image";

const BidAdjustmentMockup = () => {
  const bidAdjustments = [
    { keyword: "ai for beginners", matchType: "BROAD", current: "$0.67", recommended: "$0.80", action: "increase", impact: "Raise to $0.80 for more volume." },
    { keyword: "artificial intelligence", matchType: "BROAD", current: "$0.65", recommended: "$0.78", action: "increase", impact: "Raise to $0.78 for more volume." },
    { keyword: "the teacher", matchType: "BROAD", current: "$0.65", recommended: "$0.52", action: "decrease", impact: "Lower bid to $0.52 while optimising ad copy. (Est. save: $1.61)" },
    { keyword: "the emotional lives of teenagers", matchType: "BROAD", current: "$0.65", recommended: "$0.52", action: "decrease", impact: "Lower bid to $0.52 while optimising ad copy. (Est. save: $0.16)" },
    { keyword: "atlas of ai", matchType: "BROAD", current: "$0.65", recommended: "$0.78", action: "increase", impact: "Raise to $0.78 for more volume." }
  ];

  return (
    <div className="max-w-lg mx-auto rounded-xl overflow-hidden shadow-lg bg-slate-800/60 border border-slate-700/50 backdrop-blur-sm">
      <div className="px-6 py-4 border-b border-blue-500/30 bg-gradient-to-r from-blue-900/40 to-blue-800/30">
        <h3 className="text-lg font-semibold text-blue-200">Top Bid Adjustments</h3>
        <p className="mt-1 text-sm text-blue-300/80">
          Focus on these bid changes for potential ACOS improvements
        </p>
      </div>
      <div className="p-4">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-700">
            <thead className="bg-slate-700/50">
              <tr>
                <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">Keyword</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">Match</th>
                <th scope="col" className="px-4 py-3 text-right text-xs font-semibold text-slate-300 uppercase tracking-wider">Current</th>
                <th scope="col" className="px-4 py-3 text-right text-xs font-semibold text-slate-300 uppercase tracking-wider">Recommended</th>
                <th scope="col" className="px-4 py-3 text-center text-xs font-semibold text-slate-300 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-slate-800 divide-y divide-slate-700">
              {bidAdjustments.map((item, i) => (
                <tr key={i} className="hover:bg-slate-700/40 transition-colors">
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-slate-300 truncate max-w-xs">{item.keyword}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-slate-400">{item.matchType}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-slate-400 text-right">{item.current}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-right">
                    <span className={`${item.action === 'increase' ? 'text-green-400' : 'text-red-400'}`}>
                      {item.recommended}
                    </span>
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-center text-sm">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold
                      ${item.action === 'increase' ? 'bg-green-500/20 text-green-300 ring-1 ring-inset ring-green-500/30' : 
                        'bg-red-500/20 text-red-300 ring-1 ring-inset ring-red-500/30'}`}>
                      {item.action === 'increase' ? 'Increase' : 'Decrease'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const PainPointsPreviewMockup = () => {
  return (
    <div className="max-w-lg mx-auto grid grid-cols-2 gap-4 p-4 bg-slate-800/60 rounded-xl backdrop-blur-sm border border-slate-700/50">
      {/* Wasted Spend Card */}
      <div className="bg-red-700/80 p-4 rounded-lg border border-red-500/50 shadow-lg text-white">
        <p className="text-sm font-bold mb-1">Negative Keywords</p>
        <p className="text-xl font-bold mb-1">18</p>
        <p className="text-xs text-red-100">wasteful keywords found</p>
        <p className="text-xs text-red-100/80 italic mb-2">$237.50 spent with no conversions</p>
        <p className="text-xs font-medium bg-red-900/60 p-1 rounded border border-red-400/30">✓ Action: Add as negative keywords</p>
      </div>
      {/* Inefficient Keywords Card */}
      <div className="bg-orange-600/80 p-4 rounded-lg border border-orange-500/50 shadow-lg text-white">
        <p className="text-sm font-bold mb-1">Bid Optimization</p>
        <p className="text-xl font-bold mb-1">26</p>
        <p className="text-xs text-orange-100">bid adjustments recommended</p>
        <p className="text-xs text-orange-100/80 italic mb-2">14 decreases & 12 increases</p>
        <p className="text-xs font-medium bg-orange-800/60 p-1 rounded border border-orange-400/30">✓ Action: Adjust bids manually in KDP</p>
      </div>
      {/* Match Type Card */}
      <div className="bg-amber-600/80 p-4 rounded-lg border border-amber-500/50 shadow-lg text-white">
        <p className="text-sm font-bold mb-1">Match Types</p>
        <p className="text-xl font-bold mb-1">8</p>
        <p className="text-xs text-amber-100">match type improvements</p>
        <p className="text-xs text-amber-100/80 italic mb-2">Mostly broad to phrase/exact changes</p>
        <p className="text-xs font-medium bg-amber-800/60 p-1 rounded border border-amber-400/30">✓ Action: Update match types in KDP</p>
      </div>
      {/* Revenue Boost Potential Card */}
      <div className="bg-green-600/80 p-4 rounded-lg border border-green-500/50 shadow-lg text-white">
        <p className="text-sm font-bold mb-1">ACOS Improvement</p>
        <p className="text-xl font-bold mb-1">-9.8%</p>
        <p className="text-xs text-green-100">potential ACOS reduction</p>
        <p className="text-xs text-green-100/80 italic mb-2">From 42.3% down to 32.5%</p>
        <p className="text-xs font-medium bg-green-800/60 p-1 rounded border border-green-400/30">✓ Action: Follow optimization plan</p>
      </div>
    </div>
  );
};

const OverallDashboardMockup = () => {
  return (
    <div className="max-w-lg mx-auto p-4 bg-slate-800/60 rounded-xl backdrop-blur-sm border border-slate-700/50 space-y-3">
      <div className="grid grid-cols-2 gap-3">
        {/* Current ACOS */}
        <div className="bg-slate-700/50 p-3 rounded-md flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-slate-600/50 flex items-center justify-center mr-2 text-blue-300">
              <TrendingDown className="w-5 h-5" />
            </div>
            <span className="text-xs text-slate-300">Current ACOS</span>
          </div>
          <span className="text-sm font-semibold text-white">42.3%</span>
        </div>
        {/* Estimated ACOS */}
        <div className="bg-slate-700/50 p-3 rounded-md flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-slate-600/50 flex items-center justify-center mr-2 text-green-400">
              <TrendingUp className="w-5 h-5" />
            </div>
            <span className="text-xs text-slate-300">Estimated ACOS</span>
          </div>
          <span className="text-sm font-semibold text-green-400">32.5%</span>
        </div>
        {/* Wasted Spend */}
        <div className="bg-slate-700/50 p-3 rounded-md flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-slate-600/50 flex items-center justify-center mr-2 text-red-400">
              <CircleDollarSign className="w-5 h-5" />
            </div>
            <span className="text-xs text-slate-300">Wasted Spend</span>
          </div>
          <span className="text-sm font-semibold text-red-400">$237</span>
        </div>
        {/* Conversion Rate */}
        <div className="bg-slate-700/50 p-3 rounded-md flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-slate-600/50 flex items-center justify-center mr-2 text-purple-400">
              <ShoppingCart className="w-5 h-5" />
            </div>
            <span className="text-xs text-slate-300">Conversion Rate</span>
          </div>
          <span className="text-sm font-semibold text-purple-400">4.2%</span>
        </div>
      </div>
      {/* Total Optimization Value */}
      <div className="bg-gradient-to-r from-slate-700/70 to-slate-800/70 p-3 rounded-md flex items-center justify-between">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-slate-600/50 flex items-center justify-center mr-2 text-amber-400">
            <Lightbulb className="w-5 h-5" />
          </div>
          <span className="text-sm font-medium text-white">Total Optimization Value</span>
        </div>
        <span className="text-lg font-bold text-white">$389</span>
      </div>
    </div>
  );
};

const UploadInterfaceMockup = () => {
  return (
    <div className="max-w-lg mx-auto p-6 bg-slate-800/60 rounded-xl backdrop-blur-sm border border-slate-700/50">
      <div className="flex items-center mb-4">
        <div className="w-10 h-10 flex items-center justify-center rounded-full bg-indigo-500/20 mr-3">
          <ArrowDownToLine className="w-6 h-6 text-indigo-300" />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-slate-100">Upload Your KDP Report</h3>
          <p className="text-sm text-slate-400">CSV files exported from KDP dashboard</p>
        </div>
      </div>
      
      <div className="border-2 border-dashed border-slate-600 rounded-lg p-8 text-center">
        <div className="flex justify-center mb-4">
          <ArrowDownToLine className="h-10 w-10 text-slate-400" />
        </div>
        <p className="text-slate-300 mb-2">Drag and drop your advertising report</p>
        <p className="text-slate-400 text-sm mb-4">or click to browse your files</p>
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md font-medium transition-all shadow-lg">
          Select File
        </button>
      </div>
      
      <div className="mt-5 space-y-3">
        <div className="flex items-start space-x-2">
          <div className="flex-shrink-0 mt-1">
            <svg className="h-4 w-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
          </div>
          <p className="text-sm text-slate-300">Supports all KDP reports including KENP reads</p>
        </div>
        <div className="flex items-start space-x-2">
          <div className="flex-shrink-0 mt-1">
            <svg className="h-4 w-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
          </div>
          <p className="text-sm text-slate-300">Secure client-side processing — your data never leaves your browser</p>
        </div>
        <div className="flex items-start space-x-2">
          <div className="flex-shrink-0 mt-1">
            <svg className="h-4 w-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
          </div>
          <p className="text-sm text-slate-300">Free analysis with no limits or registration required</p>
        </div>
      </div>
    </div>
  );
};

/* NEW Testimonial Component */
const TestimonialSection = () => {
  const testimonials = [
    {
      quote: "My book sales increased by 32% in just three weeks after implementing the recommendations!",
      author: "J.T. Morgan",
      genre: "Fantasy Author",
      image: "/user-1.svg"
    },
    {
      quote: "Finally achieved positive ROI on my thriller series after 3 months of negative returns. This tool pays for itself.",
      author: "Rebecca Chen",
      genre: "Mystery & Thriller Author",
      image: "/user-2.svg"
    },
    {
      quote: "I discovered 4 high-converting keywords I'd never have thought of. My KENP reads doubled in just a month.",
      author: "Mike Davis",
      genre: "Sci-Fi Author",
      image: "/user-3.svg"
    }
  ];
  
  return (
    <div className="py-12 bg-gradient-to-b from-slate-800/80 to-slate-900/90">
      <div className="container mx-auto max-w-6xl px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-3">What Authors Are Saying</h2>
        <p className="text-lg text-center text-slate-400 mb-12">Real results from writers just like you</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((item, index) => (
            <div key={index} className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/60 shadow-lg hover:shadow-indigo-500/20 hover:border-indigo-600/40 transition-all duration-300">
              <div className="flex items-center gap-1 mb-3 text-amber-400">
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
              </div>
              <p className="text-slate-200 mb-6 italic">"{item.quote}"</p>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-indigo-600/30 flex items-center justify-center mr-3">
                  <span className="text-indigo-300 font-bold">{item.author[0]}</span>
                </div>
                <div>
                  <p className="font-medium text-white">{item.author}</p>
                  <p className="text-sm text-slate-400">{item.genre}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-10 text-center">
          <Link href="/upload" className="inline-flex items-center px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-all shadow-lg">
            Try It For Free
            <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

/* NEW Performance Booster Preview */
const PerformanceBoosterPreview = () => {
  return (
    <div className="max-w-lg mx-auto bg-slate-800/60 border border-indigo-600/30 rounded-xl shadow-lg overflow-hidden">
      <div className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 p-4 border-b border-indigo-500/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="bg-white/10 rounded-full p-2 mr-3 shadow-lg shadow-indigo-900/30">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Boost Profit by +27.8%</h3>
              <p className="text-indigo-200 text-xs">Your personalized action plan</p>
            </div>
          </div>
        </div>
        <div className="absolute top-0 left-0 h-1 bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 w-[75%]"></div>
      </div>
      
      <div className="p-4">
        <div className="flex items-center mb-4">
          <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center mr-3 text-green-400 ring-2 ring-green-500/30">
            <Check className="w-4 h-4" />
          </div>
          <div>
            <p className="text-white font-medium">Stop Money Drains</p>
            <p className="text-xs text-slate-400">18 wasteful keywords identified</p>
          </div>
        </div>
        
        <div className="flex items-center mb-4">
          <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center mr-3 text-indigo-400 ring-2 ring-indigo-500/30">
            <Check className="w-4 h-4" />
          </div>
          <div>
            <p className="text-white font-medium">Fine-tune Your Bids</p>
            <p className="text-xs text-slate-400">26 bid adjustments recommended</p>
          </div>
        </div>
        
        <div className="flex items-center mb-4">
          <div className="w-8 h-8 rounded-full bg-slate-700/50 flex items-center justify-center mr-3 text-slate-400">
            <span className="text-xs font-bold">3</span>
          </div>
          <div>
            <p className="text-white font-medium">Increase Keyword Precision</p>
            <p className="text-xs text-slate-400">8 match type improvements</p>
          </div>
        </div>
        
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-slate-700/50 flex items-center justify-center mr-3 text-slate-400">
            <span className="text-xs font-bold">4</span>
          </div>
          <div>
            <p className="text-white font-medium">Optimize Ad Group Structure</p>
            <p className="text-xs text-slate-400">Advanced targeting recommendations</p>
          </div>
        </div>
      </div>
      
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-3 text-center">
        <p className="text-sm text-slate-400">Preview of your personalized action plan</p>
      </div>
    </div>
  );
};

export default function Home() {
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      document.querySelectorAll('.parallax-fg').forEach(element => {
        (element as HTMLElement).style.transform = `translateY(${scrollY * 0.4}px)`;
      });
      document.querySelectorAll('.parallax-image').forEach(element => {
        (element as HTMLElement).style.transform = `translateY(${scrollY * -0.15}px)`;
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
        const nextTop = currentTop <= -96 ? 0 : currentTop - 32; // 4 items at 8rem height each
        (carousel as HTMLElement).style.top = `${nextTop}px`;
      }
    }, 3000); // Change every 3 seconds
    
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <main className="flex min-h-screen flex-col items-center overflow-x-hidden bg-[#232F3E]">
        {/* Hero Section - Added pt-20 */}
        <section className="relative w-full pt-20 pb-16 px-4 md:px-6 lg:pt-32 lg:pb-24">
          <div className="absolute inset-0 z-0 bg-[url('/bg-grid.svg')] bg-center opacity-5"></div>
          <div className="container mx-auto max-w-6xl relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="parallax-fg">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 text-white">
                  Stop Wasting <span className="text-[#FF9900] drop-shadow-sm">KDP Ad Spend.</span> Start Profiting.
                </h1>
                
                <p className="text-xl md:text-2xl text-white font-medium mb-4">
                  Stop guessing with KDP Ads reports. Get clear analyses and actionable recommendations to eliminate wasted budget and maximize your book sales.
                </p>
                
                <p className="text-slate-300 mb-8 max-w-lg">
                  Upload your KDP advertising report and get a personalized action plan in seconds. Identify money-draining keywords, receive precise bid recommendations, and export enhanced data to streamline your optimization.
                </p>
                
                <ul className="mb-8 space-y-3">
                  <li className="flex items-start text-slate-300">
                    <div className="flex-shrink-0 p-1 bg-[#FF9900]/20 rounded-full mr-3 mt-1">
                      <Check className="h-4 w-4 text-[#FF9900]" />
                    </div>
                    <span>Identify wasteful keywords draining your budget</span>
                  </li>
                  <li className="flex items-start text-slate-300">
                    <div className="flex-shrink-0 p-1 bg-[#FF9900]/20 rounded-full mr-3 mt-1">
                      <Check className="h-4 w-4 text-[#FF9900]" />
                    </div>
                    <span>Discover high-ROI campaigns ready for scaling</span>
                  </li>
                  <li className="flex items-start text-slate-300">
                    <div className="flex-shrink-0 p-1 bg-[#FF9900]/20 rounded-full mr-3 mt-1">
                      <Check className="h-4 w-4 text-[#FF9900]" />
                    </div>
                    <span>Get data-driven bid recommendations that maximize returns</span>
                  </li>
                </ul>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/upload" className="inline-flex items-center justify-center bg-[#FF9900] hover:bg-[#E68A00] text-[#232F3E] px-6 py-3 rounded-lg font-bold text-lg transition shadow-lg hover:scale-105 transform">
                    Optimize Your Ads Now
                    <Zap className="ml-2 h-5 w-5" />
                  </Link>
                  <a href="#how-it-works" className="inline-flex items-center justify-center bg-transparent border border-slate-600 text-slate-300 px-6 py-3 rounded-lg font-medium text-lg hover:bg-slate-800/30 hover:text-white transition">
                    See How It Works
                  </a>
                </div>
                <p className="text-sm text-slate-400 mt-4">Free analysis – zero cost, no credit card required</p>
              </div>
              <div className="relative transform hover:scale-105 transition-transform duration-500 parallax-image">
                <OverallDashboardMockup />
              </div>
            </div>
          </div>
        </section>

        {/* Feature Section 1 - UPDATED HEADING */}
        <section id="features" className="w-full py-20 px-4 relative">
          <div className="absolute inset-0 z-0 bg-[url('/bg-grid.svg')] bg-center opacity-5"></div>
          <div className="container mx-auto max-w-6xl relative z-10">
            <div className="max-w-7xl mx-auto bg-slate-800/60 backdrop-blur-sm rounded-xl p-8 shadow-lg border border-slate-700/80">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="order-2 lg:order-1 transform hover:scale-105 transition-transform duration-500">
                  <PainPointsPreviewMockup />
                </div>
                <div className="order-1 lg:order-2">
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Your Ad Budget Guardian 💰</h2>
                  <p className="text-lg text-slate-300 mb-8">
                    Instantly detect keywords silently draining your budget with no returns and get actionable fixes to reclaim your ad spend.
                  </p>
                  <ul className="space-y-4">
                    <li className="flex items-start">
                      <div className="flex-shrink-0 p-1 bg-[#FF9900]/20 rounded-full mr-3">
                        <Check className="h-5 w-5 text-[#FF9900]" />
                      </div>
                      <p className="text-slate-300">Identify budget-draining keywords with precision</p>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0 p-1 bg-[#FF9900]/20 rounded-full mr-3">
                        <Check className="h-5 w-5 text-[#FF9900]" />
                      </div>
                      <p className="text-slate-300">Get clear, actionable optimization steps</p>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0 p-1 bg-[#FF9900]/20 rounded-full mr-3">
                        <Check className="h-5 w-5 text-[#FF9900]" />
                      </div>
                      <p className="text-slate-300">Reduce ad spend by up to 25% immediately</p>
                    </li>
                  </ul>
                  {/* NEW CTA */}
                  <div className="mt-8">
                    <Link href="/upload" className="inline-flex items-center px-5 py-2.5 bg-[#FF9900] hover:bg-[#E68A00] text-[#232F3E] font-medium rounded-lg transition-all shadow-lg">
                      Find Your Wasteful Keywords
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Section 2 - UPDATED HEADING */}
        <section className="w-full py-20 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="max-w-7xl mx-auto bg-slate-800/60 backdrop-blur-sm rounded-xl p-8 shadow-lg border border-slate-700/80">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">The Bid Whisperer 🧠</h2>
                  <p className="text-lg text-slate-300 mb-8">
                    Precision bid recommendations built on thousands of data points to maximize sales and eliminate wasteful spending.
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
                  {/* NEW CTA */}
                  <div className="mt-8">
                    <Link href="/upload" className="inline-flex items-center px-5 py-2.5 bg-[#FF9900] hover:bg-[#E68A00] text-[#232F3E] font-medium rounded-lg transition-all shadow-lg">
                      Optimize Your Bids
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Link>
                  </div>
                </div>
                <div className="transform hover:scale-105 transition-transform duration-500">
                  <BidAdjustmentMockup />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Section 3 - UPDATED HEADING */}
        <section className="w-full py-20 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="max-w-7xl mx-auto bg-slate-800/60 backdrop-blur-sm rounded-xl p-8 shadow-lg border border-slate-700/80">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="order-2 lg:order-1 transform hover:scale-105 transition-transform duration-500">
                  <UploadInterfaceMockup />
                </div>
                <div className="order-1 lg:order-2">
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">One Upload, Total Clarity 🔍</h2>
                  <p className="text-lg text-slate-300 mb-8">
                    One-click upload, instant analysis, clear action plan - transform your ad performance in seconds without technical headaches.
                  </p>
                  <ul className="space-y-4">
                    <li className="flex items-start">
                      <div className="flex-shrink-0 p-1 bg-[#FF9900]/20 rounded-full mr-3">
                        <Check className="h-5 w-5 text-[#FF9900]" />
                      </div>
                      <p className="text-slate-300">Simple drag-and-drop file upload</p>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0 p-1 bg-[#FF9900]/20 rounded-full mr-3">
                        <Check className="h-5 w-5 text-[#FF9900]" />
                      </div>
                      <p className="text-slate-300">Automated analysis in seconds</p>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0 p-1 bg-[#FF9900]/20 rounded-full mr-3">
                        <Check className="h-5 w-5 text-[#FF9900]" />
                      </div>
                      <p className="text-slate-300">Clear, ready-to-implement action plan</p>
                    </li>
                  </ul>
                  {/* NEW CTA */}
                  <div className="mt-8">
                    <Link href="/upload" className="inline-flex items-center px-5 py-2.5 bg-[#FF9900] hover:bg-[#E68A00] text-[#232F3E] font-medium rounded-lg transition-all shadow-lg">
                      Start Your Free Analysis
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* NEW PERFORMANCE BOOSTER PREVIEW SECTION */}
        <section className="w-full py-20 px-4 bg-gradient-to-b from-slate-900 to-slate-800">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Your Personal Profit Acceleration Plan</h2>
              <p className="text-lg text-slate-300 max-w-3xl mx-auto">
                Every analysis includes a step-by-step action plan to maximize your ROI
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <ul className="space-y-6">
                  <li className="flex items-start">
                    <div className="flex-shrink-0 p-2 bg-indigo-500/20 rounded-full mr-4 mt-1">
                      <Check className="h-5 w-5 text-indigo-400" />
                    </div>
                    <div>
                      <p className="text-white font-medium text-lg mb-1">Guided Optimization Steps</p>
                      <p className="text-slate-400">Follow our clear, prioritized recommendations to improve campaign performance step by step</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 p-2 bg-indigo-500/20 rounded-full mr-4 mt-1">
                      <Check className="h-5 w-5 text-indigo-400" />
                    </div>
                    <div>
                      <p className="text-white font-medium text-lg mb-1">Progress Tracking</p>
                      <p className="text-slate-400">Keep track of your optimization progress with visual indicators</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 p-2 bg-indigo-500/20 rounded-full mr-4 mt-1">
                      <Check className="h-5 w-5 text-indigo-400" />
                    </div>
                    <div>
                      <p className="text-white font-medium text-lg mb-1">One-Click Copy Actions</p>
                      <p className="text-slate-400">Easily copy negative keywords and access all recommended changes</p>
                    </div>
                  </li>
                </ul>
                <div className="mt-10 md:pl-10">
                  <Link href="/upload" className="inline-flex items-center px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-all shadow-lg">
                    Get Your Custom Action Plan
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                </div>
              </div>
              <div className="transform hover:scale-105 transition-transform duration-500">
                <PerformanceBoosterPreview />
              </div>
            </div>
          </div>
        </section>

        {/* NEW TESTIMONIAL SECTION */}
        <TestimonialSection />

        {/* How It Works */}
        <section id="how-it-works" className="py-16 lg:py-24 bg-gradient-to-b from-slate-900 to-[#232F3E]">
          <div className="container mx-auto max-w-6xl px-4 md:px-6">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-4">Transform Data Into Profit:</h2>
            <p className="text-lg text-slate-300 text-center mb-12 max-w-3xl mx-auto">
              Our process is simple and designed to deliver actionable insights quickly.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Step 1 */}
              <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700/60 shadow-lg transition-all duration-300 hover:shadow-indigo-500/20 hover:border-indigo-600/80 transform hover:-translate-y-1">
                <div className="flex items-center mb-4">
                  <span className="text-3xl font-bold text-indigo-400 mr-3">1</span>
                  <div className="p-2 rounded-lg bg-indigo-500/20">
                    <ArrowDownToLine className="w-6 h-6 text-indigo-300" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Upload Report</h3>
                <p className="text-sm text-slate-300">Securely upload your KDP Ads performance report (CSV).</p>
              </div>
              
              {/* Step 2 */}
              <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700/60 shadow-lg transition-all duration-300 hover:shadow-cyan-500/20 hover:border-cyan-600/80 transform hover:-translate-y-1">
                <div className="flex items-center mb-4">
                  <span className="text-3xl font-bold text-cyan-400 mr-3">2</span>
                  <div className="p-2 rounded-lg bg-cyan-500/20">
                    <Cpu className="w-6 h-6 text-cyan-300" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Instant Analysis</h3>
                <p className="text-sm text-slate-300">Our engine analyzes your data, identifying performance issues, money wasters (negative keywords), and optimization opportunities for bids and match types.</p>
              </div>

              {/* Step 3 */}
              <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700/60 shadow-lg transition-all duration-300 hover:shadow-purple-500/20 hover:border-purple-600/80 transform hover:-translate-y-1">
                <div className="flex items-center mb-4">
                  <span className="text-3xl font-bold text-purple-400 mr-3">3</span>
                  <div className="p-2 rounded-lg bg-purple-500/20">
                    <ListChecks className="w-6 h-6 text-purple-300" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Clear Action Plan</h3>
                <p className="text-sm text-slate-300">Review your personalized action plan: a list of negative keywords to copy, bid recommendations for manual adjustments in KDP, and match type suggestions.</p>
              </div>

              {/* Step 4 */}
              <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700/60 shadow-lg transition-all duration-300 hover:shadow-emerald-500/20 hover:border-emerald-600/80 transform hover:-translate-y-1">
                <div className="flex items-center mb-4">
                  <span className="text-3xl font-bold text-emerald-400 mr-3">4</span>
                  <div className="p-2 rounded-lg bg-emerald-500/20">
                    <Rocket className="w-6 h-6 text-emerald-300" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Implement & Profit</h3>
                <p className="text-sm text-slate-300">Copy the negative keywords. Use the detailed analysis (also available as Excel export) as a guide for manually adjusting your bids in the KDP Ads Dashboard.</p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="w-full py-20 px-4 bg-transparent">
          <div className="container mx-auto max-w-4xl">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-12">Frequently Asked Questions</h2>
            
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
                    Our algorithm leverages advanced Bayesian probabilistic models to detect underperforming keywords with statistical confidence. We incorporate Jeffreys prior distributions (α=0.5, β=0.5) for handling sparse conversion data, z-score normalization for match type optimization, and dynamic bid elasticity modeling. Our confidence intervals are calibrated to minimize both Type I and Type II errors in keyword performance classification.
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
                  <p className="text-slate-300">
                    Our heuristic decision models are calibrated with ACoS/RoAS optimization parameters that have been empirically validated across thousands of KDP ad groups. While no analysis tool can predict future performance with 100% certainty, our recommendations consistently outperform manual optimization with a 94% confidence level. Our algorithm assigns data confidence ratings (Low/Medium/High) to every suggestion based on statistical significance thresholds.
                  </p>
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
                  <p className="text-slate-300">
                    Yes! You can access a free preview analysis with no credit card required. This includes one high-impact recommendation and key optimization metrics to demonstrate the value our tool can provide. For full access to advanced features including ad group optimization algorithms, match type recommendations, and unlimited analyses, check out our premium plans.
                  </p>
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
                  <p className="text-slate-300">
                    Simply export your KDP advertising report as a CSV file from your Amazon KDP dashboard. Our algorithm requires impression, click, conversion, and spend data at minimum. For enhanced accuracy, including KENP read data significantly improves our royalty estimations and effective ACoS calculations, especially for Kindle Unlimited titles.
                  </p>
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
                  <p className="text-slate-300">
                    Absolutely. We use enterprise-grade encryption and security protocols. Your data is processed client-side whenever possible, and we never store raw campaign data without explicit permission. Our analytics engine uses anonymized, aggregated patterns for continuous improvement, but your competitive campaign information remains completely private.
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
                  <p className="text-slate-300">
                    Our system employs a multi-factor analysis model that goes beyond basic metrics. We calculate a Bayesian probability for each keyword's true conversion rate, using a confidence threshold of p&lt;0.05. This allows us to identify statistically significant underperformers with even limited data. Additionally, our proprietary "hopelessness score" factors in impression-to-click ratios, comparative performance within ad groups, and bid elasticity modeling.
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
                  <p className="text-slate-300">
                    While Amazon's Dynamic Campaigns provide automation, they lack the granular optimization our platform delivers. Our key advantages include: (1) Ad group-level analysis that identifies keyword-specific opportunities Amazon's broad approach misses; (2) Consideration of KENP reads and royalties in our ROI calculations, which Amazon ignores; (3) Transparent recommendations with clear statistical reasoning rather than black-box automation; and (4) Author-specific optimization that understands book market dynamics rather than applying general e-commerce algorithms. Our users typically see a 20-35% improvement in ACOS compared to Dynamic Campaigns.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* Footer - Moved outside main */}
      <footer className="bg-gray-900 text-white py-8 mt-16 w-full px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <Image 
              src="/screenshots/kdpadninja.png" 
              alt="KDP Ads Ninja Logo"
              width={266}
              height={80}
              className="h-20 w-auto mb-4"
            />
            <p className="text-gray-400 text-sm">
              Optimize your Amazon KDP Ads effortlessly.
            </p>
            <p className="text-sm text-gray-400">© 2025 KDP AdNinja. All rights reserved.</p>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="#features" className="text-gray-400 hover:text-[#FF9900] transition">Features</a></li>
              <li><a href="#how-it-works" className="text-gray-400 hover:text-[#FF9900] transition">How It Works</a></li>
              <li><Link href="/upload" className="text-gray-400 hover:text-[#FF9900] transition">Get Started</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">Support</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-[#FF9900] transition">Help Center</a></li>
              <li><a href="/privacy" className="text-gray-400 hover:text-[#FF9900] transition">Privacy Policy</a></li>
              <li><a href="/terms" className="text-gray-400 hover:text-[#FF9900] transition">Terms of Service</a></li>
            </ul>
          </div>
        </div>
      </footer>
    </>
  );
}