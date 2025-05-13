import React from 'react';

export default function ImpressumPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-gray-800 p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-white mb-6 text-center">Impressum / Legal Notice</h1>
        <p className="mb-4 text-sm text-gray-400">Last Updated: May 13, 2025</p>

        <section className="mb-6">
          <h2 className="text-xl font-semibold text-indigo-400 mb-2">Angaben gemäß § 5 TMG / Information according to § 5 TMG</h2>
          <div className="ml-4 mt-2 text-gray-300">
            <p>KDP AdNinja</p>
            <p>Konrad Bierwagen</p>
            <p>Grenzstrasse 18</p>
            <p>01640 Coswig</p>
            <p>Germany</p>
          </div>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold text-indigo-400 mb-2">Kontakt / Contact</h2>
          <div className="ml-4 mt-2 text-gray-300">
            <p>Email: kdpninja@proton.me</p>
          </div>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold text-indigo-400 mb-2">Verantwortlich für den Inhalt / Responsible for content</h2>
          <div className="ml-4 mt-2 text-gray-300">
            <p>Konrad Bierwagen</p>
            <p>Grenzstrasse 18</p>
            <p>01640 Coswig</p>
            <p>Germany</p>
          </div>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold text-indigo-400 mb-2">EU-Streitschlichtung / EU Dispute Resolution</h2>
          <p className="text-gray-300">
            Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit: 
            <a href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-indigo-300 ml-1">
              https://ec.europa.eu/consumers/odr/
            </a>
          </p>
          <p className="text-gray-300 mt-2">
            The European Commission provides a platform for online dispute resolution (OS): 
            <a href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-indigo-300 ml-1">
              https://ec.europa.eu/consumers/odr/
            </a>
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold text-indigo-400 mb-2">Verbraucherstreitbeilegung / Consumer Dispute Resolution</h2>
          <p className="text-gray-300">
            Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.
          </p>
          <p className="text-gray-300 mt-2">
            We are not willing or obliged to participate in dispute resolution proceedings before a consumer arbitration board.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold text-indigo-400 mb-2">Haftung für Inhalte / Liability for Content</h2>
          <p className="text-gray-300">
            Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.
          </p>
          <p className="text-gray-300 mt-2">
            As a service provider, we are responsible for our own content on these pages in accordance with Section 7, Paragraph 1 of the German Telemedia Act (TMG). According to §§ 8 to 10 TMG, however, we as a service provider are not obliged to monitor transmitted or stored third-party information or to investigate circumstances that indicate illegal activity.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold text-indigo-400 mb-2">Haftung für Links / Liability for Links</h2>
          <p className="text-gray-300">
            Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich.
          </p>
          <p className="text-gray-300 mt-2">
            Our offer contains links to external websites of third parties, the content of which we have no influence on. Therefore, we cannot assume any liability for this external content. The respective provider or operator of the linked pages is always responsible for the content of the linked pages.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold text-indigo-400 mb-2">Urheberrecht / Copyright</h2>
          <p className="text-gray-300">
            Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.
          </p>
          <p className="text-gray-300 mt-2">
            The content and works created by the site operators on these pages are subject to German copyright law. The reproduction, editing, distribution, and any kind of exploitation outside the limits of copyright law require the written consent of the respective author or creator.
          </p>
        </section>
      </div>
    </div>
  );
}
