'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import MermaidDiagram from '@/components/MermaidDiagram';

interface DiagramEntry {
  el: Element;
  source: string;
  width?: number;
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

    const entries: DiagramEntry[] = placeholders.map((el) => {
      const encoded = el.getAttribute('data-mermaid') ?? '';
      const source = atob(encoded);
      const rawWidth = el.getAttribute('data-mermaid-width');
      const width = rawWidth ? parseInt(rawWidth, 10) : undefined;
      // Clear the placeholder content so the portal has a clean mount point
      el.innerHTML = '';
      return { el, source, width };
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
      {diagrams.map(({ el, source, width }, i) =>
        createPortal(
          <MermaidDiagram key={i} source={source} theme={theme} width={width} />,
          el,
        ),
      )}
    </>
  );
}
