import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy - KDP Ads Optimizer',
  description: 'Privacy Policy for the KDP Ads Optimizer application.',
};

const PrivacyPolicyPage = () => {
  return (
    <div className="container mx-auto px-4 py-8 text-slate-300">
      <h1 className="text-3xl font-bold mb-6 text-amber-500">Privacy Policy</h1>

      <p className="mb-4">Last Updated: May 5, 2025</p>

      <p className="mb-6">
        Welcome to KDP Ads Optimizer ("we", "us", "our"). We are committed to protecting your personal information and your right to privacy. If you have any questions or concerns about this privacy notice, or our practices with regards to your personal information, please contact us at kdpninja@proton.me.
      </p>

      <p className="mb-6">
        This privacy notice describes how we might use your information if you:
      </p>
      <ul className="list-disc list-inside mb-6 ml-4">
        <li>Visit our website at https://www.kdpninja.app</li>
        <li>Use our application, KDP Ads Optimizer</li>
        <li>Engage with us in other related ways ― including any sales, marketing, or events</li>
      </ul>

      <p className="mb-6">
        In this privacy notice, if we refer to:
      </p>
      <ul className="list-disc list-inside mb-6 ml-4">
        <li><strong>"App"</strong>, we are referring to KDP Ads Optimizer.</li>
        <li><strong>"Website"</strong>, we are referring to our website at https://www.kdpninja.app.</li>
        <li><strong>"Services"</strong>, we are referring to our App, Website, and other related services, including any sales, marketing, or events.</li>
      </ul>

      <p className="mb-6">
        The purpose of this privacy notice is to explain to you in the clearest way possible what information we collect, how we use it, and what rights you have in relation to it. If there are any terms in this privacy notice that you do not agree with, please discontinue use of our Services immediately.
      </p>

      <h2 className="text-2xl font-semibold mb-4 text-amber-400">1. WHAT INFORMATION DO WE COLLECT?</h2>
      <div className="mb-6 space-y-3 pl-4">
        <h3 className="text-xl font-medium text-amber-300">Personal information you disclose to us</h3>
        <p>We collect personal information that you voluntarily provide to us when you register on the Services, express an interest in obtaining information about us or our products and Services, when you participate in activities on the Services or otherwise when you contact us.</p>
        <p>The personal information that we collect depends on the context of your interactions with us and the Services, the choices you make and the products and features you use. The personal information we collect may include the following: [List types of personal info, e.g., Names, Email addresses, Passwords, Contact preferences, Billing Addresses, Debit/credit card numbers, Data uploaded (like CSV files), etc. Be specific!].</p>

        <h3 className="text-xl font-medium text-amber-300">Information automatically collected</h3>
        <p>We automatically collect certain information when you visit, use or navigate the Services. This information does not reveal your specific identity (like your name or contact information) but may include device and usage information, such as your IP address, browser and device characteristics, operating system, language preferences, referring URLs, device name, country, location, information about how and when you use our Services and other technical information. This information is primarily needed to maintain the security and operation of our Services, and for our internal analytics and reporting purposes.</p>
        <p>We use Google Analytics to help us understand how our website is being used. Google Analytics collects information such as how often users visit our site, what pages they visit, and what other sites they used prior to coming to our site. We use the information we get from Google Analytics only to improve our website and services. Google Analytics collects only the IP address assigned to you on the date you visit our site, rather than your name or other identifying information. We do not combine the information collected through the use of Google Analytics with personally identifiable information.</p>
      </div>

      <h2 className="text-2xl font-semibold mb-4 text-amber-400">2. HOW DO WE USE YOUR INFORMATION?</h2>
      <div className="mb-6 space-y-3 pl-4">
        <p>We use personal information collected via our Services for a variety of business purposes described below. We process your personal information for these purposes in reliance on our legitimate business interests, in order to enter into or perform a contract with you, with your consent, and/or for compliance with our legal obligations.</p>
        <p>[List specific purposes, e.g., To facilitate account creation and logon process, To manage user accounts, To send administrative information, To fulfill and manage your orders/payments, To post testimonials (with consent), To request feedback, To protect our Services, To respond to user inquiries/offer support, To send marketing communications (with opt-out), For data analysis/improving services, etc.]</p>
      </div>

      <h2 className="text-2xl font-semibold mb-4 text-amber-400">3. WILL YOUR INFORMATION BE SHARED WITH ANYONE?</h2>
      <div className="mb-6 space-y-3 pl-4">
        <p>We only share information with your consent, to comply with laws, to provide you with services, to protect your rights, or to fulfill business obligations.</p>
        <p>[List categories of third parties info might be shared with, e.g., Cloud Computing Services (Vercel, Supabase), Payment Processors (Stripe - if applicable), Data Analytics Providers (Google Analytics), Communication Tools, Legal Requirements, Business Transfers, etc. Be specific about *why* it's shared.]</p>
        <p>Specifically mention Supabase for authentication/database and Vercel for hosting.</p>
      </div>

      <h2 className="text-2xl font-semibold mb-4 text-amber-400">4. DO WE USE COOKIES AND OTHER TRACKING TECHNOLOGIES?</h2>
      <div className="mb-6 space-y-3 pl-4">
        <p>We may use cookies and similar tracking technologies (like web beacons and pixels) to access or store information. Specific information about how we use such technologies and how you can refuse certain cookies is set out below.</p>
        <p>The cookie consent banner uses a cookie named 'kdpAdsOptimizerCookieConsent' to store your preference about cookie usage on our site.</p>
        <p>We use the following cookies:</p>
        <ul className="list-disc list-inside ml-4">
          <li><strong>kdpAdsOptimizerCookieConsent:</strong> A functional cookie that remembers your cookie preference choices.</li>
          <li><strong>Google Analytics cookies (_ga, _gid, _gat):</strong> These cookies are used to collect information about how visitors use our website. We use the information to compile reports and to help us improve the website. The cookies collect information in an anonymous form, including the number of visitors to the website, where visitors have come to the website from and the pages they visited. <a href="https://policies.google.com/privacy" className="text-amber-300 underline">Read Google's overview of privacy and safeguarding data</a>.</li>
        </ul>
      </div>

      <h2 className="text-2xl font-semibold mb-4 text-amber-400">5. HOW LONG DO WE KEEP YOUR INFORMATION?</h2>
      <div className="mb-6 space-y-3 pl-4">
        <p>We will only keep your personal information for as long as it is necessary for the purposes set out in this privacy notice, unless a longer retention period is required or permitted by law (such as tax, accounting or other legal requirements).</p>
        <p>[Specify retention periods for different types of data, e.g., Account information kept as long as account is active, Uploaded data kept for X period, etc.]</p>
      </div>

      <h2 className="text-2xl font-semibold mb-4 text-amber-400">6. HOW DO WE KEEP YOUR INFORMATION SAFE?</h2>
      <div className="mb-6 space-y-3 pl-4">
        <p>We have implemented appropriate technical and organizational security measures designed to protect the security of any personal information we process. However, despite our safeguards and efforts to secure your information, no electronic transmission over the Internet or information storage technology can be guaranteed to be 100% secure.</p>
        <p>[Mention specific security measures like HTTPS, data encryption (if applicable), access controls, reliance on Vercel/Supabase security, etc.]</p>
      </div>

      <h2 className="text-2xl font-semibold mb-4 text-amber-400">7. WHAT ARE YOUR PRIVACY RIGHTS?</h2>
      <div className="mb-6 space-y-3 pl-4">
        <p>In some regions (like the EEA, UK, and California), you have certain rights under applicable data protection laws. These may include the right (i) to request access and obtain a copy of your personal information, (ii) to request rectification or erasure; (iii) to restrict the processing of your personal information; and (iv) if applicable, to data portability.</p>
        <p>You may review, change, or terminate your account at any time by [Explain how users can manage their account/data, e.g., logging into account settings, contacting support].</p>
        <p>To exercise your rights, please contact us at kdpninja@proton.me.</p>
      </div>

      <h2 className="text-2xl font-semibold mb-4 text-amber-400">8. CONTROLS FOR DO-NOT-TRACK FEATURES</h2>
      <div className="mb-6 space-y-3 pl-4">
        <p>Most web browsers and some mobile operating systems and mobile applications include a Do-Not-Track ("DNT") feature or setting you can activate to signal your privacy preference not to have data about your online browsing activities monitored and collected. At this stage no uniform technology standard for recognizing and implementing DNT signals has been finalized. As such, we do not currently respond to DNT browser signals or any other mechanism that automatically communicates your choice not to be tracked online.</p>
      </div>

      <h2 className="text-2xl font-semibold mb-4 text-amber-400">9. DO CALIFORNIA RESIDENTS HAVE SPECIFIC PRIVACY RIGHTS?</h2>
      <div className="mb-6 space-y-3 pl-4">
        <p>Yes, if you are a resident of California, you are granted specific rights regarding access to your personal information under the California Consumer Privacy Act (CCPA).</p>
        <p>[Detail CCPA rights if applicable to your business and user base. Consult legal advice or CCPA resources.]</p>
      </div>

      <h2 className="text-2xl font-semibold mb-4 text-amber-400">10. DO WE MAKE UPDATES TO THIS NOTICE?</h2>
      <div className="mb-6 space-y-3 pl-4">
        <p>Yes, we will update this notice as necessary to stay compliant with relevant laws.</p>
        <p>We may update this privacy notice from time to time. The updated version will be indicated by an updated "Last Updated" date and the updated version will be effective as soon as it is accessible. We encourage you to review this privacy notice frequently to be informed of how we are protecting your information.</p>
      </div>

      <h2 className="text-2xl font-semibold mb-4 text-amber-400">11. HOW CAN YOU CONTACT US ABOUT THIS NOTICE?</h2>
      <div className="mb-6 space-y-3 pl-4">
        <p>If you have questions or comments about this notice, you may email us at kdpninja@proton.me or by post to:</p>
        <p>KDP Ninja</p>
        <p>Konrad Bierwagen</p>
        <p>Grenzstrasse 18</p>
        <p>01640 Coswig</p>
        <p>Germany</p>
      </div>

      <p className="mt-8 text-sm text-slate-500">
        <strong>Disclaimer:</strong> This is a template privacy policy and does not constitute legal advice. You should consult with a qualified legal professional to ensure compliance with all applicable laws and regulations.
      </p>
    </div>
  );
};

export default PrivacyPolicyPage;
