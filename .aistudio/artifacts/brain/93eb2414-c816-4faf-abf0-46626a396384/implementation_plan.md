# SURAKSHA NETRA: Industrial Autonomous Drone Surveillance Command Centre

A presentation-ready, cinematic industrial command centre concept prototype built for a state-level startup competition demonstration, showcasing autonomous aerial monitoring, 3D WebGL isometric digital-twin visualization, synthetic anomaly detection, and closed-loop human verification workflows for an advanced metallurgical and heavy manufacturing plant.

> [!IMPORTANT] Critical Confirmed Architectural & User Decisions
> - **Facility Type**: Advanced Metallurgical and Heavy Manufacturing Plant (featuring high-capacity blast furnaces, rolling mill bays, cryogenic gas tanks, high-pressure steam pipelines, and hazardous casting zones).
> - **3D Isometric Digital Twin**: Real-time Three.js WebGL scene with procedural geometry, PBR studio lighting, orbit/zoom controls, synchronized asset selection, and contact grounding (zero unhosted 3D asset dependencies).
> - **Presentation Assist Modes**: Dual-mode system combining an automated pitch tour (auto-pilot mission with auto-pause at anomaly detection) and operator-grade manual controls with rapid scenario injection triggers.
> - **Strict Prototyping Boundaries**: All metrics, AI scores, telemetry streams, and thermal imagery are clearly identified as simulated concept data for presentation purposes.

---

### 1. Overview & Core Concept

**SURAKSHA NETRA** (meaning *Safety Eye* / *Protective Vision*) simulates the next-generation drone-in-a-box command centre deployed across critical industrial infrastructure. In heavy metallurgical complexes, manual inspection of high-temperature smelting zones, structural piping racks, and elevated cooling towers poses severe personnel risk and downtime costs. 

SURAKSHA NETRA solves this by orchestrating autonomous drone surveillance sorties, synchronizing live telemetry with a high-fidelity 3D digital twin, detecting structural anomalies via computer vision models, and enabling instant human verification with auditable corrective action tracking.

---

### 2. User Experience & Visual Design

#### A. Cinematic Industrial Aesthetic
- **Color Discipline (60-30-10)**:
  - *60% Deep Canvas*: Midnight obsidian (`#070A11`), deep aerospace navy (`#0B1120`), and charcoal structural tones (`#111827`).
  - *30% Structural Surfaces*: Subtle hairline borders (`rgba(255, 255, 255, 0.08)`), dark matte panels with subtle elevation (`#141E33`), and crisp slate typography.
  - *10% High-Intent Accents*: Electric cyan (`#00F2FE`) for active drone paths and telemetry, safety amber (`#F59E0B`) for warnings, and controlled crimson (`#EF4444`) for critical structural anomalies.
- **Typography**: Display typography using `Plus Jakarta Sans` for command headers; data grids and telemetry using `IBM Plex Mono` / `tabular-nums` for rock-solid tabular alignment.
- **Zero-Slop Restraint**: No decorative green pulse dots, no fake compiler code comments (`// 01`), no pill sandwich badges, and clean unboxed metadata with typographic separators.

#### B. Primary Navigation & 5 Core Workspaces
1. **Overview (Mission Control Command)**:
   - High-level plant status ticker, active drone sortie metrics (flight hours, battery, coverage %, inspection anomalies detected).
   - 4-quadrant layout: Facility health matrix, real-time alert feed, live sortie HUD preview, and recent operational activity log.
2. **Facility Digital Twin (Dual 3D / 2D)**:
   - **3D Isometric WebGL Viewport**: Procedural 3D models of Blast Furnace Alpha, Hot Rolling Mill Bay, Cryogenic Liquid Oxygen Silos, Main High-Pressure Gas Manifold, and Slag Casting Restricted Zone.
   - **2D Technical CAD Sitemap**: High-contrast coordinate grid, sector zones (North Smelting, East Rolling, South Utility), drone patrol flightpath, and clickable asset nodes.
   - Synchronized two-way selection: selecting an asset in 3D immediately highlights it in 2D and opens the technical specifications drawer (temperature, vibration, pressure, operating hours, inspection history).
