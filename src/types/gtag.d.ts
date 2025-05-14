// Type definitions for Google Analytics gtag
interface Window {
  dataLayer: any[];
  gtag: (...args: any[]) => void;
}

// Declare gtag as a global function
declare function gtag(...args: any[]): void;
