/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useCommandCentre } from '../../context/CommandCentreContext';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  FastForward, 
  Navigation, 
  ShieldAlert, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Gauge, 
  Sparkles
} from 'lucide-react';

export const MissionControlPanel: React.FC = () => {
  const { 
    missionStatus, 
    startMission, 
    pauseMission, 
    resetMission, 
    missionProgressPct, 
    missionSpeed, 
    setMissionSpeed,
    waypoints,
    currentWaypointIndex,
    triggerAnomalyScenario,
    setSelectedAssetId
  } = useCommandCentre();

  return (
    <div className="flex flex-col gap-4">
      {/* Primary Mission Command Card */}
      <div className="p-5 rounded-xl bg-slate-900/90 border border-slate-800">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-cyan-400">
                SORTIE · NETRA-04
              </span>
              <span className="text-slate-600">·</span>
              <span className="text-xs text-slate-400">Autonomous Thermal & Structural Patrol</span>
            </div>
            <h2 className="text-lg font-bold text-slate-100 mt-1">
              Perimeter & Critical Flange Survey
            </h2>
          </div>

          {/* Action Button Controls */}
          <div className="flex items-center gap-2">
            {missionStatus !== 'running' ? (
              <button
                onClick={startMission}
                className="flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-colors shadow-lg shadow-cyan-500/20"
              >
                <Play className="w-4 h-4 fill-current" />
                {missionStatus === 'paused' ? 'Resume Sortie' : 'Start Sortie'}
              </button>
            ) : (
              <button
                onClick={pauseMission}
                className="flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 transition-colors shadow-lg shadow-amber-500/20"
              >
                <Pause className="w-4 h-4 fill-current" />
                Pause Sortie
              </button>
            )}

            <button
              onClick={resetMission}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors border border-slate-700"
              title="Reset Sortie to launch point"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>

            {/* Speed Multiplier Segmented Tabs */}
            <div className="flex items-center p-1 bg-slate-950 rounded-lg border border-slate-800 text-xs font-mono">
              <span className="px-2 text-slate-500">Speed:</span>
              {[1, 2, 4].map(s => (
                <button
                  key={s}
                  onClick={() => setMissionSpeed(s)}
                  className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-colors ${
                    missionSpeed === s 
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' 
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {s}x
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Sortie Progress Bar */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-xs font-mono mb-1.5">
            <span className="text-slate-400">Autonomous Circuit Progress</span>
            <span className="font-bold text-cyan-400 tabular-nums">
              {Math.round(missionProgressPct)}% Complete
            </span>
          </div>
          <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-300"
              style={{ width: `${missionProgressPct}%` }}
            />
          </div>
        </div>

        {/* Quick Pitch Anomaly Injection CTA */}
        <div className="mt-4 p-3 rounded-lg bg-red-950/30 border border-red-500/30 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-red-400 shrink-0" />
            <div>
              <span className="text-xs font-bold text-slate-200 block">
                Presentation Scenario: Critical Flange Anomaly (WP-03)
              </span>
              <span className="text-[11px] text-slate-400">
                Instantly jumps drone to Waypoint 3 and launches synthetic thermal defect evidence.
              </span>
            </div>
          </div>
          <button
            onClick={triggerAnomalyScenario}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded bg-red-600 hover:bg-red-500 text-white transition-colors shrink-0 shadow-md shadow-red-600/30"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Trigger Anomaly Demo
          </button>
        </div>
      </div>

      {/* Waypoint Checkpoint Sequence List */}
      <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-cyan-400" />
          Autonomous Waypoint Checklist ({waypoints.length} Checkpoints)
        </h3>

        <div className="space-y-2.5">
          {waypoints.map((wp, idx) => {
            const isCurrent = idx === currentWaypointIndex;
            const isPassed = idx < currentWaypointIndex;

            return (
              <div
                key={wp.id}
                onClick={() => setSelectedAssetId(wp.targetAssetId)}
                className={`p-3 rounded-lg border transition-all cursor-pointer flex items-center justify-between ${
                  isCurrent
                    ? 'bg-cyan-950/30 border-cyan-500/60 shadow-lg shadow-cyan-950/50'
                    : isPassed
                    ? 'bg-slate-950/40 border-slate-800/80 opacity-70'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center font-mono text-xs font-bold ${
                    isCurrent
                      ? 'bg-cyan-500 text-slate-950'
                      : isPassed
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      : 'bg-slate-800 text-slate-400'
                  }`}>
                    {isPassed ? <CheckCircle2 className="w-4 h-4" /> : wp.number}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-bold ${isCurrent ? 'text-cyan-300' : 'text-slate-200'}`}>
                        {wp.code} · {wp.label}
                      </span>
                      {wp.hazardNote && (
                        <span className="text-[10px] font-mono text-red-400 bg-red-500/10 px-1.5 py-0.5 rounded border border-red-500/30">
                          Anomaly Target
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-slate-400 block mt-0.5">
                      {wp.action}
                    </span>
                  </div>
                </div>

                <div className="text-right text-xs font-mono">
                  <span className="text-slate-400 block">{wp.estimatedAltitudeM}m AGL</span>
                  <span className={`text-[10px] uppercase font-semibold ${
                    isCurrent ? 'text-cyan-400' : isPassed ? 'text-emerald-400' : 'text-slate-500'
                  }`}>
                    {isCurrent ? 'Scanning' : isPassed ? 'Completed' : 'Queued'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
