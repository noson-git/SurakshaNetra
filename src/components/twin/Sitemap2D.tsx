/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useCommandCentre } from '../../context/CommandCentreContext';
import { Compass, Navigation2, AlertCircle, ShieldAlert, CheckCircle2 } from 'lucide-react';

export const Sitemap2D: React.FC = () => {
  const { 
    assets, 
    selectedAssetId, 
    setSelectedAssetId, 
    waypoints, 
    dronePosition2D, 
    currentWaypointIndex 
  } = useCommandCentre();

  return (
    <div className="relative w-full h-full min-h-[540px] bg-[#070A11] rounded-xl overflow-hidden border border-slate-800 flex flex-col">
      {/* Top Bar for CAD Map */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900/90 border-b border-slate-800 z-10">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-cyan-300">
            <Compass className="w-4 h-4 text-cyan-400" />
            2D CAD Vector Sitemap · Sector 04
          </span>
          <span className="text-slate-600">·</span>
          <span className="text-xs font-mono text-slate-400">Scale 1:500 Metric Grid</span>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500/30 border border-emerald-500" />
            <span className="text-slate-300">Nominal</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-amber-500/30 border border-amber-500" />
            <span className="text-slate-300">Warning</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-red-500/30 border border-red-500" />
            <span className="text-slate-300">Critical / Anomaly</span>
          </div>
        </div>
      </div>

      {/* SVG Canvas Blueprint Area */}
      <div className="relative flex-1 w-full bg-slate-950 p-4 overflow-hidden flex items-center justify-center">
        {/* SVG Drawing */}
        <svg 
          viewBox="0 0 1000 650" 
          className="w-full h-full max-h-[580px] select-none"
        >
          <defs>
            {/* Grid Pattern */}
            <pattern id="cadGrid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
            </pattern>
            <pattern id="cadFineGrid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255,255,255,0.02)" strokeWidth="0.5" />
            </pattern>
            
            {/* Pulsing Anomaly Glow */}
            <radialGradient id="anomalyGlow">
              <stop offset="0%" stopColor="rgba(239, 68, 68, 0.4)" />
              <stop offset="100%" stopColor="rgba(239, 68, 68, 0)" />
            </radialGradient>
          </defs>

          {/* Grid layers */}
          <rect width="1000" height="650" fill="#070A11" />
          <rect width="1000" height="650" fill="url(#cadFineGrid)" />
          <rect width="1000" height="650" fill="url(#cadGrid)" />

          {/* Outer Perimeter Fence Boundary */}
          <rect 
            x="30" 
            y="30" 
            width="940" 
            height="590" 
            fill="none" 
            stroke="#1E293B" 
            strokeWidth="2" 
            strokeDasharray="8 4" 
          />
          <text x="45" y="55" fill="#475569" fontSize="11" fontFamily="monospace">
            SECURITY PERIMETER FENCE LINE // AIRSPACE RESTRICTED 0-100M AGL
          </text>

          {/* Plant Sector Boundaries */}
          {/* Zone A: Smelting */}
          <rect x="60" y="80" width="360" height="260" fill="rgba(15,23,42,0.4)" stroke="#334155" strokeWidth="1" />
          <text x="75" y="105" fill="#64748B" fontSize="12" fontWeight="600" fontFamily="sans-serif">
            ZONE A · PRIMARY SMELTING COMPLEX
          </text>

          {/* Zone B: Utility & Steam Corridor */}
          <rect x="440" y="80" width="220" height="260" fill="rgba(15,23,42,0.4)" stroke="#334155" strokeWidth="1" />
          <text x="455" y="105" fill="#64748B" fontSize="12" fontWeight="600" fontFamily="sans-serif">
            ZONE B · STEAM CORRIDOR
          </text>

          {/* Zone E: Cryogenic Tanks */}
          <rect x="680" y="80" width="260" height="260" fill="rgba(15,23,42,0.4)" stroke="#334155" strokeWidth="1" />
          <text x="695" y="105" fill="#64748B" fontSize="12" fontWeight="600" fontFamily="sans-serif">
            ZONE E · CRYO STORAGE
          </text>

          {/* Zone C: Continuous Casting */}
          <rect x="60" y="360" width="360" height="240" fill="rgba(15,23,42,0.4)" stroke="#334155" strokeWidth="1" />
          <text x="75" y="385" fill="#64748B" fontSize="12" fontWeight="600" fontFamily="sans-serif">
            ZONE C · SLAB CASTING
          </text>

          {/* Zone D: Rolling Mill */}
          <rect x="680" y="360" width="260" height="240" fill="rgba(15,23,42,0.4)" stroke="#334155" strokeWidth="1" />
          <text x="695" y="385" fill="#64748B" fontSize="12" fontWeight="600" fontFamily="sans-serif">
            ZONE D · FINISHING & ROLLING
          </text>

          {/* Zone F: Water Treatment */}
          <rect x="440" y="360" width="220" height="240" fill="rgba(15,23,42,0.4)" stroke="#334155" strokeWidth="1" />
          <text x="455" y="385" fill="#64748B" fontSize="12" fontWeight="600" fontFamily="sans-serif">
            ZONE F · COOLING & RECIRC
          </text>

          {/* Flight Path Waypoint Connecting Line */}
          <polyline
            points={waypoints.map(wp => `${(wp.coords2D.x / 100) * 1000},${(wp.coords2D.y / 100) * 650}`).join(' ')}
            fill="none"
            stroke="#00F2FE"
            strokeWidth="2"
            strokeDasharray="6 4"
            opacity="0.75"
          />

          {/* Waypoint Nodes */}
          {waypoints.map((wp, idx) => {
            const cx = (wp.coords2D.x / 100) * 1000;
            const cy = (wp.coords2D.y / 100) * 650;
            const isCurrent = idx === currentWaypointIndex;

            return (
              <g key={wp.id} className="cursor-pointer">
                <circle 
                  cx={cx} 
                  cy={cy} 
                  r={isCurrent ? 12 : 7} 
                  fill={isCurrent ? '#00F2FE' : '#0F172A'} 
                  stroke={isCurrent ? '#F8FAFC' : '#00F2FE'} 
                  strokeWidth="2"
                />
                <text 
                  x={cx + 14} 
                  y={cy + 4} 
                  fill={isCurrent ? '#00F2FE' : '#94A3B8'} 
                  fontSize="11" 
                  fontFamily="monospace"
                  fontWeight="600"
                >
                  {wp.code}
                </text>
              </g>
            );
          })}

          {/* Interactive Industrial Facility Assets */}
          {assets.map(asset => {
            const x = (asset.coords2D.x / 100) * 1000 - 80;
            const y = (asset.coords2D.y / 100) * 650 - 60;
            const w = 160;
            const h = 110;
            const isSelected = asset.id === selectedAssetId;

            // Border & Fill Color based on status
            let strokeColor = '#10B981';
            let fillColor = 'rgba(16, 185, 129, 0.08)';
            if (asset.status === 'critical') {
              strokeColor = '#EF4444';
              fillColor = 'rgba(239, 68, 68, 0.15)';
            } else if (asset.status === 'warning') {
              strokeColor = '#F59E0B';
              fillColor = 'rgba(245, 158, 11, 0.1)';
            }

            if (isSelected) {
              strokeColor = '#00F2FE';
              fillColor = 'rgba(0, 242, 254, 0.2)';
            }

            return (
              <g 
                key={asset.id} 
                onClick={() => setSelectedAssetId(asset.id)}
                className="cursor-pointer group"
              >
                {/* Anomaly radial pulse halo if critical */}
                {asset.status === 'critical' && (
                  <circle 
                    cx={x + w / 2} 
                    cy={y + h / 2} 
                    r="85" 
                    fill="url(#anomalyGlow)" 
                  />
                )}

                {/* Main Asset Box */}
                <rect
                  x={x}
                  y={y}
                  width={w}
                  height={h}
                  rx="6"
                  fill={fillColor}
                  stroke={strokeColor}
                  strokeWidth={isSelected ? '2.5' : '1.5'}
                  className="transition-all duration-200"
                />

                {/* Asset Header Tag */}
                <rect
                  x={x}
                  y={y}
                  width={w}
                  height="26"
                  rx="4"
                  fill={isSelected ? '#083344' : '#0F172A'}
                  stroke={strokeColor}
                  strokeWidth="0.5"
                />

                <text
                  x={x + 10}
                  y={y + 17}
                  fill={isSelected ? '#22D3EE' : '#F1F5F9'}
                  fontSize="11"
                  fontWeight="700"
                  fontFamily="sans-serif"
                >
                  {asset.code} · {asset.name.length > 15 ? asset.name.slice(0, 15) + '…' : asset.name}
                </text>

                {/* Telemetry Metrics on the Node */}
                <text x={x + 10} y={y + 48} fill="#94A3B8" fontSize="10" fontFamily="monospace">
                  TEMP: <tspan fill="#F8FAFC" fontWeight="bold">{asset.specs.coreTemperatureC}°C</tspan>
                </text>
                <text x={x + 10} y={y + 66} fill="#94A3B8" fontSize="10" fontFamily="monospace">
                  PRESS: <tspan fill="#F8FAFC">{asset.specs.operatingPressureBar} bar</tspan>
                </text>
                <text x={x + 10} y={y + 84} fill="#94A3B8" fontSize="10" fontFamily="monospace">
                  HEALTH: <tspan fill={asset.status === 'critical' ? '#EF4444' : '#10B981'}>{asset.healthScore}%</tspan>
                </text>

                {/* Status Indicator Icon Dot */}
                <circle 
                  cx={x + w - 14} 
                  cy={y + 13} 
                  r="4" 
                  fill={asset.status === 'critical' ? '#EF4444' : asset.status === 'warning' ? '#F59E0B' : '#10B981'} 
                />
              </g>
            );
          })}

          {/* Real-time Drone Marker */}
          {(() => {
            const droneX = (dronePosition2D.x / 100) * 1000;
            const droneY = (dronePosition2D.y / 100) * 650;

            return (
              <g className="transition-all duration-75">
                {/* Radar Scan Cone Ring */}
                <circle
                  cx={droneX}
                  cy={droneY}
                  r="36"
                  fill="rgba(0, 242, 254, 0.08)"
                  stroke="#00F2FE"
                  strokeWidth="1"
                  strokeDasharray="4 2"
                />

                {/* Drone Center Icon */}
                <circle
                  cx={droneX}
                  cy={droneY}
                  r="9"
                  fill="#00F2FE"
                  stroke="#FFFFFF"
                  strokeWidth="2"
                />

                {/* Drone Heading Arrow */}
                <polygon
                  points={`${droneX},${droneY - 14} ${droneX - 5},${droneY - 5} ${droneX + 5},${droneY - 5}`}
                  fill="#00F2FE"
                />

                {/* Drone Callout Tag */}
                <rect
                  x={droneX + 16}
                  y={droneY - 12}
                  width="110"
                  height="22"
                  rx="3"
                  fill="#0B1120"
                  stroke="#00F2FE"
                  strokeWidth="1"
                />
                <text
                  x={droneX + 22}
                  y={droneY + 3}
                  fill="#00F2FE"
                  fontSize="10"
                  fontFamily="monospace"
                  fontWeight="bold"
                >
                  NETRA-VTOL-X4
                </text>
              </g>
            );
          })()}
        </svg>

        {/* Compass Rose Overlay Bottom Right */}
        <div className="absolute bottom-6 right-6 flex flex-col items-center justify-center p-2 rounded-lg bg-slate-900/80 border border-slate-800 text-slate-400 font-mono text-[10px]">
          <span className="font-bold text-cyan-400">N ▲</span>
          <span>W ┼ E</span>
          <span>▼ S</span>
        </div>
      </div>
    </div>
  );
};
