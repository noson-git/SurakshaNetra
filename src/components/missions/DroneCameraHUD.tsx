/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useCommandCentre } from '../../context/CommandCentreContext';
import { 
  Camera, 
  Flame, 
  Crosshair, 
  Battery, 
  Wifi, 
  Compass, 
  Maximize2,
  AlertTriangle
} from 'lucide-react';

export const DroneCameraHUD: React.FC = () => {
  const { 
    droneTelemetry, 
    cameraFeedMode, 
    setCameraFeedMode,
    currentWaypointIndex,
    selectedAssetId
  } = useCommandCentre();

  const isAnomalyWaypoint = currentWaypointIndex === 2 || selectedAssetId === 'pj-204';

  return (
    <div className="relative w-full h-[380px] bg-slate-950 rounded-xl overflow-hidden border border-slate-800 shadow-2xl flex flex-col select-none">
      {/* Top HUD Telemetry Bar */}
      <div className="absolute top-0 inset-x-0 z-20 flex items-center justify-between px-4 py-2 bg-gradient-to-b from-black/80 via-black/40 to-transparent text-xs font-mono">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 font-bold text-red-500">
            <span className="w-2 h-2 rounded-full bg-red-500" />
            REC
          </span>
          <span className="text-slate-300">CAM-01 · GIMBAL 4K/FLIR</span>
          <span className="text-slate-600">·</span>
          <span className="text-cyan-400">FPS: 60.0</span>
        </div>

        {/* Camera Feed Toggle Buttons (Optical vs Thermal) */}
        <div className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-lg border border-slate-700 pointer-events-auto">
          <button
            onClick={() => setCameraFeedMode('optical')}
            className={`px-2.5 py-1 text-xs font-medium rounded transition-colors flex items-center gap-1.5 ${
              cameraFeedMode === 'optical'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Camera className="w-3.5 h-3.5" /> Optical RGB
          </button>
          <button
            onClick={() => setCameraFeedMode('thermal')}
            className={`px-2.5 py-1 text-xs font-medium rounded transition-colors flex items-center gap-1.5 ${
              cameraFeedMode === 'thermal'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Flame className="w-3.5 h-3.5" /> FLIR Thermal
          </button>
        </div>

        {/* Battery & Signal Stats */}
        <div className="flex items-center gap-4 text-slate-300">
          <div className="flex items-center gap-1.5">
            <Battery className="w-4 h-4 text-emerald-400" />
            <span className="tabular-nums font-bold">{droneTelemetry.batteryPct}%</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Wifi className="w-4 h-4 text-cyan-400" />
            <span className="tabular-nums">{droneTelemetry.signalStrengthDbm} dBm</span>
          </div>
        </div>
      </div>

      {/* Simulated Video Canvas Backing */}
      <div className={`relative flex-1 w-full flex items-center justify-center overflow-hidden ${
        cameraFeedMode === 'thermal'
          ? 'bg-gradient-to-br from-indigo-950 via-purple-950 to-amber-950'
          : 'bg-gradient-to-b from-slate-900 via-slate-800 to-slate-950'
      }`}>
        {/* Synthetic Plant Infrastructure Silhouette Background */}
        <svg className="absolute inset-0 w-full h-full opacity-40" viewBox="0 0 800 350">
          {/* Industrial pipes and furnace framing */}
          <line x1="0" y1="220" x2="800" y2="220" stroke="#334155" strokeWidth="18" />
          <line x1="0" y1="180" x2="800" y2="180" stroke="#1E293B" strokeWidth="10" />
          <line x1="180" y1="50" x2="180" y2="350" stroke="#334155" strokeWidth="14" />
          <line x1="620" y1="50" x2="620" y2="350" stroke="#334155" strokeWidth="14" />
          <rect x="320" y="140" width="160" height="120" fill="none" stroke="#475569" strokeWidth="4" />
        </svg>

        {/* Thermal Palette Heatmap Simulation */}
        {cameraFeedMode === 'thermal' && (
          <div className="absolute inset-0 pointer-events-none">
            {/* Heat Gradient Plume near PJ-204 */}
            <div 
              className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-56 rounded-full blur-2xl transition-opacity duration-500 ${
                isAnomalyWaypoint 
                  ? 'bg-gradient-to-r from-red-600/70 via-yellow-500/80 to-purple-800/50' 
                  : 'bg-gradient-to-r from-blue-600/30 via-indigo-600/40 to-purple-800/30'
              }`} 
            />

            {/* Thermal Calibration Scale Bar (Right Edge) */}
            <div className="absolute right-4 top-16 bottom-16 w-4 rounded bg-gradient-to-b from-white via-red-500 via-amber-400 via-purple-700 to-blue-900 border border-slate-700 flex flex-col justify-between py-1 px-5 text-[10px] font-mono text-slate-300">
              <span className="font-bold text-white">400°C</span>
              <span>320°C</span>
              <span>240°C</span>
              <span>160°C</span>
              <span>80°C</span>
              <span className="text-cyan-400">20°C</span>
            </div>
          </div>
        )}

        {/* Optical Scanning Grid Overlay */}
        <div className="absolute inset-0 bg-tech-grid opacity-20 pointer-events-none" />

        {/* Central HUD Crosshair & Targeting Reticle */}
        <div className="relative z-10 flex flex-col items-center justify-center">
          {/* Target Reticle */}
          <div className="relative w-40 h-40 border border-cyan-400/30 rounded-full flex items-center justify-center">
            {/* Corner brackets */}
            <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-cyan-400" />
            <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-cyan-400" />
            <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-cyan-400" />
            <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-cyan-400" />

            <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full" />
            <div className="absolute w-12 h-[1px] bg-cyan-400/50" />
            <div className="absolute h-12 w-[1px] bg-cyan-400/50" />

            {/* Artificial Horizon Pitch Ladder */}
            <div 
              className="absolute w-24 h-[1px] bg-cyan-300/60"
              style={{ transform: `rotate(${droneTelemetry.rollDeg}deg) translateY(${droneTelemetry.pitchDeg * 3}px)` }}
            />
          </div>

          {/* Anomaly Detection Bounding Box if at PJ-204 */}
          {isAnomalyWaypoint && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-56 h-44 border-2 border-red-500/80 rounded-md bg-red-500/10 flex flex-col justify-between p-2">
              <div className="flex items-center justify-between text-[10px] font-mono font-bold bg-red-600/90 text-white px-1.5 py-0.5 rounded">
                <span>SIMULATED ANOMALY #2026-089</span>
                <span>CONF: 96.4%</span>
              </div>
              <div className="flex items-center justify-between text-[11px] font-mono text-amber-300 bg-black/70 px-2 py-1 rounded">
                <span>PEAK: 382.4°C</span>
                <span className="text-red-400 font-bold">DELTA: +78.3°C</span>
              </div>
            </div>
          )}
        </div>

        {/* Altitude Tape (Left Edge) */}
        <div className="absolute left-4 top-16 bottom-16 flex flex-col justify-between text-[11px] font-mono text-cyan-300/80 border-l border-cyan-500/30 pl-2">
          <span>50m</span>
          <span>40m</span>
          <span className="bg-cyan-500/20 text-cyan-300 px-1.5 py-0.5 rounded border border-cyan-400 font-bold">
            {droneTelemetry.altitudeM}m AGL
          </span>
          <span>20m</span>
          <span>10m</span>
        </div>

        {/* Bottom Synthetic Disclaimer Watermark */}
        <div className="absolute bottom-2 left-4 z-20 text-[10px] font-mono text-slate-400/80 bg-black/60 px-2 py-0.5 rounded">
          SYNTHETIC TELEMETRY & THERMAL FEED · DEMO PURPOSES ONLY
        </div>
      </div>

      {/* Bottom HUD Telemetry Strip */}
      <div className="px-4 py-2 bg-slate-900 border-t border-slate-800 flex items-center justify-between text-xs font-mono text-slate-300">
        <div className="flex items-center gap-4">
          <div>
            <span className="text-slate-500 text-[10px] block">GROUND SPEED</span>
            <span className="font-bold text-cyan-300">{droneTelemetry.groundSpeedKmh} km/h</span>
          </div>
          <div>
            <span className="text-slate-500 text-[10px] block">HEADING</span>
            <span className="font-bold text-cyan-300">{droneTelemetry.headingDeg}° SE</span>
          </div>
          <div>
            <span className="text-slate-500 text-[10px] block">COORDINATES</span>
            <span className="text-slate-300">{droneTelemetry.lat.toFixed(4)}°N, {droneTelemetry.lng.toFixed(4)}°E</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div>
            <span className="text-slate-500 text-[10px] block">PAYLOAD SENSOR</span>
            <span className="font-bold text-amber-400">FLIR LWIR 640 × 512</span>
          </div>
          <div>
            <span className="text-slate-500 text-[10px] block">SORTIE TIME</span>
            <span className="font-bold text-slate-200">
              {Math.floor(droneTelemetry.flightTimeSec / 60)}:{(droneTelemetry.flightTimeSec % 60).toString().padStart(2, '0')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
