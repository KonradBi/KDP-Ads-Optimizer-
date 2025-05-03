"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { 
  ChevronDown, 
  Download, 
  Upload, 
  BarChart4, 
  CheckCircle,
  ArrowRight 
} from "lucide-react";
import Link from "next/link";

const STEPS = [
  {
    id: 1,
    title: "Download KDP Report",
    description: "Export your ads report from KDP dashboard",
    icon: Download,
    color: "bg-amber-500",
    borderColor: "border-amber-400",
    shadowColor: "shadow-amber-500/20"
  },
  {
    id: 2,
    title: "Upload CSV",
    description: "We'll analyze it securely in your browser",
    icon: Upload,
    color: "bg-orange-500",
    borderColor: "border-orange-400",
    shadowColor: "shadow-orange-500/20"
  },
  {
    id: 3,
    title: "Guided Action Plan",
    description: "Get your personalized optimization steps",
    icon: BarChart4,
    color: "bg-green-500",
    borderColor: "border-green-400",
    shadowColor: "shadow-green-500/20"
  }
];

export default function JourneyTimeline() {
  const [activeStep, setActiveStep] = useState(1);


  // Simplified navigation - redirect to the upload page instead of handling file uploads directly

  // Go to next step in the journey
  const goToNextStep = () => {
    if (activeStep < STEPS.length) {
      setActiveStep(activeStep + 1);
    }
  };

  // Generate step styles based on active state
  const getStepStyles = (stepNumber: number) => {
    if (stepNumber < activeStep) return "completed"; // Past step
    if (stepNumber === activeStep) return "active"; // Current step
    return "upcoming"; // Future step
  };

  // Show appropriate content based on the active step
  const renderStepContent = () => {
    if (activeStep === 1) {
      return (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mt-8"
        >
          <h3 className="text-xl font-semibold text-white mb-4">How to Download Your KDP Report</h3>
          <div className="bg-slate-800/70 rounded-lg p-6 max-w-md mx-auto">
            <ol className="text-left space-y-3 text-slate-300">
              <li className="flex items-start">
                <span className="flex-shrink-0 bg-amber-900/30 text-amber-400 w-6 h-6 rounded-full flex items-center justify-center mr-2">1</span>
                <span>Login to your KDP dashboard</span>
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 bg-amber-900/30 text-amber-400 w-6 h-6 rounded-full flex items-center justify-center mr-2">2</span>
                <span>Navigate to "Reports" → "Advertising Reports"</span>
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 bg-amber-900/30 text-amber-400 w-6 h-6 rounded-full flex items-center justify-center mr-2">3</span>
                <span>Set your date range and select "Download CSV"</span>
              </li>
            </ol>
            <button 
              onClick={() => setActiveStep(2)} 
              className="mt-6 inline-flex items-center px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition"
            >
              I have my report <ArrowRight className="ml-2 w-4 h-4" />
            </button>
          </div>
        </motion.div>
      );
    }
    
    if (activeStep === 2) {
      return (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mt-8"
        >
          <h3 className="text-xl font-semibold text-white mb-4">Upload Your KDP Report</h3>
          <div className="bg-slate-800/70 rounded-lg p-6 max-w-md mx-auto border border-slate-700/40">
            <div className="flex justify-center mb-4">
              <Upload className="h-10 w-10 text-orange-400" />
            </div>
            <p className="text-slate-300 mb-6">Our upload page will guide you through the exact steps to export and upload your KDP advertising report.</p>
            
            <Link href="/upload" className="btn-primary">
              Go to Upload Page
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
            
            <p className="mt-4 text-sm text-slate-400">Or continue exploring the optimization journey below</p>
            <motion.div 
              className="mt-4 flex justify-center cursor-pointer" 
              onClick={() => goToNextStep()}
              whileHover={{ y: 3 }}
              whileTap={{ y: 5 }}
            >
              <ChevronDown className="h-6 w-6 text-slate-400" />
            </motion.div>
          </div>
          
          <div className="mt-5 space-y-3 max-w-md mx-auto text-left">
            <div className="flex items-start space-x-2">
              <div className="flex-shrink-0 mt-1">
                <CheckCircle className="h-4 w-4 text-green-400" />
              </div>
              <p className="text-sm text-slate-300">Supports all KDP reports including KENP reads</p>
            </div>
            <div className="flex items-start space-x-2">
              <div className="flex-shrink-0 mt-1">
                <CheckCircle className="h-4 w-4 text-green-400" />
              </div>
              <p className="text-sm text-slate-300">Secure client-side processing — your data never leaves your browser</p>
            </div>
            <div className="flex items-start space-x-2">
              <div className="flex-shrink-0 mt-1">
                <CheckCircle className="h-4 w-4 text-green-400" />
              </div>
              <p className="text-sm text-slate-300">Free preview with no limits or registration required</p>
            </div>
          </div>
        </motion.div>
      );
    }
    
    if (activeStep === 3) {
      return (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mt-8"
        >
          <h3 className="text-xl font-semibold text-white mb-4">Your Guided Action Plan is Ready!</h3>
          <div className="bg-slate-800/70 rounded-lg p-6 max-w-md mx-auto">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-green-900/30 rounded-full">
                <CheckCircle className="h-10 w-10 text-green-400" />
              </div>
            </div>
            <p className="text-slate-300 mb-6">We've analyzed your KDP data and prepared your personalized optimization plan.</p>
            
            <motion.div 
              className="mb-8 flex justify-center"
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              <ChevronDown className="h-6 w-6 text-green-400" />
            </motion.div>
            
            <p className="text-sm text-slate-400">Scroll down to view your Guided Action Plan</p>
          </div>
        </motion.div>
      );
    }
    
    return null;
  };

  return (
    <section className="w-full py-16 lg:py-20 overflow-hidden bg-gradient-to-b from-amber-700/10 via-slate-800/30 to-transparent">
      <div className="container mx-auto max-w-6xl px-4 md:px-6 relative z-10">
        <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-12 text-center">3-Step Journey to Optimization</h2>
        
        {/* Timeline */}
        <div className="relative max-w-4xl mx-auto mb-16">
          {/* Connection Line */}
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-700/50 -translate-y-1/2 z-0"></div>
          
          {/* Animated Progress */}
          <motion.div 
            className="absolute top-1/2 left-0 h-1 bg-gradient-to-r from-amber-500 via-orange-500 to-green-500 -translate-y-1/2 z-1"
            initial={{ width: '0%' }}
            animate={{ width: `${Math.max(0, (activeStep - 1) * 50)}%` }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          ></motion.div>
          
          {/* Steps */}
          <div className="flex justify-between relative z-10">
            {STEPS.map((step) => (
              <motion.div 
                key={step.id}
                className={`flex flex-col items-center ${step.id > activeStep ? 'opacity-70' : 'opacity-100'}`}
                whileHover={{ scale: step.id <= activeStep ? 1.05 : 1 }}
                onClick={() => step.id < activeStep && setActiveStep(step.id)}
                style={{ cursor: step.id < activeStep ? 'pointer' : 'default' }}
              >
                <motion.div 
                  className={`w-16 h-16 rounded-full ${step.color} border-2 ${step.borderColor} flex items-center justify-center shadow-lg ${step.shadowColor} relative`}
                  animate={step.id === activeStep ? { 
                    scale: [1, 1.1, 1],
                    boxShadow: [
                      '0 0 0 rgba(255,255,255,0)',
                      '0 0 15px rgba(255,255,255,0.5)',
                      '0 0 0 rgba(255,255,255,0)'
                    ]
                  } : {}}
                  transition={{ 
                    repeat: step.id === activeStep ? Infinity : 0, 
                    duration: 2 
                  }}
                >
                  {step.id < activeStep ? (
                    <CheckCircle className="w-8 h-8 text-white" />
                  ) : (
                    <step.icon className="w-8 h-8 text-white" />
                  )}
                  
                  {/* Step Number Badge */}
                  <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-slate-800 border border-slate-600 flex items-center justify-center text-xs font-bold text-white">
                    {step.id}
                  </div>
                </motion.div>
                
                <h3 className="mt-4 font-semibold text-white text-center">{step.title}</h3>
                <p className="text-xs text-slate-400 text-center max-w-[120px] mt-1">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
        
        {/* Dynamic Step Content */}
        {renderStepContent()}
      </div>
    </section>
  );
}