3. **Drone Missions (Sortie Simulator)**:
   - Autonomous sortie planner (Sortie NETRA-04: Perimeter & Thermal Structural Sweep).
   - Mission controls: Start Sortie, Pause, Fast-Forward (2x/4x), and Reset Sortie.
   - Presentation assist toggles: "Guided Startup Pitch Tour" (auto-narrated step-by-step) vs "Manual Operator Console".
   - Live drone telemetry HUD: Altitude (AGL), ground speed, GPS coordinate drift, battery depletion rate, gimbal pitch/yaw, waypoint progress (WP1 to WP5), and simulated optical/thermal dual-feed overlay.
4. **AI Findings (Synthetic Anomaly Evidence Suite)**:
   - Deep inspection report of detected anomaly: *High-Pressure Steam Flange Thermal Anomaly & Micro-Fissure Corrosion* at Pipeline Junction PJ-204.
   - Side-by-side evidence inspection: Synthetic optical zoom capture and calibrated thermal thermography view with isotherms and crosshair temperature differential (+78°C delta).
   - Clear simulated metadata badges (Simulated AI Confidence: 94.8%, Risk Tier: High, Structural Degradation Index: Grade 3).
5. **Action Tracker (Human-in-the-Loop Governance)**:
   - End-to-end corrective action lifecycle:
     - Review Anomaly -> Human Decision (Confirm as True Hazard / Dismiss as Benign Flare)
     - Ticket creation modal: Assign Field Engineer (e.g., Rajesh Kumar - Chief Piping Engineer), Priority (Critical / Urgent / Routine), Scheduled Work Order, and Mitigation Protocol.
     - Status updates: Open -> In Progress -> Maintenance Verified -> Resolved.
   - Real-time updates reflected across alert count badges, facility asset health score, and global timeline.
   - One-click "Reset Demo" button in header to instantly restore pristine initial state for consecutive pitch rehearsals.

---

### 3. Key Product Decisions & Trade-Offs

- **Decision 1: Direct Three.js Integration (Canvas + OrbitControls) with React Wrapper**
  - *Chosen Approach*: Implement a custom Three.js renderer inside a controlled React `useRef` container using procedural geometries, `RoomEnvironment`, soft directional shadows, and pointer raycasting.
  - *Why*: Eliminates complex third-party R3F version conflicts with React 19 while guaranteeing 60fps performance, custom isometric projection, and zero broken external 3D asset dependencies.
- **Decision 2: Local Deterministic Simulation Engine**
  - *Chosen Approach*: A comprehensive, pure TypeScript state manager with time-stepped simulation ticks, waypoint interpolation, simulated telemetry noise, and persistent action log.
  - *Why*: Zero backend or API keys required, lightning-fast boot time, and 100% reliable execution during live in-person competition pitching without internet dropouts.
- **Decision 3: Integrated Dual Evidence Presentation (Optical + Thermal)**
  - *Chosen Approach*: Canvas-rendered procedural thermographic heatmaps combined with high-contrast macro inspection imagery, complete with simulated measurement calipers and temperature scale legend.
  - *Why*: Provides the authentic aerospace/industrial visual credibility judges look for, explicitly distinguished as concept simulation.

---

### 4. Technical Architecture & System Data Flow

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                 SURAKSHA NETRA SHELL                                   │
│  ┌─────────────────────────┐  ┌─────────────────────────────────────────────────────┐  │
│  │    Header & Telemetry   │  │ Plant Status: Nominal | Active Drone: Eagle-1 (88%) │  │
│  │   [Reset Demo Control]  │  │ Mode: Pitch Tour / Operator | Global Alert Counter  │  │
│  └─────────────────────────┘  └─────────────────────────────────────────────────────┘  │
└───────────────────────────────────────────┬────────────────────────────────────────────┘
                                            │
                     ┌──────────────────────┴──────────────────────┐
                     ▼                                             ▼
       ┌───────────────────────────┐                 ┌───────────────────────────┐
       │   Navigation Sidebar      │                 │   Dynamic Workspace Area  │
       │   • 01 Overview           │                 │                           │
       │   • 02 Facility Twin      │                 │  [Active View Routing]    │
       │   • 03 Drone Missions     │◄───────────────►│  • Overview Dashboard     │
       │   • 04 AI Findings        │                 │  • Twin (3D / 2D Canvas)  │
       │   • 05 Action Tracker     │                 │  • Mission Simulator HUD  │
       │   [Pitch Tour Controls]   │                 │  • Anomaly Evidence View  │
       └───────────────────────────┘                 │  • Work Order Governance  │
                                                     └─────────────┬─────────────┘
                                                                   │
                                            ┌──────────────────────┴──────────────────────┐
                                            ▼                                             ▼
                               ┌───────────────────────────┐                 ┌───────────────────────────┐
                               │  Simulation & Mission     │                 │   Asset & Finding Store   │
                               │  - Waypoint Progress (0%) │                 │   - 6 Key Heavy Plant     │
                               │  - Drone Physics / Telemetry                │     Industrial Assets     │
                               │  - Autonomous Path Ticks  │◄───────────────►│   - Anomaly Evidence Hub  │
                               │  - Audio/Visual Triggers  │                 │   - Corrective Work Orders│
                               └───────────────────────────┘                 └───────────────────────────┘
