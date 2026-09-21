import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { BookOpen, X, Sparkles, ChevronRight, RotateCcw, Layers } from 'lucide-react';

/* 
  AshenPress 3D Visual Layer
  Integrated from: https://threeui.com/source-code/ashen-press.json
  Serves as the 3D Academic Curriculum & Digital Library Shelf.
*/

const BOOKS = [
  { id: 'vol1', title: 'Artificial Intelligence & Neural Networks', code: 'CS-801', vol: 'I', spine: '#1e3a8a', cloth: '#0f172a', edge: '#e2e8f0', desc: 'Core deep learning architectures, transformer attention, and autonomous campus operations.' },
  { id: 'vol2', title: 'Distributed Systems & Cloud Computing', code: 'CS-702', vol: 'II', spine: '#047857', cloth: '#064e3b', edge: '#e2e8f0', desc: 'Scalable campus microservices, consensus protocols, and reactive event streaming.' },
  { id: 'vol3', title: 'Advanced Algorithms & Complexity', code: 'MA-603', vol: 'III', spine: '#b45309', cloth: '#78350f', edge: '#fef3c7', desc: 'Combinatorial optimization, probabilistic proofs, and graph partitioning theorem.' },
  { id: 'vol4', title: 'Software Engineering & System Design', code: 'SE-504', vol: 'IV', spine: '#6d28d9', cloth: '#4c1d95', edge: '#ede9fe', desc: 'Design patterns, CI/CD orchestration, and large-scale academic portal architecture.' },
  { id: 'vol5', title: 'Data Structures & Modern C++', code: 'CS-405', vol: 'V', spine: '#be123c', cloth: '#881337', edge: '#ffe4e6', desc: 'Memory hierarchies, concurrent lock-free collections, and low-latency systems.' },
];

