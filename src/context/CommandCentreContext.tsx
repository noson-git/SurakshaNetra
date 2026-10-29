/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { 
  FacilityAsset, 
  MissionWaypoint, 
  InspectionFinding, 
  CorrectiveAction, 
  ActivityEvent, 
  DroneTelemetry, 
  ViewTab, 
  ActionPriority, 
  ActionStatus 
} from '../types';
import { 
  INITIAL_ASSETS, 
  MISSION_WAYPOINTS, 
  INITIAL_FINDINGS, 
  INITIAL_ACTIONS, 
  INITIAL_ACTIVITIES 
} from '../data/mockFacilityData';

interface CommandCentreContextType {
  activeTab: ViewTab;
  setActiveTab: (tab: ViewTab) => void;
  selectedAssetId: string | null;
  setSelectedAssetId: (id: string | null) => void;
  selectedAsset: FacilityAsset | null;
  assets: FacilityAsset[];
  twinViewMode: '3d' | '2d';
  setTwinViewMode: (mode: '3d' | '2d') => void;
  
  // Mission state
  waypoints: MissionWaypoint[];
  missionStatus: 'idle' | 'running' | 'paused' | 'completed';
  currentWaypointIndex: number;
  missionProgressPct: number;
  missionSpeed: number;
  setMissionSpeed: (speed: number) => void;
  startMission: () => void;
  pauseMission: () => void;
  resetMission: () => void;
  droneTelemetry: DroneTelemetry;
  dronePosition3D: [number, number, number];
  dronePosition2D: { x: number; y: number };
  cameraFeedMode: 'optical' | 'thermal';
  setCameraFeedMode: (mode: 'optical' | 'thermal') => void;
  
  // Findings & Human Verification
  findings: InspectionFinding[];
  actions: CorrectiveAction[];
  activities: ActivityEvent[];
  confirmFinding: (findingId: string, reviewerNotes?: string) => void;
  dismissFinding: (findingId: string, reason?: string) => void;
  createAction: (findingId: string, data: { title: string; priority: ActionPriority; assignee: string; dueDate: string; notes: string }) => void;
  updateActionStatus: (actionId: string, status: ActionStatus, resolutionSummary?: string) => void;
  
  // Demo Presentation Mode
  pitchTourActive: boolean;
  pitchTourStep: number;
  setPitchTourActive: (active: boolean) => void;
  nextTourStep: () => void;
  prevTourStep: () => void;
  jumpToTourStep: (step: number) => void;
  triggerAnomalyScenario: () => void;
  resetDemo: () => void;
}

const CommandCentreContext = createContext<CommandCentreContextType | null>(null);

const INITIAL_TELEMETRY: DroneTelemetry = {
  altitudeM: 28.4,
  groundSpeedKmh: 14.2,
  batteryPct: 88,
  signalStrengthDbm: -68,
  headingDeg: 134,
  pitchDeg: -4.5,
  rollDeg: 1.2,
  lat: 21.1938,
  lng: 81.3822,
  flightTimeSec: 420,
  distanceCoveredM: 1840,
  payloadThermalTempC: 382.4
};

