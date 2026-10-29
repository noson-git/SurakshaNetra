/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useCommandCentre } from '../../context/CommandCentreContext';
import { ViewTab } from '../../types';
import { 
  Compass,
  LayoutDashboard, 
  Box, 
  Navigation, 
  ShieldAlert, 
  CheckSquare, 
  Sparkles,
  Layers,
  Terminal
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    findings, 
    actions, 
    setPitchTourActive,
    pitchTourActive 
  } = useCommandCentre();

  const unreviewedFindings = findings.filter(f => f.status === 'unreviewed').length;
  const openActions = actions.filter(a => a.status === 'open' || a.status === 'in_progress').length;

  const NAV_ITEMS: { id: ViewTab; label: string; icon: React.FC<{ className?: string }>; badge?: number; badgeColor?: string }[] = [
    {
      id: 'home',
      label: 'Platform Home',
      icon: Compass
    },
    {
      id: 'overview',
      label: 'Command Overview',
      icon: LayoutDashboard
    },
    {
      id: 'twin',
      label: 'Facility Digital Twin',
      icon: Box
    },
    {
      id: 'missions',
      label: 'Drone Missions',
      icon: Navigation
    },
    {
      id: 'findings',
      label: 'AI Findings',
      icon: ShieldAlert,
      badge: unreviewedFindings,
      badgeColor: 'bg-red-500 text-white'
    },
    {
      id: 'actions',
      label: 'Action Tracker',
      icon: CheckSquare,
      badge: openActions,
      badgeColor: 'bg-amber-500 text-slate-950 font-bold'
    }
  ];

  return (
    <aside className="w-64 bg-slate-900/90 border-r border-slate-800 flex flex-col justify-between shrink-0 select-none">
      <div className="p-4">
        {/* Navigation Section Title */}
        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 px-3 block mb-2">
          Operations Modules
        </span>

        {/* Navigation Items */}
        <nav className="space-y-1">
          {NAV_ITEMS.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>

                {item.badge !== undefined && item.badge > 0 && (
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${item.badgeColor || 'bg-slate-800 text-slate-300'}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section: Pitch Mode & System Info */}
      <div className="p-4 border-t border-slate-800/80 space-y-3">
        <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 text-xs font-mono">
          <div className="flex items-center justify-between text-slate-400 text-[10px] mb-1">
            <span>DRONE LINK</span>
            <span className="text-emerald-400 font-bold">ONLINE</span>
          </div>
          <div className="text-slate-200 font-semibold truncate">
            Netra-VTOL-X4
          </div>
          <div className="text-slate-500 text-[10px] mt-0.5">
            Firmware: v3.2-Aero · RTK Lock
          </div>
        </div>

        <button
          onClick={() => setPitchTourActive(true)}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-bold rounded-lg bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/30 transition-all shadow-sm"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Launch Pitch Tour</span>
        </button>
      </div>
    </aside>
  );
};
