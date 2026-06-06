"use client";
import React, { useEffect, useRef } from 'react';

export function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    const resize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);

    // Particles
    const particles: Array<{x:number,y:number,vx:number,vy:number,r:number,alpha:number}> = [];
    for (let i = 0; i < 55; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 2.5 + 0.5,
        alpha: Math.random() * 0.4 + 0.1
      });
    }

    // Wave lines
    let t = 0;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      t += 0.005;

      // Draw subtle wave lines
      const waves = [
        { amp: 60, freq: 0.002, phase: 0, y: height * 0.3, color: 'rgba(201,169,110,0.07)' },
        { amp: 45, freq: 0.003, phase: 1, y: height * 0.5, color: 'rgba(201,169,110,0.05)' },
        { amp: 75, freq: 0.0015, phase: 2, y: height * 0.7, color: 'rgba(201,169,110,0.06)' },
      ];

      waves.forEach(w => {
        ctx.beginPath();
        ctx.moveTo(0, w.y + Math.sin(w.phase + t) * w.amp);
        for (let x = 0; x <= width; x += 4) {
          const y = w.y + Math.sin(w.freq * x + w.phase + t) * w.amp;
          ctx.lineTo(x, y);
        }
        ctx.strokeStyle = w.color;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      });

      // Draw particles
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(201,169,110,${p.alpha})`;
        ctx.fill();
      });

      // Connect nearby particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 130) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(201,169,110,${0.08 * (1 - dist/130)})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      animationId = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}
