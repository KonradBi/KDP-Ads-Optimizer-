import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-8 w-full px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
        <div>
          <Image 
            src="/screenshots/kdpadninja.png" 
            alt="KDP Ads Ninja Logo"
            width={266}
            height={80}
            className="h-20 w-auto mb-4"
          />
          <p className="text-gray-400 text-sm">
            Optimize your Amazon KDP Ads effortlessly.
          </p>
          <p className="text-sm text-gray-400">© {new Date().getFullYear()} KDP AdNinja. All rights reserved.</p>
        </div>
        <div>
          <h4 className="font-semibold text-amber-500 mb-4">Quick Links</h4>
          <ul className="space-y-2">
            <li><a href="/#features" className="text-gray-400 hover:text-[#FF9900] transition">Features</a></li>
            <li><a href="/#faq" className="text-gray-400 hover:text-[#FF9900] transition">FAQ</a></li>
            <li><Link href="/blog" className="text-gray-400 hover:text-[#FF9900] transition">Blog</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-amber-500 mb-4">Support</h4>
          <ul className="space-y-2">
            <li><Link href="/privacy" className="text-gray-400 hover:text-[#FF9900] transition">Privacy Policy</Link></li>
            <li><Link href="/terms" className="text-gray-400 hover:text-[#FF9900] transition">Terms of Service</Link></li>
            <li><Link href="/impressum" className="text-gray-400 hover:text-[#FF9900] transition">Impressum</Link></li>
            <li><a href="mailto:kdpninja@proton.me" className="text-gray-400 hover:text-[#FF9900] transition">Contact Us</a></li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;