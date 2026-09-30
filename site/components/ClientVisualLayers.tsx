'use client';

import dynamic from 'next/dynamic';

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

export default function ClientVisualLayers() {
  return (
    <>
      <CircuitBackground />
      <GlobalParticles />
      <CursorGlow />
    </>
  );
}
