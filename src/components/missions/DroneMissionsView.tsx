/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { MissionControlPanel } from './MissionControlPanel';
import { DroneCameraHUD } from './DroneCameraHUD';
import { useCommandCentre } from '../../context/CommandCentreContext';
import { Navigation, Camera, AlertCircle, Info } from 'lucide-react';

export const DroneMissionsView: React.FC = () => {
  return (
    <div className="flex flex-col gap-5">
      {/* Disclaimer */}
      <div className="px-4 py-2.5 rounded-lg bg-cyan-950/40 border border-cyan-500/20 flex items-center justify-between text-xs font-mono text-cyan-300">
        <span className="flex items-center gap-2">
          <Info className="w-4 h-4 shrink-0" />
          Autonomous Mission Simulator · Real-time waypoint pathing, sensor telemetry, and simulated optical/thermal gimbal feeds.
        </span>
        <span className="text-slate-400">Zero physical hardware required</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Mission Control & Waypoint Checklist (7 cols) */}
        <div className="lg:col-span-7">
          <MissionControlPanel />
        </div>

        {/* Right Column: Drone Camera HUD Viewport (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
              <Camera className="w-3.5 h-3.5 text-cyan-400" />
              Live Gimbal Payload Feed
            </h3>
            <DroneCameraHUD />
          </div>
        </div>
      </div>
    </div>
  );
};
