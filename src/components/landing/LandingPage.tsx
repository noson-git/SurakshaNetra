/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useCommandCentre } from '../../context/CommandCentreContext';
import { LandingHero3D } from './LandingHero3D';
import { 
  ArrowRight, 
  Play, 
  Box, 
  Navigation, 
  ShieldAlert, 
  Flame, 
  Camera, 
  Activity, 
  CheckCircle2, 
  ChevronDown, 
  Sparkles, 
  RotateCcw, 
  Layers, 
  Clock, 
  Gauge, 
  FileCheck,
  ShieldCheck,
  Sliders,
  Cpu
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { 
    setActiveTab, 
    setTwinViewMode, 
    setSelectedAssetId, 
    startMission, 
    setPitchTourActive,
    resetDemo,
    findings
  } = useCommandCentre();

  const [interactiveMode, setInteractiveMode] = useState<'thermal' | 'optical'>('thermal');

  const primaryFinding = findings[0];

  return (
    <div className="w-full flex flex-col text-slate-100 overflow-x-hidden select-none">
      {/* ──────────────────────────────────────────────────────────────────────────
          1. CINEMATIC DUSK HERO SECTION
      ────────────────────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[92vh] flex flex-col justify-between p-6 md:p-12 lg:p-16 overflow-hidden rounded-2xl border border-slate-800/80 bg-[#070A11] shadow-2xl">
        {/* 3D WebGL Industrial Dusk Scene with Multiple Drones */}
        <LandingHero3D />

        {/* Hero Top Identity Lockup & Demo Indicator */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono font-bold tracking-widest text-cyan-400 bg-cyan-950/60 px-3 py-1.5 rounded-lg border border-cyan-500/40 backdrop-blur-md">
              SURAKSHA NETRA · DEFENSE MATRIX
            </span>
            <span className="hidden sm:inline-block text-slate-500 font-mono text-xs">·</span>
            <span className="text-xs font-mono text-slate-300 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-700/80 backdrop-blur-md">
              BHILAI METALLURGY SEC-04
            </span>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 backdrop-blur-md text-amber-300 text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span>INTERACTIVE CONCEPT DEMO · SIMULATED DATA</span>
          </div>
        </div>

        {/* Hero Central Headline & Value Proposition */}
        <div className="relative z-10 max-w-3xl my-auto py-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-slate-900/80 border border-slate-700/80 text-xs font-mono text-cyan-300 mb-6 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>NEXT-GEN AUTONOMOUS INDUSTRIAL DRONE INTELLIGENCE</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.08] text-balance">
            See Risks Before <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500">
              They Escalate.
            </span>
          </h1>

          <p className="mt-5 text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl text-balance">
            AI-assisted drone surveillance and visual risk intelligence for critical industrial infrastructure. Continuous aerial thermography, synchronized 3D digital twins, and closed-loop human verification.
          </p>

          {/* Action Callouts */}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <button
              onClick={() => setActiveTab('overview')}
              className="flex items-center gap-2.5 px-6 py-3 text-sm font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-xl transition-all shadow-xl shadow-cyan-400/20 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              <span>Explore Command Centre</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                setActiveTab('missions');
                startMission();
              }}
              className="flex items-center gap-2 px-5 py-3 text-sm font-semibold text-slate-200 hover:text-white bg-slate-900/90 hover:bg-slate-800 rounded-xl border border-slate-700 hover:border-slate-600 transition-all backdrop-blur-md cursor-pointer"
            >
              <Play className="w-4 h-4 text-cyan-400 fill-current" />
              <span>Launch Demo Mission</span>
            </button>

            <button
              onClick={() => setPitchTourActive(true)}
              className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-slate-400 hover:text-slate-200 bg-transparent hover:bg-slate-800/40 rounded-xl transition-colors cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Guided Pitch Tour</span>
            </button>
          </div>
        </div>

        {/* Hero Bottom Telemetry Strip & Scroll Cue */}
        <div className="relative z-10 flex flex-wrap items-end justify-between gap-6 pt-6 border-t border-slate-800/80">
          {/* Live Simulated Airspace Telemetry Ticker */}
          <div className="flex flex-wrap items-center gap-6 text-xs font-mono">
            <div>
              <span className="text-slate-500 text-[10px] block">AIRSPACE SORTIE</span>
              <span className="font-bold text-cyan-300">NETRA-04 · AUTONOMOUS</span>
            </div>
            <div className="hidden sm:block">
              <span className="text-slate-500 text-[10px] block">ACTIVE DRONES</span>
              <span className="font-bold text-slate-200">3 VTOL PATROL CRAFT</span>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] block">CRITICAL ASSET HEALTH</span>
              <span className="font-bold text-emerald-400">88.4% NOMINAL</span>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] block">CV ANOMALY DETECTIONS</span>
              <span className="font-bold text-red-400">1 FLAGGED (PJ-204)</span>
            </div>
          </div>

          {/* Discreet Scroll Cue */}
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <span>EXPLORE PLATFORM BELOW</span>
            <ChevronDown className="w-4 h-4 text-cyan-400 animate-bounce" />
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────────────────────
          2. THREE ATTRACTIVE, CLICKABLE FEATURE PREVIEWS
      ────────────────────────────────────────────────────────────────────────── */}
      <section className="mt-16">
        <div className="flex flex-col gap-2 mb-8">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-cyan-400">
            INTERACTIVE SYSTEM MODULES
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Designed for Zero-Downtime Industrial Facilities
          </h2>
          <p className="text-sm text-slate-400 max-w-2xl">
            Click any feature preview below to enter the live functional module. Every control and data point connects to working application state.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Facility Digital Twin */}
          <div 
            onClick={() => {
              setActiveTab('twin');
              setTwinViewMode('3d');
            }}
            className="group relative p-6 rounded-2xl bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-cyan-500/50 transition-all duration-300 cursor-pointer flex flex-col justify-between shadow-xl hover:shadow-cyan-950/30 hover:-translate-y-1"
          >
            <div>
              {/* Card Visual Header */}
              <div className="w-full h-44 rounded-xl bg-slate-950 border border-slate-800 overflow-hidden relative mb-5 flex items-center justify-center p-3">
                {/* Stylized Architectural Twin Grid Preview */}
                <svg className="w-full h-full opacity-70 group-hover:opacity-100 transition-opacity" viewBox="0 0 300 160">
                  <pattern id="gridPatternMini" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1E293B" strokeWidth="1" />
                  </pattern>
                  <rect width="300" height="160" fill="url(#gridPatternMini)" />
                  {/* Isometric furnace & pipes wireframe */}
                  <polygon points="70,90 120,65 170,90 120,115" fill="rgba(6, 182, 212, 0.15)" stroke="#06B6D4" strokeWidth="1.5" />
                  <line x1="120" y1="65" x2="120" y2="25" stroke="#00F2FE" strokeWidth="2" />
                  <polygon points="190,110 240,85 270,100 220,125" fill="rgba(245, 158, 11, 0.15)" stroke="#F59E0B" strokeWidth="1.5" />
                  <circle cx="120" cy="25" r="4" fill="#00F2FE" />
                  <circle cx="240" cy="85" r="4" fill="#EF4444" />
                </svg>

                <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded bg-slate-900/90 border border-slate-700 text-[10px] font-mono text-cyan-400 flex items-center gap-1.5">
                  <Box className="w-3 h-3" /> 3D WebGL + 2D CAD
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-cyan-400">01</span>
                <span className="text-slate-600">·</span>
                <span className="text-xs font-mono text-slate-400 uppercase">Spatial Telemetry</span>
              </div>
              <h3 className="text-lg font-bold text-white mt-1 group-hover:text-cyan-300 transition-colors">
                Facility Digital Twin
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed mt-2.5">
                Inspect high-heat blast furnaces, gas distribution headers, and rolling mills in real-time isometric 3D or 2D technical CAD layout. Synchronized sensor gauges for temperature, pressure, and vibration.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold text-cyan-400">
              <span>Enter 2D/3D Facility View</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 2: Autonomous Mission Simulator */}
          <div 
            onClick={() => {
              setActiveTab('missions');
              startMission();
            }}
            className="group relative p-6 rounded-2xl bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-cyan-500/50 transition-all duration-300 cursor-pointer flex flex-col justify-between shadow-xl hover:shadow-cyan-950/30 hover:-translate-y-1"
          >
            <div>
              {/* Card Visual Header */}
              <div className="w-full h-44 rounded-xl bg-slate-950 border border-slate-800 overflow-hidden relative mb-5 flex items-center justify-center p-3">
                {/* Stylized Mission Waypoint Radar */}
                <div className="relative w-28 h-28 border border-cyan-500/30 rounded-full flex items-center justify-center group-hover:scale-105 transition-transform">
                  <div className="w-20 h-20 border border-cyan-500/20 rounded-full" />
                  <div className="w-12 h-12 border border-cyan-500/20 rounded-full" />
                  {/* Waypoint nodes */}
                  <span className="absolute top-2 left-6 w-2.5 h-2.5 rounded-full bg-cyan-400" />
                  <span className="absolute bottom-4 right-6 w-2.5 h-2.5 rounded-full bg-cyan-400" />
                  <span className="absolute top-10 right-2 w-3 h-3 rounded-full bg-red-400" />
                  {/* Drone cursor */}
                  <div className="w-3.5 h-3.5 bg-cyan-400 rounded-sm rotate-45 shadow-lg shadow-cyan-400" />
                </div>

                <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded bg-slate-900/90 border border-slate-700 text-[10px] font-mono text-cyan-400 flex items-center gap-1.5">
                  <Navigation className="w-3 h-3" /> Sortie NETRA-04
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-cyan-400">02</span>
                <span className="text-slate-600">·</span>
                <span className="text-xs font-mono text-slate-400 uppercase">Sortie Simulation</span>
              </div>
              <h3 className="text-lg font-bold text-white mt-1 group-hover:text-cyan-300 transition-colors">
                Autonomous Drone Missions
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed mt-2.5">
                Simulate autonomous drone sorties with Start, Pause, and Speed controls. Monitor simulated flight telemetry, 5 checkpoint waypoints, and dual optical/FLIR thermal camera HUD viewfinders.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold text-cyan-400">
              <span>Launch Mission Simulator</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 3: AI Findings & Response */}
          <div 
            onClick={() => {
              setActiveTab('findings');
              setSelectedAssetId('pj-204');
            }}
            className="group relative p-6 rounded-2xl bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-red-500/50 transition-all duration-300 cursor-pointer flex flex-col justify-between shadow-xl hover:shadow-red-950/30 hover:-translate-y-1"
          >
            <div>
              {/* Card Visual Header */}
              <div className="w-full h-44 rounded-xl bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-950 border border-slate-800 overflow-hidden relative mb-5 flex items-center justify-center p-3">
                {/* Simulated Thermal Heat Plume */}
                <div className="w-24 h-24 rounded-full bg-radial from-red-500 via-amber-400 to-transparent opacity-80 blur-lg group-hover:scale-110 transition-transform" />
                <div className="relative z-10 text-center font-mono">
                  <div className="text-xs font-bold text-white bg-black/80 px-2 py-0.5 rounded border border-red-500/60">
                    DELTA: +78.3°C
                  </div>
                  <div className="text-[10px] text-amber-300 mt-1">CONF: 96.4%</div>
                </div>

                <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded bg-slate-900/90 border border-red-500/40 text-[10px] font-mono text-red-400 flex items-center gap-1.5">
                  <ShieldAlert className="w-3 h-3" /> CV Defect Dossier
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-red-400">03</span>
                <span className="text-slate-600">·</span>
                <span className="text-xs font-mono text-slate-400 uppercase">Hazard Governance</span>
              </div>
              <h3 className="text-lg font-bold text-white mt-1 group-hover:text-red-300 transition-colors">
                AI Findings & Response
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed mt-2.5">
                Inspect synthetic radiometric thermograms and 12x optical zoom captures. Certified human safety engineers confirm hazards, assign work orders, and track resolution through the Action Tracker.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold text-red-400">
              <span>Explore Verification Workflow</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────────────────────
          3. HOW AUTONOMOUS SURVEILLANCE WORKS (Operational Loop)
      ────────────────────────────────────────────────────────────────────────── */}
      <section className="mt-20 p-8 sm:p-12 rounded-2xl bg-slate-900/50 border border-slate-800/80">
        <div className="max-w-3xl mb-12">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-cyan-400">
            OPERATIONAL ARCHITECTURE
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1">
            Closed-Loop Autonomous Aerial Defense
          </h2>
          <p className="text-sm text-slate-300 mt-2">
            Eliminating dangerous manual scaffolding climbs through deterministic drone-in-a-box sorties and human-supervised computer vision.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Step 1 */}
          <div className="p-5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex flex-col justify-between">
            <div>
              <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-mono text-xs font-bold mb-4">
                01
              </div>
              <h4 className="text-sm font-bold text-white">Autonomous Launch</h4>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Pre-programmed flight circuits launch automatically from weatherproof docking stations, adhering to plant airspace geofences.
              </p>
            </div>
            <span className="text-[11px] font-mono text-cyan-400 mt-4 block">RTK GPS & Collision Mesh</span>
          </div>

          {/* Step 2 */}
          <div className="p-5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex flex-col justify-between">
            <div>
              <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-mono text-xs font-bold mb-4">
                02
              </div>
              <h4 className="text-sm font-bold text-white">Dual-Spectrum Sweep</h4>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                4K optical zoom cameras capture millimeter micro-fissures, while calibrated FLIR radiometric sensors map thermal isotherms.
              </p>
            </div>
            <span className="text-[11px] font-mono text-cyan-400 mt-4 block">640×512 Radiometric LWIR</span>
          </div>

          {/* Step 3 */}
          <div className="p-5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex flex-col justify-between">
            <div>
              <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-mono text-xs font-bold mb-4">
                03
              </div>
              <h4 className="text-sm font-bold text-white">Edge Vision Triage</h4>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Computer vision models detect anomalous gradients, temperature spikes, and structural corrosion against historical baselines.
              </p>
            </div>
            <span className="text-[11px] font-mono text-amber-400 mt-4 block">96.4% Simulated Confidence</span>
          </div>

          {/* Step 4 */}
          <div className="p-5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex flex-col justify-between">
            <div>
              <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-mono text-xs font-bold mb-4">
                04
              </div>
              <h4 className="text-sm font-bold text-white">Human Sign-off & SLA</h4>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Certified plant engineers verify findings, dispatch corrective work orders, and track resolution through to nominal sign-off.
              </p>
            </div>
            <span className="text-[11px] font-mono text-emerald-400 mt-4 block">Closed-Loop Audit Ledger</span>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────────────────────
          4. INTERACTIVE ANOMALY COMPARATOR SHOWCASE
      ────────────────────────────────────────────────────────────────────────── */}
      <section className="mt-20">
        <div className="p-8 sm:p-10 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-2xl">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-800">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-red-400">
                SAMPLE INSPECTION FINDING · DEFECT DOSSIER #2026-089
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
                High-Pressure Gas & Steam Flange Anomaly (PJ-204)
              </h2>
            </div>

            {/* Toggle Modes */}
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
              <button
                onClick={() => setInteractiveMode('thermal')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded font-medium transition-colors cursor-pointer ${
                  interactiveMode === 'thermal'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Flame className="w-3.5 h-3.5" /> FLIR Thermogram
              </button>
              <button
                onClick={() => setInteractiveMode('optical')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded font-medium transition-colors cursor-pointer ${
                  interactiveMode === 'optical'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Camera className="w-3.5 h-3.5" /> 12x Optical Macro
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6 items-center">
            {/* Visual Viewport Canvas (7 cols) */}
            <div className="lg:col-span-7 h-80 rounded-xl bg-slate-950 border border-slate-800 overflow-hidden relative flex items-center justify-center select-none">
              {interactiveMode === 'thermal' ? (
                <div className="relative w-full h-full bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-950 flex items-center justify-center">
                  {/* Flange geometry */}
                  <svg className="absolute inset-0 w-full h-full opacity-60" viewBox="0 0 600 320">
                    <rect x="0" y="120" width="600" height="80" fill="#1E1B4B" stroke="#4338CA" strokeWidth="2" />
                    <rect x="270" y="90" width="30" height="140" rx="4" fill="#312E81" stroke="#6366F1" strokeWidth="2" />
                    <rect x="300" y="90" width="30" height="140" rx="4" fill="#312E81" stroke="#6366F1" strokeWidth="2" />
                  </svg>

                  {/* Hotspot plume */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-44 h-44 rounded-full bg-radial from-red-500 via-amber-400 to-transparent opacity-90 blur-xl animate-pulse" />

                  <div className="relative z-10 bg-black/80 px-3 py-1.5 rounded border border-red-500/80 text-xs font-mono text-center">
                    <div className="text-white font-bold">PEAK RADIOMETRIC TEMP: 382.4°C</div>
                    <div className="text-red-400 font-semibold">DELTA: +78.3°C above baseline</div>
                  </div>

                  <div className="absolute bottom-2 left-3 text-[10px] font-mono text-slate-400 bg-black/60 px-2 py-0.5 rounded">
                    FLIR RADIOMETRIC THERMOGRAPHY · GRADE-IV HOTSPOT
                  </div>
                </div>
              ) : (
                <div className="relative w-full h-full bg-slate-900 flex items-center justify-center">
                  <svg className="w-full h-full" viewBox="0 0 600 320">
                    <rect width="600" height="320" fill="#1E293B" />
                    <rect x="180" y="30" width="240" height="260" rx="8" fill="#334155" stroke="#475569" strokeWidth="3" />
                    <circle cx="300" cy="160" r="80" fill="#0F172A" stroke="#64748B" strokeWidth="4" />
                    <path d="M 370 110 Q 385 130 378 155 T 392 185" fill="none" stroke="#EF4444" strokeWidth="3.5" />
                    <text x="360" y="95" fill="#EF4444" fontSize="11" fontFamily="monospace" fontWeight="bold">
                      MICRO-FISSURE [7.8mm]
                    </text>
                  </svg>
                  <div className="absolute bottom-2 left-3 text-[10px] font-mono text-slate-400 bg-black/60 px-2 py-0.5 rounded">
                    12X OPTICAL TELEPHOTO · CALIPER DEFECT ANNOTATION
                  </div>
                </div>
              )}
            </div>

            {/* Diagnostic Information & Exploration Button (5 cols) */}
            <div className="lg:col-span-5 flex flex-col gap-4">
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-[11px] font-mono font-bold text-slate-400 uppercase">
                  Automated Finding Analysis
                </span>
                <p className="text-xs text-slate-300 leading-relaxed mt-1.5">
                  Thermal gradient reveals concentrated steam leakage along the secondary bypass gasket seam. Risk of blowout under cyclic pressure loads.
                </p>
                <div className="flex items-center gap-4 mt-3 pt-3 border-t border-slate-800 text-xs font-mono">
                  <div>
                    <span className="text-slate-500 text-[10px] block">SIMULATED CONFIDENCE</span>
                    <span className="font-bold text-cyan-400">96.4%</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block">PRIORITY</span>
                    <span className="font-bold text-red-400 uppercase">Critical (Within 6h)</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  setSelectedAssetId('pj-204');
                  setActiveTab('findings');
                }}
                className="w-full py-3 px-4 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-cyan-400/20 cursor-pointer"
              >
                <span>Inspect Full Dossier & Confirm Hazard</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────────────────────
          5. MEASURABLE PILOT GOALS & OPERATIONAL IMPACT
      ────────────────────────────────────────────────────────────────────────── */}
      <section className="mt-20">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-cyan-400">
            COMPETITION BENCHMARK IMPACT
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1">
            Proven Industrial Risk Mitigation Metrics
          </h2>
          <p className="text-sm text-slate-400 mt-2">
            Targeted operational benchmarks designed for deployment in state-level heavy industry complexes.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 text-center">
            <span className="text-3xl sm:text-4xl font-extrabold font-mono text-cyan-400 block">
              0
            </span>
            <span className="text-xs font-semibold text-slate-200 mt-2 block">
              Personnel Climbing Hazards
            </span>
            <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
              Eliminates dangerous manual gantry scaffolding climbing in high-heat zones.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 text-center">
            <span className="text-3xl sm:text-4xl font-extrabold font-mono text-emerald-400 block">
              6x
            </span>
            <span className="text-xs font-semibold text-slate-200 mt-2 block">
              Faster Inspection Cadence
            </span>
            <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
              Reduces 48-hour manual plant walkdowns to 8-minute autonomous aerial sweeps.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 text-center">
            <span className="text-3xl sm:text-4xl font-extrabold font-mono text-amber-400 block">
              -40%
            </span>
            <span className="text-xs font-semibold text-slate-200 mt-2 block">
              Unplanned Steam Outages
            </span>
            <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
              Detects flange gasket micro-leaks days before catastrophic pressure ruptures occur.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 text-center">
            <span className="text-3xl sm:text-4xl font-extrabold font-mono text-indigo-400 block">
              100%
            </span>
            <span className="text-xs font-semibold text-slate-200 mt-2 block">
              Auditable Compliance Ledger
            </span>
            <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
              Every inspection sortie and corrective action is timestamped in the digital twin.
            </p>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────────────────────
          6. FINAL EXPLORATION CALL-TO-ACTION
      ────────────────────────────────────────────────────────────────────────── */}
      <section className="mt-20 mb-12 p-10 sm:p-14 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-[#0A1024] border border-cyan-500/40 shadow-2xl relative overflow-hidden text-center">
        <div className="relative z-10 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-cyan-950/60 border border-cyan-500/40 text-xs font-mono text-cyan-300 mb-4">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>STATE-LEVEL STARTUP COMPETITION PROTOTYPE</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight text-balance">
            Experience SURAKSHA NETRA in Action
          </h2>

          <p className="mt-4 text-sm text-slate-300 leading-relaxed text-balance">
            Explore the full command centre, interact with the 3D isometric digital twin, run autonomous drone sorties, and verify synthetic anomalies in real time.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => setActiveTab('overview')}
              className="flex items-center gap-2 px-6 py-3 text-sm font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-xl transition-all shadow-xl shadow-cyan-400/20 hover:scale-[1.02] cursor-pointer"
            >
              <span>Enter Command Centre</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setPitchTourActive(true)}
              className="flex items-center gap-2 px-5 py-3 text-sm font-semibold text-slate-200 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-700 transition-colors cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Launch Guided Pitch Tour</span>
            </button>

            <button
              onClick={resetDemo}
              className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-slate-400 hover:text-slate-200 bg-transparent hover:bg-slate-800/40 rounded-xl transition-colors cursor-pointer"
              title="Reset demonstration state back to initial parameters"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Demo State</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
