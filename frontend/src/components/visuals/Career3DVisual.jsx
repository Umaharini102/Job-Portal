import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Briefcase, CheckCircle2, TrendingUp, Sparkles, Building2, Search, FileText, Zap } from 'lucide-react';

export default function Career3DVisual({ className = '' }) {
  const containerRef = useRef(null);
  const [webglError, setWebglError] = useState(false);
  const [activeStage, setActiveStage] = useState(0);

  const stages = [
    { label: 'Role Simulation', desc: 'AI-driven match with 500+ verified companies', color: '#FF5C28' },
    { label: 'Skill Gap Analysis', desc: 'Real-time telemetry on in-demand engineering skills', color: '#A78BFA' },
    { label: 'Direct Pipeline', desc: 'Fast-track recruiter review without intermediary noise', color: '#FD7E65' },
    { label: 'Career Trajectory', desc: 'Predictive milestone tracking to senior leadership', color: '#FFB703' },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStage((prev) => (prev + 1) % stages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [stages.length]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Verify WebGL support
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
    camera.position.set(0, 3.6, 9.2);
    camera.lookAt(0, 0.5, 0);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    container.appendChild(renderer.domElement);

    // Master Group for Parallax & Gentle Floating
    const masterGroup = new THREE.Group();
    scene.add(masterGroup);

    // 2. Lighting System in Warm Burnt Orange, Cream, and Soft Purple
    const ambientLight = new THREE.AmbientLight(0xfff6ee, 1.1); // Warm ivory ambient
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xff5c28, 3.8); // Burnt orange key light
    keyLight.position.set(6, 10, 7);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xa78bfa, 2.8); // Soft purple fill light
    fillLight.position.set(-7, 6, -3);
    scene.add(fillLight);

    const centerGlow = new THREE.PointLight(0xff7a3d, 3.2, 12);
    centerGlow.position.set(0, 1.2, 1.2);
    scene.add(centerGlow);

    // 3. Base Platform / Pedestal in Deep Charcoal with Burnt Orange Glow Ring
    const baseGroup = new THREE.Group();
    masterGroup.add(baseGroup);

    // Circular charcoal chamfered base
    const baseGeo = new THREE.CylinderGeometry(3.6, 3.9, 0.28, 48);
    const baseMat = new THREE.MeshStandardMaterial({
      color: 0x121318,
      metalness: 0.85,
      roughness: 0.25,
    });
    const baseMesh = new THREE.Mesh(baseGeo, baseMat);
    baseMesh.position.y = -0.15;
    baseGroup.add(baseMesh);

    // Glowing Burnt Orange Trim Ring
    const ringGeo = new THREE.TorusGeometry(3.64, 0.04, 16, 64);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0xff5c28 });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = Math.PI / 2;
    ringMesh.position.y = 0.01;
    baseGroup.add(ringMesh);

    // Warm Ivory / Purple grid helper
    const gridHelper = new THREE.GridHelper(6.4, 18, 0xff5c28, 0x2d1f3b);
    gridHelper.position.y = 0.015;
    baseGroup.add(gridHelper);

    // 4. Centerpiece: 3D Laptop with Charcoal Body and Warm Orange Screen UI
    const laptopGroup = new THREE.Group();
    laptopGroup.position.set(0, 0.38, 0.3);

    // Keyboard Deck
    const deckGeo = new THREE.BoxGeometry(2.4, 0.08, 1.6);
    const metalMat = new THREE.MeshStandardMaterial({
      color: 0x181920,
      metalness: 0.85,
      roughness: 0.28,
    });
    const laptopDeck = new THREE.Mesh(deckGeo, metalMat);
    laptopDeck.position.y = 0.04;
    laptopGroup.add(laptopDeck);

    // Trackpad
    const padGeo = new THREE.PlaneGeometry(0.7, 0.45);
    const padMat = new THREE.MeshStandardMaterial({ color: 0x282a35, roughness: 0.5 });
    const trackpad = new THREE.Mesh(padGeo, padMat);
    trackpad.rotation.x = -Math.PI / 2;
    trackpad.position.set(0, 0.085, 0.4);
    laptopGroup.add(trackpad);

    // Screen Lid (Angled backwards)
    const lidGroup = new THREE.Group();
    lidGroup.position.set(0, 0.08, -0.78);
    lidGroup.rotation.x = -0.28;

    const lidGeo = new THREE.BoxGeometry(2.4, 1.5, 0.06);
    const lidBack = new THREE.Mesh(lidGeo, metalMat);
    lidBack.position.set(0, 0.75, 0);
    lidGroup.add(lidBack);

    // Dynamic Canvas Texture for Laptop Screen Display (Charcoal + Orange + Cream UI)
    const createScreenTexture = () => {
      const cvs = document.createElement('canvas');
      cvs.width = 1024;
      cvs.height = 640;
      const ctx = cvs.getContext('2d');

      // Deep Charcoal & Warm Glow Background
      const grad = ctx.createLinearGradient(0, 0, 1024, 640);
      grad.addColorStop(0, '#111217');
      grad.addColorStop(0.5, '#171822');
      grad.addColorStop(1, '#201826');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 1024, 640);

      // Window Bar
      ctx.fillStyle = '#1c1e28';
      ctx.fillRect(0, 0, 1024, 60);

      // Window Controls (warm accents)
      ctx.fillStyle = '#ff6b6b';
      ctx.beginPath(); ctx.arc(36, 30, 9, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#ff9f1c';
      ctx.beginPath(); ctx.arc(68, 30, 9, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#2ec4b6';
      ctx.beginPath(); ctx.arc(100, 30, 9, 0, Math.PI * 2); ctx.fill();

      // Search Container inside simulated OS
      ctx.fillStyle = 'rgba(255, 255, 255, 0.07)';
      ctx.roundRect(140, 14, 540, 34, 10);
      ctx.fill();
      ctx.fillStyle = '#dfd3bf';
      ctx.font = 'bold 16px sans-serif';
      ctx.fillText('⚡ Career Simulation Engine  •  Searching Next Opportunity...', 160, 37);

      // Main Job Match Feature Card
      ctx.fillStyle = 'rgba(255, 92, 40, 0.12)';
      ctx.strokeStyle = '#ff5c28';
      ctx.lineWidth = 3;
      ctx.roundRect(40, 88, 944, 185, 16);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#ff7a3d';
      ctx.font = 'bold 22px monospace';
      ctx.fillText('★ 98% CAREER PROFILE COMPATIBILITY', 70, 132);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 36px sans-serif';
      ctx.fillText('Staff Full-Stack & Cloud Systems Architect', 70, 182);

      ctx.fillStyle = '#e8dfd0';
      ctx.font = '20px sans-serif';
      ctx.fillText('Verified Enterprise Partner  •  Bengaluru / Remote  •  ₹35–50 LPA', 70, 228);

      // Pipeline Progression Matrix (Profile -> Skills -> Apply -> Interview -> Career)
      const stagesList = ['01 Profile', '02 Skills', '03 Match', '04 Interview', '05 Career'];
      stagesList.forEach((st, idx) => {
        const x = 40 + idx * 194;
        ctx.fillStyle = idx <= 2 ? 'rgba(255, 92, 40, 0.18)' : 'rgba(167, 139, 250, 0.1)';
        ctx.strokeStyle = idx <= 2 ? '#ff5c28' : '#7c3aed';
        ctx.lineWidth = 2;
        ctx.roundRect(x, 298, 175, 114, 12);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = idx <= 2 ? '#ff8552' : '#c4b5fd';
        ctx.font = 'bold 18px sans-serif';
        ctx.fillText(st, x + 20, 342);

        ctx.fillStyle = '#f5efe0';
        ctx.font = '14px sans-serif';
        ctx.fillText(idx <= 2 ? 'Simulated ✓' : 'In Progress', x + 20, 380);
      });

      // Bottom Trajectory Spline & Telemetry
      ctx.strokeStyle = '#ff5c28';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(40, 560);
      ctx.bezierCurveTo(240, 520, 380, 480, 540, 490);
      ctx.bezierCurveTo(700, 500, 800, 430, 984, 420);
      ctx.stroke();

      ctx.fillStyle = '#a78bfa';
      ctx.font = 'bold 18px monospace';
      ctx.fillText('TELEMETRY: CAREER TRAJECTORY ACCELERATING (+184% VELOCITY)', 40, 610);

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

    // 5. 3D Executive Briefcase in Deep Charcoal with Burnt Orange Hardware (Right Foreground)
    const briefcaseGroup = new THREE.Group();
    briefcaseGroup.position.set(1.9, 0.5, 0.8);
    briefcaseGroup.rotation.set(0, -0.4, 0.1);

    const caseGeo = new THREE.BoxGeometry(0.95, 0.7, 0.28);
    const caseMat = new THREE.MeshStandardMaterial({
      color: 0x1a1c22,
      roughness: 0.35,
      metalness: 0.7,
    });
    const caseMesh = new THREE.Mesh(caseGeo, caseMat);
    briefcaseGroup.add(caseMesh);

    // Warm Burnt Orange / Brass Clasps
    const claspMat = new THREE.MeshStandardMaterial({ color: 0xff7a3d, metalness: 0.9, roughness: 0.15 });
    const clasp1 = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.1, 0.3), claspMat);
    clasp1.position.set(-0.25, 0.15, 0);
    briefcaseGroup.add(clasp1);

    const clasp2 = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.1, 0.3), claspMat);
    clasp2.position.set(0.25, 0.15, 0);
    briefcaseGroup.add(clasp2);

    const handleGeo = new THREE.TorusGeometry(0.18, 0.035, 12, 24, Math.PI);
    const handle = new THREE.Mesh(handleGeo, claspMat);
    handle.position.set(0, 0.38, 0);
    briefcaseGroup.add(handle);
    masterGroup.add(briefcaseGroup);

    // 6. 3D Resume / Portfolio Document in Warm Ivory / Cream (Left Foreground)
    const resumeGroup = new THREE.Group();
    resumeGroup.position.set(-1.9, 0.62, 0.7);
    resumeGroup.rotation.set(0.15, 0.45, -0.08);

    const resumeGeo = new THREE.BoxGeometry(0.85, 1.15, 0.04);
    const resumeMat = new THREE.MeshStandardMaterial({
      color: 0xf5efe0, // Warm ivory
      roughness: 0.25,
      metalness: 0.1,
    });
    const resumeMesh = new THREE.Mesh(resumeGeo, resumeMat);
    resumeGroup.add(resumeMesh);

    // Header bar on resume in Burnt Orange
    const headerLineGeo = new THREE.PlaneGeometry(0.68, 0.08);
    const headerLineMat = new THREE.MeshBasicMaterial({ color: 0xff5c28 });
    const headerLine = new THREE.Mesh(headerLineGeo, headerLineMat);
    headerLine.position.set(0, 0.42, 0.025);
    resumeGroup.add(headerLine);

    // Holographic lines on the resume (purple and warm dark)
    for (let r = 0; r < 4; r++) {
      const lineGeo = new THREE.PlaneGeometry(0.62 - (r % 2) * 0.16, 0.035);
      const lineMat = new THREE.MeshBasicMaterial({ color: r === 0 ? 0xa78bfa : 0x4a4d5c });
      const line = new THREE.Mesh(lineGeo, lineMat);
      line.position.set(-0.03, 0.22 - r * 0.14, 0.025);
      resumeGroup.add(line);
    }
    masterGroup.add(resumeGroup);

    // 7. Floating 3D Job Card Mesh (Top Left Background)
    const jobCardGroup = new THREE.Group();
    jobCardGroup.position.set(-1.8, 2.3, -1.0);
    jobCardGroup.rotation.set(-0.1, 0.3, 0.05);

    const cardBodyGeo = new THREE.BoxGeometry(1.2, 0.75, 0.04);
    const cardBodyMat = new THREE.MeshStandardMaterial({
      color: 0x15161d,
      roughness: 0.3,
      metalness: 0.8,
    });
    const cardBody = new THREE.Mesh(cardBodyGeo, cardBodyMat);
    jobCardGroup.add(cardBody);

    // Orange accent border on card
    const cardBorderGeo = new THREE.BoxGeometry(1.24, 0.79, 0.02);
    const cardBorderMat = new THREE.MeshBasicMaterial({ color: 0xff5c28 });
    const cardBorder = new THREE.Mesh(cardBorderGeo, cardBorderMat);
    cardBorder.position.z = -0.015;
    jobCardGroup.add(cardBorder);

    // Monogram badge on job card
    const badgeGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.02, 24);
    const badgeMat = new THREE.MeshBasicMaterial({ color: 0xa78bfa });
    const badgeMesh = new THREE.Mesh(badgeGeo, badgeMat);
    badgeMesh.rotation.x = Math.PI / 2;
    badgeMesh.position.set(-0.4, 0.18, 0.025);
    jobCardGroup.add(badgeMesh);

    // Card text bars
    const bar1 = new THREE.Mesh(new THREE.PlaneGeometry(0.48, 0.04), new THREE.MeshBasicMaterial({ color: 0xfff6ee }));
    bar1.position.set(0.04, 0.22, 0.025);
    jobCardGroup.add(bar1);

    const bar2 = new THREE.Mesh(new THREE.PlaneGeometry(0.36, 0.03), new THREE.MeshBasicMaterial({ color: 0xff7a3d }));
    bar2.position.set(-0.02, 0.12, 0.025);
    jobCardGroup.add(bar2);

    masterGroup.add(jobCardGroup);

    // 8. Career Growth Trajectory Spline & Travelling Energy Packet (Vibrant Orange & Coral)
    const curvePoints = [
      new THREE.Vector3(-2.2, 0.4, 0.5),
      new THREE.Vector3(-1.0, 1.7, 0.2),
      new THREE.Vector3(0.4, 2.4, -0.4),
      new THREE.Vector3(1.8, 3.3, -1.0),
    ];
    const curve = new THREE.CatmullRomCurve3(curvePoints);

    const tubeGeo = new THREE.TubeGeometry(curve, 54, 0.03, 8, false);
    const tubeMat = new THREE.MeshBasicMaterial({
      color: 0xff5c28,
      transparent: true,
      opacity: 0.75,
    });
    const trajectoryTube = new THREE.Mesh(tubeGeo, tubeMat);
    masterGroup.add(trajectoryTube);

    // Glowing Pulse
    const pulseGeo = new THREE.SphereGeometry(0.09, 16, 16);
    const pulseMat = new THREE.MeshBasicMaterial({ color: 0xfff5ee });
    const pulseMesh = new THREE.Mesh(pulseGeo, pulseMat);
    masterGroup.add(pulseMesh);
    let pulseProgress = 0;

    // 9. Orbiting Skill Badges (Burnt Orange, Soft Purple, Warm Gold, Coral)
    const skillsGroup = new THREE.Group();
    masterGroup.add(skillsGroup);

    const skillNodes = [];
    const skillColors = [0xff5c28, 0xa78bfa, 0xffb703, 0xfd7e65];
    for (let s = 0; s < 4; s++) {
      const sGeo = new THREE.OctahedronGeometry(0.16, 0);
      const sMat = new THREE.MeshStandardMaterial({
        color: skillColors[s],
        emissive: skillColors[s],
        emissiveIntensity: 0.65,
        roughness: 0.2,
      });
      const sMesh = new THREE.Mesh(sGeo, sMat);
      skillsGroup.add(sMesh);
      skillNodes.push({
        mesh: sMesh,
        radius: 2.7,
        speed: 0.42 + s * 0.08,
        angle: (s * Math.PI) / 2,
        heightOffset: 1.7 + (s % 2) * 0.45,
      });
    }

    // 10. Warm Floating Particle Dust (Cream, Orange, Lavender)
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
      color: 0xffceb5, // Warm peach/cream
      transparent: true,
      opacity: 0.5,
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
      masterGroup.rotation.y = elapsed * 0.11 + targetX;
      masterGroup.rotation.x = 0.05 + targetY * 0.22;

      // Gentle floating hover
      masterGroup.position.y = Math.sin(elapsed * 1.3) * 0.06;

      // Pulse along career progression curve
      pulseProgress = (pulseProgress + 0.006) % 1;
      const pulsePt = curve.getPointAt(pulseProgress);
      pulseMesh.position.copy(pulsePt);

      // Briefcase & Resume subtle counter-tilt
      briefcaseGroup.position.y = 0.5 + Math.sin(elapsed * 1.6) * 0.03;
      resumeGroup.position.y = 0.62 + Math.cos(elapsed * 1.4) * 0.03;
      jobCardGroup.position.y = 2.3 + Math.sin(elapsed * 1.1) * 0.04;

      // Orbiting skill nodes
      skillNodes.forEach((sn) => {
        const curAngle = elapsed * sn.speed + sn.angle;
        sn.mesh.position.set(
          Math.cos(curAngle) * sn.radius,
          sn.heightOffset + Math.sin(elapsed * 2) * 0.1,
          Math.sin(curAngle) * sn.radius
        );
        sn.mesh.rotation.y = elapsed * 1.4;
        sn.mesh.rotation.x = elapsed * 0.7;
      });

      // Background particles drift
      particles.rotation.y = elapsed * 0.012;

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
        <div className="flex flex-col items-center justify-center p-8 text-center bg-charcoal-900/90 backdrop-blur-md rounded-3xl border border-brand-500/30 text-white w-full h-full">
          <Briefcase className="w-16 h-16 text-brand-500 mb-4 animate-bounce" />
          <h4 className="text-xl font-bold">Career Simulation Workspace</h4>
          <p className="text-xs text-cream-300 mt-2 max-w-sm">
            AI-Driven Opportunity Matching, Skill Gap Telemetry, and Autonomous Application Pipeline.
          </p>
          <div className="flex items-center gap-2 mt-4 px-3.5 py-1.5 rounded-full bg-brand-500/20 border border-brand-500/30 text-xs text-brand-300">
            <Sparkles className="w-3.5 h-3.5 text-brand-400" /> Digital Career Workspace Online
          </div>
        </div>
      )}

      {/* Floating Glass Status Pill (Top Left) */}
      <div className="absolute top-4 left-4 z-10 pointer-events-none">
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-charcoal-900/90 backdrop-blur-md border border-brand-500/30 shadow-xl text-white">
          <span className="w-2 h-2 rounded-full bg-brand-500 animate-ping" />
          <span className="text-[11px] font-mono font-bold tracking-wider text-cream-200">
            CSE • DIGITAL WORKSPACE
          </span>
        </div>
      </div>

      {/* Floating Dynamic Metric Widget (Bottom Right) */}
      <div className="absolute bottom-4 right-4 z-10 pointer-events-none max-w-[220px]">
        <div className="p-3.5 rounded-2xl bg-charcoal-900/90 backdrop-blur-md border border-charcoal-700/80 shadow-2xl text-white transition-all duration-300">
          <div className="flex items-center justify-between text-[10px] text-brand-400 mb-1">
            <span className="flex items-center gap-1 font-bold">
              <TrendingUp className="w-3.5 h-3.5 text-brand-400" /> {stages[activeStage].label}
            </span>
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-brand-500/20 text-brand-300 border border-brand-500/30 font-bold font-mono">
              ACTIVE
            </span>
          </div>
          <div className="text-xs font-medium text-cream-300 leading-snug">
            {stages[activeStage].desc}
          </div>
        </div>
      </div>

      {/* Floating Partner Network Indicator (Bottom Left) */}
      <div className="absolute bottom-4 left-4 z-10 pointer-events-none hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-charcoal-900/80 backdrop-blur-sm border border-charcoal-700/80 text-[11px] text-cream-300">
        <Zap className="w-3.5 h-3.5 text-brand-400" />
        <span>Simulated Roles: <strong className="text-white">Active</strong></span>
      </div>
    </div>
  );
}

