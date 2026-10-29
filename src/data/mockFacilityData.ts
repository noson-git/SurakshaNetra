/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { FacilityAsset, MissionWaypoint, InspectionFinding, CorrectiveAction, ActivityEvent } from '../types';

export const FACILITY_NAME = "BHILAI HEAVY METALLURGICAL & FORGE COMPLEX";
export const FACILITY_CODE = "SEC-04-IND";
export const SIMULATION_DISCLAIMER = "ILLUSTRATIVE CONCEPT PROTOTYPE · ALL TELEMETRY & AI FINDINGS ARE SYNTHETIC DEMONSTRATION DATA";

export const INITIAL_ASSETS: FacilityAsset[] = [
  {
    id: "bf-01",
    name: "Blast Furnace Alpha",
    code: "BF-01",
    type: "blast_furnace",
    zone: "Zone A: Primary Smelting",
    healthScore: 92,
    status: "nominal",
    specs: {
      coreTemperatureC: 1485,
      operatingPressureBar: 3.8,
      vibrationMmSec: 1.4,
      powerConsumptionMw: 44.2,
      throughputTonsHr: 320,
      structuralIntegrityPct: 94
    },
    coords3D: [-6, 0, -4],
    coords2D: { x: 22, y: 30, width: 20, height: 26 },
    description: "High-capacity continuous pig-iron blast furnace with quadruple hot blast tuyeres and automated refractory shell cooling jackets.",
    lastInspected: "Today, 06:15 IST",
    inspectionCycleDays: 7
  },
  {
    id: "pj-204",
    name: "High-Pressure Gas & Steam Manifold",
    code: "PJ-204",
    type: "gas_manifold",
    zone: "Zone B: Utility & Steam Corridor",
    healthScore: 68,
    status: "critical", // The simulated anomaly target!
    specs: {
      coreTemperatureC: 382,
      operatingPressureBar: 18.4,
      vibrationMmSec: 4.9,
      powerConsumptionMw: 8.5,
      throughputTonsHr: 110,
      structuralIntegrityPct: 68
    },
    coords3D: [1, 0, -2],
    coords2D: { x: 48, y: 44, width: 18, height: 16 },
    description: "Main distribution header for blast furnace off-gas and superheated process steam lines bridging Smelting and Rolling bays.",
    lastInspected: "During Active Sortie NETRA-04",
    inspectionCycleDays: 3
  },
  {
    id: "sc-03",
    name: "Continuous Slab Casting Complex",
    code: "SC-03",
    type: "slag_casting",
    zone: "Zone C: Restricted Casting Bay",
    healthScore: 88,
    status: "nominal",
    specs: {
      coreTemperatureC: 1220,
      operatingPressureBar: 2.1,
      vibrationMmSec: 2.3,
      powerConsumptionMw: 31.0,
      throughputTonsHr: 240,
      structuralIntegrityPct: 91
    },
    coords3D: [-5, 0, 4],
    coords2D: { x: 24, y: 72, width: 22, height: 20 },
    description: "Twin-strand curved mould continuous slab caster with automated electromagnetic stirring and hydraulic shear containment.",
    lastInspected: "Yesterday, 18:40 IST",
    inspectionCycleDays: 5
  },
  {
    id: "rm-02",
    name: "Hot Strip Rolling Mill Bay",
    code: "RM-02",
    type: "rolling_mill",
    zone: "Zone D: Finishing & Rolling",
    healthScore: 84,
    status: "warning",
    specs: {
      coreTemperatureC: 960,
      operatingPressureBar: 6.4,
      vibrationMmSec: 3.8,
      powerConsumptionMw: 56.5,
      throughputTonsHr: 410,
      structuralIntegrityPct: 83
    },
    coords3D: [6, 0, 3],
    coords2D: { x: 74, y: 68, width: 22, height: 22 },
    description: "7-stand tandem finishing mill line for high-tensile structural steel coil production with laminar runout cooling tables.",
    lastInspected: "2 days ago, 11:20 IST",
    inspectionCycleDays: 7
  },
  {
    id: "co-05",
    name: "Cryogenic Liquid Oxygen Silos",
    code: "CO-05",
    type: "cryo_tanks",
    zone: "Zone E: Cryogenic Gas Storage",
    healthScore: 96,
    status: "nominal",
    specs: {
      coreTemperatureC: -183,
      operatingPressureBar: 12.2,
      vibrationMmSec: 0.8,
      powerConsumptionMw: 14.8,
      throughputTonsHr: 85,
      structuralIntegrityPct: 98
    },
    coords3D: [7, 0, -5],
    coords2D: { x: 76, y: 26, width: 16, height: 20 },
    description: "Vacuum-insulated vertical cryogenic storage vessels supplying high-purity oxygen for basic oxygen steelmaking converters.",
    lastInspected: "Yesterday, 09:00 IST",
    inspectionCycleDays: 14
  },
  {
    id: "ct-04",
    name: "Hyperbolic Cooling Tower Beta",
    code: "CT-04",
    type: "cooling_tower",
    zone: "Zone F: Recirculation & Effluent",
    healthScore: 90,
    status: "nominal",
    specs: {
      coreTemperatureC: 34,
      operatingPressureBar: 1.2,
      vibrationMmSec: 1.1,
      powerConsumptionMw: 6.2,
      throughputTonsHr: 1250,
      structuralIntegrityPct: 92
    },
    coords3D: [0, 0, 7],
    coords2D: { x: 50, y: 84, width: 16, height: 14 },
    description: "Natural-draft reinforced concrete cooling tower processing secondary circuit cooling water from continuous casting and rolling lines.",
    lastInspected: "3 days ago, 14:10 IST",
    inspectionCycleDays: 30
  }
];

