'use client';

import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

/**
 * CursorGlow
 * A soft radial glow that follows the cursor. Rendered via portal so it's independent of layout.
 * - pointer-events: none so it never blocks clicks
 * - fixed and full-viewport
 * - low opacity + blur for subtle effect
 */
export default function CursorGlow() {
  const [mounted, setMounted] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth spring to reduce lag behind cursor
  const smoothX = useSpring(mouseX, { damping: 25, stiffness: 300, mass: 0.6 });
  const smoothY = useSpring(mouseY, { damping: 25, stiffness: 300, mass: 0.6 });

  const rafRef = useRef<number>();

  useEffect(() => {
    setMounted(true);

    const handleMouseMove = (e: MouseEvent) => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        mouseX.set(e.clientX);
        mouseY.set(e.clientY);
      });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [mouseX, mouseY]);

  if (!mounted) return null;

  const glow = (
    <div
      className="pointer-events-none"
      style={{ position: 'fixed', inset: 0, zIndex: 2 }}
    >
      {/* Center the glow around the cursor by offsetting half its size */}
      <motion.div
        aria-hidden
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          x: smoothX,
          y: smoothY,
          translateX: '-50%',
          translateY: '-50%',
          width: 360,
          height: 360,
          borderRadius: '50%',
          opacity: 0.18,
          filter: 'blur(48px)',
          background: 'radial-gradient(closest-side, rgba(10,190,255,0.65), rgba(10,190,255,0.25) 40%, rgba(10,190,255,0) 70%)',
          mixBlendMode: 'screen',
        }}
      />
    </div>
  );

  return createPortal(glow, document.body);
}
