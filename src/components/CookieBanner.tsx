'use client';

import React, { useEffect, useState } from 'react';
import CookieConsent from 'react-cookie-consent';
import Link from 'next/link';
import Script from 'next/script';

const CookieBanner = () => {
  const [hasConsent, setHasConsent] = useState(false);

  // Check if consent already exists on mount
  useEffect(() => {
    // Check if the cookie exists using document.cookie
    const cookieExists = document.cookie
      .split('; ')
      .some(row => row.startsWith('kdpAdsOptimizerCookieConsent=true'));
      
    if (cookieExists) {
      setHasConsent(true);
    }
  }, []);

  const handleAccept = () => {
    setHasConsent(true);
  };

  return (
    <>
      {/* Google Analytics - Only loaded after consent */}
      {hasConsent && (
        <>
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
        </>
      )}

      <CookieConsent
        location="bottom"
        buttonText="Accept"
        cookieName="kdpAdsOptimizerCookieConsent"
        style={{ background: '#2B373B' }}
        buttonStyle={{ 
          color: '#fff', 
          backgroundColor: '#4d7c0f', 
          fontSize: '13px', 
          borderRadius: '4px',
          padding: '8px 16px'
        }}
        expires={150}
        onAccept={handleAccept}
        enableDeclineButton
        declineButtonText="Decline"
        declineButtonStyle={{
          color: '#fff',
          backgroundColor: '#7f1d1d',
          fontSize: '13px',
          borderRadius: '4px',
          padding: '8px 16px'
        }}
      >
        This website uses cookies to enhance the user experience and analyze site traffic.{' '}
        <span style={{ fontSize: '10px' }}>
          By clicking "Accept", you agree to the storing of cookies on your device and the use of Google Analytics.
          Learn more in our{' '}
          <Link href="/privacy-policy" style={{ color: '#F0E68C', textDecoration: 'underline' }}>
            Privacy Policy
          </Link>
          .
        </span>
      </CookieConsent>
    </>
  );
};

export default CookieBanner;
