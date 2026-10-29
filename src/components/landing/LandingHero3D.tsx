/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export const LandingHero3D: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [hasWebGlError, setHasWebGlError] = useState<boolean>(false);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let renderer: THREE.WebGLRenderer | null = null;
    let frameId = 0;
    let resizeObserver: ResizeObserver | null = null;
    let handleMouseMove: ((e: MouseEvent) => void) | null = null;

    try {
      // 1. Safe WebGL availability probe (DO NOT trigger loseContext())
      const testCanvas = document.createElement('canvas');
      const gl = testCanvas.getContext('webgl2') || testCanvas.getContext('webgl');
      if (!gl) {
        throw new Error('WebGL not supported');
      }

      // Check for software GL gently without provoking context loss
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
      scene.background = new THREE.Color(0x070914);
      scene.fog = new THREE.FogExp2(0x090D1E, 0.024);

      const width = container.clientWidth || 1200;
      const height = container.clientHeight || 650;

      const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 120);
      camera.position.set(14, 11, 20);

      // Safe WebGLRenderer instantiation
      renderer = new THREE.WebGLRenderer({
        antialias: !isSoftwareGl,
        powerPreference: 'high-performance',
        alpha: true
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.25;
      renderer.shadowMap.enabled = !isSoftwareGl;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;

      container.appendChild(renderer.domElement);

      // 3. Dusk Lighting Rig (Sunset Rim + Cool Twilight Ambience)
      const ambientLight = new THREE.AmbientLight(0x13192B, 1.4);
      scene.add(ambientLight);

      const hemiLight = new THREE.HemisphereLight(0x38BDF8, 0x090D1E, 1.2);
      hemiLight.position.set(0, 30, 0);
      scene.add(hemiLight);

      const duskSun = new THREE.DirectionalLight(0xFFA351, 3.2);
      duskSun.position.set(-25, 12, -18);
      duskSun.castShadow = !isSoftwareGl;
      if (duskSun.castShadow) {
        duskSun.shadow.mapSize.width = 1024;
        duskSun.shadow.mapSize.height = 1024;
        duskSun.shadow.camera.near = 0.5;
        duskSun.shadow.camera.far = 70;
        duskSun.shadow.camera.left = -25;
        duskSun.shadow.camera.right = 25;
        duskSun.shadow.camera.top = 25;
        duskSun.shadow.camera.bottom = -25;
        duskSun.shadow.bias = -0.0004;
      }
      scene.add(duskSun);

      const cyanAccent = new THREE.DirectionalLight(0x00F2FE, 1.8);
      cyanAccent.position.set(16, 18, 14);
      scene.add(cyanAccent);

      // 4. Ground Terrain & Technical Grid Foundation
      const groundGeo = new THREE.PlaneGeometry(80, 80);
      const groundMat = new THREE.MeshStandardMaterial({
        color: 0x080C17,
        roughness: 0.88,
        metalness: 0.2
      });
      const ground = new THREE.Mesh(groundGeo, groundMat);
      ground.rotation.x = -Math.PI / 2;
      ground.receiveShadow = !isSoftwareGl;
      scene.add(ground);

      const grid1 = new THREE.GridHelper(60, 60, 0x00F2FE, 0x1E293B);
      grid1.position.y = 0.01;
      scene.add(grid1);

      const grid2 = new THREE.GridHelper(60, 240, 0x0F172A, 0x0A0F1D);
      grid2.position.y = 0.005;
      scene.add(grid2);

      // 5. Procedural Industrial Structures at Dusk
      const industrialGroup = new THREE.Group();

      // Blast Furnace Complex
      const bfGroup = new THREE.Group();
      bfGroup.position.set(-6, 0, -4);

      const bfBase = new THREE.Mesh(
        new THREE.CylinderGeometry(2.4, 2.7, 1.0, 24),
        new THREE.MeshStandardMaterial({ color: 0x222B3D, roughness: 0.9 })
      );
      bfBase.position.y = 0.5;
      bfBase.castShadow = true;
      bfGroup.add(bfBase);

      const bfBody = new THREE.Mesh(
        new THREE.CylinderGeometry(1.6, 2.2, 6.2, 24),
        new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.85, roughness: 0.35 })
      );
      bfBody.position.y = 4.1;
      bfBody.castShadow = true;
      bfGroup.add(bfBody);

      const bfTop = new THREE.Mesh(
        new THREE.CylinderGeometry(0.8, 1.5, 2.0, 16),
        new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.9, roughness: 0.25 })
      );
      bfTop.position.y = 8.2;
      bfGroup.add(bfTop);

      const beaconLight = new THREE.PointLight(0xEF4444, 2.5, 8);
      beaconLight.position.set(0, 9.5, 0);
      bfGroup.add(beaconLight);

      const beaconSphere = new THREE.Mesh(
        new THREE.SphereGeometry(0.12, 8, 8),
        new THREE.MeshBasicMaterial({ color: 0xFF3333 })
      );
      beaconSphere.position.set(0, 9.5, 0);
      bfGroup.add(beaconSphere);

      industrialGroup.add(bfGroup);

      // Steam & Gas Gantry
      const pipeGroup = new THREE.Group();
      pipeGroup.position.set(1, 0, -2);

      for (let px = -2; px <= 2; px += 2) {
        const pSupport = new THREE.Mesh(
          new THREE.BoxGeometry(0.3, 3.2, 0.3),
          new THREE.MeshStandardMaterial({ color: 0x1E293B, roughness: 0.8 })
        );
        pSupport.position.set(px, 1.6, 0);
        pipeGroup.add(pSupport);
      }

      const mainPipe = new THREE.Mesh(
        new THREE.CylinderGeometry(0.4, 0.4, 6.0, 20),
        new THREE.MeshStandardMaterial({ color: 0x64748B, metalness: 0.9, roughness: 0.2 })
      );
      mainPipe.rotation.z = Math.PI / 2;
      mainPipe.position.set(0, 3.2, 0);
      mainPipe.castShadow = true;
      pipeGroup.add(mainPipe);

      const flange = new THREE.Mesh(
        new THREE.CylinderGeometry(0.6, 0.6, 0.25, 20),
        new THREE.MeshStandardMaterial({
          color: 0xEF4444,
          emissive: 0xDC2626,
          emissiveIntensity: 0.8,
          roughness: 0.3
        })
      );
      flange.rotation.z = Math.PI / 2;
      flange.position.set(0.6, 3.2, 0);
      pipeGroup.add(flange);

      industrialGroup.add(pipeGroup);

      // Cryogenic Tanks
      const cryoGroup = new THREE.Group();
      cryoGroup.position.set(7, 0, -5);

      [-1.0, 1.0].forEach(tx => {
        const tank = new THREE.Mesh(
          new THREE.CylinderGeometry(0.7, 0.7, 4.5, 20),
          new THREE.MeshStandardMaterial({ color: 0xCBD5E1, metalness: 0.95, roughness: 0.15 })
        );
        tank.position.set(tx, 2.6, 0);
        tank.castShadow = true;
        cryoGroup.add(tank);

        const dome = new THREE.Mesh(
          new THREE.SphereGeometry(0.7, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2),
          new THREE.MeshStandardMaterial({ color: 0xCBD5E1, metalness: 0.95, roughness: 0.15 })
        );
        dome.position.set(tx, 4.85, 0);
        cryoGroup.add(dome);
      });
      industrialGroup.add(cryoGroup);

      // Hyperbolic Cooling Tower
      const ctGroup = new THREE.Group();
      ctGroup.position.set(0, 0, 8);
      const ctPoints: THREE.Vector2[] = [];
      for (let i = 0; i <= 10; i++) {
        const y = i * 0.6;
        const r = 2.6 - Math.sin((i / 10) * Math.PI) * 0.8;
        ctPoints.push(new THREE.Vector2(r, y));
      }
      const ctGeo = new THREE.LatheGeometry(ctPoints, 24);
      const ctMesh = new THREE.Mesh(
        ctGeo,
        new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.85, side: THREE.DoubleSide })
      );
      ctMesh.castShadow = true;
      ctGroup.add(ctMesh);
      industrialGroup.add(ctGroup);

      // Rolling Mill Shed
      const rmGroup = new THREE.Group();
      rmGroup.position.set(7, 0, 4);
      const rmShed = new THREE.Mesh(
        new THREE.BoxGeometry(6.0, 2.5, 3.2),
        new THREE.MeshStandardMaterial({ color: 0x1E293B, metalness: 0.5, roughness: 0.6 })
      );
      rmShed.position.y = 1.25;
      rmShed.castShadow = true;
      rmGroup.add(rmShed);
      industrialGroup.add(rmGroup);

      scene.add(industrialGroup);

      // 6. Glowing Flight Trails
      const flightPoints1 = [
        new THREE.Vector3(-10, 4.5, -8),
        new THREE.Vector3(-6, 5.2, -3),
        new THREE.Vector3(1, 4.2, -1),
        new THREE.Vector3(7, 4.8, 3),
        new THREE.Vector3(5, 5.5, -6),
        new THREE.Vector3(-10, 4.5, -8)
      ];
      const flightCurve1 = new THREE.CatmullRomCurve3(flightPoints1);
      const flightGeo1 = new THREE.TubeGeometry(flightCurve1, 80, 0.04, 8, true);
      const flightMat1 = new THREE.MeshBasicMaterial({
        color: 0x00F2FE,
        transparent: true,
        opacity: 0.65
      });
      const trail1 = new THREE.Mesh(flightGeo1, flightMat1);
      scene.add(trail1);

      const flightPoints2 = [
        new THREE.Vector3(8, 6.5, -7),
        new THREE.Vector3(10, 6.0, 2),
        new THREE.Vector3(2, 6.8, 9),
        new THREE.Vector3(-8, 6.2, 5),
        new THREE.Vector3(-9, 6.4, -6),
        new THREE.Vector3(8, 6.5, -7)
      ];
      const flightCurve2 = new THREE.CatmullRomCurve3(flightPoints2);
      const flightGeo2 = new THREE.TubeGeometry(flightCurve2, 80, 0.03, 8, true);
      const flightMat2 = new THREE.MeshBasicMaterial({
        color: 0x38BDF8,
        transparent: true,
        opacity: 0.4
      });
      const trail2 = new THREE.Mesh(flightGeo2, flightMat2);
      scene.add(trail2);

      // 7. Drone Models Helper
      function createDroneModel(rotorColor = 0x00F2FE, lightColor = 0x00F2FE) {
        const drone = new THREE.Group();
        const fuse = new THREE.Mesh(
          new THREE.BoxGeometry(0.6, 0.18, 0.6),
          new THREE.MeshStandardMaterial({ color: 0x0F172A, metalness: 0.9, roughness: 0.2 })
        );
        drone.add(fuse);

        const armMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.8, roughness: 0.3 });
        const a1 = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 1.1), armMat);
        a1.rotation.z = Math.PI / 4;
        drone.add(a1);

        const a2 = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 1.1), armMat);
        a2.rotation.z = -Math.PI / 4;
        drone.add(a2);

        const rMat = new THREE.MeshBasicMaterial({ color: rotorColor, transparent: true, opacity: 0.7 });
        const rotors: THREE.Mesh[] = [];
        [
          [-0.45, 0.1, -0.45],
          [0.45, 0.1, -0.45],
          [-0.45, 0.1, 0.45],
          [0.45, 0.1, 0.45]
        ].forEach(([rx, ry, rz]) => {
          const disc = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.015, 12), rMat);
          disc.position.set(rx, ry, rz);
          drone.add(disc);
          rotors.push(disc);
        });

        const beamGeo = new THREE.ConeGeometry(1.4, 4.0, 16, 1, true);
        const beamMat = new THREE.MeshBasicMaterial({
          color: lightColor,
          transparent: true,
          opacity: 0.15,
          side: THREE.DoubleSide,
          depthWrite: false
        });
        const beam = new THREE.Mesh(beamGeo, beamMat);
        beam.position.set(0, -2.0, 0);
        drone.add(beam);

        return { drone, rotors };
      }

      const drone1Data = createDroneModel(0x00F2FE, 0x00F2FE);
      scene.add(drone1Data.drone);

      const drone2Data = createDroneModel(0xF59E0B, 0xEF4444);
      drone2Data.drone.position.set(1.5, 4.6, -1.8);
      scene.add(drone2Data.drone);

      const drone3Data = createDroneModel(0x38BDF8, 0x38BDF8);
      scene.add(drone3Data.drone);

      // 8. Mouse Parallax
      let targetMouseX = 0;
      let targetMouseY = 0;
      let currentMouseX = 0;
      let currentMouseY = 0;

      handleMouseMove = (e: MouseEvent) => {
        const rect = container.getBoundingClientRect();
        targetMouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
        targetMouseY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      };

      window.addEventListener('mousemove', handleMouseMove);

      // 9. Animation Loop
      const clock = new THREE.Clock();

      const tick = () => {
        const elapsed = clock.getElapsedTime();

        currentMouseX += (targetMouseX - currentMouseX) * 0.04;
        currentMouseY += (targetMouseY - currentMouseY) * 0.04;

        camera.position.x = 14 + currentMouseX * 2.5;
        camera.position.y = 11 - currentMouseY * 1.5;
        camera.position.z = 20;
        camera.lookAt(0, 2.5, 0);

        const t1 = (elapsed * 0.06) % 1;
        const pos1 = flightCurve1.getPointAt(t1);
        const tangent1 = flightCurve1.getTangentAt(t1);
        drone1Data.drone.position.copy(pos1);
        drone1Data.drone.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), tangent1);

        drone2Data.drone.position.y = 4.6 + Math.sin(elapsed * 2.2) * 0.12;
        drone2Data.drone.rotation.y = Math.sin(elapsed * 1.2) * 0.3;

        const t3 = (elapsed * 0.04 + 0.5) % 1;
        const pos3 = flightCurve2.getPointAt(t3);
        const tangent3 = flightCurve2.getTangentAt(t3);
        drone3Data.drone.position.copy(pos3);
        drone3Data.drone.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), tangent3);

        drone1Data.rotors.forEach(r => (r.rotation.y += 0.5));
        drone2Data.rotors.forEach(r => (r.rotation.y += 0.45));
        drone3Data.rotors.forEach(r => (r.rotation.y += 0.5));

        if (renderer) {
          renderer.render(scene, camera);
        }
        frameId = requestAnimationFrame(tick);
      };

      frameId = requestAnimationFrame(tick);

      resizeObserver = new ResizeObserver(entries => {
        for (const entry of entries) {
          const { width: newW, height: newH } = entry.contentRect;
          if (newW > 0 && newH > 0 && renderer) {
            camera.aspect = newW / newH;
            camera.updateProjectionMatrix();
            renderer.setSize(newW, newH);
          }
        }
      });
      resizeObserver.observe(container);

    } catch (err) {
      console.warn('WebGL initialization failed, activating high-fidelity animated vector dusk scene:', err);
      setHasWebGlError(true);
    }

    return () => {
      if (frameId) cancelAnimationFrame(frameId);
      if (handleMouseMove) window.removeEventListener('mousemove', handleMouseMove);
      if (resizeObserver) resizeObserver.disconnect();
      if (renderer) {
        renderer.dispose();
        if (container && renderer.domElement && container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
        }
      }
    };
  }, []);

  // If WebGL fails or context was lost/blocked, render this gorgeous, resilient animated SVG/CSS dusk scene
  if (hasWebGlError) {
    return (
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none select-none">
        {/* Animated Twilight Dusk Sky Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#060914] via-[#0E1328] to-[#1C162E]" />
        
        {/* Distant Warm Dusk Horizon Rim Glow */}
        <div className="absolute bottom-12 inset-x-0 h-44 bg-gradient-to-t from-orange-600/20 via-amber-500/10 to-transparent blur-3xl pointer-events-none" />

        {/* High-Fidelity Vector Industrial Facility Silhouette with Atmospheric Lighting */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1200 650" preserveAspectRatio="xMidYMid slice">
          <defs>
            <linearGradient id="duskGlow" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#00F2FE" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#00F2FE" stopOpacity="0.05" />
            </linearGradient>
            <linearGradient id="sunsetRim" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#FF7A45" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#1E293B" stopOpacity="0.9" />
            </linearGradient>
            <radialGradient id="anomalyHotspot" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#EF4444" stopOpacity="0.9" />
              <stop offset="60%" stopColor="#F59E0B" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#EF4444" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Perspective Ground Grid */}
          <g opacity="0.35">
            <line x1="0" y1="480" x2="1200" y2="480" stroke="#00F2FE" strokeWidth="1" strokeDasharray="4 4" />
            <line x1="0" y1="520" x2="1200" y2="520" stroke="#334155" strokeWidth="1" />
            <line x1="0" y1="570" x2="1200" y2="570" stroke="#334155" strokeWidth="1" />
            <line x1="0" y1="630" x2="1200" y2="630" stroke="#00F2FE" strokeWidth="1" strokeOpacity="0.5" />
            {/* Perspective lines */}
            <line x1="600" y1="450" x2="100" y2="650" stroke="#1E293B" strokeWidth="1" />
            <line x1="600" y1="450" x2="350" y2="650" stroke="#1E293B" strokeWidth="1" />
            <line x1="600" y1="450" x2="600" y2="650" stroke="#00F2FE" strokeWidth="1" strokeOpacity="0.3" strokeDasharray="6 3" />
            <line x1="600" y1="450" x2="850" y2="650" stroke="#1E293B" strokeWidth="1" />
            <line x1="600" y1="450" x2="1100" y2="650" stroke="#1E293B" strokeWidth="1" />
          </g>

          {/* Plant Silhouettes at Dusk */}
          {/* Hyperbolic Cooling Tower Silhouette */}
          <path d="M 120 480 C 140 400 160 360 170 310 L 230 310 C 240 360 260 400 280 480 Z" fill="#131B2E" stroke="#1E293B" strokeWidth="1.5" />

          {/* Blast Furnace Alpha Tower */}
          <rect x="340" y="440" width="130" height="40" rx="3" fill="#182236" />
          <path d="M 360 440 L 375 220 L 435 220 L 450 440 Z" fill="url(#sunsetRim)" stroke="#334155" strokeWidth="1.5" />
          {/* Charging bell gantry */}
          <rect x="385" y="170" width="40" height="50" rx="2" fill="#25324D" stroke="#475569" strokeWidth="1.5" />
          {/* Red aviation warning light blinking */}
          <circle cx="405" cy="165" r="4" fill="#EF4444" className="animate-pulse" />
          {/* Downcomer pipe */}
          <path d="M 405 170 C 470 200 480 340 500 480" fill="none" stroke="#0284C7" strokeWidth="6" strokeLinecap="round" />

          {/* High-Pressure Gas & Steam Gantry Corridor */}
          <line x1="500" y1="380" x2="840" y2="380" stroke="#475569" strokeWidth="10" />
          <line x1="500" y1="360" x2="840" y2="360" stroke="#64748B" strokeWidth="6" />
          {/* Truss supports */}
          <rect x="540" y="380" width="12" height="100" fill="#1E293B" />
          <rect x="660" y="380" width="12" height="100" fill="#1E293B" />
          <rect x="780" y="380" width="12" height="100" fill="#1E293B" />
          {/* Flange PJ-204 with pulsating thermal hotspot */}
          <circle cx="690" cy="380" r="32" fill="url(#anomalyHotspot)" className="animate-pulse" />
          <rect x="684" y="365" width="12" height="30" rx="2" fill="#EF4444" stroke="#F87171" strokeWidth="1" />

          {/* Cryogenic Liquid Oxygen Tanks */}
          <rect x="880" y="270" width="50" height="210" rx="25" fill="#334155" stroke="#475569" strokeWidth="2" />
          <rect x="950" y="270" width="50" height="210" rx="25" fill="#334155" stroke="#475569" strokeWidth="2" />

          {/* Rolling Mill Finishing Shed */}
          <rect x="760" y="420" width="280" height="60" rx="4" fill="#182236" stroke="#334155" strokeWidth="1.5" />

          {/* Glowing Animated Flight Ribbon Trail (Curved Catmull-Rom Path) */}
          <path
            d="M 150 180 Q 400 120 700 240 T 1100 200"
            fill="none"
            stroke="#00F2FE"
            strokeWidth="2.5"
            strokeDasharray="8 6"
            opacity="0.8"
          />

          {/* Autonomous Surveillance Drone 1 (Alpha) */}
          <g transform="translate(680, 235)">
            {/* Searchlight radar cone */}
            <polygon points="0,5 -60,150 60,150" fill="url(#duskGlow)" />
            {/* Drone body */}
            <rect x="-14" y="-5" width="28" height="10" rx="3" fill="#0F172A" stroke="#00F2FE" strokeWidth="1.5" />
            <line x1="-22" y1="-5" x2="22" y2="5" stroke="#38BDF8" strokeWidth="2" />
            <line x1="-22" y1="5" x2="22" y2="-5" stroke="#38BDF8" strokeWidth="2" />
            <circle cx="-22" cy="-5" r="4" fill="#00F2FE" opacity="0.8" />
            <circle cx="22" cy="5" r="4" fill="#00F2FE" opacity="0.8" />
            <circle cx="0" cy="5" r="2.5" fill="#00F2FE" />
            {/* Tag */}
            <rect x="26" y="-12" width="90" height="18" rx="3" fill="#0B1120" stroke="#00F2FE" strokeWidth="1" />
            <text x="32" y="1" fill="#00F2FE" fontSize="9" fontFamily="monospace" fontWeight="bold">
              NETRA-ALPHA
            </text>
          </g>

          {/* Autonomous Surveillance Drone 2 (Bravo) hovering over Flange PJ-204 */}
          <g transform="translate(690, 310)">
            {/* Thermal scanning cone */}
            <polygon points="0,5 -40,70 40,70" fill="rgba(239, 68, 68, 0.15)" stroke="rgba(239, 68, 68, 0.4)" strokeDasharray="3 3" />
            <rect x="-12" y="-4" width="24" height="8" rx="2" fill="#0F172A" stroke="#EF4444" strokeWidth="1.5" />
            <circle cx="0" cy="4" r="2" fill="#EF4444" />
            <rect x="18" y="-10" width="85" height="16" rx="3" fill="#0B1120" stroke="#EF4444" strokeWidth="1" />
            <text x="24" y="2" fill="#EF4444" fontSize="8" fontFamily="monospace" fontWeight="bold">
              FLIR // NETRA-B
            </text>
          </g>

          {/* Autonomous Surveillance Drone 3 (Charlie) High Altitude */}
          <g transform="translate(240, 160)">
            <polygon points="0,5 -45,120 45,120" fill="rgba(56, 189, 248, 0.12)" />
            <rect x="-12" y="-4" width="24" height="8" rx="2" fill="#0F172A" stroke="#38BDF8" strokeWidth="1.5" />
            <circle cx="0" cy="4" r="2" fill="#38BDF8" />
            <rect x="18" y="-10" width="85" height="16" rx="3" fill="#0B1120" stroke="#38BDF8" strokeWidth="1" />
            <text x="24" y="2" fill="#38BDF8" fontSize="8" fontFamily="monospace" fontWeight="bold">
              PERIMETER // NETRA-C
            </text>
          </g>
        </svg>

        {/* Cinematic Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#070A11] via-transparent to-[#070A11]/60 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#070A11]/90 via-[#070A11]/40 to-transparent pointer-events-none" />
      </div>
    );
  }

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
      {/* 3D WebGL Canvas */}
      <div ref={mountRef} className="w-full h-full select-none" />

      {/* Atmospheric Vignette & Contrast Scrims */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#070A11] via-transparent to-[#070A11]/60 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#070A11]/90 via-[#070A11]/40 to-transparent pointer-events-none" />
    </div>
  );
};
