import Link from 'next/link';
import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-gray-400 py-6 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm">
        <p>&copy; {currentYear} KDP Ads Optimizer. All rights reserved.</p>
        <div className="mt-2">
          <Link href="/terms" className="hover:text-indigo-400 transition duration-150 ease-in-out">
            Terms of Service
          </Link>
          <span className="mx-2">|</span>
          <Link href="/privacy" className="hover:text-indigo-400 transition duration-150 ease-in-out">
            Privacy Policy
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
