'use client';

import { useEffect, useState } from 'react';
import MermaidRenderer from '@/components/MermaidRenderer';

/** Reads the live theme from the <html> class and re-passes it to MermaidRenderer. */
export default function MermaidRendererWithTheme() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    function readTheme(): 'dark' | 'light' {
      return document.documentElement.classList.contains('light') ? 'light' : 'dark';
    }

    setTheme(readTheme());

    // Watch for theme class changes on <html>
    const observer = new MutationObserver(() => setTheme(readTheme()));
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });
    return () => observer.disconnect();
  }, []);

  return <MermaidRenderer theme={theme} />;
}
