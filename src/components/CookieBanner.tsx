'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

const CookieBanner = () => {
  const [consentGiven, setConsentGiven] = useState<boolean | null>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [analyticsConsent, setAnalyticsConsent] = useState(false);
  const [advertisingConsent, setAdvertisingConsent] = useState(false);

  // Check if consent already exists on mount
  useEffect(() => {
    // Don't run on server side
    if (typeof window === 'undefined') return;
    
    // Check for existing consent
    const hasAnalyticsConsent = localStorage.getItem('analytics_consent') === 'true';
    const hasAdvertisingConsent = localStorage.getItem('advertising_consent') === 'true';
    const hasSeenBanner = localStorage.getItem('consent_processed') === 'true';
    
    setAnalyticsConsent(hasAnalyticsConsent);
    setAdvertisingConsent(hasAdvertisingConsent);
    setConsentGiven(hasSeenBanner);
    setShowBanner(!hasSeenBanner);
    
    // If we have existing consent, update GTM
    if (hasSeenBanner) {
      updateGoogleConsentMode(hasAnalyticsConsent, hasAdvertisingConsent);
    }
  }, []);
  
  // Function to update Google's consent mode
  const updateGoogleConsentMode = (analytics: boolean, advertising: boolean) => {
    if (typeof window === 'undefined' || typeof window.gtag === 'undefined') return;
    
    // Update consent for analytics - explicitly signal user consent
    console.log('Updating consent mode:', { analytics, advertising });
    window.gtag('consent', 'update', {
      'analytics_storage': analytics ? 'granted' : 'denied',
      'ad_storage': advertising ? 'granted' : 'denied',
      'ad_user_data': advertising ? 'granted' : 'denied',
      'ad_personalization': advertising ? 'granted' : 'denied'
    });
    
    // If analytics consent is granted, send a page view
    if (analytics) {
      setTimeout(() => {
        window.gtag('event', 'page_view', {
          page_title: document.title,
          page_location: window.location.href,
          send_to: 'G-BDJ0SBH2Z3'
        });
        console.log('Page view sent after consent granted');
      }, 100);
    }
  };

  const handleAcceptAll = () => {
    setAnalyticsConsent(true);
    setAdvertisingConsent(true);
    setConsentGiven(true);
    setShowBanner(false);
    
    localStorage.setItem('analytics_consent', 'true');
    localStorage.setItem('advertising_consent', 'true');
    localStorage.setItem('consent_processed', 'true');
    
    updateGoogleConsentMode(true, true);
  };
  
  const handleRejectAll = () => {
    setAnalyticsConsent(false);
    setAdvertisingConsent(false);
    setConsentGiven(true);
    setShowBanner(false);
    
    localStorage.setItem('analytics_consent', 'false');
    localStorage.setItem('advertising_consent', 'false');
    localStorage.setItem('consent_processed', 'true');
    
    updateGoogleConsentMode(false, false);
  };
  
  const handleCustomConsent = () => {
    setConsentGiven(true);
    setShowBanner(false);
    
    localStorage.setItem('analytics_consent', analyticsConsent ? 'true' : 'false');
    localStorage.setItem('advertising_consent', advertisingConsent ? 'true' : 'false');
    localStorage.setItem('consent_processed', 'true');
    
    updateGoogleConsentMode(analyticsConsent, advertisingConsent);
  };

  return (
    <>
      {/* Google Tag Manager scripts moved to GoogleAnalytics.tsx */}

      {/* Custom Cookie Banner */}
      {showBanner && (
        <div className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 p-4 z-50">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col space-y-4">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-2">Cookie Settings</h3>
                  <p className="text-sm text-gray-300 mb-4">
                    This website uses cookies to improve your experience and analyze website traffic.
                    Please select which types of cookies you wish to accept.
                  </p>
                </div>
                <div className="flex space-x-3 mt-4 md:mt-0">
                  <button 
                    onClick={handleAcceptAll}
                    className="px-4 py-2 bg-green-700 hover:bg-green-600 text-white rounded text-sm font-medium"
                  >
                    Accept All
                  </button>
                  <button 
                    onClick={handleRejectAll}
                    className="px-4 py-2 bg-red-800 hover:bg-red-700 text-white rounded text-sm font-medium"
                  >
                    Reject All
                  </button>
                </div>
              </div>
              
              <div className="border-t border-gray-700 pt-4">
                <div className="flex items-center justify-between py-2">
                  <div>
                    <p className="text-sm font-medium text-white">Essential Cookies</p>
                    <p className="text-xs text-gray-400">These cookies are required for the basic functions of the website and cannot be disabled.</p>
                  </div>
                  <div className="bg-gray-700 rounded-full w-12 h-6 flex items-center px-1">
                    <div className="bg-green-500 w-4 h-4 rounded-full ml-auto"></div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between py-2">
                  <div>
                    <p className="text-sm font-medium text-white">Analytics Cookies</p>
                    <p className="text-xs text-gray-400">These cookies help us understand how visitors interact with our website.</p>
                  </div>
                  <div 
                    className={`w-12 h-6 flex items-center px-1 rounded-full cursor-pointer ${analyticsConsent ? 'bg-green-700' : 'bg-gray-700'}`}
                    onClick={() => setAnalyticsConsent(!analyticsConsent)}
                  >
                    <div className={`w-4 h-4 rounded-full transition-all duration-300 ${analyticsConsent ? 'bg-white ml-auto' : 'bg-gray-400'}`}></div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between py-2">
                  <div>
                    <p className="text-sm font-medium text-white">Advertising Cookies</p>
                    <p className="text-xs text-gray-400">These cookies are used to show you more relevant ads and measure the effectiveness of advertising campaigns.</p>
                  </div>
                  <div 
                    className={`w-12 h-6 flex items-center px-1 rounded-full cursor-pointer ${advertisingConsent ? 'bg-green-700' : 'bg-gray-700'}`}
                    onClick={() => setAdvertisingConsent(!advertisingConsent)}
                  >
                    <div className={`w-4 h-4 rounded-full transition-all duration-300 ${advertisingConsent ? 'bg-white ml-auto' : 'bg-gray-400'}`}></div>
                  </div>
                </div>
              </div>
              
              <div className="border-t border-gray-700 pt-4 flex justify-between items-center">
                <p className="text-xs text-gray-400">
                  For more information, please see our{' '}
                  <Link href="/privacy" className="text-indigo-400 hover:text-indigo-300 underline">
                    Privacy Policy
                  </Link>.
                </p>
                <button 
                  onClick={handleCustomConsent}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-sm font-medium"
                >
                  Save Settings
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// Add window.gtag type definition for TypeScript
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

export default CookieBanner;
