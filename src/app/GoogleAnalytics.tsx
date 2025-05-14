'use client';

import Script from 'next/script';
import { useEffect } from 'react';

// Google Analytics Measurement ID
const GA_MEASUREMENT_ID = 'G-BDJ0SBH2Z3';

export default function GoogleAnalytics() {
  // Initialize consent mode when the component mounts
  useEffect(() => {
    // Only run on client side
    if (typeof window !== 'undefined') {
      // Check for existing consent
      const hasAnalyticsConsent = localStorage.getItem('analytics_consent') === 'true';
      const hasAdvertisingConsent = localStorage.getItem('advertising_consent') === 'true';
      
      // If user has already given consent, update the consent mode
      if (hasAnalyticsConsent || hasAdvertisingConsent) {
        window.gtag?.('consent', 'update', {
          'analytics_storage': hasAnalyticsConsent ? 'granted' : 'denied',
          'ad_storage': hasAdvertisingConsent ? 'granted' : 'denied',
          'ad_user_data': hasAdvertisingConsent ? 'granted' : 'denied',
          'ad_personalization': hasAdvertisingConsent ? 'granted' : 'denied'
        });
        
        // Send a page view if analytics is consented
        if (hasAnalyticsConsent) {
          window.gtag?.('event', 'page_view', {
            page_title: document.title,
            page_location: window.location.href,
            send_to: GA_MEASUREMENT_ID
          });
        }
      }
    }
  }, []);

  return (
    <>
      {/* Initialize gtag and set default consent to denied */}
      <Script id="google-tag-manager-init" strategy="beforeInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag;
          
          // Default consent mode settings - all denied by default
          gtag('consent', 'default', {
            'analytics_storage': 'denied',
            'ad_storage': 'denied',
            'ad_user_data': 'denied',
            'ad_personalization': 'denied',
            'wait_for_update': 500
          });
          
          // Explicitly signal that we're using consent mode v2
          gtag('set', 'url_passthrough', true);
          gtag('set', 'ads_data_redaction', true);
        `}
      </Script>
      
      {/* Load the Google Analytics script */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      
      {/* Configure Google Analytics */}
      <Script id="google-analytics-config" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag;
          
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}', {
            'cookie_flags': 'samesite=none;secure',
            'send_page_view': false
          });
        `}
      </Script>
    </>
  );
}