export const CommandCentreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<ViewTab>('home');
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>('pj-204');
  const [assets, setAssets] = useState<FacilityAsset[]>(INITIAL_ASSETS);
  const [twinViewMode, setTwinViewMode] = useState<'3d' | '2d'>('3d');
  
  // Mission state
  const [missionStatus, setMissionStatus] = useState<'idle' | 'running' | 'paused' | 'completed'>('idle');
  const [currentWaypointIndex, setCurrentWaypointIndex] = useState<number>(2); // Default pointing near WP-3 (PJ-204)
  const [missionProgressPct, setMissionProgressPct] = useState<number>(55);
  const [missionSpeed, setMissionSpeed] = useState<number>(1);
  const [droneTelemetry, setDroneTelemetry] = useState<DroneTelemetry>(INITIAL_TELEMETRY);
  const [dronePosition3D, setDronePosition3D] = useState<[number, number, number]>(MISSION_WAYPOINTS[2].coords3D);
  const [dronePosition2D, setDronePosition2D] = useState<{ x: number; y: number }>(MISSION_WAYPOINTS[2].coords2D);
  const [cameraFeedMode, setCameraFeedMode] = useState<'optical' | 'thermal'>('thermal');
  
  // Findings, Actions & Activity
  const [findings, setFindings] = useState<InspectionFinding[]>(INITIAL_FINDINGS);
  const [actions, setActions] = useState<CorrectiveAction[]>(INITIAL_ACTIONS);
  const [activities, setActivities] = useState<ActivityEvent[]>(INITIAL_ACTIVITIES);
  
  // Pitch Tour
  const [pitchTourActive, setPitchTourActive] = useState<boolean>(false);
  const [pitchTourStep, setPitchTourStep] = useState<number>(0);

  const selectedAsset = assets.find(a => a.id === selectedAssetId) || null;

  // Add an activity item helper
  const logActivity = useCallback((type: ActivityEvent['type'], title: string, detail: string, severity: ActivityEvent['severity']) => {
    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0];
    const newEvent: ActivityEvent = {
      id: `act-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: timeStr,
      type,
      title,
      detail,
      severity
    };
    setActivities(prev => [newEvent, ...prev.slice(0, 40)]);
  }, []);

  // Drone simulation step loop
  const animFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(performance.now());
  const progressRef = useRef<number>(missionProgressPct);
  progressRef.current = missionProgressPct;

  useEffect(() => {
    if (missionStatus !== 'running') {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      return;
    }

    const tick = (now: number) => {
      const deltaSec = (now - lastTimeRef.current) / 1000;
      lastTimeRef.current = now;

      // Advance progress
      const increment = (deltaSec * 4.5 * missionSpeed); // approx 22s full circuit at 1x
      let newProgress = progressRef.current + increment;

      if (newProgress >= 100) {
        newProgress = 100;
        setMissionStatus('completed');
        logActivity('mission', 'Sortie NETRA-04 Completed', 'Autonomous drone returned to base landing pad. Sortie debrief generated.', 'nominal');
      }

      setMissionProgressPct(newProgress);

      // Determine segment between waypoints
      const numSegments = MISSION_WAYPOINTS.length - 1;
      const exactSegment = (newProgress / 100) * numSegments;
      const segIndex = Math.min(Math.floor(exactSegment), numSegments - 1);
      const segFraction = exactSegment - segIndex;

      setCurrentWaypointIndex(segIndex);

      const wpStart = MISSION_WAYPOINTS[segIndex];
      const wpEnd = MISSION_WAYPOINTS[Math.min(segIndex + 1, MISSION_WAYPOINTS.length - 1)];

      // Interpolate 3D
      const x3 = wpStart.coords3D[0] + (wpEnd.coords3D[0] - wpStart.coords3D[0]) * segFraction;
      const y3 = wpStart.coords3D[1] + (wpEnd.coords3D[1] - wpStart.coords3D[1]) * segFraction;
      const z3 = wpStart.coords3D[2] + (wpEnd.coords3D[2] - wpStart.coords3D[2]) * segFraction;
      setDronePosition3D([x3, y3, z3]);

      // Interpolate 2D
      const x2 = wpStart.coords2D.x + (wpEnd.coords2D.x - wpStart.coords2D.x) * segFraction;
      const y2 = wpStart.coords2D.y + (wpEnd.coords2D.y - wpStart.coords2D.y) * segFraction;
      setDronePosition2D({ x: x2, y: y2 });

      // Update telemetry with realistic micro-jitter
      const alt = wpStart.estimatedAltitudeM + (wpEnd.estimatedAltitudeM - wpStart.estimatedAltitudeM) * segFraction + (Math.sin(now / 500) * 0.4);
      const spd = 14 + Math.cos(now / 600) * 1.5;
      const battery = Math.max(10, 88 - (newProgress * 0.15));

      setDroneTelemetry(prev => ({
        ...prev,
        altitudeM: Number(alt.toFixed(1)),
        groundSpeedKmh: Number(spd.toFixed(1)),
        batteryPct: Math.round(battery),
        headingDeg: Math.round((Math.atan2(wpEnd.coords3D[0] - wpStart.coords3D[0], wpEnd.coords3D[2] - wpStart.coords3D[2]) * 180 / Math.PI + 360) % 360),
        pitchDeg: Number((-4 + Math.sin(now / 400) * 0.6).toFixed(1)),
        rollDeg: Number((Math.cos(now / 700) * 1.2).toFixed(1)),
        distanceCoveredM: Math.round(1840 + (newProgress * 15)),
        flightTimeSec: Math.round(prev.flightTimeSec + deltaSec)
      }));

      // If passing WP-3 and anomaly is still unreviewed, pulse notification
      if (segIndex === 2 && segFraction > 0.4 && segFraction < 0.6) {
        setSelectedAssetId('pj-204');
      }

      if (newProgress < 100) {
        animFrameRef.current = requestAnimationFrame(tick);
      }
    };

    lastTimeRef.current = performance.now();
    animFrameRef.current = requestAnimationFrame(tick);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [missionStatus, missionSpeed, logActivity]);

  const startMission = () => {
    if (missionProgressPct >= 100) {
      setMissionProgressPct(0);
      setCurrentWaypointIndex(0);
    }
    setMissionStatus('running');
    logActivity('mission', 'Autonomous Sortie Resumed', 'Drone Netra-VTOL-X4 active along perimeter flight path.', 'accent');
  };

  const pauseMission = () => {
    setMissionStatus('paused');
    logActivity('mission', 'Sortie Paused by Operator', 'Drone holding station in autonomous loiter mode.', 'nominal');
  };

  const resetMission = () => {
    setMissionStatus('idle');
    setMissionProgressPct(0);
    setCurrentWaypointIndex(0);
    setDronePosition3D(MISSION_WAYPOINTS[0].coords3D);
    setDronePosition2D(MISSION_WAYPOINTS[0].coords2D);
    setDroneTelemetry(prev => ({
      ...prev,
      altitudeM: MISSION_WAYPOINTS[0].estimatedAltitudeM,
      batteryPct: 98,
      flightTimeSec: 0,
      distanceCoveredM: 0
    }));
    logActivity('mission', 'Mission Simulator Reset', 'Sortie reset to launch coordinates (WP-01).', 'nominal');
  };

  // Human Verification Workflow
  const confirmFinding = (findingId: string, reviewerNotes?: string) => {
    const finding = findings.find(f => f.id === findingId);
    if (!finding) return;

    const reviewer = "Er. Vikram Sen (Senior Metallurgical Safety Officer)";
    const now = new Date();
    const timeStr = `Today, ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')} IST`;

    setFindings(prev => prev.map(f => {
      if (f.id === findingId) {
        return {
          ...f,
          status: 'confirmed',
          reviewedBy: reviewer,
          reviewedAt: timeStr,
          explanation: reviewerNotes ? `${f.explanation}\n\n[Human Reviewer Note]: ${reviewerNotes}` : f.explanation
        };
      }
      return f;
    }));

    // Update asset status
    setAssets(prev => prev.map(a => {
      if (a.id === finding.assetId) {
        return {
          ...a,
          status: 'critical',
          healthScore: Math.min(a.healthScore, 65)
        };
      }
      return a;
    }));

    logActivity('verification', `Finding Confirmed: ${finding.anomalyType}`, `Human verified by ${reviewer}. Immediate corrective protocol authorized.`, 'critical');
  };

  const dismissFinding = (findingId: string, reason?: string) => {
    const finding = findings.find(f => f.id === findingId);
    if (!finding) return;

    const reviewer = "Er. Vikram Sen (Senior Metallurgical Safety Officer)";
    const now = new Date();
    const timeStr = `Today, ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')} IST`;

    setFindings(prev => prev.map(f => {
      if (f.id === findingId) {
        return {
          ...f,
          status: 'dismissed',
          reviewedBy: reviewer,
          reviewedAt: timeStr,
          explanation: `${f.explanation}\n\n[Dismissed by Human Reviewer]: ${reason || 'Determined to be benign reflective flare from slag ladle transit.'}`
        };
      }
      return f;
    }));

    // Asset health can be restored to nominal if dismissed
    setAssets(prev => prev.map(a => {
      if (a.id === finding.assetId) {
        return {
          ...a,
          status: 'nominal',
          healthScore: 89
        };
      }
      return a;
    }));

    logActivity('verification', `Finding Dismissed: ${finding.anomalyType}`, `Reviewed as non-hazardous by ${reviewer}. Reason: ${reason || 'Reflective artifact'}`, 'nominal');
  };

  const createAction = (findingId: string, data: { title: string; priority: ActionPriority; assignee: string; dueDate: string; notes: string }) => {
    const finding = findings.find(f => f.id === findingId);
    if (!finding) return;

    const newActionId = `act-${Date.now().toString().slice(-4)}`;
    const now = new Date();
    const timeStr = `Today, ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')} IST`;

    const newAction: CorrectiveAction = {
      id: newActionId,
      findingId,
      assetId: finding.assetId,
      assetName: finding.assetName,
      title: data.title,
      priority: data.priority,
      assignee: data.assignee,
      dueDate: data.dueDate,
      notes: data.notes,
      status: 'open',
      createdAt: timeStr
    };

    setActions(prev => [newAction, ...prev]);

    // Mark finding as having action created
    setFindings(prev => prev.map(f => {
      if (f.id === findingId) {
        return {
          ...f,
          actionCreated: true,
          actionId: newActionId
        };
      }
      return f;
    }));

    logActivity('action', `Corrective Action Created: ${data.title}`, `Assigned to ${data.assignee} with priority [${data.priority.toUpperCase()}]. Work order issued.`, 'warning');
    
    // Switch to actions tab to view the newly created ticket
    setActiveTab('actions');
  };

  const updateActionStatus = (actionId: string, status: ActionStatus, resolutionSummary?: string) => {
    const now = new Date();
    const timeStr = `Today, ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')} IST`;

    let targetAction: CorrectiveAction | undefined;

    setActions(prev => prev.map(act => {
      if (act.id === actionId) {
        targetAction = act;
        return {
          ...act,
          status,
          resolvedAt: status === 'resolved' ? timeStr : undefined,
          resolutionSummary: resolutionSummary || act.resolutionSummary
        };
      }
      return act;
    }));

    if (targetAction) {
      if (status === 'resolved') {
        // Improve asset health score
        setAssets(prev => prev.map(a => {
          if (a.id === targetAction!.assetId) {
            return {
              ...a,
              status: 'nominal',
              healthScore: 94
            };
          }
          return a;
        }));
        logActivity('action', `Action Resolved: ${targetAction.title}`, `Work order signed off by maintenance chief. Asset ${targetAction.assetName} restored to nominal status.`, 'nominal');
      } else {
        logActivity('action', `Action Updated: ${targetAction.title}`, `Status changed to [${status.toUpperCase()}].`, 'nominal');
      }
    }
  };

  // Trigger quick anomaly injection scenario for live judges presentation
  const triggerAnomalyScenario = () => {
    setSelectedAssetId('pj-204');
    setActiveTab('findings');
    setCurrentWaypointIndex(2);
    setDronePosition3D(MISSION_WAYPOINTS[2].coords3D);
    setDronePosition2D(MISSION_WAYPOINTS[2].coords2D);
    setMissionProgressPct(50);
    setCameraFeedMode('thermal');
    logActivity('detection', 'Presentation Test Scenario Triggered', 'Simulated high-pressure steam flange leak anomaly injected at PJ-204.', 'critical');
  };

  // Pitch tour navigation
  const tourStepsCount = 5;
  const nextTourStep = () => {
    setPitchTourStep(prev => {
      const next = (prev + 1) % tourStepsCount;
      syncTourStepWithApp(next);
      return next;
    });
  };

  const prevTourStep = () => {
    setPitchTourStep(prev => {
      const p = prev > 0 ? prev - 1 : tourStepsCount - 1;
      syncTourStepWithApp(p);
      return p;
    });
  };

  const jumpToTourStep = (step: number) => {
    setPitchTourStep(step);
    syncTourStepWithApp(step);
  };

  const syncTourStepWithApp = (step: number) => {
    switch(step) {
      case 0: // Executive Overview
        setActiveTab('overview');
        break;
      case 1: // 3D Digital Twin
        setActiveTab('twin');
        setTwinViewMode('3d');
        setSelectedAssetId('bf-01');
        break;
      case 2: // Mission Simulator & Telemetry
        setActiveTab('missions');
        setSelectedAssetId('pj-204');
        break;
      case 3: // AI Findings & Thermal Evidence
        setActiveTab('findings');
        setSelectedAssetId('pj-204');
        setCameraFeedMode('thermal');
        break;
      case 4: // Human Verification & Action Tracker
        setActiveTab('actions');
        break;
      default:
        break;
    }
  };

  // Global Reset Demo
  const resetDemo = () => {
    setActiveTab('overview');
    setSelectedAssetId('pj-204');
    setAssets(INITIAL_ASSETS);
    setFindings(INITIAL_FINDINGS);
    setActions(INITIAL_ACTIONS);
    setActivities(INITIAL_ACTIVITIES);
    setTwinViewMode('3d');
    setMissionStatus('idle');
    setCurrentWaypointIndex(2);
    setMissionProgressPct(55);
    setDronePosition3D(MISSION_WAYPOINTS[2].coords3D);
    setDronePosition2D(MISSION_WAYPOINTS[2].coords2D);
    setDroneTelemetry(INITIAL_TELEMETRY);
    setCameraFeedMode('thermal');
    setPitchTourActive(false);
    setPitchTourStep(0);
    logActivity('system', 'System Demo State Reset', 'Restored pristine demonstration parameters across all assets and missions.', 'nominal');
  };

  return (
    <CommandCentreContext.Provider
      value={{
        activeTab,
        setActiveTab,
        selectedAssetId,
        setSelectedAssetId,
        selectedAsset,
        assets,
        twinViewMode,
        setTwinViewMode,
        waypoints: MISSION_WAYPOINTS,
        missionStatus,
        currentWaypointIndex,
        missionProgressPct,
        missionSpeed,
        setMissionSpeed,
        startMission,
        pauseMission,
        resetMission,
        droneTelemetry,
        dronePosition3D,
        dronePosition2D,
        cameraFeedMode,
        setCameraFeedMode,
        findings,
        actions,
        activities,
        confirmFinding,
        dismissFinding,
        createAction,
        updateActionStatus,
        pitchTourActive,
        pitchTourStep,
        setPitchTourActive,
        nextTourStep,
        prevTourStep,
        jumpToTourStep,
        triggerAnomalyScenario,
        resetDemo
      }}
    >
      {children}
    </CommandCentreContext.Provider>
  );
};

export const useCommandCentre = () => {
  const context = useContext(CommandCentreContext);
  if (!context) {
    throw new Error('useCommandCentre must be used within a CommandCentreProvider');
  }
  return context;
};
