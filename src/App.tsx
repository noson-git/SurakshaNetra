/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { CommandCentreProvider, useCommandCentre } from './context/CommandCentreContext';
import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';
import { OverviewDashboard } from './components/overview/OverviewDashboard';
import { LandingPage } from './components/landing/LandingPage';
import { FacilityDigitalTwinView } from './components/twin/FacilityDigitalTwinView';
import { DroneMissionsView } from './components/missions/DroneMissionsView';
import { AnomalyEvidenceViewer } from './components/findings/AnomalyEvidenceViewer';
import { ActionTrackerView } from './components/actions/ActionTrackerView';
import { PitchTourGuide } from './components/tour/PitchTourGuide';
import { 
  LayoutDashboard, 
  Box, 
  Navigation, 
  ShieldAlert, 
  CheckSquare, 
  Menu, 
  X 
} from 'lucide-react';

const MainContent: React.FC = () => {
  const { activeTab, setActiveTab } = useCommandCentre();
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#070A11] text-slate-100 font-sans">
      {/* Top Bar Header */}
      <Header />

      {/* Main Workspace Body */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Desktop Persistent Sidebar */}
        <div className="hidden md:flex">
          <Sidebar />
        </div>

        {/* Mobile Hamburger Drawer */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-40 md:hidden flex">
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
            <div className="relative w-64 h-full z-50 bg-slate-900 border-r border-slate-800 flex flex-col">
              <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                <span className="text-xs font-bold font-mono text-cyan-400">SURAKSHA NETRA</span>
                <button onClick={() => setMobileMenuOpen(false)} className="text-slate-400">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto" onClick={() => setMobileMenuOpen(false)}>
                <Sidebar />
              </div>
            </div>
          </div>
        )}

        {/* Main Content Viewport */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-tech-grid">
          {/* Mobile Tab Bar Header Helper */}
          <div className="md:hidden flex items-center justify-between mb-4 pb-2 border-b border-slate-800">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded bg-slate-800 text-slate-200"
            >
              <Menu className="w-4 h-4" /> Menu
            </button>
            <span className="text-xs font-mono font-bold uppercase text-cyan-400">
              {activeTab}
            </span>
          </div>

          <div className="max-w-7xl mx-auto">
            {activeTab === 'home' && <LandingPage />}
            {activeTab === 'overview' && <OverviewDashboard />}
            {activeTab === 'twin' && <FacilityDigitalTwinView />}
            {activeTab === 'missions' && <DroneMissionsView />}
            {activeTab === 'findings' && <AnomalyEvidenceViewer />}
            {activeTab === 'actions' && <ActionTrackerView />}
          </div>
        </main>
      </div>

      {/* Startup Competition Pitch Tour Companion Guide */}
      <PitchTourGuide />
    </div>
  );
};

export default function App() {
  return (
    <CommandCentreProvider>
      <MainContent />
    </CommandCentreProvider>
  );
}
