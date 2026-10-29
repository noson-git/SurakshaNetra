/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type AssetType = 
  | 'blast_furnace'
  | 'rolling_mill'
  | 'cryo_tanks'
  | 'gas_manifold'
  | 'slag_casting'
  | 'cooling_tower';

export type AssetStatus = 'nominal' | 'warning' | 'critical';

export interface FacilityAsset {
  id: string;
  name: string;
  code: string;
  type: AssetType;
  zone: string;
  healthScore: number; // 0-100
  status: AssetStatus;
  specs: {
    coreTemperatureC: number;
    operatingPressureBar: number;
    vibrationMmSec: number;
    powerConsumptionMw: number;
    throughputTonsHr: number;
    structuralIntegrityPct: number;
  };
  coords3D: [number, number, number]; // x, y, z in Three.js space
  coords2D: { x: number; y: number; width: number; height: number }; // percentage 0-100
  description: string;
  lastInspected: string;
  inspectionCycleDays: number;
}

export interface DroneTelemetry {
  altitudeM: number;
  groundSpeedKmh: number;
  batteryPct: number;
  signalStrengthDbm: number;
  headingDeg: number;
  pitchDeg: number;
  rollDeg: number;
  lat: number;
  lng: number;
  flightTimeSec: number;
  distanceCoveredM: number;
  payloadThermalTempC: number;
}

export interface MissionWaypoint {
  id: string;
  number: number;
  label: string;
  code: string;
  coords3D: [number, number, number];
  coords2D: { x: number; y: number };
  targetAssetId: string;
  action: string;
  estimatedAltitudeM: number;
  hazardNote?: string;
}

export type FindingStatus = 'unreviewed' | 'confirmed' | 'dismissed';

export interface InspectionFinding {
  id: string;
  assetId: string;
  assetName: string;
  timestamp: string;
  anomalyType: string;
  severity: 'critical' | 'high' | 'medium';
  simulatedConfidencePct: number; // e.g. 96.4
  thermography: {
    peakTemperatureC: number;
    baselineTemperatureC: number;
    differentialDeltaC: number;
    isothermGrade: string;
  };
  explanation: string;
  recommendedAction: string;
  status: FindingStatus;
  actionCreated: boolean;
  actionId?: string;
  reviewedBy?: string;
  reviewedAt?: string;
}

export type ActionPriority = 'critical' | 'high' | 'medium';
export type ActionStatus = 'open' | 'in_progress' | 'resolved';

export interface CorrectiveAction {
  id: string;
  findingId: string;
  assetId: string;
  assetName: string;
  title: string;
  priority: ActionPriority;
  assignee: string;
  dueDate: string;
  notes: string;
  status: ActionStatus;
  createdAt: string;
  resolvedAt?: string;
  resolutionSummary?: string;
}

export interface ActivityEvent {
  id: string;
  timestamp: string;
  type: 'mission' | 'detection' | 'verification' | 'action' | 'system';
  title: string;
  detail: string;
  severity: 'nominal' | 'warning' | 'critical' | 'accent';
}

export type ViewTab = 'home' | 'overview' | 'twin' | 'missions' | 'findings' | 'actions';
