import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Cpu, Wifi, Activity, Layers, ShieldCheck, Sparkles } from 'lucide-react';

export default function Campus3DVisual({ className = '' }) {
  const containerRef = useRef(null);
  const [webglError, setWebglError] = useState(false);
  const [activeMetric, setActiveMetric] = useState(0);

  const metrics = [
    { label: 'Campus IoT Mesh', value: '1,420 Nodes Active', status: 'Optimal' },
    { label: 'Cloud Gateway', value: '99.98% SLA', status: 'Live' },
    { label: 'Academic Sync', value: '< 12ms Latency', status: 'Synchronized' },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveMetric((prev) => (prev + 1) % metrics.length);
    }, 3800);
    return () => clearInterval(timer);
  }, [metrics.length]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Check WebGL support
    try {
      const testCanvas = document.createElement('canvas');
      const gl = testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl');
      if (!gl) {
        setWebglError(true);
        return;
      }
    } catch {
      setWebglError(true);
      return;
    }

    let width = container.clientWidth || 500;
    let height = container.clientHeight || 450;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    // Soft atmospheric fog
    scene.fog = new THREE.FogExp2(0x0a1128, 0.045);

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 4.2, 9.2);
    camera.lookAt(0, 0.8, 0);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.appendChild(renderer.domElement);

    // Master Campus Group
    const campusGroup = new THREE.Group();
    scene.add(campusGroup);

    // 2. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0x60a5fa, 3.2);
    mainLight.position.set(6, 12, 8);
    scene.add(mainLight);

    const rimLight = new THREE.DirectionalLight(0x818cf8, 2.5);
    rimLight.position.set(-8, 6, -5);
    scene.add(rimLight);

    const pointLight = new THREE.PointLight(0x38bdf8, 4.5, 12);
    pointLight.position.set(0, 2, 0);
    scene.add(pointLight);

    // 3. Digital Campus Map Base & Circular Plinth
    const baseGroup = new THREE.Group();
    campusGroup.add(baseGroup);

    // Octagonal / Cylindrical Tech Pedestal
    const baseGeo = new THREE.CylinderGeometry(3.6, 3.9, 0.35, 48);
    const baseMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.25,
      metalness: 0.85,
    });
    const baseMesh = new THREE.Mesh(baseGeo, baseMat);
    baseMesh.position.y = -0.18;
    baseGroup.add(baseMesh);

    // Top Glowing Bevel Ring
    const ringPlinthGeo = new THREE.TorusGeometry(3.62, 0.04, 16, 64);
    const ringPlinthMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
    const ringPlinth = new THREE.Mesh(ringPlinthGeo, ringPlinthMat);
    ringPlinth.rotation.x = Math.PI / 2;
    ringPlinth.position.y = 0.01;
    baseGroup.add(ringPlinth);

    // Concentric Inner Glowing Pulse Rings
    const innerRingGeo1 = new THREE.RingGeometry(2.1, 2.15, 48);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x60a5fa,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.65,
    });
    const innerRing1 = new THREE.Mesh(innerRingGeo1, ringMat);
    innerRing1.rotation.x = -Math.PI / 2;
    innerRing1.position.y = 0.02;
    baseGroup.add(innerRing1);

    const innerRingGeo2 = new THREE.RingGeometry(1.2, 1.24, 32);
    const ringMat2 = new THREE.MeshBasicMaterial({
      color: 0x818cf8,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.5,
    });
    const innerRing2 = new THREE.Mesh(innerRingGeo2, ringMat2);
    innerRing2.rotation.x = -Math.PI / 2;
    innerRing2.position.y = 0.025;
    baseGroup.add(innerRing2);

    // Grid on the base
    const gridHelper = new THREE.GridHelper(6.5, 20, 0x38bdf8, 0x1e293b);
    gridHelper.position.y = 0.015;
    baseGroup.add(gridHelper);

    // 4. Modern Campus Architectural Buildings
    const buildingsGroup = new THREE.Group();
    campusGroup.add(buildingsGroup);

    // Materials
    const glassBuildingMat = new THREE.MeshStandardMaterial({
      color: 0x1e3a8a,
      roughness: 0.15,
      metalness: 0.7,
      transparent: true,
      opacity: 0.88,
    });

    const windowLouverMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x38bdf8,
      emissiveIntensity: 0.35,
      roughness: 0.2,
      metalness: 0.5,
    });

    const techAccentMat = new THREE.MeshStandardMaterial({
      color: 0x2563eb,
      metalness: 0.8,
      roughness: 0.2,
    });

    // A. Central Administration & Innovation Tower (Multi-tier)
    const towerGroup = new THREE.Group();
    towerGroup.position.set(0, 0, 0);

    // Main Tower Base
    const towerGeo1 = new THREE.BoxGeometry(1.1, 2.2, 1.1);
    const tower1 = new THREE.Mesh(towerGeo1, glassBuildingMat);
    tower1.position.y = 1.1;
    towerGroup.add(tower1);

    // Mid Tower Step
    const towerGeo2 = new THREE.BoxGeometry(0.85, 1.1, 0.85);
    const tower2 = new THREE.Mesh(towerGeo2, techAccentMat);
    tower2.position.y = 2.45;
    towerGroup.add(tower2);

    // Top Tower Crown
    const towerGeo3 = new THREE.BoxGeometry(0.6, 0.6, 0.6);
    const tower3 = new THREE.Mesh(towerGeo3, glassBuildingMat);
    tower3.position.y = 3.1;
    towerGroup.add(tower3);

    // Illuminated vertical strips
    for (let s = 0; s < 4; s++) {
      const stripGeo = new THREE.BoxGeometry(0.04, 1.8, 0.04);
      const strip = new THREE.Mesh(stripGeo, windowLouverMat);
      const angle = (s * Math.PI) / 2;
      strip.position.set(Math.cos(angle) * 0.56, 1.1, Math.sin(angle) * 0.56);
      towerGroup.add(strip);
    }

    // Communication Mast / Spire
    const spireGeo = new THREE.CylinderGeometry(0.02, 0.05, 0.8, 8);
    const spireMat = new THREE.MeshStandardMaterial({ color: 0x93c5fd, metalness: 0.9 });
    const spire = new THREE.Mesh(spireGeo, spireMat);
    spire.position.y = 3.7;
    towerGroup.add(spire);

    // Beacon light at spire top
    const beaconGeo = new THREE.SphereGeometry(0.06, 12, 12);
    const beaconMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
    const beacon = new THREE.Mesh(beaconGeo, beaconMat);
    beacon.position.y = 4.1;
    towerGroup.add(beacon);

    buildingsGroup.add(towerGroup);

    // B. Academic Wing North (Engineering & Computing Sciences)
    const wingNorthGroup = new THREE.Group();
    wingNorthGroup.position.set(-1.8, 0, -0.6);
    const wingNorthGeo = new THREE.BoxGeometry(1.2, 1.4, 0.8);
    const wingNorth = new THREE.Mesh(wingNorthGeo, glassBuildingMat);
    wingNorth.position.y = 0.7;
    wingNorth.rotation.y = 0.25;
    wingNorthGroup.add(wingNorth);

    // Louvered roof canopy
    const canopyGeo = new THREE.BoxGeometry(1.35, 0.08, 0.95);
    const canopy = new THREE.Mesh(canopyGeo, techAccentMat);
    canopy.position.y = 1.45;
    canopy.rotation.y = 0.25;
    wingNorthGroup.add(canopy);
    buildingsGroup.add(wingNorthGroup);

    // C. Academic Wing South (Management & Humanities)
    const wingSouthGroup = new THREE.Group();
    wingSouthGroup.position.set(1.7, 0, -0.5);
    const wingSouthGeo = new THREE.BoxGeometry(1.1, 1.2, 0.9);
    const wingSouth = new THREE.Mesh(wingSouthGeo, glassBuildingMat);
    wingSouth.position.y = 0.6;
    wingSouth.rotation.y = -0.3;
    wingSouthGroup.add(wingSouth);
    buildingsGroup.add(wingSouthGroup);

    // D. Digital Library & Research Rotunda (Geodesic Dome)
    const rotundaGroup = new THREE.Group();
    rotundaGroup.position.set(-0.9, 0, 1.6);
    const rotundaBaseGeo = new THREE.CylinderGeometry(0.7, 0.75, 0.4, 24);
    const rotundaBase = new THREE.Mesh(rotundaBaseGeo, techAccentMat);
    rotundaBase.position.y = 0.2;
    rotundaGroup.add(rotundaBase);

    const domeGeo = new THREE.SphereGeometry(0.65, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    const domeMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      roughness: 0.1,
      metalness: 0.6,
      transparent: true,
      opacity: 0.75,
    });
    const dome = new THREE.Mesh(domeGeo, domeMat);
    dome.position.y = 0.4;
    rotundaGroup.add(dome);
    buildingsGroup.add(rotundaGroup);

    // E. Tech Pavilion & Smart Auditorium
    const techPavilionGroup = new THREE.Group();
    techPavilionGroup.position.set(1.2, 0, 1.4);
    const pavGeo = new THREE.BoxGeometry(0.9, 0.5, 1.1);
    const pavMesh = new THREE.Mesh(pavGeo, techAccentMat);
    pavMesh.position.y = 0.25;
    pavMesh.rotation.y = 0.35;
    techPavilionGroup.add(pavMesh);

    // Angled Solar glass roof
    const solarGeo = new THREE.BoxGeometry(1.0, 0.05, 1.2);
    const solarMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      metalness: 0.9,
      roughness: 0.1,
    });
    const solar = new THREE.Mesh(solarGeo, solarMat);
    solar.position.set(0, 0.55, 0);
    solar.rotation.set(0.15, 0.35, -0.1);
    techPavilionGroup.add(solar);
    buildingsGroup.add(techPavilionGroup);

    // 5. Dynamic Digital Screens / Holographic Dashboards in 3D Space
    const createDashboardTexture = (title, sub, metric) => {
      const cvs = document.createElement('canvas');
      cvs.width = 512;
      cvs.height = 256;
      const ctx = cvs.getContext('2d');

      // Gradient background
      const grad = ctx.createLinearGradient(0, 0, 512, 256);
      grad.addColorStop(0, 'rgba(15, 23, 42, 0.92)');
      grad.addColorStop(1, 'rgba(30, 58, 138, 0.92)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 512, 256);

      // Cyan Border
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 6;
      ctx.strokeRect(6, 6, 500, 244);

      // Header Tag
      ctx.fillStyle = '#60a5fa';
      ctx.font = 'bold 22px monospace';
      ctx.fillText(title.toUpperCase(), 28, 48);

      // Value
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 44px sans-serif';
      ctx.fillText(metric, 28, 115);

      // Subtitle
      ctx.fillStyle = '#94a3b8';
      ctx.font = '24px sans-serif';
      ctx.fillText(sub, 28, 165);

      // Progress / Status indicator bar
      ctx.fillStyle = 'rgba(56, 189, 248, 0.3)';
      ctx.fillRect(28, 195, 456, 14);
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(28, 195, 380, 14);

      const texture = new THREE.CanvasTexture(cvs);
      texture.needsUpdate = true;
      return texture;
    };

    // Holographic Screen 1: Academic AI Core Telemetry
    const dashTex1 = createDashboardTexture('AI Campus Core', 'Realtime Sync Active', '99.8% Uptime');
    const dashGeo1 = new THREE.PlaneGeometry(1.6, 0.8);
    const dashMat1 = new THREE.MeshBasicMaterial({
      map: dashTex1,
      transparent: true,
      opacity: 0.92,
      side: THREE.DoubleSide,
    });
    const dashMesh1 = new THREE.Mesh(dashGeo1, dashMat1);
    dashMesh1.position.set(-1.6, 2.5, 1.2);
    dashMesh1.rotation.set(-0.1, 0.45, 0.05);
    campusGroup.add(dashMesh1);

    // Holographic Screen 2: Realtime Campus IoT Mesh
    const dashTex2 = createDashboardTexture('IoT Sensor Mesh', 'Connected Facilities', '1,420 Nodes');
    const dashMat2 = new THREE.MeshBasicMaterial({
      map: dashTex2,
      transparent: true,
      opacity: 0.9,
      side: THREE.DoubleSide,
    });
    const dashMesh2 = new THREE.Mesh(dashGeo1, dashMat2);
    dashMesh2.position.set(1.7, 2.3, 0.9);
    dashMesh2.rotation.set(-0.15, -0.4, -0.05);
    campusGroup.add(dashMesh2);

    // 6. Connected Device Spline Curves & Travelling Data Pulses
    // Connecting paths between the central tower and the four buildings
    const connections = [
      { start: new THREE.Vector3(0, 1.5, 0), end: new THREE.Vector3(-1.8, 1.0, -0.6), color: 0x38bdf8 },
      { start: new THREE.Vector3(0, 1.5, 0), end: new THREE.Vector3(1.7, 0.9, -0.5), color: 0x60a5fa },
      { start: new THREE.Vector3(0, 1.5, 0), end: new THREE.Vector3(-0.9, 0.6, 1.6), color: 0x818cf8 },
      { start: new THREE.Vector3(0, 1.5, 0), end: new THREE.Vector3(1.2, 0.5, 1.4), color: 0x38bdf8 },
    ];

    const dataSplineCurves = [];
    const dataPackets = [];

    connections.forEach((conn) => {
      // Arc curve midpoint with elevation
      const mid = new THREE.Vector3()
        .addVectors(conn.start, conn.end)
        .multiplyScalar(0.5);
      mid.y += 0.8;

      const curve = new THREE.QuadraticBezierCurve3(conn.start, mid, conn.end);
      dataSplineCurves.push(curve);

      // Glowing tube representation
      const tubeGeo = new THREE.TubeGeometry(curve, 32, 0.018, 8, false);
      const tubeMat = new THREE.MeshBasicMaterial({
        color: conn.color,
        transparent: true,
        opacity: 0.55,
      });
      const tube = new THREE.Mesh(tubeGeo, tubeMat);
      campusGroup.add(tube);

      // Travelling data pulse packet
      const packetGeo = new THREE.SphereGeometry(0.06, 12, 12);
      const packetMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const packet = new THREE.Mesh(packetGeo, packetMat);
      campusGroup.add(packet);
      dataPackets.push({ mesh: packet, curve, progress: Math.random() });
    });

    // 7. Floating Central AI Core Crystal (Above Central Spire)
    const aiCoreGroup = new THREE.Group();
    aiCoreGroup.position.set(0, 4.4, 0);

    const octGeo = new THREE.OctahedronGeometry(0.24, 0);
    const octMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x2563eb,
      emissiveIntensity: 0.8,
      roughness: 0.1,
      metalness: 0.9,
    });
    const octMesh = new THREE.Mesh(octGeo, octMat);
    aiCoreGroup.add(octMesh);

    // AI Core Outer Wireframe Halo
    const icosaWireGeo = new THREE.IcosahedronGeometry(0.42, 1);
    const icosaWireMat = new THREE.MeshBasicMaterial({
      color: 0x93c5fd,
      wireframe: true,
      transparent: true,
      opacity: 0.45,
    });
    const icosaWire = new THREE.Mesh(icosaWireGeo, icosaWireMat);
    aiCoreGroup.add(icosaWire);
    campusGroup.add(aiCoreGroup);

    // 8. Orbiting Student & Faculty Academic Telemetry Nodes
    const orbitalGroup = new THREE.Group();
    campusGroup.add(orbitalGroup);

    // Inclined Orbit Ring 1
    const orbitRingGeo1 = new THREE.TorusGeometry(2.9, 0.015, 16, 120);
    const orbitRingMat1 = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.4,
    });
    const orbitRing1 = new THREE.Mesh(orbitRingGeo1, orbitRingMat1);
    orbitRing1.rotation.x = Math.PI / 3;
    orbitRing1.position.y = 1.8;
    orbitalGroup.add(orbitRing1);

    // Orbit Ring 2
    const orbitRingGeo2 = new THREE.TorusGeometry(3.3, 0.015, 16, 120);
    const orbitRingMat2 = new THREE.MeshBasicMaterial({
      color: 0xa855f7,
      transparent: true,
      opacity: 0.35,
    });
    const orbitRing2 = new THREE.Mesh(orbitRingGeo2, orbitRingMat2);
    orbitRing2.rotation.x = -Math.PI / 3.4;
    orbitRing2.rotation.y = 0.5;
    orbitRing2.position.y = 2.0;
    orbitalGroup.add(orbitRing2);

    // Orbiting Academic Nodes
    const orbitalNodes = [];
    const nodeColors = [0x38bdf8, 0x60a5fa, 0x34d399, 0xf59e0b, 0xa855f7];
    for (let i = 0; i < 5; i++) {
      const nGeo = new THREE.SphereGeometry(0.1, 16, 16);
      const nMat = new THREE.MeshStandardMaterial({
        color: nodeColors[i],
        emissive: nodeColors[i],
        emissiveIntensity: 0.6,
        roughness: 0.2,
      });
      const node = new THREE.Mesh(nGeo, nMat);
      orbitalGroup.add(node);
      orbitalNodes.push({
        mesh: node,
        radius: 2.8 + (i % 2) * 0.5,
        speed: 0.35 + i * 0.12,
        phase: (i / 5) * Math.PI * 2,
        incline: i % 2 === 0 ? 0.35 : -0.4,
      });
    }

    // 9. Floating Background Particle Dust
    const pCount = 180;
    const pPositions = new Float32Array(pCount * 3);
    for (let i = 0; i < pCount * 3; i += 3) {
      pPositions[i] = (Math.random() - 0.5) * 12;
      pPositions[i + 1] = Math.random() * 7 - 0.5;
      pPositions[i + 2] = (Math.random() - 0.5) * 12;
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPositions, 3));
    const pMat = new THREE.PointsMaterial({
      size: 0.045,
      color: 0x93c5fd,
      transparent: true,
      opacity: 0.5,
    });
    const particles = new THREE.Points(pGeo, pMat);
    scene.add(particles);

    // 10. Smooth Parallax & Mouse Interactivity
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / height) * 2 - 1);
      mouseX = x * 0.35;
      mouseY = y * 0.25;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Responsive Resize Handler
    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth;
      height = container.clientHeight;
      if (width && height) {
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
      }
    };
    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animId;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Smooth parallax damping
      targetX += (mouseX - targetX) * 0.04;
      targetY += (mouseY - targetY) * 0.04;

      // Base campus slow majestic rotation + mouse tilt
      campusGroup.rotation.y = elapsed * 0.15 + targetX;
      campusGroup.rotation.x = 0.08 + targetY * 0.3;

      // Floating gentle oscillation
      campusGroup.position.y = Math.sin(elapsed * 1.2) * 0.06;

      // Pulse Central AI Core
      aiCoreGroup.rotation.y = elapsed * 0.8;
      aiCoreGroup.rotation.x = Math.sin(elapsed * 0.5) * 0.2;
      icosaWire.rotation.y = -elapsed * 0.5;
      const coreScale = 1 + Math.sin(elapsed * 2.5) * 0.06;
      octMesh.scale.set(coreScale, coreScale, coreScale);

      // Dashboards subtle hover float
      dashMesh1.position.y = 2.5 + Math.sin(elapsed * 1.6) * 0.04;
      dashMesh2.position.y = 2.3 + Math.cos(elapsed * 1.4) * 0.04;

      // Animate Travelling Data Packets along splines
      dataPackets.forEach((dp) => {
        dp.progress = (dp.progress + 0.006) % 1;
        const pt = dp.curve.getPointAt(dp.progress);
        dp.mesh.position.copy(pt);
      });

      // Animate Orbiting Academic Nodes
      orbitalNodes.forEach((node) => {
        const angle = elapsed * node.speed + node.phase;
        const x = Math.cos(angle) * node.radius;
        const z = Math.sin(angle) * node.radius;
        const y = Math.sin(angle * 1.2) * node.incline;
        node.mesh.position.set(x, 1.9 + y, z);
      });

      // Rotate background particle dust
      particles.rotation.y = elapsed * 0.02;

      // Render
      renderer.render(scene, camera);
    };

    animate();

    // Clean up
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);

      if (container && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }

      scene.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
          if (Array.isArray(obj.material)) {
            obj.material.forEach((m) => m.dispose());
          } else {
            obj.material.dispose();
          }
        }
      });
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full min-h-[380px] md:min-h-[460px] flex items-center justify-center select-none ${className}`}
    >
      {/* Fallback in case WebGL is unavailable */}
      {webglError ? (
        <div className="flex flex-col items-center justify-center p-8 text-center bg-slate-900/90 backdrop-blur-md rounded-2xl border border-blue-500/30 text-white w-full h-full">
          <Layers className="w-16 h-16 text-blue-400 mb-4 animate-bounce" />
          <h4 className="text-lg font-bold">Interactive Digital Campus Hub</h4>
          <p className="text-xs text-slate-400 mt-2 max-w-sm">
            AI-driven campus orchestration, bio-metric attendance, real-time timetable telemetry, and automated workflows.
          </p>
          <div className="flex items-center gap-2 mt-4 px-3 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-xs text-blue-300">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-400" /> Digital Twin Online
          </div>
        </div>
      ) : null}

      {/* Floating Glass Micro-HUD Top Badge */}
      <div className="absolute top-3 left-3 z-10 pointer-events-none">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/75 backdrop-blur-md border border-blue-400/30 shadow-lg text-white">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-[11px] font-mono font-medium tracking-wide text-blue-200">
            DIGITAL TWIN • 3D ACTIVE
          </span>
        </div>
      </div>

      {/* Floating Dynamic Metric Widget (Bottom Right) */}
      <div className="absolute bottom-3 right-3 z-10 pointer-events-none max-w-[210px]">
        <div className="p-2.5 rounded-xl bg-slate-900/80 backdrop-blur-md border border-slate-700/60 shadow-xl text-white transition-all duration-300">
          <div className="flex items-center justify-between text-[10px] text-blue-300 mb-1">
            <span className="flex items-center gap-1 font-semibold">
              <Activity className="w-3 h-3 text-cyan-400" /> {metrics[activeMetric].label}
            </span>
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
              {metrics[activeMetric].status}
            </span>
          </div>
          <div className="text-xs font-mono font-bold text-white tracking-wide">
            {metrics[activeMetric].value}
          </div>
        </div>
      </div>

      {/* Subtle Bottom-Left Quick Indicator */}
      <div className="absolute bottom-3 left-3 z-10 pointer-events-none hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-lg bg-slate-900/70 backdrop-blur-sm border border-slate-800 text-[10px] text-slate-300">
        <Wifi className="w-3 h-3 text-emerald-400" />
        <span>Connected Gateway: <strong className="text-white">Active</strong></span>
      </div>
    </div>
  );
}
