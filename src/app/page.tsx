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
import KeywordSpectrumSection from "../components/KeywordSpectrumSection";
import BidWhispererSection from "../components/BidWhispererSection";
import AdBudgetGuardianSummary from "../components/AdBudgetGuardianSummary";
import JourneyTimeline from "../components/JourneyTimeline";
import { motion } from 'framer-motion';

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
          <Link href="/upload" className="btn-primary">
            Upload CSV – Free Preview <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
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
        const nextTop = currentTop <= -96 ? 0 : currentTop - 32; // 4 items at 8rem height each
        (carousel as HTMLElement).style.top = `${nextTop}px`;
      }
    }, 3000); // Change every 3 seconds
    
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
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 text-white">
                  Stop Wasting <span className="text-[#FF9900] drop-shadow-sm">KDP Ad Spend.</span> Start Profiting.
                </h1>
                
                <p className="text-xl md:text-2xl text-white font-medium mb-4">
                  Transform your KDP ads from money-drains to profit-machines with data-driven insights.
                </p>
                
                <p className="text-slate-300 mb-8 max-w-lg">
                  Upload your KDP report, get instant insights. Cut waste, boost sales, dominate rankings.
                </p>
                
                <ul className="mb-8 space-y-3">
                  <li className="flex items-start text-slate-300">
                    <div className="flex-shrink-0 p-1 bg-[#FF9900]/20 rounded-full mr-3 mt-1">
                      <Check className="h-4 w-4 text-[#FF9900]" />
                    </div>
                    <span>Stop wasting money on dead keywords</span>
                  </li>
                  <li className="flex items-start text-slate-300">
                    <div className="flex-shrink-0 p-1 bg-[#FF9900]/20 rounded-full mr-3 mt-1">
                      <Check className="h-4 w-4 text-[#FF9900]" />
                    </div>
                    <span>Scale winning campaigns instantly</span>
                  </li>
                  <li className="flex items-start text-slate-300">
                    <div className="flex-shrink-0 p-1 bg-[#FF9900]/20 rounded-full mr-3 mt-1">
                      <Check className="h-4 w-4 text-[#FF9900]" />
                    </div>
                    <span>Get optimal bids that maximize ROI</span>
                  </li>
                </ul>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/upload" className="btn-primary">
                    Upload CSV – Free Preview <Zap className="ml-2 h-5 w-5" />
                  </Link>
                  <a href="#how-it-works" className="inline-flex items-center justify-center bg-transparent border border-slate-600 text-slate-300 px-6 py-3 rounded-lg font-medium text-lg hover:bg-slate-800/30 hover:text-white transition">
                    See How It Works
                  </a>
                </div>
                <p className="text-sm text-slate-400 mt-4">Free preview – zero cost, no credit card required</p>
              </div>
              <div className="relative">
                <OverallDashboardMockup />
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

        {/* Journey Timeline - ersetzt Upload Section */}
        <JourneyTimeline />

        {/* Guided Action Plan - direkt nach Timeline */}

        {/* Corrected: Replaced the entire 'Profit Acceleration' section with KeywordSpectrumSection */}
        <motion.section initial={{opacity:0,y:40}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:0.6}} className="w-full py-20 bg-gradient-to-b from-amber-600/15 via-slate-700/15 to-transparent">
          <KeywordSpectrumSection />
        </motion.section>

        {/* Testimonials */}
        <motion.section initial={{opacity:0,y:40}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:0.6}} className="w-full py-20 px-4 bg-transparent">
          <TestimonialSection />
        </motion.section>

        {/* FAQ Section */}
        <motion.section id="faq" initial={{opacity:0,y:40}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:0.6}} className="w-full py-20 px-4 bg-transparent">
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

      {/* Footer */}
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
            <p className="text-sm text-gray-400">2025 KDP AdNinja. All rights reserved.</p>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="#features" className="text-gray-400 hover:text-[#FF9900] transition">Features</a></li>
              <li><a href="#faq" className="text-gray-400 hover:text-[#FF9900] transition">FAQ</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">Support</h4>
            <ul className="space-y-2">
              <li><a href="/privacy" className="text-gray-400 hover:text-[#FF9900] transition">Privacy Policy</a></li>
              <li><a href="/terms" className="text-gray-400 hover:text-[#FF9900] transition">Terms of Service</a></li>
              <li><a href="mailto:kdpninja@proton.me" className="text-gray-400 hover:text-[#FF9900] transition">Contact Us</a></li>
            </ul>
          </div>
        </div>
      </footer>
    </>
  );
}