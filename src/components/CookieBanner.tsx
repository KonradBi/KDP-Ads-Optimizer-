'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Script from 'next/script';

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
    if (typeof window === 'undefined' || !window.gtag) return;
    
    // Update consent for analytics
    window.gtag('consent', 'update', {
      'analytics_storage': analytics ? 'granted' : 'denied',
      'ad_storage': advertising ? 'granted' : 'denied',
      'ad_user_data': advertising ? 'granted' : 'denied',
      'ad_personalization': advertising ? 'granted' : 'denied'
    });
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
      {/* Google Tag Manager - Always load with default consent denied */}
      <Script id="google-tag-manager-consent-mode" strategy="beforeInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          
          // Default consent mode settings - all denied by default
          gtag('consent', 'default', {
            'analytics_storage': 'denied',
            'ad_storage': 'denied',
            'ad_user_data': 'denied',
            'ad_personalization': 'denied',
            'wait_for_update': 500
          });
          gtag('set', 'ads_data_redaction', true);
        `}
      </Script>
      
      {/* Google Tag Manager */}
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-BDJ0SBH2Z3"
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-BDJ0SBH2Z3');
        `}
      </Script>

      {/* Custom Cookie Banner */}
      {showBanner && (
        <div className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 p-4 z-50">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col space-y-4">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-2">Cookie-Einstellungen</h3>
                  <p className="text-sm text-gray-300 mb-4">
                    Diese Website verwendet Cookies, um Ihre Erfahrung zu verbessern und den Website-Verkehr zu analysieren. 
                    Bitte wählen Sie aus, welche Arten von Cookies Sie akzeptieren möchten.
                  </p>
                </div>
                <div className="flex space-x-3 mt-4 md:mt-0">
                  <button 
                    onClick={handleAcceptAll}
                    className="px-4 py-2 bg-green-700 hover:bg-green-600 text-white rounded text-sm font-medium"
                  >
                    Alle akzeptieren
                  </button>
                  <button 
                    onClick={handleRejectAll}
                    className="px-4 py-2 bg-red-800 hover:bg-red-700 text-white rounded text-sm font-medium"
                  >
                    Alle ablehnen
                  </button>
                </div>
              </div>
              
              <div className="border-t border-gray-700 pt-4">
                <div className="flex items-center justify-between py-2">
                  <div>
                    <p className="text-sm font-medium text-white">Notwendige Cookies</p>
                    <p className="text-xs text-gray-400">Diese Cookies sind für die Grundfunktionen der Website erforderlich und können nicht deaktiviert werden.</p>
                  </div>
                  <div className="bg-gray-700 rounded-full w-12 h-6 flex items-center px-1">
                    <div className="bg-green-500 w-4 h-4 rounded-full ml-auto"></div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between py-2">
                  <div>
                    <p className="text-sm font-medium text-white">Analyse-Cookies</p>
                    <p className="text-xs text-gray-400">Diese Cookies helfen uns zu verstehen, wie Besucher mit unserer Website interagieren.</p>
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
                    <p className="text-sm font-medium text-white">Werbe-Cookies</p>
                    <p className="text-xs text-gray-400">Diese Cookies werden verwendet, um Ihnen relevantere Anzeigen zu zeigen und die Effektivität von Werbekampagnen zu messen.</p>
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
                  Weitere Informationen finden Sie in unserer{' '}
                  <Link href="/privacy" className="text-indigo-400 hover:text-indigo-300 underline">
                    Datenschutzerklärung
                  </Link>.
                </p>
                <button 
                  onClick={handleCustomConsent}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-sm font-medium"
                >
                  Einstellungen speichern
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
