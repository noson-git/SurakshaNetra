/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useCommandCentre } from '../../context/CommandCentreContext';
import { RotateCcw, Sparkles, ShieldAlert, Cpu } from 'lucide-react';

export const Header: React.FC = () => {
  const { 
    resetDemo, 
    pitchTourActive, 
    setPitchTourActive, 
    findings, 
    activeTab, 
    setActiveTab 
  } = useCommandCentre();

  const activeAlerts = findings.filter(f => f.status === 'unreviewed' || f.status === 'confirmed').length;

  return (
    <header className="h-16 px-6 bg-slate-900/95 border-b border-slate-800 flex items-center justify-between gap-8 shrink-0 z-30 select-none">
      {/* Zone 1: Brand Wordmark (Clickable to Home) */}
      <button 
        onClick={() => setActiveTab('home')}
        className="flex items-center gap-3 shrink-0 text-left group cursor-pointer focus:outline-none"
        title="SURAKSHA NETRA Platform Home"
      >
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-slate-950 font-extrabold text-sm shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
          SN
        </div>
        <div>
          <span className="text-base font-extrabold tracking-tight text-white whitespace-nowrap block group-hover:text-cyan-300 transition-colors">
            SURAKSHA NETRA
          </span>
          <span className="text-[10px] font-mono text-cyan-400 -mt-1 block tracking-wider">
            AUTONOMOUS AERIAL SURVEILLANCE
          </span>
        </div>
      </button>

      {/* Zone 2: Facility Status Context (Clean unboxed metadata) */}
      <div className="hidden lg:flex items-center gap-6 text-xs text-slate-400 font-mono">
        <div className="flex items-center gap-2">
          <span className="text-slate-500">FACILITY:</span>
          <span className="text-slate-200 font-semibold">BHILAI SEC-04 METALLURGY</span>
        </div>
        <span aria-hidden="true" className="text-slate-700">·</span>
        <div className="flex items-center gap-2">
          <span className="text-slate-500">AIRSPACE:</span>
          <span className="text-emerald-400 font-semibold">RESTRICTED PATROL ONLINE</span>
        </div>
        <span aria-hidden="true" className="text-slate-700">·</span>
        <div className="flex items-center gap-2">
          <span className="text-slate-500">AI DETECTIONS:</span>
          <span className={`font-semibold ${activeAlerts > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
            {activeAlerts} ACTIVE ALERT{activeAlerts !== 1 ? 'S' : ''}
          </span>
        </div>
      </div>

      {/* Zone 3: Presentation Assist & Reset Demo Actions */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Pitch Tour Companion Toggle */}
        <button
          onClick={() => setPitchTourActive(!pitchTourActive)}
          className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors border ${
            pitchTourActive
              ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/60 shadow-lg shadow-cyan-500/20'
              : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
          }`}
          title="Interactive walkthrough for competition judges"
        >
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span className="hidden sm:inline">Pitch Tour Mode</span>
        </button>

        {/* Global Reset Demo Control */}
        <button
          onClick={resetDemo}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors border border-slate-700"
          title="Reset demonstration state back to initial parameters"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Reset Demo</span>
        </button>
      </div>
    </header>
  );
};
