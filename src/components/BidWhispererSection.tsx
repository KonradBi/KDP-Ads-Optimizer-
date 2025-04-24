"use client";
import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";


export default function BidWhispererSection() {
  return (
    <section className="w-full py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="max-w-7xl mx-auto bg-slate-800/60 backdrop-blur-sm rounded-xl p-8 shadow-lg border border-slate-700/80">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">The Bid Whisperer 🧠</h2>
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
                <Link href="/upload" className="inline-flex items-center px-5 py-2.5 bg-[#FF9900] hover:bg-[#E68A00] text-[#232F3E] font-medium rounded-lg transition-all shadow-lg">
                  Optimize Your Bids
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </div>
            </div>
            <div className="transform hover:scale-105 transition-transform duration-500">
              
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
