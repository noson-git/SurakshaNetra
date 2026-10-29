/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { useCommandCentre } from '../../context/CommandCentreContext';
import { Camera, Eye, RotateCcw, AlertTriangle, CheckCircle2, ShieldAlert } from 'lucide-react';

export const DigitalTwin3D: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const { 
    assets, 
    selectedAssetId, 
    setSelectedAssetId, 
    dronePosition3D,
    cameraFeedMode,
    setCameraFeedMode,
    setTwinViewMode
  } = useCommandCentre();

  const [activePreset, setActivePreset] = useState<string>('isometric');
  const [showWireframe, setShowWireframe] = useState<boolean>(false);
  const [isControlsCollapsed, setIsControlsCollapsed] = useState<boolean>(false);
  const [webGlFailed, setWebGlFailed] = useState<boolean>(false);

  // References to keep scene objects across renders
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const droneGroupRef = useRef<THREE.Group | null>(null);
  const assetMeshesRef = useRef<Map<string, THREE.Group>>(new Map());
  const raycasterRef = useRef<THREE.Raycaster>(new THREE.Raycaster());
  const mouseRef = useRef<THREE.Vector2>(new THREE.Vector2());

  // Target camera positions for smooth interpolation
  const targetCamPos = useRef<THREE.Vector3>(new THREE.Vector3(16, 14, 18));
  const targetLookAt = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 0));

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let renderer: THREE.WebGLRenderer | null = null;
    let frameId = 0;
    let resizeObserver: ResizeObserver | null = null;
    let handlePointerDown: ((event: MouseEvent) => void) | null = null;

    try {
      // 1. Safe probe without loseContext()
      const testCanvas = document.createElement('canvas');
      const gl = testCanvas.getContext('webgl2') || testCanvas.getContext('webgl');
      if (!gl) {
        throw new Error('WebGL not supported');
      }

      let isSoftwareGl = false;
      try {
        const ext = gl.getExtension('WEBGL_debug_renderer_info');
        const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
        const gpu = String(gl.getParameter(param));
        isSoftwareGl = /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
      } catch {
        // Fallback default
      }

    // 2. Initialize Three.js Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x070A11);
    scene.fog = new THREE.FogExp2(0x070A11, 0.022);

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 500;

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(16, 14, 18);
    cameraRef.current = camera;

    renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
      alpha: false
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    container.appendChild(renderer.domElement);

    // Studio Environment Reflection
    try {
      const pmrem = new THREE.PMREMGenerator(renderer);
      scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
      pmrem.dispose();
    } catch {
      // Fallback
    }

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.08;
    controls.maxPolarAngle = Math.PI / 2 - 0.05; // Don't go below ground
    controls.minDistance = 6;
    controls.maxDistance = 45;
    controlsRef.current = controls;

    // 3. Lighting Rig
    const ambientLight = new THREE.AmbientLight(0x1E293B, 1.2);
    scene.add(ambientLight);

    const hemiLight = new THREE.HemisphereLight(0x38BDF8, 0x0F172A, 1.4);
    hemiLight.position.set(0, 30, 0);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xF8FAFC, 2.5);
    keyLight.position.set(18, 26, 12);
    keyLight.castShadow = !isSoftwareGl;
    if (keyLight.castShadow) {
      keyLight.shadow.mapSize.width = 1024;
      keyLight.shadow.mapSize.height = 1024;
      keyLight.shadow.camera.near = 0.5;
      keyLight.shadow.camera.far = 60;
      keyLight.shadow.camera.left = -20;
      keyLight.shadow.camera.right = 20;
      keyLight.shadow.camera.top = 20;
      keyLight.shadow.camera.bottom = -20;
      keyLight.shadow.bias = -0.0005;
      keyLight.shadow.normalBias = 0.02;
    }
    scene.add(keyLight);

    const cyanRim = new THREE.DirectionalLight(0x00F2FE, 1.8);
    cyanRim.position.set(-15, 12, -15);
    scene.add(cyanRim);

    // 4. Ground Foundation & Technical Grid
    const groundGeo = new THREE.PlaneGeometry(50, 50);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x0B0F19,
      roughness: 0.85,
      metalness: 0.2
    });
    const groundMesh = new THREE.Mesh(groundGeo, groundMat);
    groundMesh.rotation.x = -Math.PI / 2;
    groundMesh.receiveShadow = !isSoftwareGl;
    scene.add(groundMesh);

    // Fine technical grid
    const gridHelper = new THREE.GridHelper(48, 48, 0x00F2FE, 0x1E293B);
    gridHelper.position.y = 0.01;
    scene.add(gridHelper);

    // Secondary sub-grid
    const subGrid = new THREE.GridHelper(48, 192, 0x0F172A, 0x111827);
    subGrid.position.y = 0.005;
    scene.add(subGrid);

    // 5. Procedural 3D Plant Models
    const assetMap = new Map<string, THREE.Group>();

    // 5A. Blast Furnace Alpha (bf-01) - 6-part procedural composite
    const bfGroup = new THREE.Group();
    bfGroup.position.set(-6, 0, -4);
    bfGroup.userData = { assetId: 'bf-01' };

    // Concrete base foundation
    const bfBase = new THREE.Mesh(
      new THREE.CylinderGeometry(2.4, 2.8, 0.8, 24),
      new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.9 })
    );
    bfBase.position.y = 0.4;
    bfBase.castShadow = true;
    bfBase.receiveShadow = true;
    bfGroup.add(bfBase);

    // Main furnace hearth & stack
    const bfBody = new THREE.Mesh(
      new THREE.CylinderGeometry(1.6, 2.2, 5.5, 24),
      new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.8, roughness: 0.35 })
    );
    bfBody.position.y = 3.55;
    bfBody.castShadow = true;
    bfGroup.add(bfBody);

    // Bustle pipe ring (tuyere hot air ring)
    const bustleRing = new THREE.Mesh(
      new THREE.TorusGeometry(2.35, 0.22, 12, 32),
      new THREE.MeshStandardMaterial({ color: 0x94A3B8, metalness: 0.9, roughness: 0.2 })
    );
    bustleRing.rotation.x = Math.PI / 2;
    bustleRing.position.y = 1.8;
    bfGroup.add(bustleRing);

    // Top charging bell gantry
    const bfTop = new THREE.Mesh(
      new THREE.CylinderGeometry(0.9, 1.6, 1.8, 16),
      new THREE.MeshStandardMaterial({ color: 0x64748B, metalness: 0.85, roughness: 0.3 })
    );
    bfTop.position.y = 7.2;
    bfGroup.add(bfTop);

    // Blast furnace gas off-take downcomer pipe
    const downcomerCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 7.8, 0),
      new THREE.Vector3(2.2, 6.5, 0),
      new THREE.Vector3(2.6, 2.5, 0),
      new THREE.Vector3(3.2, 0.8, 0)
    ]);
    const downcomerGeo = new THREE.TubeGeometry(downcomerCurve, 20, 0.25, 12, false);
    const downcomer = new THREE.Mesh(
      downcomerGeo,
      new THREE.MeshStandardMaterial({ color: 0x0284C7, metalness: 0.7, roughness: 0.3 })
    );
    bfGroup.add(downcomer);

    // Status beacon ring
    const bfBeaconGeo = new THREE.TorusGeometry(2.5, 0.06, 8, 32);
    const bfBeaconMat = new THREE.MeshBasicMaterial({ color: 0x10B981 });
    const bfBeacon = new THREE.Mesh(bfBeaconGeo, bfBeaconMat);
    bfBeacon.rotation.x = Math.PI / 2;
    bfBeacon.position.y = 0.85;
    bfBeacon.name = 'statusRing';
    bfGroup.add(bfBeacon);

    scene.add(bfGroup);
    assetMap.set('bf-01', bfGroup);

    // 5B. High-Pressure Gas & Steam Manifold (pj-204) - THE ANOMALY TARGET
    const pjGroup = new THREE.Group();
    pjGroup.position.set(1, 0, -2);
    pjGroup.userData = { assetId: 'pj-204' };

    // Structural concrete pillars
    for (let i = -1.6; i <= 1.6; i += 1.6) {
      const pillar = new THREE.Mesh(
        new THREE.BoxGeometry(0.35, 2.4, 0.35),
        new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.9 })
      );
      pillar.position.set(i, 1.2, 0);
      pillar.castShadow = true;
      pjGroup.add(pillar);
    }

    // Heavy gantry truss beam
    const gantryBeam = new THREE.Mesh(
      new THREE.BoxGeometry(4.2, 0.3, 0.7),
      new THREE.MeshStandardMaterial({ color: 0x1E293B, metalness: 0.6, roughness: 0.4 })
    );
    gantryBeam.position.set(0, 2.4, 0);
    pjGroup.add(gantryBeam);

    // Main high-pressure distribution header (Piping)
    const mainPipe = new THREE.Mesh(
      new THREE.CylinderGeometry(0.38, 0.38, 4.4, 24),
      new THREE.MeshStandardMaterial({ color: 0x64748B, metalness: 0.9, roughness: 0.25 })
    );
    mainPipe.rotation.z = Math.PI / 2;
    mainPipe.position.set(0, 2.85, 0);
    mainPipe.castShadow = true;
    pjGroup.add(mainPipe);

    // Secondary steam header parallel pipe
    const steamPipe = new THREE.Mesh(
      new THREE.CylinderGeometry(0.24, 0.24, 4.0, 16),
      new THREE.MeshStandardMaterial({ color: 0x94A3B8, metalness: 0.85, roughness: 0.3 })
    );
    steamPipe.rotation.z = Math.PI / 2;
    steamPipe.position.set(0, 3.4, 0);
    pjGroup.add(steamPipe);

    // Flange Joint PJ-204 (The critical anomaly point)
    const flangeRing = new THREE.Mesh(
      new THREE.CylinderGeometry(0.55, 0.55, 0.2, 24),
      new THREE.MeshStandardMaterial({ 
        color: 0xEF4444, 
        emissive: 0xDC2626, 
        emissiveIntensity: 0.6,
        roughness: 0.4 
      })
    );
    flangeRing.rotation.z = Math.PI / 2;
    flangeRing.position.set(0.4, 2.85, 0);
    pjGroup.add(flangeRing);

    // Glowing thermal anomaly marker ring around PJ-204
    const pjBeaconGeo = new THREE.TorusGeometry(1.8, 0.08, 8, 32);
    const pjBeaconMat = new THREE.MeshBasicMaterial({ color: 0xEF4444 });
    const pjBeacon = new THREE.Mesh(pjBeaconGeo, pjBeaconMat);
    pjBeacon.rotation.x = Math.PI / 2;
    pjBeacon.position.y = 0.05;
    pjBeacon.name = 'statusRing';
    pjGroup.add(pjBeacon);

    scene.add(pjGroup);
    assetMap.set('pj-204', pjGroup);

    // 5C. Continuous Slab Casting Complex (sc-03)
    const scGroup = new THREE.Group();
    scGroup.position.set(-5, 0, 4);
    scGroup.userData = { assetId: 'sc-03' };

    // Industrial casting bay enclosure
    const scHall = new THREE.Mesh(
      new THREE.BoxGeometry(4.2, 2.6, 2.8),
      new THREE.MeshStandardMaterial({ color: 0x1E293B, metalness: 0.5, roughness: 0.6 })
    );
    scHall.position.y = 1.3;
    scHall.castShadow = true;
    scGroup.add(scHall);

    // Ladle turret assembly top
    const scTurret = new THREE.Mesh(
      new THREE.CylinderGeometry(0.8, 0.9, 1.2, 16),
      new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.8, roughness: 0.3 })
    );
    scTurret.position.set(-1.2, 3.2, 0);
    scGroup.add(scTurret);

    // Outfeed roller conveyor
    const rollerBed = new THREE.Mesh(
      new THREE.BoxGeometry(2.4, 0.4, 1.2),
      new THREE.MeshStandardMaterial({ color: 0x0F172A, roughness: 0.8 })
    );
    rollerBed.position.set(3.0, 0.4, 0);
    scGroup.add(rollerBed);

    const scBeaconGeo = new THREE.TorusGeometry(2.4, 0.06, 8, 32);
    const scBeaconMat = new THREE.MeshBasicMaterial({ color: 0x10B981 });
    const scBeacon = new THREE.Mesh(scBeaconGeo, scBeaconMat);
    scBeacon.rotation.x = Math.PI / 2;
    scBeacon.position.y = 0.05;
    scBeacon.name = 'statusRing';
    scGroup.add(scBeacon);

    scene.add(scGroup);
    assetMap.set('sc-03', scGroup);

    // 5D. Hot Strip Rolling Mill Bay (rm-02)
    const rmGroup = new THREE.Group();
    rmGroup.position.set(6, 0, 3);
    rmGroup.userData = { assetId: 'rm-02' };

    // Main long mill shed
    const rmShed = new THREE.Mesh(
      new THREE.BoxGeometry(5.4, 2.4, 2.6),
      new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.4, roughness: 0.5 })
    );
    rmShed.position.y = 1.2;
    rmShed.castShadow = true;
    rmGroup.add(rmShed);

    // Stand housings
    for (let s = -1.8; s <= 1.8; s += 0.9) {
      const stand = new THREE.Mesh(
        new THREE.BoxGeometry(0.4, 1.8, 1.8),
        new THREE.MeshStandardMaterial({ color: 0x64748B, metalness: 0.8, roughness: 0.3 })
      );
      stand.position.set(s, 1.6, 0);
      rmGroup.add(stand);
    }

    const rmBeaconGeo = new THREE.TorusGeometry(3.0, 0.06, 8, 32);
    const rmBeaconMat = new THREE.MeshBasicMaterial({ color: 0xF59E0B }); // Warning status
    const rmBeacon = new THREE.Mesh(rmBeaconGeo, rmBeaconMat);
    rmBeacon.rotation.x = Math.PI / 2;
    rmBeacon.position.y = 0.05;
    rmBeacon.name = 'statusRing';
    rmGroup.add(rmBeacon);

    scene.add(rmGroup);
    assetMap.set('rm-02', rmGroup);

    // 5E. Cryogenic Liquid Oxygen Silos (co-05)
    const coGroup = new THREE.Group();
    coGroup.position.set(7, 0, -5);
    coGroup.userData = { assetId: 'co-05' };

    // Concrete bund wall
    const bundWall = new THREE.Mesh(
      new THREE.BoxGeometry(3.6, 0.6, 3.0),
      new THREE.MeshStandardMaterial({ color: 0x1E293B, roughness: 0.9 })
    );
    bundWall.position.y = 0.3;
    coGroup.add(bundWall);

    // Twin vertical cryogenic tanks
    [-0.9, 0.9].forEach(offsetX => {
      const tankBody = new THREE.Mesh(
        new THREE.CylinderGeometry(0.65, 0.65, 4.0, 20),
        new THREE.MeshStandardMaterial({ color: 0xE2E8F0, metalness: 0.95, roughness: 0.15 })
      );
      tankBody.position.set(offsetX, 2.4, 0);
      tankBody.castShadow = true;
      coGroup.add(tankBody);

      const domeTop = new THREE.Mesh(
        new THREE.SphereGeometry(0.65, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2),
        new THREE.MeshStandardMaterial({ color: 0xE2E8F0, metalness: 0.95, roughness: 0.15 })
      );
      domeTop.position.set(offsetX, 4.4, 0);
      coGroup.add(domeTop);
    });

    const coBeaconGeo = new THREE.TorusGeometry(2.0, 0.06, 8, 32);
    const coBeaconMat = new THREE.MeshBasicMaterial({ color: 0x10B981 });
    const coBeacon = new THREE.Mesh(coBeaconGeo, coBeaconMat);
    coBeacon.rotation.x = Math.PI / 2;
    coBeacon.position.y = 0.05;
    coBeacon.name = 'statusRing';
    coGroup.add(coBeacon);

    scene.add(coGroup);
    assetMap.set('co-05', coGroup);

    // 5F. Hyperbolic Cooling Tower Beta (ct-04)
    const ctGroup = new THREE.Group();
    ctGroup.position.set(0, 0, 7);
    ctGroup.userData = { assetId: 'ct-04' };

    // Hyperbolic shell geometry via lathe
    const towerPoints: THREE.Vector2[] = [];
    for (let deg = 0; deg <= 10; deg++) {
      const y = deg * 0.55;
      // Hyperbolic profile
      const r = 2.4 - Math.sin((deg / 10) * Math.PI) * 0.75;
      towerPoints.push(new THREE.Vector2(r, y));
    }
    const towerGeo = new THREE.LatheGeometry(towerPoints, 24);
    const towerMat = new THREE.MeshStandardMaterial({
      color: 0x475569,
      roughness: 0.8,
      side: THREE.DoubleSide
    });
    const towerMesh = new THREE.Mesh(towerGeo, towerMat);
    towerMesh.castShadow = true;
    ctGroup.add(towerMesh);

    const ctBeaconGeo = new THREE.TorusGeometry(2.6, 0.06, 8, 32);
    const ctBeaconMat = new THREE.MeshBasicMaterial({ color: 0x10B981 });
    const ctBeacon = new THREE.Mesh(ctBeaconGeo, ctBeaconMat);
    ctBeacon.rotation.x = Math.PI / 2;
    ctBeacon.position.y = 0.05;
    ctBeacon.name = 'statusRing';
    ctGroup.add(ctBeacon);

    scene.add(ctGroup);
    assetMap.set('ct-04', ctGroup);

    assetMeshesRef.current = assetMap;

    // 6. Drone 3D Representation (Composite Quad-VTOL Model)
    const drone = new THREE.Group();
    droneGroupRef.current = drone;
    drone.position.set(dronePosition3D[0], dronePosition3D[1], dronePosition3D[2]);

    // Central avionics fuselage
    const fuselage = new THREE.Mesh(
      new THREE.BoxGeometry(0.7, 0.22, 0.7),
      new THREE.MeshStandardMaterial({ color: 0x0F172A, metalness: 0.9, roughness: 0.2 })
    );
    drone.add(fuselage);

    // 4 Carbon-fibre rotor arms
    const armMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.8, roughness: 0.3 });
    const arm1 = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 1.4), armMat);
    arm1.rotation.z = Math.PI / 4;
    drone.add(arm1);

    const arm2 = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 1.4), armMat);
    arm2.rotation.z = -Math.PI / 4;
    drone.add(arm2);

    // Propeller discs (translucent spinning disc effect)
    const rotorMat = new THREE.MeshBasicMaterial({ color: 0x00F2FE, transparent: true, opacity: 0.6 });
    [
      [-0.55, 0.12, -0.55],
      [0.55, 0.12, -0.55],
      [-0.55, 0.12, 0.55],
      [0.55, 0.12, 0.55]
    ].forEach(([rx, ry, rz]) => {
      const disc = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.02, 16), rotorMat);
      disc.position.set(rx, ry, rz);
      drone.add(disc);
    });

    // Optical/Thermal Gimbal camera pod
    const gimbal = new THREE.Mesh(
      new THREE.SphereGeometry(0.18, 12, 12),
      new THREE.MeshStandardMaterial({ color: 0x06B6D4, metalness: 0.95, roughness: 0.1 })
    );
    gimbal.position.set(0, -0.15, 0.2);
    drone.add(gimbal);

    // Cyan surveillance spotlight cone
    const spotGeo = new THREE.ConeGeometry(1.6, 4.0, 16, 1, true);
    const spotMat = new THREE.MeshBasicMaterial({
      color: 0x00F2FE,
      transparent: true,
      opacity: 0.15,
      side: THREE.DoubleSide,
      depthWrite: false
    });
    const spotCone = new THREE.Mesh(spotGeo, spotMat);
    spotCone.position.set(0, -2.0, 0);
    drone.add(spotCone);

    scene.add(drone);

    // 7. Raycasting for Asset Selection on Canvas Click
    handlePointerDown = (event: MouseEvent) => {
      if (!renderer) return;
      const rect = renderer.domElement.getBoundingClientRect();
      mouseRef.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouseRef.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycasterRef.current.setFromCamera(mouseRef.current, camera);
      const intersects = raycasterRef.current.intersectObjects(scene.children, true);

      for (const hit of intersects) {
        // Walk up to find asset group
        let curr: THREE.Object3D | null = hit.object;
        while (curr && curr !== scene) {
          if (curr.userData && curr.userData.assetId) {
            setSelectedAssetId(curr.userData.assetId);
            return;
          }
          curr = curr.parent;
        }
      }
    };

    renderer.domElement.addEventListener('pointerdown', handlePointerDown);

    // 8. Animation & Render Loop
    const clock = new THREE.Clock();

    function tick() {
      const delta = clock.getDelta();

      // Smooth camera interpolation towards target
      if (cameraRef.current && controlsRef.current) {
        cameraRef.current.position.lerp(targetCamPos.current, 0.05);
        controlsRef.current.target.lerp(targetLookAt.current, 0.05);
        controlsRef.current.update();
      }

      // Rotate rotor effects
      if (droneGroupRef.current) {
        // Subtle hover bob
        const elapsed = clock.getElapsedTime();
        droneGroupRef.current.rotation.y = Math.sin(elapsed * 2) * 0.08;
      }

      if (renderer) {
        renderer.render(scene, camera);
      }
      frameId = requestAnimationFrame(tick);
    }

    frameId = requestAnimationFrame(tick);

    // Resize Observer
    resizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        const { width: newWidth, height: newHeight } = entry.contentRect;
        if (newWidth > 0 && newHeight > 0 && cameraRef.current && rendererRef.current) {
          cameraRef.current.aspect = newWidth / newHeight;
          cameraRef.current.updateProjectionMatrix();
          rendererRef.current.setSize(newWidth, newHeight);
        }
      }
    });
    resizeObserver.observe(container);

    } catch (err) {
      console.warn('WebGL initialization failed in DigitalTwin3D, fallback available:', err);
      setWebGlFailed(true);
    }

    return () => {
      if (frameId) cancelAnimationFrame(frameId);
      if (resizeObserver) resizeObserver.disconnect();
      if (renderer) {
        if (handlePointerDown && renderer.domElement) {
          renderer.domElement.removeEventListener('pointerdown', handlePointerDown);
        }
        renderer.dispose();
        if (container && renderer.domElement && container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
        }
      }
    };
  }, [setSelectedAssetId]);

  // Synchronize dynamic asset status colors and selection ring
  useEffect(() => {
    assets.forEach(asset => {
      const group = assetMeshesRef.current.get(asset.id);
      if (!group) return;

      const ring = group.getObjectByName('statusRing') as THREE.Mesh;
      if (ring && ring.material instanceof THREE.MeshBasicMaterial) {
        if (asset.id === selectedAssetId) {
          ring.material.color.setHex(0x00F2FE); // Cyan for selected
          ring.scale.set(1.2, 1.2, 1.2);
        } else if (asset.status === 'critical') {
          ring.material.color.setHex(0xEF4444); // Crimson
          ring.scale.set(1.0, 1.0, 1.0);
        } else if (asset.status === 'warning') {
          ring.material.color.setHex(0xF59E0B); // Amber
          ring.scale.set(1.0, 1.0, 1.0);
        } else {
          ring.material.color.setHex(0x10B981); // Emerald
          ring.scale.set(1.0, 1.0, 1.0);
        }
      }
    });
  }, [assets, selectedAssetId]);

  // Synchronize drone position
  useEffect(() => {
    if (droneGroupRef.current) {
      droneGroupRef.current.position.set(
        dronePosition3D[0],
        dronePosition3D[1],
        dronePosition3D[2]
      );
    }
  }, [dronePosition3D]);

  // Handle camera preset view switches
  const handlePresetSelect = (preset: string) => {
    setActivePreset(preset);
    switch (preset) {
      case 'isometric':
        targetCamPos.current.set(16, 14, 18);
        targetLookAt.current.set(0, 0, 0);
        break;
      case 'bf':
        targetCamPos.current.set(-1, 8, 3);
        targetLookAt.current.set(-6, 3, -4);
        setSelectedAssetId('bf-01');
        break;
      case 'manifold':
        targetCamPos.current.set(4, 5, 2);
        targetLookAt.current.set(1, 2.8, -2);
        setSelectedAssetId('pj-204');
        break;
      case 'mill':
        targetCamPos.current.set(11, 6, 8);
        targetLookAt.current.set(6, 1.5, 3);
        setSelectedAssetId('rm-02');
        break;
      case 'topdown':
        targetCamPos.current.set(0, 28, 0.1);
        targetLookAt.current.set(0, 0, 0);
        break;
    }
  };

  if (webGlFailed) {
    return (
      <div className="relative w-full h-full min-h-[540px] bg-[#070A11] rounded-xl overflow-hidden border border-slate-800 flex flex-col items-center justify-center p-8 text-center">
        <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-4">
          <ShieldAlert className="w-7 h-7" />
        </div>
        <h3 className="text-lg font-bold text-white">WebGL Digital Twin Acceleration Suspended</h3>
        <p className="text-xs text-slate-400 max-w-md mt-2 leading-relaxed">
          Hardware WebGL context allocation is currently restricted in this browser environment. You can seamlessly inspect the interactive 2D CAD Vector Blueprint with full equipment telemetry.
        </p>
        <button
          onClick={() => setTwinViewMode('2d')}
          className="mt-5 px-5 py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs transition-colors cursor-pointer"
        >
          Switch to 2D CAD Vector Blueprint
        </button>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full min-h-[540px] bg-[#070A11] rounded-xl overflow-hidden border border-slate-800">
      {/* 3D WebGL Canvas Mount Container */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top Left Spec / Spatial Info HUD */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-1 pointer-events-none">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/90 border border-slate-700/80 backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-cyan-400" />
          <span className="text-xs font-semibold uppercase tracking-wider text-cyan-300">
            3D Isometric Digital Twin
          </span>
          <span className="text-slate-600">·</span>
          <span className="text-xs font-mono text-slate-400">WebGL PBR Rig</span>
        </div>
        <p className="text-[11px] font-mono text-slate-400 px-1">
          Left-click + drag to orbit · Right-click to pan · Scroll to zoom · Click asset to inspect
        </p>
      </div>

      {/* Top Right Active Drone Tracking Badge */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-2 bg-slate-900/90 border border-slate-800 px-3 py-1.5 rounded-lg pointer-events-auto">
        <span className="text-xs font-mono text-cyan-400">NETRA-VTOL-X4</span>
        <span className="text-slate-600">·</span>
        <span className="text-xs font-mono text-slate-300 tabular-nums">
          XYZ: [{dronePosition3D[0].toFixed(1)}, {dronePosition3D[1].toFixed(1)}, {dronePosition3D[2].toFixed(1)}]
        </span>
      </div>

      {/* Collapsible Unified Bottom Control Dock (Zero Viewport Occlusion) */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 w-[95%] max-w-2xl pointer-events-auto transition-transform duration-300">
        <div className="flex flex-col items-center">
          {/* Collapse/Expand Toggle Tab */}
          <button
            onClick={() => setIsControlsCollapsed(!isControlsCollapsed)}
            className="px-3 py-1 text-[11px] font-medium text-slate-400 hover:text-slate-200 bg-slate-900/95 border-t border-x border-slate-700 rounded-t-md transition-colors"
          >
            {isControlsCollapsed ? '▲ Show Camera & View Controls' : '▼ Hide Controls'}
          </button>

          {!isControlsCollapsed && (
            <div className="w-full p-2.5 rounded-xl bg-slate-900/95 border border-slate-700/80 backdrop-blur-md shadow-2xl flex flex-wrap items-center justify-between gap-3">
              {/* Camera Presets Segmented Buttons */}
              <div className="flex items-center gap-1 bg-slate-950/80 p-1 rounded-lg border border-slate-800">
                <span className="text-[11px] font-medium text-slate-400 px-2 flex items-center gap-1">
                  <Camera className="w-3.5 h-3.5 text-cyan-400" /> Presets:
                </span>
                <button
                  onClick={() => handlePresetSelect('isometric')}
                  className={`px-2.5 py-1 text-xs font-medium rounded transition-colors ${
                    activePreset === 'isometric'
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Isometric
                </button>
                <button
                  onClick={() => handlePresetSelect('manifold')}
                  className={`px-2.5 py-1 text-xs font-medium rounded transition-colors ${
                    activePreset === 'manifold'
                      ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Manifold PJ-204
                </button>
                <button
                  onClick={() => handlePresetSelect('bf')}
                  className={`px-2.5 py-1 text-xs font-medium rounded transition-colors ${
                    activePreset === 'bf'
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Blast Furnace
                </button>
                <button
                  onClick={() => handlePresetSelect('mill')}
                  className={`px-2.5 py-1 text-xs font-medium rounded transition-colors ${
                    activePreset === 'mill'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Rolling Mill
                </button>
                <button
                  onClick={() => handlePresetSelect('topdown')}
                  className={`px-2.5 py-1 text-xs font-medium rounded transition-colors ${
                    activePreset === 'topdown'
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Top-Down
                </button>
              </div>

              {/* Reset Orbit Button */}
              <button
                onClick={() => handlePresetSelect('isometric')}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors border border-slate-700"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset View
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