export default function AshenPressLayer({ isOpen, onClose }) {
  const mountRef = useRef(null);
  const [selectedBook, setSelectedBook] = useState(0);

  useEffect(() => {
    if (!isOpen) return;

    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 450;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0f172a); // Academic slate-900

    const camera = new THREE.PerspectiveCamera(35, width / height, 0.1, 100);
    camera.position.set(0, 0.5, 4.2);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    // Shelf Plank
    const plankGeo = new THREE.BoxGeometry(4.8, 0.08, 1.2);
    const plankMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.4,
      metalness: 0.2,
    });
    const plank = new THREE.Mesh(plankGeo, plankMat);
    plank.position.set(0, -0.65, 0);
    plank.receiveShadow = true;
    scene.add(plank);

    // Book Creation Helper
    const bookMeshes = [];
    const bookGroup = new THREE.Group();
    scene.add(bookGroup);

    BOOKS.forEach((b, idx) => {
      const bookW = 0.52;
      const bookH = 0.78;
      const bookD = 0.14;

      // Spine & Cover Texture Canvas
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 768;
      const ctx = canvas.getContext('2d');

      // Cloth background
      ctx.fillStyle = b.cloth;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Spine edge band
      ctx.fillStyle = b.spine;
      ctx.fillRect(0, 0, 80, canvas.height);

      // Gold foil border
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 6;
      ctx.strokeRect(100, 40, canvas.width - 140, canvas.height - 80);

      // Volume label
      ctx.fillStyle = '#f59e0b';
      ctx.font = 'bold 24px monospace';
      ctx.fillText(`NEXUSCAMPUS · VOL ${b.vol}`, 120, 90);

      // Title
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 36px sans-serif';
      const words = b.title.split(' ');
      let line = '';
      let y = 170;
      for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        const metrics = ctx.measureText(testLine);
        if (metrics.width > 320 && n > 0) {
          ctx.fillText(line, 120, y);
          line = words[n] + ' ';
          y += 45;
        } else {
          line = testLine;
        }
      }
      ctx.fillText(line, 120, y);

      // Course Code
      ctx.fillStyle = '#94a3b8';
      ctx.font = '22px sans-serif';
      ctx.fillText(`Curriculum Code: ${b.code}`, 120, y + 60);

      const texture = new THREE.CanvasTexture(canvas);

      // Geometry & Materials
      const materials = [
        new THREE.MeshStandardMaterial({ color: b.edge, roughness: 0.8 }), // right (pages)
        new THREE.MeshStandardMaterial({ color: b.spine, roughness: 0.5 }), // left (spine)
        new THREE.MeshStandardMaterial({ color: b.edge, roughness: 0.8 }), // top
        new THREE.MeshStandardMaterial({ color: b.edge, roughness: 0.8 }), // bottom
        new THREE.MeshStandardMaterial({ map: texture, roughness: 0.4 }), // front
        new THREE.MeshStandardMaterial({ color: b.cloth, roughness: 0.5 }), // back
      ];

      const geo = new THREE.BoxGeometry(bookW, bookH, bookD);
      const mesh = new THREE.Mesh(geo, materials);
      mesh.castShadow = true;

      // Position along the shelf
      const xSpacing = 0.65;
      mesh.position.set((idx - (BOOKS.length - 1) / 2) * xSpacing, -0.22, 0);

      // Slight natural book lean
      mesh.rotation.y = -0.15 + idx * 0.05;
      mesh.userData = { id: idx, basePos: mesh.position.clone() };

      bookGroup.add(mesh);
      bookMeshes.push(mesh);
    });

    // Lighting
    const ambient = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambient);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.8);
    dirLight.position.set(4, 5, 4);
    dirLight.castShadow = true;
    scene.add(dirLight);

    const goldPoint = new THREE.PointLight(0xf59e0b, 1.5, 6);
    goldPoint.position.set(0, 1.2, 1.5);
    scene.add(goldPoint);

    // Animation & Selection Loop
    let animId;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Lift and tilt the selected book
      bookMeshes.forEach((mesh, i) => {
        if (i === selectedBook) {
          mesh.position.y = THREE.MathUtils.lerp(mesh.position.y, 0.1, 0.1);
          mesh.position.z = THREE.MathUtils.lerp(mesh.position.z, 0.45, 0.1);
          mesh.rotation.y = THREE.MathUtils.lerp(mesh.rotation.y, 0.35 + Math.sin(elapsed * 1.5) * 0.05, 0.1);
        } else {
          mesh.position.y = THREE.MathUtils.lerp(mesh.position.y, mesh.userData.basePos.y, 0.1);
          mesh.position.z = THREE.MathUtils.lerp(mesh.position.z, mesh.userData.basePos.z, 0.1);
          mesh.rotation.y = THREE.MathUtils.lerp(mesh.rotation.y, -0.15 + i * 0.05, 0.1);
        }
      });

      renderer.render(scene, camera);
    };

    animate();

    // Resize listener
    const onResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (w && h) {
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      }
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', onResize);
      if (container && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      scene.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
          if (Array.isArray(obj.material)) obj.material.forEach((m) => m.dispose());
          else obj.material.dispose();
        }
      });
      renderer.dispose();
    };
  }, [isOpen, selectedBook]);

  if (!isOpen) return null;

  const currentBook = BOOKS[selectedBook];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-5xl w-full overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                AshenPress 3D Library & Syllabus Archive
                <span className="text-[10px] bg-blue-500/20 text-blue-300 border border-blue-500/30 px-2 py-0.5 rounded-full font-mono">
                  Three.js 3D Engine
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Interactive real-time 3D rendered academic shelf. Click volumes to inspect syllabus modules.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 3D WebGL Canvas Viewport */}
        <div ref={mountRef} className="relative w-full h-80 sm:h-96 bg-slate-950 cursor-grab active:cursor-grabbing" />

        {/* Book Selector Rail & Details */}
        <div className="p-6 bg-slate-900/90 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-md">
            <span className="text-xs font-mono font-bold text-amber-400 tracking-wider">
              VOLUME {currentBook.vol} &bull; {currentBook.code}
            </span>
            <h4 className="text-lg font-bold text-white mt-1 mb-1">{currentBook.title}</h4>
            <p className="text-xs text-slate-400 leading-relaxed">{currentBook.desc}</p>
          </div>

          {/* Book Buttons */}
          <div className="flex flex-wrap gap-2">
            {BOOKS.map((b, i) => (
              <button
                key={b.id}
                onClick={() => setSelectedBook(i)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 ${
                  selectedBook === i
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200'
                }`}
              >
                <span>Vol {b.vol}</span>
                <span className="text-[10px] opacity-75">({b.code})</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
