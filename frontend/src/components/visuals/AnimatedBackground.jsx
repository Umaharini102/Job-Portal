import React, { useEffect, useRef } from 'react';

export default function AnimatedBackground({ className = '' }) {
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

    // Particle nodes for gentle glowing lines
    const nodeCount = 35;
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
      { x: width * 0.15, y: height * 0.25, size: 28, rot: 0, rotSpeed: 0.003, type: 'hex' },
      { x: width * 0.85, y: height * 0.3, size: 34, rot: 0.5, rotSpeed: -0.002, type: 'square' },
      { x: width * 0.25, y: height * 0.75, size: 22, rot: 1.2, rotSpeed: 0.004, type: 'triangle' },
      { x: width * 0.75, y: height * 0.8, size: 30, rot: 0.8, rotSpeed: -0.003, type: 'hex' },
    ];

    let t = 0;

    const render = () => {
      t += 0.01;
      ctx.clearRect(0, 0, width, height);

      // 1. Draw glowing connecting lines between close nodes
      ctx.lineWidth = 0.75;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 130) {
            const lineAlpha = (1 - dist / 130) * 0.18;
            ctx.strokeStyle = `rgba(59, 130, 246, ${lineAlpha})`;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      // 2. Draw moving soft light particles
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        node.x += node.vx;
        node.y += node.vy;

        // Wrap boundaries
        if (node.x < 0) node.x = width;
        if (node.x > width) node.x = 0;
        if (node.y < 0) node.y = height;
        if (node.y > height) node.y = 0;

        const currentAlpha = node.baseAlpha + Math.sin(t * 2 + node.phase) * 0.15;
        ctx.fillStyle = `rgba(96, 165, 250, ${Math.max(0.1, currentAlpha)})`;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fill();

        // Subtle glow halo
        ctx.fillStyle = `rgba(147, 197, 253, ${Math.max(0.03, currentAlpha * 0.25)})`;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius * 2.8, 0, Math.PI * 2);
        ctx.fill();
      }

      // 3. Draw subtle floating geometric wireframes
      shapes.forEach((s) => {
        s.rot += s.rotSpeed;
        const bobbingY = s.y + Math.sin(t + s.rot * 3) * 8;
        ctx.save();
        ctx.translate(s.x, bobbingY);
        ctx.rotate(s.rot);
        ctx.strokeStyle = 'rgba(99, 102, 241, 0.14)';
        ctx.lineWidth = 1;

        if (s.type === 'hex') {
          ctx.beginPath();
          for (let k = 0; k < 6; k++) {
            const angle = (k * Math.PI) / 3;
            const px = Math.cos(angle) * s.size;
            const py = Math.sin(angle) * s.size;
            if (k === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.closePath();
          ctx.stroke();
        } else if (s.type === 'square') {
          ctx.strokeRect(-s.size / 2, -s.size / 2, s.size, s.size);
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
    <div
      className={`absolute inset-0 pointer-events-none overflow-hidden select-none -z-10 ${className}`}
      aria-hidden="true"
    >
      {/* 1. Atmospheric soft ambient gradient orbs */}
      <div className="absolute -top-36 left-1/2 -translate-x-1/2 w-[850px] h-[550px] bg-gradient-to-tr from-blue-400/15 via-indigo-500/10 to-sky-400/15 blur-[120px] rounded-full animate-pulse" style={{ animationDuration: '9s' }} />
      <div className="absolute top-1/3 -left-40 w-[500px] h-[500px] bg-gradient-to-br from-cyan-400/10 via-blue-500/10 to-transparent blur-[100px] rounded-full" />
      <div className="absolute top-2/3 -right-40 w-[550px] h-[550px] bg-gradient-to-bl from-purple-500/10 via-indigo-400/10 to-transparent blur-[110px] rounded-full" />

      {/* 2. Very subtle isometric/grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.45]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(203, 213, 225, 0.4) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(203, 213, 225, 0.4) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
          maskImage: 'radial-gradient(ellipse 90% 70% at 50% 30%, black 40%, transparent 85%)',
          WebkitMaskImage: 'radial-gradient(ellipse 90% 70% at 50% 30%, black 40%, transparent 85%)',
        }}
      />

      {/* 3. Subtle cyber glowing horizon line */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-blue-400/30 to-transparent" />

      {/* 4. Canvas for animated particles, nodes, and geometric elements */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
    </div>
  );
}
