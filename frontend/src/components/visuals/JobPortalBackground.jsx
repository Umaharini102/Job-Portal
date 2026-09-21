import React, { useEffect, useRef } from 'react';

export default function JobPortalBackground({ className = '' }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener('resize', handleResize);

    // Particle nodes for career network connection lines
    const nodeCount = 38;
    const nodes = [];
    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        radius: Math.random() * 2 + 1,
        baseAlpha: Math.random() * 0.4 + 0.2,
        pulseSpeed: Math.random() * 0.02 + 0.01,
        phase: Math.random() * Math.PI * 2,
      });
    }

    // Floating subtle geometric elements
    const shapes = [
      { x: width * 0.12, y: height * 0.22, size: 26, rot: 0, rotSpeed: 0.003, type: 'diamond' },
      { x: width * 0.88, y: height * 0.28, size: 32, rot: 0.5, rotSpeed: -0.002, type: 'hexagon' },
      { x: width * 0.22, y: height * 0.76, size: 22, rot: 1.1, rotSpeed: 0.004, type: 'triangle' },
      { x: width * 0.78, y: height * 0.82, size: 28, rot: 0.7, rotSpeed: -0.003, type: 'diamond' },
    ];

    let t = 0;

    const render = () => {
      t += 0.01;
      ctx.clearRect(0, 0, width, height);

      // Deep Navy & Indigo Gradient Background
      const bgGrad = ctx.createLinearGradient(0, 0, width, height);
      bgGrad.addColorStop(0, '#0a1128');
      bgGrad.addColorStop(0.35, '#0f172a');
      bgGrad.addColorStop(0.7, '#070d1e');
      bgGrad.addColorStop(1, '#050a17');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Soft moving ambient radial light glow
      const cx1 = width * 0.25 + Math.sin(t * 0.7) * 80;
      const cy1 = height * 0.3 + Math.cos(t * 0.5) * 60;
      const glow1 = ctx.createRadialGradient(cx1, cy1, 10, cx1, cy1, width * 0.45);
      glow1.addColorStop(0, 'rgba(10, 102, 194, 0.16)');
      glow1.addColorStop(0.5, 'rgba(99, 102, 241, 0.06)');
      glow1.addColorStop(1, 'transparent');
      ctx.fillStyle = glow1;
      ctx.fillRect(0, 0, width, height);

      const cx2 = width * 0.75 + Math.cos(t * 0.6) * 90;
      const cy2 = height * 0.45 + Math.sin(t * 0.8) * 70;
      const glow2 = ctx.createRadialGradient(cx2, cy2, 10, cx2, cy2, width * 0.4);
      glow2.addColorStop(0, 'rgba(139, 92, 246, 0.14)');
      glow2.addColorStop(0.6, 'rgba(56, 189, 248, 0.04)');
      glow2.addColorStop(1, 'transparent');
      ctx.fillStyle = glow2;
      ctx.fillRect(0, 0, width, height);

      // Very subtle grid lines
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.035)';
      ctx.lineWidth = 1;
      const gridSize = 64;
      for (let x = 0; x <= width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y <= height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Update & Draw Nodes
      nodes.forEach((node) => {
        node.x += node.vx;
        node.y += node.vy;

        if (node.x < 0) node.x = width;
        if (node.x > width) node.x = 0;
        if (node.y < 0) node.y = height;
        if (node.y > height) node.y = 0;

        const alpha = node.baseAlpha + Math.sin(t * 2 + node.phase) * 0.15;
        ctx.fillStyle = `rgba(56, 189, 248, ${Math.max(0.1, alpha)})`;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw subtle connecting proximity lines between career nodes
      ctx.lineWidth = 0.75;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 130) {
            const lineAlpha = (1 - dist / 130) * 0.14;
            ctx.strokeStyle = `rgba(96, 165, 250, ${lineAlpha})`;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      // Floating Geometric Wireframes
      shapes.forEach((s) => {
        s.rot += s.rotSpeed;
        ctx.save();
        ctx.translate(s.x, s.y);
        ctx.rotate(s.rot);
        ctx.strokeStyle = 'rgba(129, 140, 248, 0.18)';
        ctx.lineWidth = 1.2;

        if (s.type === 'diamond') {
          ctx.beginPath();
          ctx.moveTo(0, -s.size);
          ctx.lineTo(s.size * 0.7, 0);
          ctx.lineTo(0, s.size);
          ctx.lineTo(-s.size * 0.7, 0);
          ctx.closePath();
          ctx.stroke();
        } else if (s.type === 'hexagon') {
          ctx.beginPath();
          for (let i = 0; i < 6; i++) {
            const angle = (i * Math.PI) / 3;
            const px = Math.cos(angle) * s.size;
            const py = Math.sin(angle) * s.size;
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.closePath();
          ctx.stroke();
        } else if (s.type === 'triangle') {
          ctx.beginPath();
          ctx.moveTo(0, -s.size);
          ctx.lineTo(s.size * 0.86, s.size * 0.5);
          ctx.lineTo(-s.size * 0.86, s.size * 0.5);
          ctx.closePath();
          ctx.stroke();
        }
        ctx.restore();
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 w-full h-full pointer-events-none -z-10 ${className}`}
    />
  );
}
