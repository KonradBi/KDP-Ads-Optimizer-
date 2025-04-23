import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-gray-400 py-6 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm">
        <p>&copy; {currentYear} KDP Ninja. All rights reserved.</p>
        
      </div>
    </footer>
  );
};

export default Footer;