```

#### State Management Entities
- `FacilityAsset`: ID, Name, Type (BlastFurnace, RollingMill, CryoTank, GasManifold, SlagCasting), HealthScore (0-100), Status (Nominal, Warning, Critical), Specs (Temp, Pressure, Vibration), Coordinates (3D & 2D).
- `DroneMission`: MissionID, DroneModel (Netra-VTOL-X4), FlightMode (Manual / Autonomous), CurrentWaypoint, TotalWaypoints, BatteryPct, AltitudeM, SpeedKmh, FlightTimeSec, EventLog.
- `InspectionFinding`: FindingID, AssetID, Timestamp, AnomalyType, Severity, ConfidenceScore, ThermographyData, MitigationChecklist, HumanReviewStatus (Pending / Confirmed / Dismissed).
- `CorrectiveAction`: ActionID, FindingID, Title, Assignee, Priority, ScheduledDate, ResolutionNotes, Status (Open / In_Progress / Resolved).

---

### 5. Implementation Steps

1. **Step 1: Core Foundation & Styling Setup**
   - Install `three` and `@types/three` for the 3D isometric digital twin.
   - Configure global aerospace color tokens, fonts, and dark theme variables in `src/index.css` and `index.html`.
   - Update `metadata.json` and page titles with SURAKSHA NETRA branding.
2. **Step 2: Simulation Engine & Mock Industrial State Store**
   - Implement `src/types/index.ts` containing strict TypeScript definitions.
   - Implement `src/data/mockFacilityData.ts` with industrial heavy manufacturing equipment, waypoints, telemetry streams, and synthetic anomaly dataset.
   - Build `src/context/CommandCentreContext.tsx` managing global state (selected asset, mission progress, anomaly review status, action tickets, pitch tour step).
3. **Step 3: Facility Digital Twin (Three.js WebGL 3D & 2D Sitemap)**
   - Build `src/components/twin/DigitalTwin3D.tsx`: Three.js procedural isometric scene with blast furnace towers, piping racks, gas tanks, animated heat convection particles, grounded grid plane, and asset click raycasting.
   - Build `src/components/twin/Sitemap2D.tsx`: Clean technical CAD vector layout with sector boundaries, live drone breadcrumb trail, and checkpoint coordinates.
   - Build `src/components/twin/AssetDetailDrawer.tsx`: Technical slide-out panel with live telemetry meters and maintenance log.
4. **Step 4: Drone Mission Simulator & Flight Telemetry HUD**
   - Build `src/components/missions/MissionControlPanel.tsx`: Start/Pause/Reset controls, speed toggles, waypoint checklist, and simulated gimbal viewfinder.
   - Build `src/components/missions/DroneCameraHUD.tsx`: Live simulated optical camera feed with crosshair targeting, thermal false-color toggle, and telemetry overlay.
   - Implement presentation assist mode (Guided Pitch Tour with synchronized modal callouts).
5. **Step 5: Synthetic Anomaly Evidence Suite & Human Verification Workflow**
   - Build `src/components/findings/AnomalyEvidenceViewer.tsx`: High-resolution synthetic thermal inspection comparison, temperature histogram, and simulated detection breakdown.
   - Build `src/components/actions/ActionTrackerView.tsx`: Full human-in-the-loop review workflow, ticket assignment dialog, status transitions, and audit trail.
   - Build `src/components/overview/OverviewDashboard.tsx`: Executive status overview combining KPI cards, active alerts, and quick launch triggers.
6. **Step 6: Verification & Polish**
   - Test compilation with `compile_applet` and fix all linting/typing issues.
   - Verify responsiveness on standard desktop presentation displays (1440px) down to laptop viewports.
