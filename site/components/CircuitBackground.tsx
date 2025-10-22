'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

export default function CircuitBackground() {
  const [mounted, setMounted] = useState(false);
  const [seed, setSeed] = useState(0);

  useEffect(() => {
    setSeed(Math.random() * 1000);
    setMounted(true);
  }, []);

  const random = (min: number, max: number, offset: number = 0) => {
    const x = Math.sin(seed + offset) * 10000;
    return min + ((x - Math.floor(x)) * (max - min));
  };

  // Don't render until mounted to avoid hydration mismatch
  if (!mounted) {
    return null;
  }

  const layer = (
    <div
      className="pointer-events-none"
      style={{ position: 'fixed', inset: 0, width: '100vw', height: '100vh', zIndex: 0 }}
    >
      <svg
        className="opacity-[0.17]"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <pattern id="circuit-bg-pattern" x="0" y="0" width="200" height="200" patternUnits="userSpaceOnUse">
            {/* Horizontal traces */}
            {[...Array(6)].map((_, i) => {
              const y = random(5 + i * 20, 10 + i * 20, i * 100);
              return (
                <path
                  key={`h-${i}`}
                  d={`M 0 ${y} L ${random(30, 60, i * 10)} ${y} L ${random(30, 60, i * 10)} ${random(y - 15, y + 15, i * 10 + 1)} L ${random(100, 140, i * 10 + 2)} ${random(y - 15, y + 15, i * 10 + 1)} L ${random(100, 140, i * 10 + 2)} ${random(y - 8, y + 8, i * 10 + 3)} L 200 ${random(y - 8, y + 8, i * 10 + 3)}`}
                  stroke="#0088CC"
                  strokeWidth={random(0.8, 1.5, i * 10 + 4)}
                  fill="none"
                  opacity={random(0.4, 0.6, i * 10 + 5)}
                />
              );
            })}

            {/* Vertical traces */}
            {[...Array(6)].map((_, i) => {
              const x = random(5 + i * 20, 10 + i * 20, i * 100 + 500);
              return (
                <path
                  key={`v-${i}`}
                  d={`M ${x} 0 L ${x} ${random(30, 60, i * 10 + 600)} L ${random(x - 15, x + 15, i * 10 + 601)} ${random(30, 60, i * 10 + 600)} L ${random(x - 15, x + 15, i * 10 + 601)} ${random(100, 140, i * 10 + 602)} L ${random(x - 8, x + 8, i * 10 + 603)} ${random(100, 140, i * 10 + 602)} L ${random(x - 8, x + 8, i * 10 + 603)} 200`}
                  stroke="#0088CC"
                  strokeWidth={random(0.8, 1.5, i * 10 + 604)}
                  fill="none"
                  opacity={random(0.4, 0.6, i * 10 + 605)}
                />
              );
            })}

            {/* Diagonal connections */}
            {[...Array(5)].map((_, i) => (
              <path
                key={`diag-${i}`}
                d={`M ${random(0, 80, i * 50 + 1000)} ${random(0, 80, i * 50 + 1001)} L ${random(120, 200, i * 50 + 1002)} ${random(120, 200, i * 50 + 1003)}`}
                stroke="#0088CC"
                strokeWidth="0.8"
                fill="none"
                opacity="0.3"
              />
            ))}

            {/* L-shaped connectors */}
            {[...Array(8)].map((_, i) => {
              const startX = random(10, 190, i * 30 + 2000);
              const startY = random(10, 190, i * 30 + 2001);
              const midX = random(startX - 40, startX + 40, i * 30 + 2002);
              const endY = random(startY - 50, startY + 50, i * 30 + 2003);
              return (
                <path
                  key={`l-${i}`}
                  d={`M ${startX} ${startY} L ${midX} ${startY} L ${midX} ${endY}`}
                  stroke="#0088CC"
                  strokeWidth="1.2"
                  fill="none"
                  opacity="0.4"
                />
              );
            })}

            {/* Connection pads at intersections */}
            {[...Array(15)].map((_, i) => (
              <circle
                key={`pad-${i}`}
                cx={random(10, 190, i * 40 + 3000)}
                cy={random(10, 190, i * 40 + 3001)}
                r={random(2, 3.5, i * 40 + 3002)}
                fill="#0ABEFF"
                opacity="0.5"
              />
            ))}

            {/* Via holes (smaller dots) */}
            {[...Array(12)].map((_, i) => (
              <circle
                key={`via-${i}`}
                cx={random(15, 185, i * 35 + 4000)}
                cy={random(15, 185, i * 35 + 4001)}
                r="1.5"
                fill="none"
                stroke="#0088CC"
                strokeWidth="0.5"
                opacity="0.4"
              />
            ))}

            {/* Large CPU/Processor chip */}
            <rect x={random(85, 91, 26)} y={random(85, 91, 27)} width="28" height="28" fill="none" stroke="#0ABEFF" strokeWidth="1.5" opacity="0.5"/>
            <rect x={random(87, 93, 28)} y={random(87, 93, 29)} width="24" height="24" fill="#0088CC" opacity="0.08"/>
            <rect x={random(91, 95, 30)} y={random(91, 95, 31)} width="16" height="16" fill="#0088CC" opacity="0.1"/>
            {/* CPU pins */}
            {[...Array(3)].map((_, i) => (
              <line
                key={`cpu-l-${i}`}
                x1={random(85, 91, 26)}
                y1={random(91 + i * 9, 95 + i * 9, 32 + i)}
                x2={random(75, 83, 33)}
                y2={random(91 + i * 9, 95 + i * 9, 32 + i)}
                stroke="#0088CC"
                strokeWidth="0.8"
                opacity="0.4"
              />
            ))}
            {[...Array(3)].map((_, i) => (
              <line
                key={`cpu-r-${i}`}
                x1={random(113, 119, 37)}
                y1={random(91 + i * 9, 95 + i * 9, 32 + i)}
                x2={random(121, 127, 38)}
                y2={random(91 + i * 9, 95 + i * 9, 32 + i)}
                stroke="#0088CC"
                strokeWidth="0.8"
                opacity="0.4"
              />
            ))}

            {/* Storage chip */}
            <rect x={random(160, 164, 59)} y={random(160, 164, 60)} width="22" height="18" fill="none" stroke="#0ABEFF" strokeWidth="1.2" opacity="0.5"/>
            <rect x={random(162, 166, 61)} y={random(162, 166, 62)} width="18" height="14" fill="#0088CC" opacity="0.08"/>
            <line x1={random(160, 164, 59)} y1={random(164, 168, 63)} x2={random(152, 158, 64)} y2={random(164, 168, 63)} stroke="#0088CC" strokeWidth="0.8" opacity="0.4"/>
            <line x1={random(160, 164, 59)} y1={random(170, 174, 65)} x2={random(152, 158, 64)} y2={random(170, 174, 65)} stroke="#0088CC" strokeWidth="0.8" opacity="0.4"/>
            
            {/* Small resistor */}
            <rect x={random(50, 55, 66)} y={random(55, 60, 67)} width="10" height="3" fill="none" stroke="#0088CC" strokeWidth="0.8" opacity="0.3"/>

            {/* Capacitor */}
            <g opacity="0.3">
              <line x1={random(130, 135, 72)} y1={random(45, 50, 73)} x2={random(130, 135, 72)} y2={random(53, 58, 74)} stroke="#0088CC" strokeWidth="1"/>
              <line x1={random(133, 138, 75)} y1={random(45, 50, 73)} x2={random(133, 138, 75)} y2={random(53, 58, 74)} stroke="#0088CC" strokeWidth="1"/>
            </g>

            {/* Mounting holes at corners */}
            <circle cx="10" cy="10" r="4" fill="none" stroke="#0088CC" strokeWidth="1" opacity="0.25"/>
            <circle cx="190" cy="10" r="4" fill="none" stroke="#0088CC" strokeWidth="1" opacity="0.25"/>
            <circle cx="10" cy="190" r="4" fill="none" stroke="#0088CC" strokeWidth="1" opacity="0.25"/>
            <circle cx="190" cy="190" r="4" fill="none" stroke="#0088CC" strokeWidth="1" opacity="0.25"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#circuit-bg-pattern)" />
      </svg>
    </div>
  );

  return createPortal(layer, document.body);
}
