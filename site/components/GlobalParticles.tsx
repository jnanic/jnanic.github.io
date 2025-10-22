'use client';

import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';

/**
 * Global particle network - fixed to viewport, doesn't scroll
 */
export default function GlobalParticles() {
  const [particles, setParticles] = useState<Array<{
    id: number;
    x: number;
    y: number;
    vx: number;
    vy: number;
  }>>([]);
  const [mounted, setMounted] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothMouseX = useSpring(mouseX, { damping: 30, stiffness: 200 });
  const smoothMouseY = useSpring(mouseY, { damping: 30, stiffness: 200 });
  
  const rafRef = useRef<number>();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Initialize 90 particles across viewport
    const initialParticles = Array.from({ length: 90 }, (_, i) => ({
      id: i,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.8,
      vy: (Math.random() - 0.5) * 0.8,
    }));
    setParticles(initialParticles);

    // Track mouse in viewport coordinates
    const handleMouseMove = (e: MouseEvent) => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        mouseX.set(e.clientX);
        mouseY.set(e.clientY);
      });
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Animate particles within viewport
    const interval = setInterval(() => {
      setParticles((prev) =>
        prev.map((p) => {
          let newX = p.x + p.vx;
          let newY = p.y + p.vy;
          let newVx = p.vx;
          let newVy = p.vy;

          // Cursor repulsion
          const dx = mouseX.get() - p.x;
          const dy = mouseY.get() - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist < 150 && dist > 0) {
            const force = (1 - dist / 150) * 0.8;
            const angle = Math.atan2(dy, dx);
            newVx -= Math.cos(angle) * force * 0.05;
            newVy -= Math.sin(angle) * force * 0.05;
          }

          // Physics
          newVx *= 0.98; // friction
          newVy *= 0.98;
          newVx += (Math.random() - 0.5) * 0.05; // random movement
          newVy += (Math.random() - 0.5) * 0.05;

          // Speed limit
          const speed = Math.sqrt(newVx * newVx + newVy * newVy);
          if (speed > 2) {
            newVx = (newVx / speed) * 2;
            newVy = (newVy / speed) * 2;
          }

          newX += newVx;
          newY += newVy;

          // Bounce off viewport edges
          const vw = window.innerWidth;
          const vh = window.innerHeight;
          if (newX <= 10 || newX >= vw - 10) {
            newVx = -newVx * 0.8;
            newX = Math.max(10, Math.min(vw - 10, newX));
          }
          if (newY <= 10 || newY >= vh - 10) {
            newVy = -newVy * 0.8;
            newY = Math.max(10, Math.min(vh - 10, newY));
          }

          return { ...p, x: newX, y: newY, vx: newVx, vy: newVy };
        })
      );
    }, 32);

    return () => {
      clearInterval(interval);
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [mouseX, mouseY]);

  // Calculate connections between nearby particles
  const connections = particles.flatMap((p1, i) =>
    particles.slice(i + 1).map((p2) => {
      const dx = p2.x - p1.x;
      const dy = p2.y - p1.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const maxDistance = 150;

      if (distance < maxDistance) {
        return {
          x1: p1.x,
          y1: p1.y,
          x2: p2.x,
          y2: p2.y,
          opacity: 1 - distance / maxDistance,
        };
      }
      return null;
    })
  ).filter(Boolean);

  if (!mounted) return null;

  const particleLayer = (
    <div 
      className="pointer-events-none"
      style={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 1,
        overflow: 'hidden'
      }}
    >
      <svg 
        width="100%" 
        height="100%" 
        style={{ 
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%'
        }}
      >
        <defs>
          <filter id="particle-glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Connections */}
        {connections.map((conn, i) => 
          conn && (
            <line
              key={`conn-${i}`}
              x1={conn.x1}
              y1={conn.y1}
              x2={conn.x2}
              y2={conn.y2}
              stroke="#0ABEFF"
              strokeWidth="1.5"
              opacity={conn.opacity * 0.4}
            />
          )
        )}
        
        {/* Particles */}
        {particles.map((p) => {
          const dx = smoothMouseX.get() - p.x;
          const dy = smoothMouseY.get() - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const scale = dist < 100 ? 1.5 : 1;

          return (
            <motion.circle
              key={p.id}
              cx={p.x}
              cy={p.y}
              r="3"
              fill="#0ABEFF"
              filter="url(#particle-glow)"
              opacity="0.8"
              animate={{
                scale: [scale, scale * 1.1, scale],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          );
        })}
      </svg>
    </div>
  );

  return createPortal(particleLayer, document.body);
}

