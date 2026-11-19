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
    const decode = (encoded: string): string => {
      const bytes = Uint8Array.from(atob(encoded), (character) => character.charCodeAt(0));
      return new TextDecoder().decode(bytes);
    };

    // Discover the article placeholders once the browser can lay them out.
    const frame = requestAnimationFrame(() => {
      const entries = Array.from(document.querySelectorAll('[data-mermaid]'), (el): DiagramEntry => {
        const source = decode(el.getAttribute('data-mermaid') ?? '');
        const rawSize = el.getAttribute('data-mermaid-size');
        const size = rawSize === 'compact' || rawSize === 'wide' ? rawSize : 'standard';
        const encodedCaption = el.getAttribute('data-mermaid-caption');
        const caption = encodedCaption ? decode(encodedCaption) : undefined;
        return { el, source, size, caption };
      });
      if (entries.length) setDiagrams(entries);
    });
    return () => cancelAnimationFrame(frame);
  }, []);

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
