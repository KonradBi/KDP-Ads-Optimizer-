"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { 
  ChevronDown, 
  Download, 
  Upload, 
  BarChart4, 
  Check, 
  ArrowRight 
} from "lucide-react";
import Link from "next/link";

const STEPS = [
  {
    id: 1,
    title: "Download KDP Report",
    description: "Export your ads report from KDP dashboard",
    icon: Download,
    color: "amber",
  },
  {
    id: 2,
    title: "Upload CSV",
    description: "We'll analyze it securely in your browser",
    icon: Upload,
    color: "orange",
  },
  {
    id: 3,
    title: "Guided Action Plan",
    description: "Get your personalized optimization steps",
    icon: BarChart4,
    color: "green",
  }
];

export default function JourneyTimeline() {
  const [activeStep, setActiveStep] = useState(1);

  // Go to next step in the journey
  const goToNextStep = () => {
    if (activeStep < STEPS.length) {
      setActiveStep(activeStep + 1);
    }
  };

  // Generate step styles based on active state
  const getStepStatus = (stepNumber: number) => {
    if (stepNumber < activeStep) return "completed"; // Past step
    if (stepNumber === activeStep) return "active"; // Current step
    return "upcoming"; // Future step
  };

  // Show appropriate content based on the active step
  const renderStepContent = () => {
    const currentStepConfig = STEPS.find(step => step.id === activeStep);
    if (!currentStepConfig) return null;
    const color = currentStepConfig.color;

    if (activeStep === 1) {
      return (
        <motion.div 
          key="step-1-content"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.4 }}
          className="mt-12 max-w-lg mx-auto"
        >
          <h3 className={`text-xl font-semibold text-white mb-5 text-center`}>How to Download Your KDP Report</h3>
          <div className={`bg-slate-800/60 backdrop-blur-sm rounded-lg p-6 border border-${color}-500/30 shadow-lg shadow-${color}-500/10`}>
            <ol className="text-left space-y-4 text-slate-300 text-sm">
              <li className="flex items-start">
                <span className={`flex-shrink-0 bg-${color}-500/20 text-${color}-300 w-6 h-6 rounded-full flex items-center justify-center mr-3 font-semibold text-xs ring-1 ring-${color}-500/30`}>1</span>
                <span>Login to your KDP dashboard.</span>
              </li>
              <li className="flex items-start">
                <span className={`flex-shrink-0 bg-${color}-500/20 text-${color}-300 w-6 h-6 rounded-full flex items-center justify-center mr-3 font-semibold text-xs ring-1 ring-${color}-500/30`}>2</span>
                <span>Navigate to "Reports" <ArrowRight className="inline w-3 h-3 mx-0.5 opacity-50"/> "Advertising Reports".</span>
              </li>
              <li className="flex items-start">
                <span className={`flex-shrink-0 bg-${color}-500/20 text-${color}-300 w-6 h-6 rounded-full flex items-center justify-center mr-3 font-semibold text-xs ring-1 ring-${color}-500/30`}>3</span>
                <span>Set your date range (e.g., last 60 days) and select "Download CSV".</span>
              </li>
            </ol>
            <div className="text-center mt-8">
              <button 
                onClick={() => setActiveStep(2)} 
                className={`inline-flex items-center px-6 py-2.5 bg-${color}-600 text-white rounded-lg font-semibold text-sm shadow-md hover:bg-${color}-700 focus:outline-none focus:ring-2 focus:ring-${color}-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition duration-150 ease-in-out`}
              >
                I have my report <ArrowRight className="ml-2 w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      );
    }
    
    if (activeStep === 2) {
      return (
        <motion.div 
          key="step-2-content"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.4 }}
          className="mt-12 max-w-lg mx-auto"
        >
          <h3 className={`text-xl font-semibold text-white mb-5 text-center`}>Ready to Upload Your Report?</h3>
          <div className={`bg-slate-800/60 backdrop-blur-sm rounded-lg p-6 border border-${color}-500/30 shadow-lg shadow-${color}-500/10 text-center`}>
            <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-${color}-500/20 border border-${color}-500/30 mb-5`}>
              <Upload className={`h-8 w-8 text-${color}-300`} />
            </div>
            <p className="text-slate-300 text-sm mb-6">Click below to securely upload and analyze your KDP advertising report directly in your browser.</p>
            
            <Link href="/upload" 
                  className={`inline-flex items-center px-6 py-2.5 bg-${color}-600 text-white rounded-lg font-semibold text-sm shadow-md hover:bg-${color}-700 focus:outline-none focus:ring-2 focus:ring-${color}-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition duration-150 ease-in-out`}
            >
              Go to Upload Page
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
            
            {/* Security/Privacy points */}
             <div className="mt-8 space-y-3 text-left text-xs">
              <div className="flex items-start space-x-2 text-slate-400">
                <div className="flex-shrink-0 mt-0.5">
                  <Check className="h-3.5 w-3.5 text-green-500" />
                </div>
                <p>Supports all KDP ad reports (including KENP).</p>
              </div>
              <div className="flex items-start space-x-2 text-slate-400">
                <div className="flex-shrink-0 mt-0.5">
                  <Check className="h-3.5 w-3.5 text-green-500" />
                </div>
                <p>Secure client-side processing — data stays in your browser.</p>
              </div>
              <div className="flex items-start space-x-2 text-slate-400">
                <div className="flex-shrink-0 mt-0.5">
                  <Check className="h-3.5 w-3.5 text-green-500" />
                </div>
                <p>Free preview, no registration needed.</p>
              </div>
            </div>

          </div>
          {/* Option to see next step description (Optional) */}
          {/* <motion.div 
            className="mt-4 flex justify-center cursor-pointer text-slate-500 hover:text-slate-400 transition"
            onClick={() => goToNextStep()}
            whileHover={{ y: 2 }}
          >
            <span className="text-xs mr-1">See next step</span>
            <ChevronDown className="h-4 w-4" />
          </motion.div> */}  
        </motion.div>
      );
    }
    
    if (activeStep === 3) {
      return (
        <motion.div 
          key="step-3-content"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.4 }}
          className="mt-12 max-w-lg mx-auto"
        >
           <h3 className={`text-xl font-semibold text-white mb-5 text-center`}>Your Action Plan Awaits</h3>
           <div className={`bg-slate-800/60 backdrop-blur-sm rounded-lg p-6 border border-${color}-500/30 shadow-lg shadow-${color}-500/10 text-center`}>
            <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-${color}-500/20 border border-${color}-500/30 mb-5`}>
                <BarChart4 className={`h-8 w-8 text-${color}-300`} />
            </div>
            <p className="text-slate-300 text-sm mb-6">Once uploaded, we'll generate a personalized action plan with clear steps to optimize your campaigns.</p>
            
            <motion.div 
              className="mb-4 flex justify-center"
              animate={{ y: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            >
              <ChevronDown className={`h-5 w-5 text-${color}-400`} />
            </motion.div>
            
            <p className="text-xs text-slate-400">Ready to optimize? Go back and upload your report!</p>
          </div>
        </motion.div>
      );
    }
    
    return null;
  };

  return (
    <section className="w-full py-16 lg:py-20 overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950">
      <div className="container px-4 md:px-6 relative z-10">
        <h2 className="text-4xl md:text-5xl font-bold mb-16 text-center bg-gradient-to-r from-amber-300 via-amber-400 to-orange-500 bg-clip-text text-transparent">
          Your 3-Step Journey to Optimization
        </h2>
        
        {/* Timeline Visualizer */}
        <div className="flex items-center justify-center mb-12 md:mb-16 relative">
          {/* Base Connection Line */}
          <div className="absolute top-6 left-6 right-6 h-0.5 bg-slate-700"></div>
          
          {/* Animated Progress Line */}
          <motion.div 
            className="absolute top-6 left-6 h-0.5 bg-gradient-to-r from-amber-500 via-orange-500 to-green-500"
            initial={{ width: 0 }}
            animate={{ width: `${((activeStep - 1) / (STEPS.length -1)) * 100}%` }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />

          {/* Steps */}
          <div className="relative flex justify-between">
            {STEPS.map((step) => {
              const status = getStepStatus(step.id);
              const Icon = step.icon;
              const color = step.color;
              let circleClasses = "w-12 h-12 rounded-full flex items-center justify-center relative border-2 transition-all duration-300 ";
              let iconClasses = "w-5 h-5 transition-all duration-300 ";
              let textClasses = "mt-3 text-center text-sm transition-opacity duration-300 ";
              let descriptionClasses = "text-xs opacity-70 ";

              if (status === 'completed') {
                circleClasses += `bg-${color}-500/30 border-${color}-500 text-${color}-200 shadow-md shadow-${color}-500/20`;
                iconClasses += `text-${color}-200`;
                textClasses += `text-slate-300`;
                descriptionClasses += `text-slate-400`;
              } else if (status === 'active') {
                circleClasses += `bg-slate-700 border-${color}-400 text-${color}-300 scale-110 shadow-lg shadow-${color}-500/30 ring-2 ring-${color}-500/50 ring-offset-4 ring-offset-slate-900`;
                iconClasses += `text-${color}-300`;
                textClasses += `text-white font-semibold`;
                 descriptionClasses += `text-${color}-300/80`;
              } else { // upcoming
                circleClasses += `bg-slate-800 border-slate-700 text-slate-500`;
                iconClasses += `text-slate-500`;
                textClasses += `text-slate-500`;
                descriptionClasses += `text-slate-600`;
              }
              
              return (
                <div key={step.id} className="flex flex-col items-center z-10">
                  <motion.div 
                    className={circleClasses}
                    whileHover={status !== 'active' ? { scale: 1.1 } : {}}
                  >
                    {status === 'completed' ? <Check className={iconClasses} /> : <Icon className={iconClasses} />}
                  </motion.div>
                  <div className={textClasses} style={{ maxWidth: '120px' }}> {/* Limit width */} 
                     {step.title}
                     <p className={descriptionClasses}>{step.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Step Content Area */} 
        <div className="relative min-h-[300px]"> {/* Ensure space for content */} 
           {renderStepContent()}
        </div>

      </div>
    </section>
  );
}
