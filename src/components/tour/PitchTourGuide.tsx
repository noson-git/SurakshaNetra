/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useCommandCentre } from '../../context/CommandCentreContext';
import { 
  Sparkles, 
  ChevronRight, 
  ChevronLeft, 
  X, 
  Play, 
  Pause, 
  ShieldCheck, 
  ArrowRight,
  Layers
} from 'lucide-react';

const TOUR_STEPS = [
  {
    step: 0,
    title: "01. Executive Overview & Mission Control",
    tagline: "Industrial Hazard Mitigation via Autonomous Drone-in-a-Box",
    description: "In heavy metallurgy plants, high-heat blast furnaces, steam corridors, and toxic gas manifolds require dangerous manual climbing. SURAKSHA NETRA replaces manual inspections with automated aerial sweeps.",
    highlightAction: "Review aggregate plant vitals, active anomalies, and live SCADA telemetry feeds."
  },
  {
    step: 1,
    title: "02. 3D Isometric Digital Twin & 2D CAD",
    tagline: "Synchronized Real-Time Spatial Awareness",
    description: "Inspect Blast Furnace Alpha, the Gas Manifold, Slab Casting Bay, and Rolling Mills in real-time WebGL. Select any asset in 3D or 2D to immediately inspect live operating pressure, temperature, and vibration.",
    highlightAction: "Orbit with mouse or click Manifold PJ-204 to inspect active thermal hotspot."
  },
  {
    step: 2,
    title: "03. Autonomous Sortie Simulator",
    tagline: "Zero-Hardware High-Fidelity Drone Patrol",
    description: "Sortie NETRA-04 navigates 5 predefined industrial checkpoints. The telemetry HUD displays live AGL altitude, battery reserve, ground speed, heading, and gimbal optical/thermal camera feeds.",
    highlightAction: "Use Start / Pause / Speed multipliers to test autonomous flightpath progression."
  },
  {
    step: 3,
    title: "04. Synthetic Computer Vision Defect Dossier",
    tagline: "Multimodal Optical & Radiometric Thermography",
    description: "SURAKSHA Netra flags an apparent high-pressure steam flange leak at PJ-204 with 96.4% simulated confidence, showing a +78.3°C thermal gradient delta and 7.8mm micro-fissure caliper measurement.",
    highlightAction: "Toggle between FLIR Thermal Isotherms and 12x Optical Zoom macro evidence."
  },
  {
    step: 4,
    title: "05. Human Verification & Action Governance",
    tagline: "Closed-Loop Engineering Work Order Dispatch",
    description: "AI never acts alone in critical industrial infrastructure. Certified human safety engineers confirm or dismiss the defect, issue corrective work orders with SLAs, and track resolution to nominal status.",
    highlightAction: "Click 'Confirm Hazard' and 'Assign Work Order' to see real-time updates across the system."
  }
];

export const PitchTourGuide: React.FC = () => {
  const { 
    pitchTourActive, 
    setPitchTourActive, 
    pitchTourStep, 
    nextTourStep, 
    prevTourStep,
    jumpToTourStep,
    startMission,
    pauseMission,
    missionStatus
  } = useCommandCentre();

  if (!pitchTourActive) return null;

  const currentStep = TOUR_STEPS[pitchTourStep] || TOUR_STEPS[0];

  return (
    <div className="fixed bottom-6 right-6 z-50 w-full max-w-md bg-slate-900/95 border-2 border-cyan-500/80 rounded-2xl shadow-2xl backdrop-blur-xl p-5 text-slate-100 flex flex-col gap-3.5">
      {/* Top Banner */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-cyan-300">
            Startup Pitch Companion Mode
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-slate-400">
            {pitchTourStep + 1} / {TOUR_STEPS.length}
          </span>
          <button
            onClick={() => setPitchTourActive(false)}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Exit pitch tour"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Step Content */}
      <div>
        <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
          {currentStep.title}
        </h4>
        <span className="text-xs font-semibold text-cyan-400 block mt-0.5">
          {currentStep.tagline}
        </span>
        <p className="text-xs text-slate-300 leading-relaxed mt-2">
          {currentStep.description}
        </p>
      </div>

      {/* Recommended Demo Action */}
      <div className="p-2.5 rounded-lg bg-slate-950 border border-cyan-500/30 text-xs">
        <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-cyan-400 block">
          Suggested Judge Demo Action:
        </span>
        <span className="text-slate-200 mt-0.5 block font-medium">
          {currentStep.highlightAction}
        </span>
      </div>

      {/* Navigation & Step Dots */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-800">
        {/* Step dots */}
        <div className="flex items-center gap-1.5">
          {TOUR_STEPS.map((s, idx) => (
            <button
              key={idx}
              onClick={() => jumpToTourStep(idx)}
              className={`w-2 h-2 rounded-full transition-all ${
                idx === pitchTourStep
                  ? 'w-6 bg-cyan-400'
                  : 'bg-slate-700 hover:bg-slate-500'
              }`}
            />
          ))}
        </div>

        {/* Previous / Next Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={prevTourStep}
            disabled={pitchTourStep === 0}
            className="px-2.5 py-1.5 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-40 disabled:pointer-events-none transition-colors flex items-center gap-1"
          >
            <ChevronLeft className="w-3.5 h-3.5" /> Prev
          </button>

          <button
            onClick={nextTourStep}
            className="px-3.5 py-1.5 text-xs font-bold rounded-lg bg-cyan-400 hover:bg-cyan-300 text-slate-950 transition-colors flex items-center gap-1 shadow-md shadow-cyan-400/20"
          >
            {pitchTourStep === TOUR_STEPS.length - 1 ? 'Finish Tour' : 'Next Stage'}
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
