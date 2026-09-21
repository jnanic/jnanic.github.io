'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import MermaidDiagram, { type MermaidSize } from '@/components/MermaidDiagram';

interface DiagramEntry {
  el: Element;
  source: string;
  size: MermaidSize;
  caption?: string;
}

interface Props {
  theme: 'dark' | 'light';
}

/**
 * Scans the article for `data-mermaid` placeholder divs (emitted by the
 * marked custom renderer in lib/blog.ts) and hydrates each one with a
 * <MermaidDiagram> portal.  The surrounding article stays server-rendered.
 */
export default function MermaidRenderer({ theme }: Props) {
  const [diagrams, setDiagrams] = useState<DiagramEntry[]>([]);

  useEffect(() => {
    const placeholders = Array.from(document.querySelectorAll('[data-mermaid]'));
    if (placeholders.length === 0) return;

    const decode = (encoded: string): string => {
      const bytes = Uint8Array.from(atob(encoded), (character) => character.charCodeAt(0));
      return new TextDecoder().decode(bytes);
    };

    const entries: DiagramEntry[] = placeholders.map((el) => {
      const encoded = el.getAttribute('data-mermaid') ?? '';
      const source = decode(encoded);
      const rawSize = el.getAttribute('data-mermaid-size');
      const size: MermaidSize = rawSize === 'compact' || rawSize === 'wide'
        ? rawSize
        : 'standard';
      const encodedCaption = el.getAttribute('data-mermaid-caption');
      const caption = encodedCaption ? decode(encodedCaption) : undefined;
      // Clear the placeholder content so the portal has a clean mount point
      el.innerHTML = '';
      return { el, source, size, caption };
    });

    setDiagrams(entries);
  }, []);

  // Re-run when theme changes so each diagram re-renders with the correct theme
  useEffect(() => {
    if (diagrams.length === 0) return;
    // Trigger a re-render by refreshing the diagrams array reference
    setDiagrams((prev) => [...prev]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme]);

  return (
    <>
      {diagrams.map(({ el, source, size, caption }, i) =>
        createPortal(
          <MermaidDiagram
            key={i}
            source={source}
            theme={theme}
            size={size}
            caption={caption}
          />,
          el,
        ),
      )}
    </>
  );
}