export const MISSION_WAYPOINTS: MissionWaypoint[] = [
  {
    id: "wp-1",
    number: 1,
    label: "Sortie Launch & Perimeter Ingress",
    code: "WP-01",
    coords3D: [-9, 3.5, -8],
    coords2D: { x: 8, y: 12 },
    targetAssetId: "bf-01",
    action: "Ascent to 35m AGL; Optical calibration check",
    estimatedAltitudeM: 35
  },
  {
    id: "wp-2",
    number: 2,
    label: "Blast Furnace Alpha Shell Scan",
    code: "WP-02",
    coords3D: [-6, 4.2, -4],
    coords2D: { x: 22, y: 30 },
    targetAssetId: "bf-01",
    action: "Thermographic azimuth sweep of refractory shell; Tuyere temp verification",
    estimatedAltitudeM: 42
  },
  {
    id: "wp-3",
    number: 3,
    label: "Utility Corridor & Manifold Junction PJ-204",
    code: "WP-03",
    coords3D: [1, 2.8, -2],
    coords2D: { x: 48, y: 44 },
    targetAssetId: "pj-204",
    action: "Close-proximity visual inspection; Steam flange thermal acoustic sweep",
    estimatedAltitudeM: 28,
    hazardNote: "SIMULATED ANOMALY TRIGGER ZONE: Detected abnormal localized thermal signature (+78°C delta)"
  },
  {
    id: "wp-4",
    number: 4,
    label: "Rolling Mill West Gantry Survey",
    code: "WP-04",
    coords3D: [6, 3.2, 3],
    coords2D: { x: 74, y: 68 },
    targetAssetId: "rm-02",
    action: "Structural overhead crane rail alignment check & vibration sensor cross-check",
    estimatedAltitudeM: 32
  },
  {
    id: "wp-5",
    number: 5,
    label: "Cryogenic Storage Perimeter & Egress",
    code: "WP-05",
    coords3D: [7, 3.8, -5],
    coords2D: { x: 76, y: 26 },
    targetAssetId: "co-05",
    action: "Oxygen relief valve thermal inspection; Automated return-to-base alignment",
    estimatedAltitudeM: 38
  }
];

export const INITIAL_FINDINGS: InspectionFinding[] = [
  {
    id: "find-2026-089",
    assetId: "pj-204",
    assetName: "High-Pressure Gas & Steam Manifold (PJ-204)",
    timestamp: "Today, 10:42:18 IST",
    anomalyType: "Apparent Steam Flange Thermal Anomaly & Gasket Micro-Fissure",
    severity: "critical",
    simulatedConfidencePct: 96.4,
    thermography: {
      peakTemperatureC: 382.4,
      baselineTemperatureC: 304.1,
      differentialDeltaC: 78.3,
      isothermGrade: "Grade-IV Hotspot with Expanding Thermal Gradient"
    },
    explanation: "Synthetic aerial thermography identified an abnormal high-temperature plume concentrated at the secondary steam gantry flange junction PJ-204. Radiometric signature exhibits a +78.3°C gradient delta above nominal baseline operating parameters, indicating probable high-pressure steam leakage or gasket degradation under cyclic thermal stress.",
    recommendedAction: "Execute rapid ultrasonic thickness test on pipe bend B-14, isolate secondary bypass valve BV-08, and replace graphite-composite flange gasket within 6 operating hours.",
    status: "unreviewed",
    actionCreated: false
  }
];

export const INITIAL_ACTIONS: CorrectiveAction[] = [
  {
    id: "act-101",
    findingId: "find-historical-044",
    assetId: "rm-02",
    assetName: "Hot Strip Rolling Mill Bay (RM-02)",
    title: "Inspect Hydraulic Bearing Housing Pinion-6",
    priority: "medium",
    assignee: "Suresh Pillai (Lead Mechanical)",
    dueDate: "Tomorrow, 16:00 IST",
    notes: "Bearing vibration elevated to 3.8 mm/sec on stand #4. Routine grease flushing and acoustic probe validation scheduled.",
    status: "in_progress",
    createdAt: "Yesterday, 14:30 IST"
  }
];

export const INITIAL_ACTIVITIES: ActivityEvent[] = [
  {
    id: "act-01",
    timestamp: "10:42:19",
    type: "detection",
    title: "Synthetic Anomaly Flagged by SURAKSHA Vision Model",
    detail: "High-pressure thermal leak flagged on Manifold PJ-204 (96.4% simulated confidence). Awaiting human engineering review.",
    severity: "critical"
  },
  {
    id: "act-02",
    timestamp: "10:40:02",
    type: "mission",
    title: "Autonomous Sortie NETRA-04 Arrived at WP-03",
    detail: "Drone VTOL-X4 holding 28m altitude with 12x optical zoom and thermal sensor active over Utility Corridor.",
    severity: "accent"
  },
  {
    id: "act-03",
    timestamp: "10:35:10",
    type: "system",
    title: "3D Digital Twin Telemetry Synced",
    detail: "6 critical plant nodes updated with live sensor readings from SCADA gateway.",
    severity: "nominal"
  },
  {
    id: "act-04",
    timestamp: "10:30:00",
    type: "mission",
    title: "Sortie NETRA-04 Launched from Docking Station Beta",
    detail: "Automated pre-flight check nominal: Battery 98%, GPS RTK lock 14 satellites, wind 4.2 km/h NW.",
    severity: "nominal"
  }
];
