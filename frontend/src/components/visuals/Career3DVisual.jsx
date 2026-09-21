import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Briefcase, CheckCircle2, TrendingUp, Sparkles, Building2, Search, FileText } from 'lucide-react';

export default function Career3DVisual({ className = '' }) {
  const containerRef = useRef(null);
  const [webglError, setWebglError] = useState(false);
  const [activeStage, setActiveStage] = useState(0);

  const stages = [
    { label: 'Job Search', desc: 'AI-Powered Keyword & Skill Matching', icon: Search, color: '#38bdf8' },
    { label: 'Job Match', desc: '98% Compatibility with Top Roles', icon: CheckCircle2, color: '#34d399' },
    { label: 'Application', desc: 'Direct One-Click Recruiter Pipeline', icon: FileText, color: '#818cf8' },
    { label: 'Career Growth', desc: 'Accelerated Professional Milestone', icon: TrendingUp, color: '#f59e0b' },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStage((prev) => (prev + 1) % stages.length);
    }, 3600);
    return () => clearInterval(interval);
  }, [stages.length]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Verify WebGL availability
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

    let width = container.clientWidth || 540;
    let height = container.clientHeight || 480;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(44, width / height, 0.1, 100);
    camera.position.set(0, 3.8, 9.4);
    camera.lookAt(0, 0.6, 0);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // Master Career Group
    const masterGroup = new THREE.Group();
    scene.add(masterGroup);

    // 2. Lighting System
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0x38bdf8, 3.5);
    keyLight.position.set(5, 10, 7);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x818cf8, 2.6);
    fillLight.position.set(-6, 5, -4);
    scene.add(fillLight);

    const bottomGlow = new THREE.PointLight(0x0284c7, 3.8, 10);
    bottomGlow.position.set(0, 1.2, 1);
    scene.add(bottomGlow);

    // 3. Base Platform / Pedestal
    const baseGroup = new THREE.Group();
    masterGroup.add(baseGroup);

    // Sleek chamfered circular base
    const baseGeo = new THREE.CylinderGeometry(3.6, 3.9, 0.28, 48);
    const baseMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      metalness: 0.85,
      roughness: 0.2,
    });
    const baseMesh = new THREE.Mesh(baseGeo, baseMat);
    baseMesh.position.y = -0.15;
    baseGroup.add(baseMesh);

    // Glowing Cyan Trim Ring
    const ringGeo = new THREE.TorusGeometry(3.64, 0.035, 16, 64);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = Math.PI / 2;
    ringMesh.position.y = 0.01;
    baseGroup.add(ringMesh);

    // Digital grid helper
    const gridHelper = new THREE.GridHelper(6.4, 18, 0x38bdf8, 0x1e293b);
    gridHelper.position.y = 0.015;
    baseGroup.add(gridHelper);

    // 4. Centerpiece: 3D Laptop with Glowing Screen
    const laptopGroup = new THREE.Group();
    laptopGroup.position.set(0, 0.4, 0.4);

    // Laptop Base / Keyboard deck
    const deckGeo = new THREE.BoxGeometry(2.4, 0.08, 1.6);
    const metalMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      metalness: 0.8,
      roughness: 0.25,
    });
    const laptopDeck = new THREE.Mesh(deckGeo, metalMat);
    laptopDeck.position.y = 0.04;
    laptopGroup.add(laptopDeck);

    // Trackpad
    const padGeo = new THREE.PlaneGeometry(0.7, 0.45);
    const padMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.5 });
    const trackpad = new THREE.Mesh(padGeo, padMat);
    trackpad.rotation.x = -Math.PI / 2;
    trackpad.position.set(0, 0.085, 0.4);
    laptopGroup.add(trackpad);

    // Laptop Screen Lid (Angled 105 degrees)
    const lidGroup = new THREE.Group();
    lidGroup.position.set(0, 0.08, -0.78);
    lidGroup.rotation.x = -0.28; // Tilted slightly backwards

    const lidGeo = new THREE.BoxGeometry(2.4, 1.5, 0.06);
    const lidBack = new THREE.Mesh(lidGeo, metalMat);
    lidBack.position.set(0, 0.75, 0);
    lidGroup.add(lidBack);

    // Dynamic Canvas Texture for Laptop Screen Display
    const createScreenTexture = () => {
      const cvs = document.createElement('canvas');
      cvs.width = 1024;
      cvs.height = 640;
      const ctx = cvs.getContext('2d');

      // Gradient background
      const grad = ctx.createLinearGradient(0, 0, 1024, 640);
      grad.addColorStop(0, '#0a192f');
      grad.addColorStop(0.5, '#0f172a');
      grad.addColorStop(1, '#1e1b4b');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 1024, 640);

      // Top window bar
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(0, 0, 1024, 60);
      ctx.fillStyle = '#ef4444';
      ctx.beginPath(); ctx.arc(36, 30, 9, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath(); ctx.arc(68, 30, 9, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#10b981';
      ctx.beginPath(); ctx.arc(100, 30, 9, 0, Math.PI * 2); ctx.fill();

      // Search bar inside UI
      ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.roundRect(140, 14, 520, 34, 8);
      ctx.fill();
      ctx.fillStyle = '#94a3b8';
      ctx.font = 'bold 18px sans-serif';
      ctx.fillText('🔍 Search Senior Full-Stack Engineer, AI...', 160, 38);

      // Main Job Match Banner
      ctx.fillStyle = 'rgba(14, 135, 234, 0.15)';
      ctx.strokeStyle = '#0284c7';
      ctx.lineWidth = 3;
      ctx.roundRect(40, 90, 944, 180, 16);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 24px monospace';
      ctx.fillText('★ 98% JOB COMPATIBILITY MATCH', 70, 135);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 36px sans-serif';
      ctx.fillText('Senior Cloud & Full-Stack Architect', 70, 185);

      ctx.fillStyle = '#cbd5e1';
      ctx.font = '20px sans-serif';
      ctx.fillText('Verified Enterprise Partner  •  Remote  •  Competitive Package', 70, 230);

      // Pipeline Stages Matrix
      const stagesList = ['01 Search', '02 Match', '03 Applied', '04 Interview', '05 Offer'];
      stagesList.forEach((st, idx) => {
        const x = 40 + idx * 194;
        ctx.fillStyle = idx <= 2 ? 'rgba(56, 189, 248, 0.2)' : 'rgba(255, 255, 255, 0.05)';
        ctx.strokeStyle = idx <= 2 ? '#38bdf8' : '#334155';
        ctx.lineWidth = 2;
        ctx.roundRect(x, 300, 175, 110, 12);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = idx <= 2 ? '#38bdf8' : '#64748b';
        ctx.font = 'bold 18px sans-serif';
        ctx.fillText(st, x + 20, 345);

        ctx.fillStyle = '#94a3b8';
        ctx.font = '14px sans-serif';
        ctx.fillText(idx <= 2 ? 'Completed ✓' : 'In Progress', x + 20, 380);
      });

      // Bottom Code / Telemetry Graph
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(40, 560);
      ctx.bezierCurveTo(240, 530, 380, 480, 540, 490);
      ctx.bezierCurveTo(700, 500, 800, 440, 984, 430);
      ctx.stroke();

      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 18px monospace';
      ctx.fillText('CAREER VELOCITY METRICS: +142% HIRED CONFIDENCE', 40, 610);

      const tex = new THREE.CanvasTexture(cvs);
      tex.needsUpdate = true;
      return tex;
    };

    const screenGeo = new THREE.PlaneGeometry(2.28, 1.38);
    const screenMat = new THREE.MeshBasicMaterial({
      map: createScreenTexture(),
      side: THREE.DoubleSide,
    });
    const laptopScreen = new THREE.Mesh(screenGeo, screenMat);
    laptopScreen.position.set(0, 0.75, 0.035);
    lidGroup.add(laptopScreen);
    laptopGroup.add(lidGroup);
    masterGroup.add(laptopGroup);

    // 5. 3D Executive Briefcase (Right Foreground)
    const briefcaseGroup = new THREE.Group();
    briefcaseGroup.position.set(1.9, 0.5, 0.8);
    briefcaseGroup.rotation.set(0, -0.4, 0.1);

    // Body
    const caseGeo = new THREE.BoxGeometry(0.95, 0.7, 0.28);
    const caseMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.35,
      metalness: 0.6,
    });
    const caseMesh = new THREE.Mesh(caseGeo, caseMat);
    briefcaseGroup.add(caseMesh);

    // Chrome Clasps
    const claspMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.9, roughness: 0.1 });
    const clasp1 = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.1, 0.3), claspMat);
    clasp1.position.set(-0.25, 0.15, 0);
    briefcaseGroup.add(clasp1);

    const clasp2 = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.1, 0.3), claspMat);
    clasp2.position.set(0.25, 0.15, 0);
    briefcaseGroup.add(clasp2);

    // Handle
    const handleGeo = new THREE.TorusGeometry(0.18, 0.035, 12, 24, Math.PI);
    const handle = new THREE.Mesh(handleGeo, claspMat);
    handle.position.set(0, 0.38, 0);
    briefcaseGroup.add(handle);
    masterGroup.add(briefcaseGroup);

    // 6. 3D Resume / CV Tablet (Left Foreground)
    const resumeGroup = new THREE.Group();
    resumeGroup.position.set(-1.9, 0.6, 0.7);
    resumeGroup.rotation.set(0.15, 0.45, -0.08);

    const resumeGeo = new THREE.BoxGeometry(0.85, 1.15, 0.04);
    const resumeMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.2,
      metalness: 0.7,
    });
    const resumeMesh = new THREE.Mesh(resumeGeo, resumeMat);
    resumeGroup.add(resumeMesh);

    // Holographic lines on the resume
    for (let r = 0; r < 5; r++) {
      const lineGeo = new THREE.PlaneGeometry(0.65 - (r % 2) * 0.15, 0.035);
      const lineMat = new THREE.MeshBasicMaterial({ color: r === 0 ? 0x38bdf8 : 0x64748b });
      const line = new THREE.Mesh(lineGeo, lineMat);
      line.position.set(-0.04, 0.32 - r * 0.14, 0.025);
      resumeGroup.add(line);
    }
    masterGroup.add(resumeGroup);

    // 7. Corporate Headquarters Glass Tower (Backdrop Pillar)
    const buildingGroup = new THREE.Group();
    buildingGroup.position.set(-1.8, 0, -1.4);

    const bldgGeo = new THREE.BoxGeometry(1.2, 2.6, 1.0);
    const bldgMat = new THREE.MeshStandardMaterial({
      color: 0x0a66c2,
      roughness: 0.15,
      metalness: 0.8,
      transparent: true,
      opacity: 0.82,
    });
    const building = new THREE.Mesh(bldgGeo, bldgMat);
    building.position.y = 1.3;
    buildingGroup.add(building);

    // Rooftop Spire & Beacon
    const spireGeo = new THREE.CylinderGeometry(0.02, 0.05, 0.7, 8);
    const spireMat = new THREE.MeshStandardMaterial({ color: 0x93c5fd, metalness: 0.9 });
    const spire = new THREE.Mesh(spireGeo, spireMat);
    spire.position.y = 2.95;
    buildingGroup.add(spire);

    const beaconGeo = new THREE.SphereGeometry(0.06, 12, 12);
    const beaconMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
    const beacon = new THREE.Mesh(beaconGeo, beaconMat);
    beacon.position.y = 3.3;
    buildingGroup.add(beacon);
    masterGroup.add(buildingGroup);

    // 8. Career Growth Trajectory Spline & Travelling Energy Packet
    const curvePoints = [
      new THREE.Vector3(-2.2, 0.4, 0.5),
      new THREE.Vector3(-1.0, 1.6, 0.2),
      new THREE.Vector3(0.4, 2.3, -0.4),
      new THREE.Vector3(1.8, 3.2, -1.0),
    ];
    const curve = new THREE.CatmullRomCurve3(curvePoints);

    const tubeGeo = new THREE.TubeGeometry(curve, 48, 0.025, 8, false);
    const tubeMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.6,
    });
    const trajectoryTube = new THREE.Mesh(tubeGeo, tubeMat);
    masterGroup.add(trajectoryTube);

    // Travelling energy pulse on trajectory
    const pulseGeo = new THREE.SphereGeometry(0.08, 16, 16);
    const pulseMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const pulseMesh = new THREE.Mesh(pulseGeo, pulseMat);
    masterGroup.add(pulseMesh);
    let pulseProgress = 0;

    // 9. Orbiting Skill Badges (React, Python, Cloud, AI)
    const skillsGroup = new THREE.Group();
    masterGroup.add(skillsGroup);

    const skillNodes = [];
    const skillColors = [0x38bdf8, 0x60a5fa, 0xa855f7, 0x34d399];
    for (let s = 0; s < 4; s++) {
      const sGeo = new THREE.OctahedronGeometry(0.16, 0);
      const sMat = new THREE.MeshStandardMaterial({
        color: skillColors[s],
        emissive: skillColors[s],
        emissiveIntensity: 0.6,
        roughness: 0.2,
      });
      const sMesh = new THREE.Mesh(sGeo, sMat);
      skillsGroup.add(sMesh);
      skillNodes.push({
        mesh: sMesh,
        radius: 2.7,
        speed: 0.45 + s * 0.1,
        angle: (s * Math.PI) / 2,
        heightOffset: 1.8 + (s % 2) * 0.4,
      });
    }

    // 10. Subtle Floating Particle Dust
    const pCount = 140;
    const pPositions = new Float32Array(pCount * 3);
    for (let i = 0; i < pCount * 3; i += 3) {
      pPositions[i] = (Math.random() - 0.5) * 10;
      pPositions[i + 1] = Math.random() * 6 - 0.5;
      pPositions[i + 2] = (Math.random() - 0.5) * 10;
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPositions, 3));
    const pMat = new THREE.PointsMaterial({
      size: 0.045,
      color: 0x93c5fd,
      transparent: true,
      opacity: 0.45,
    });
    const particles = new THREE.Points(pGeo, pMat);
    scene.add(particles);

    // Mouse Parallax
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / height) * 2 - 1);
      mouseX = x * 0.32;
      mouseY = y * 0.22;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Resize Handler
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

      // Parallax easing
      targetX += (mouseX - targetX) * 0.04;
      targetY += (mouseY - targetY) * 0.04;

      // Master scene subtle rotation & tilt
      masterGroup.rotation.y = elapsed * 0.12 + targetX;
      masterGroup.rotation.x = 0.06 + targetY * 0.25;

      // Gentle floating hover
      masterGroup.position.y = Math.sin(elapsed * 1.3) * 0.06;

      // Pulse along career progression curve
      pulseProgress = (pulseProgress + 0.006) % 1;
      const pulsePt = curve.getPointAt(pulseProgress);
      pulseMesh.position.copy(pulsePt);

      // Briefcase & Resume subtle counter-tilt
      briefcaseGroup.position.y = 0.5 + Math.sin(elapsed * 1.6) * 0.03;
      resumeGroup.position.y = 0.6 + Math.cos(elapsed * 1.4) * 0.03;

      // Orbiting skill nodes
      skillNodes.forEach((sn) => {
        const curAngle = elapsed * sn.speed + sn.angle;
        sn.mesh.position.set(
          Math.cos(curAngle) * sn.radius,
          sn.heightOffset + Math.sin(elapsed * 2) * 0.1,
          Math.sin(curAngle) * sn.radius
        );
        sn.mesh.rotation.y = elapsed * 1.5;
        sn.mesh.rotation.x = elapsed * 0.8;
      });

      // Background particles drift
      particles.rotation.y = elapsed * 0.015;

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
      {/* Graceful Fallback if WebGL fails */}
      {webglError && (
        <div className="flex flex-col items-center justify-center p-8 text-center bg-slate-900/90 backdrop-blur-md rounded-3xl border border-brand-500/30 text-white w-full h-full">
          <Briefcase className="w-16 h-16 text-brand-400 mb-4 animate-bounce" />
          <h4 className="text-xl font-bold">Interactive Career Hub</h4>
          <p className="text-xs text-slate-400 mt-2 max-w-sm">
            AI-Driven Job Matching, Direct Recruiter Messaging, and Real-Time Application Tracking.
          </p>
          <div className="flex items-center gap-2 mt-4 px-3.5 py-1.5 rounded-full bg-brand-500/20 border border-brand-400/30 text-xs text-brand-300">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> Career Velocity Online
          </div>
        </div>
      )}

      {/* Floating Glass Status Pill (Top Left) */}
      <div className="absolute top-4 left-4 z-10 pointer-events-none">
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/80 backdrop-blur-md border border-brand-400/30 shadow-lg text-white">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-[11px] font-mono font-semibold tracking-wide text-brand-200">
            CAREER PIPELINE • ACTIVE
          </span>
        </div>
      </div>

      {/* Floating Dynamic Metric Widget (Bottom Right) */}
      <div className="absolute bottom-4 right-4 z-10 pointer-events-none max-w-[220px]">
        <div className="p-3 rounded-2xl bg-slate-900/85 backdrop-blur-md border border-slate-700/70 shadow-2xl text-white transition-all duration-300">
          <div className="flex items-center justify-between text-[10px] text-cyan-300 mb-1">
            <span className="flex items-center gap-1 font-semibold">
              <TrendingUp className="w-3.5 h-3.5 text-cyan-400" /> {stages[activeStage].label}
            </span>
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold">
              Live
            </span>
          </div>
          <div className="text-xs font-medium text-slate-300">
            {stages[activeStage].desc}
          </div>
        </div>
      </div>

      {/* Floating Partner Network Indicator (Bottom Left) */}
      <div className="absolute bottom-4 left-4 z-10 pointer-events-none hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/75 backdrop-blur-sm border border-slate-800 text-[11px] text-slate-300">
        <Building2 className="w-3.5 h-3.5 text-brand-400" />
        <span>Verified Network: <strong className="text-white">Active</strong></span>
      </div>
    </div>
  );
}
