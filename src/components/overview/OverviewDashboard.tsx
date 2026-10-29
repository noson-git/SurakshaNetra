/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useCommandCentre } from '../../context/CommandCentreContext';
import { 
  ShieldAlert, 
  Activity, 
  Wind, 
  Thermometer, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Navigation, 
  ArrowRight, 
  Layers, 
  Cpu, 
  Zap, 
  Sparkles
} from 'lucide-react';
import { FACILITY_NAME, FACILITY_CODE, SIMULATION_DISCLAIMER } from '../../data/mockFacilityData';

export const OverviewDashboard: React.FC = () => {
  const { 
    assets, 
    setSelectedAssetId, 
    setActiveTab, 
    droneTelemetry, 
    missionProgressPct, 
    missionStatus, 
    findings, 
    activities, 
    triggerAnomalyScenario 
  } = useCommandCentre();

  const criticalFindings = findings.filter(f => f.status === 'unreviewed' || f.status === 'confirmed');

  return (
    <div className="flex flex-col gap-5">
      {/* Disclaimer Banner */}
      <div className="flex items-center justify-between px-4 py-2 rounded-lg bg-cyan-950/40 border border-cyan-500/20 text-xs font-mono text-cyan-300">
        <span>{SIMULATION_DISCLAIMER}</span>
        <span className="hidden sm:inline text-slate-500">STATE COMPETITION PROTOTYPE</span>
      </div>

      {/* Facility Header Strip */}
      <div className="p-5 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-cyan-400">
              {FACILITY_CODE}
            </span>
            <span className="text-slate-600">·</span>
            <span className="text-xs font-mono text-slate-400">Continuous Metallurgy & Rolling Facility</span>
          </div>
          <h1 className="text-xl font-bold text-slate-100 mt-1">
            {FACILITY_NAME}
          </h1>
        </div>

        {/* Environmental & Plant Vitals */}
        <div className="flex flex-wrap items-center gap-4 text-xs font-mono">
          <div className="p-2 px-3 rounded-lg bg-slate-950 border border-slate-800">
            <span className="text-slate-500 text-[10px] block">PLANT AGGREGATE HEALTH</span>
            <span className="text-base font-bold text-emerald-400">88.4% Nominal</span>
          </div>

          <div className="p-2 px-3 rounded-lg bg-slate-950 border border-slate-800">
            <span className="text-slate-500 text-[10px] block">AMBIENT WEATHER</span>
            <span className="text-sm font-semibold text-slate-200">32°C · Wind 4.2 km/h NW</span>
          </div>

          <div className="p-2 px-3 rounded-lg bg-slate-950 border border-slate-800">
            <span className="text-slate-500 text-[10px] block">AIR QUALITY (AQI)</span>
            <span className="text-sm font-semibold text-cyan-300">54 Good</span>
          </div>
        </div>
      </div>

      {/* 4 Primary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-xs font-medium">Autonomous Sortie Time</span>
            <Clock className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-slate-100">142.5</span>
            <span className="text-xs text-slate-400 font-mono">Flight Hours</span>
          </div>
          <span className="text-[11px] text-emerald-400 mt-1 block">
            ↑ 28 missions completed safely
          </span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-xs font-medium">Monitored High-Heat Assets</span>
            <Layers className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-slate-100">6 / 6</span>
            <span className="text-xs text-slate-400 font-mono">Industrial Units</span>
          </div>
          <span className="text-[11px] text-cyan-400 mt-1 block">
            100% telemetry sync online
          </span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-xs font-medium">Active Anomaly Flags</span>
            <ShieldAlert className="w-4 h-4 text-red-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-red-400">
              {criticalFindings.length}
            </span>
            <span className="text-xs text-slate-400 font-mono">Inspection Alert</span>
          </div>
          <span className="text-[11px] text-red-400 mt-1 block">
            Manifold PJ-204 thermal delta (+78°C)
          </span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-xs font-medium">Resolved Work Orders</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-emerald-400">14</span>
            <span className="text-xs text-slate-400 font-mono">Cleared This Quarter</span>
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">
            98.2% compliance on corrective SLAs
          </span>
        </div>
      </div>

      {/* Active Anomaly Alert Banner */}
      {criticalFindings.length > 0 && (
        <div className="p-4 rounded-xl bg-red-950/30 border border-red-500/40 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-red-500/20 border border-red-500/50 flex items-center justify-center text-red-400 shrink-0">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-red-400 uppercase">
                  Simulated Critical Anomaly Detected
                </span>
                <span className="text-slate-600">·</span>
                <span className="text-xs font-mono text-slate-400">96.4% AI Confidence</span>
              </div>
              <h4 className="text-sm font-bold text-slate-100 mt-0.5">
                High-Pressure Gas & Steam Manifold (PJ-204) — Steam Flange Gasket Micro-Fissure
              </h4>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setSelectedAssetId('pj-204');
                setActiveTab('findings');
              }}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg bg-red-600 hover:bg-red-500 text-white transition-colors shadow-lg shadow-red-600/30"
            >
              Review Anomaly Dossier
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Mid Split Section: Asset Health Grid & Drone Mission Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Asset Health Matrix (7 cols) */}
        <div className="lg:col-span-7 p-5 rounded-xl bg-slate-900/90 border border-slate-800">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-slate-100">
                Facility Digital Twin Equipment Roster
              </h3>
              <span className="text-xs font-mono text-slate-400">
                6 core industrial assets · Click to view in 3D/2D
              </span>
            </div>
            <button
              onClick={() => setActiveTab('twin')}
              className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
            >
              Open 3D Twin <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
            {assets.map(asset => (
              <div
                key={asset.id}
                onClick={() => {
                  setSelectedAssetId(asset.id);
                  setActiveTab('twin');
                }}
                className={`p-3 rounded-lg border transition-all cursor-pointer ${
                  asset.status === 'critical'
                    ? 'bg-red-950/20 border-red-500/40 hover:border-red-500'
                    : asset.status === 'warning'
                    ? 'bg-amber-950/20 border-amber-500/40 hover:border-amber-500'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[11px] font-mono font-bold text-cyan-400">
                      {asset.code}
                    </span>
                    <h4 className="text-xs font-bold text-slate-200 mt-0.5 line-clamp-1">
                      {asset.name}
                    </h4>
                  </div>
                  <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded uppercase ${
                    asset.status === 'critical'
                      ? 'bg-red-500/20 text-red-400'
                      : asset.status === 'warning'
                      ? 'bg-amber-500/20 text-amber-400'
                      : 'bg-emerald-500/20 text-emerald-400'
                  }`}>
                    {asset.status}
                  </span>
                </div>

                <div className="flex items-center justify-between mt-3 text-xs font-mono">
                  <div className="flex items-center gap-1 text-slate-400">
                    <Thermometer className="w-3 h-3 text-amber-400" />
                    <span>{asset.specs.coreTemperatureC}°C</span>
                  </div>
                  <div className="flex items-center gap-1 text-slate-400">
                    <Activity className="w-3 h-3 text-cyan-400" />
                    <span>{asset.specs.operatingPressureBar} bar</span>
                  </div>
                  <span className={`font-bold ${
                    asset.healthScore < 70 ? 'text-red-400' : 'text-emerald-400'
                  }`}>
                    {asset.healthScore}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Sortie NETRA-04 Live Preview (5 cols) */}
        <div className="lg:col-span-5 p-5 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <span className="text-xs font-mono text-cyan-400 font-bold">
                  ACTIVE SORTIE · NETRA-04
                </span>
                <h3 className="text-sm font-bold text-slate-100 mt-0.5">
                  Autonomous Inspection Flight
                </h3>
              </div>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 uppercase">
                {missionStatus === 'running' ? 'Active' : 'Holding'}
              </span>
            </div>

            {/* Drone Quick Stats */}
            <div className="grid grid-cols-2 gap-3 mt-4 text-xs font-mono">
              <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
                <span className="text-slate-500 text-[10px] block">ALTITUDE (AGL)</span>
                <span className="text-base font-bold text-slate-100">{droneTelemetry.altitudeM}m</span>
              </div>
              <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
                <span className="text-slate-500 text-[10px] block">BATTERY RESERVE</span>
                <span className="text-base font-bold text-emerald-400">{droneTelemetry.batteryPct}%</span>
              </div>
              <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
                <span className="text-slate-500 text-[10px] block">SPEED</span>
                <span className="text-base font-bold text-cyan-300">{droneTelemetry.groundSpeedKmh} km/h</span>
              </div>
              <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
                <span className="text-slate-500 text-[10px] block">HEADING</span>
                <span className="text-base font-bold text-slate-100">{droneTelemetry.headingDeg}° SE</span>
              </div>
            </div>

            {/* Progress */}
            <div className="mt-4">
              <div className="flex items-center justify-between text-xs font-mono mb-1">
                <span className="text-slate-400">Sortie Circuit Progress</span>
                <span className="font-bold text-cyan-400">{Math.round(missionProgressPct)}%</span>
              </div>
              <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="h-full bg-cyan-400 rounded-full transition-all duration-300"
                  style={{ width: `${missionProgressPct}%` }}
                />
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between pt-3 border-t border-slate-800">
            <button
              onClick={() => setActiveTab('missions')}
              className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
            >
              Open Full Mission Console <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={triggerAnomalyScenario}
              className="px-3 py-1.5 text-xs font-semibold rounded bg-red-600/80 hover:bg-red-500 text-white transition-colors"
            >
              Trigger Demo Scenario
            </button>
          </div>
        </div>
      </div>

      {/* Operational Activity Stream */}
      <div className="p-5 rounded-xl bg-slate-900/90 border border-slate-800">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-400" />
            Real-Time Surveillance & Incident Feed
          </h3>
          <span className="text-xs font-mono text-slate-500">
            Live SCADA & Drone Ingestion
          </span>
        </div>

        <div className="divide-y divide-slate-800/80 mt-2 font-mono">
          {activities.slice(0, 5).map(act => (
            <div key={act.id} className="py-2.5 flex items-start gap-3 text-xs">
              <span className="text-slate-500 shrink-0 tabular-nums">
                {act.timestamp}
              </span>
              <div className="flex-1">
                <span className={`font-semibold block ${
                  act.severity === 'critical' 
                    ? 'text-red-400' 
                    : act.severity === 'warning' 
                    ? 'text-amber-400' 
                    : act.severity === 'accent'
                    ? 'text-cyan-300'
                    : 'text-slate-200'
                }`}>
                  {act.title}
                </span>
                <span className="text-slate-400 text-[11px] font-sans">
                  {act.detail}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
