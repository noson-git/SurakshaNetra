/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useCommandCentre } from '../../context/CommandCentreContext';
import { 
  X, 
  Thermometer, 
  Gauge, 
  Activity, 
  Zap, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  ExternalLink,
  Clock,
  ChevronRight
} from 'lucide-react';

export const AssetDetailDrawer: React.FC = () => {
  const { 
    selectedAsset, 
    setSelectedAssetId, 
    setActiveTab, 
    findings 
  } = useCommandCentre();

  if (!selectedAsset) return null;

  // Check if there is an active finding for this asset
  const assetFinding = findings.find(f => f.assetId === selectedAsset.id);

  return (
    <div className="w-full lg:w-96 bg-slate-900/95 border-l border-slate-800 flex flex-col h-full overflow-y-auto">
      {/* Header */}
      <div className="p-4 border-b border-slate-800 flex items-start justify-between bg-slate-950/40">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-semibold text-cyan-400">
              {selectedAsset.code}
            </span>
            <span className="text-slate-600">·</span>
            <span className="text-xs text-slate-400 font-mono">
              {selectedAsset.zone}
            </span>
          </div>
          <h3 className="text-base font-bold text-slate-100 mt-1">
            {selectedAsset.name}
          </h3>
        </div>
        <button
          onClick={() => setSelectedAssetId(null)}
          className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          title="Close details"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Health & Status Strip */}
      <div className="p-4 border-b border-slate-800 bg-slate-900/50 flex items-center justify-between">
        <div>
          <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">
            Health Index
          </span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className={`text-2xl font-bold font-mono tabular-nums ${
              selectedAsset.healthScore < 70 ? 'text-red-400' : selectedAsset.healthScore < 85 ? 'text-amber-400' : 'text-emerald-400'
            }`}>
              {selectedAsset.healthScore}%
            </span>
            <span className="text-xs text-slate-500">/ 100</span>
          </div>
        </div>

        {/* Status indicator */}
        <div className={`px-2.5 py-1 rounded text-xs font-semibold uppercase tracking-wider border flex items-center gap-1.5 ${
          selectedAsset.status === 'critical'
            ? 'bg-red-500/10 border-red-500/30 text-red-400'
            : selectedAsset.status === 'warning'
            ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
            : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
        }`}>
          {selectedAsset.status === 'critical' ? (
            <ShieldAlert className="w-3.5 h-3.5" />
          ) : selectedAsset.status === 'warning' ? (
            <AlertTriangle className="w-3.5 h-3.5" />
          ) : (
            <CheckCircle2 className="w-3.5 h-3.5" />
          )}
          {selectedAsset.status}
        </div>
      </div>

      {/* Active Anomaly Banner if detected */}
      {assetFinding && (
        <div className="m-4 p-3 rounded-lg bg-red-950/40 border border-red-500/30">
          <div className="flex items-center gap-2 text-red-400 text-xs font-semibold">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>Active Inspection Finding Detected</span>
          </div>
          <p className="text-xs text-slate-300 mt-1 line-clamp-2">
            {assetFinding.anomalyType}
          </p>
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-red-900/40 text-[11px] font-mono">
            <span className="text-slate-400">Confidence: {assetFinding.simulatedConfidencePct}%</span>
            <button
              onClick={() => setActiveTab('findings')}
              className="text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1"
            >
              Inspect Evidence <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}

      {/* Live SCADA Telemetry Matrix */}
      <div className="p-4 flex-1">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
          <Activity className="w-3.5 h-3.5 text-cyan-400" />
          Real-Time Sensor Telemetry
        </h4>

        <div className="grid grid-cols-2 gap-2.5">
          {/* Temperature */}
          <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
            <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
              <Thermometer className="w-3.5 h-3.5 text-amber-400" />
              <span>Core Temp</span>
            </div>
            <span className="text-lg font-bold font-mono tabular-nums text-slate-100 block mt-1">
              {selectedAsset.specs.coreTemperatureC}°C
            </span>
          </div>

          {/* Operating Pressure */}
          <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
            <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
              <Gauge className="w-3.5 h-3.5 text-cyan-400" />
              <span>Pressure</span>
            </div>
            <span className="text-lg font-bold font-mono tabular-nums text-slate-100 block mt-1">
              {selectedAsset.specs.operatingPressureBar} <span className="text-xs text-slate-400 font-normal">bar</span>
            </span>
          </div>

          {/* Mechanical Vibration */}
          <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
            <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
              <Activity className="w-3.5 h-3.5 text-indigo-400" />
              <span>Vibration</span>
            </div>
            <span className="text-lg font-bold font-mono tabular-nums text-slate-100 block mt-1">
              {selectedAsset.specs.vibrationMmSec} <span className="text-xs text-slate-400 font-normal">mm/s</span>
            </span>
          </div>

          {/* Power Consumption */}
          <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
            <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
              <Zap className="w-3.5 h-3.5 text-yellow-400" />
              <span>Power Load</span>
            </div>
            <span className="text-lg font-bold font-mono tabular-nums text-slate-100 block mt-1">
              {selectedAsset.specs.powerConsumptionMw} <span className="text-xs text-slate-400 font-normal">MW</span>
            </span>
          </div>
        </div>

        {/* Structural Integrity Bar */}
        <div className="mt-4 p-3 rounded-lg bg-slate-950/40 border border-slate-800">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-slate-400">Structural Shell Integrity</span>
            <span className="font-mono font-semibold text-slate-200">
              {selectedAsset.specs.structuralIntegrityPct}%
            </span>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                selectedAsset.specs.structuralIntegrityPct < 70
                  ? 'bg-red-500'
                  : selectedAsset.specs.structuralIntegrityPct < 85
                  ? 'bg-amber-500'
                  : 'bg-cyan-500'
              }`}
              style={{ width: `${selectedAsset.specs.structuralIntegrityPct}%` }}
            />
          </div>
        </div>

        {/* Equipment Engineering Overview */}
        <div className="mt-4">
          <h5 className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
            Engineering Profile
          </h5>
          <p className="text-xs text-slate-300 leading-relaxed">
            {selectedAsset.description}
          </p>
        </div>

        {/* Inspection Schedule */}
        <div className="mt-4 p-2.5 rounded-lg bg-slate-950/40 border border-slate-800/80 flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-1.5 text-slate-400">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span>Last Drone Scan:</span>
          </div>
          <span className="text-slate-200 font-medium">{selectedAsset.lastInspected}</span>
        </div>
      </div>
    </div>
  );
};
