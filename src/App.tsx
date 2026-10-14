import React, { useState } from 'react';
import { Header } from './components/Header';
import { CustomerMasterView } from './components/CustomerMasterView';
import { CaptainAppSimulator } from './components/CaptainAppSimulator';
import { ReceiverTrackingView } from './components/ReceiverTrackingView';
import { DownloadSection } from './components/DownloadSection';
import { ReleaseNotesSection } from './components/ReleaseNotesSection';
import { ScreenDirectory } from './components/ScreenDirectory';
import { DriverEarningsCalculator } from './components/DriverEarningsCalculator';
import { MapSimulation } from './components/MapSimulation';
import { Footer } from './components/Footer';

export function App() {
  // Default to 'customer' as requested: focus on Bax (Customer)
  const [activeTab, setActiveTab] = useState<string>('customer');

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-indigo-600 selection:text-white">
      {/* Navigation Bar */}
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16">
        {activeTab === 'customer' && <CustomerMasterView />}
        {activeTab === 'captain-app' && <CaptainAppSimulator />}
        {activeTab === 'tracking-web' && <ReceiverTrackingView />}
        {activeTab === 'downloads' && <DownloadSection />}
        {activeTab === 'screens' && <ScreenDirectory />}
        {activeTab === 'notes' && <ReleaseNotesSection />}
        {activeTab === 'calculator' && <DriverEarningsCalculator />}
        {activeTab === 'map-preview' && <MapSimulation />}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;
