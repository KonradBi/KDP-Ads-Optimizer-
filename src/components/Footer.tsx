import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-gray-400 py-6 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm">
        <p>&copy; {currentYear} KDP Ninja. All rights reserved.</p>
        <div className="mt-2">
          {/* Use standard <a> tags for testing */}
          <a href="/terms" className="hover:text-indigo-400 transition duration-150 ease-in-out">
            Terms of Service
          </a>
          <span className="mx-2">|</span>
          <a href="/privacy" className="hover:text-indigo-400 transition duration-150 ease-in-out">
            Privacy Policy
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
