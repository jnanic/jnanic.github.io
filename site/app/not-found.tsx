'use client';

import Link from 'next/link';

// Choose one of the designs by toggling the import
import Neon404 from '@/components/notFound/Neon404';
// import Glitch404 from '@/components/notFound/Glitch404';
// import Orbit404 from '@/components/notFound/Orbit404';
// import Ascii404 from '@/components/notFound/Ascii404';

export default function NotFound() {
  return <Neon404 />;
}
