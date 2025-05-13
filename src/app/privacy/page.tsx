import React from 'react';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-gray-800 p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-white mb-6 text-center">Privacy Policy</h1>
        <p className="mb-4 text-sm text-gray-400">Last Updated: April 23, 2025</p>

        <section className="mb-6">
          <h2 className="text-xl font-semibold text-indigo-400 mb-2">1. Introduction</h2>
          <p className="text-gray-300">
            This Privacy Policy explains how KDP Ninja ("we", "us", "our") collects, uses, discloses, and safeguards your information when you use our website and services (the "Service"). By using the Service, you consent to the practices described in this policy.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold text-indigo-400 mb-2">2. Data Controller</h2>
          <p className="text-gray-300">
            For the purposes of the EU General Data Protection Regulation (GDPR), the data controller is:
          </p>
          <div className="ml-4 mt-2 text-gray-300">
            <p>KDP AdNinja</p>
            <p>Konrad Bierwagen</p>
            <p>Grenzstrasse 18</p>
            <p>01640 Coswig</p>
            <p>Germany</p>
            <p>Email: kdpninja@proton.me</p>
          </div>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold text-indigo-400 mb-2">3. Information We Collect</h2>
          <ul className="list-disc list-inside ml-4 text-gray-300">
            <li><span className="font-semibold">Account Information:</span> When you register, we collect your email address and other information you provide.</li>
            <li><span className="font-semibold">Uploaded Data:</span> When you use our analysis tools, you may upload advertising reports or other files. We store and process these solely to provide the Service to you.</li>
            <li><span className="font-semibold">Payment Information:</span> Payments are processed by our third-party provider (Stripe). We do not store your full payment details.</li>
            <li><span className="font-semibold">Usage Data:</span> We may collect technical data such as IP address, browser type, device information, and usage patterns to improve the Service and for security purposes.</li>
            <li><span className="font-semibold">Cookies:</span> We use cookies and similar technologies to enhance your experience and analyze usage. You may disable cookies in your browser, but some features may not work as intended.</li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold text-indigo-400 mb-2">4. How We Use Your Information</h2>
          <ul className="list-disc list-inside ml-4 text-gray-300">
            <li>To provide, operate, and maintain the Service.</li>
            <li>To process transactions and send related information, including confirmations and invoices.</li>
            <li>To communicate with you, including responding to your inquiries and sending administrative messages.</li>
            <li>To improve and personalize the Service, including analytics and research.</li>
            <li>To detect, prevent, and address technical issues or security threats.</li>
            <li>To comply with legal obligations.</li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold text-indigo-400 mb-2">5. How We Share Your Information</h2>
          <ul className="list-disc list-inside ml-4 text-gray-300">
            <li>We do <span className="font-bold">not</span> sell, rent, or trade your personal information to third parties.</li>
            <li>We may share information with trusted service providers (like Stripe and Supabase) who assist in operating the Service, but only as necessary and under confidentiality obligations.</li>
            <li>We may disclose information if required by law or to protect our rights, users, or others.</li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold text-indigo-400 mb-2">6. Data Security</h2>
          <p className="text-gray-300">
            We implement reasonable security measures to protect your information. However, no method of transmission over the Internet or electronic storage is 100% secure. You use the Service at your own risk.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold text-indigo-400 mb-2">7. Data Retention</h2>
          <p className="text-gray-300">
            We retain your information only as long as necessary to fulfill the purposes outlined in this policy, unless a longer retention period is required or permitted by law. You may request deletion of your account and uploaded data at any time by contacting us.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold text-indigo-400 mb-2">8. Children's Privacy</h2>
          <p className="text-gray-300">
            The Service is not intended for use by children under the age of 18. We do not knowingly collect personal information from children. If you believe a child has provided us with personal data, please contact us and we will delete it promptly.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold text-indigo-400 mb-2">9. International Users</h2>
          <p className="text-gray-300">
            Your information may be transferred to and processed in countries other than your own. By using the Service, you consent to such transfer and processing.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold text-indigo-400 mb-2">10. Changes to This Policy</h2>
          <p className="text-gray-300">
            We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new policy on this page. Your continued use of the Service after changes are posted constitutes your acceptance of the new policy.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-indigo-400 mb-2">11. Contact Us</h2>
          <p className="text-gray-300">
            If you have any questions about this Privacy Policy, please contact us at: kdpninja@proton.me
          </p>
        </section>
      </div>
    </div>
  );
}
