'use client';

import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import { useSyncExternalStore } from 'react';

const CircuitBackground = dynamic(() => import('@/components/CircuitBackground'), {
  ssr: false,
  loading: () => null,
});
const GlobalParticles = dynamic(() => import('@/components/GlobalParticles'), {
  ssr: false,
  loading: () => null,
});
const CursorGlow = dynamic(() => import('@/components/CursorGlow'), {
  ssr: false,
  loading: () => null,
});

const reducedMotionQuery = '(prefers-reduced-motion: reduce)';

function subscribeToReducedMotion(onChange: () => void) {
  const media = window.matchMedia(reducedMotionQuery);
  media.addEventListener('change', onChange);
  return () => media.removeEventListener('change', onChange);
}

function getReducedMotion() {
  return window.matchMedia(reducedMotionQuery).matches;
}

function getServerReducedMotion() {
  return true;
}

export default function ClientVisualLayers() {
  const pathname = usePathname();
  const isBlogPost = /^\/blog\/.+/.test(pathname ?? '');
  const reducedMotion = useSyncExternalStore(
    subscribeToReducedMotion,
    getReducedMotion,
    getServerReducedMotion,
  );

  return (
    <>
      <CircuitBackground />
      {!reducedMotion && (
        <>
          {!isBlogPost && <GlobalParticles />}
          <CursorGlow />
        </>
      )}
    </>
  );
}
