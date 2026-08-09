'use client';

import { useEffect, useRef, useState, useId } from 'react';

interface Props {
  /** Raw Mermaid source text */
  source: string;
  theme: 'dark' | 'light';
  /** Optional max-width in pixels. When omitted the diagram is 100% wide. */
  width?: number;
}

export default function MermaidDiagram({ source, theme, width }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const uid = useId().replace(/:/g, '');
  const diagramId = `mermaid-${uid}`;
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function render() {
      try {
        const mermaid = (await import('mermaid')).default;

        mermaid.initialize({
          startOnLoad: false,
          theme: theme === 'dark' ? 'dark' : 'default',
          securityLevel: 'strict',
          fontFamily: "ui-monospace, 'Cascadia Code', 'Source Code Pro', monospace",
        });

        if (cancelled || !containerRef.current) return;

        const { svg } = await mermaid.render(diagramId, source);

        if (cancelled || !containerRef.current) return;

        containerRef.current.innerHTML = svg;
        setError(null);

        // Make SVG responsive, applying optional author-specified max-width
        const svgEl = containerRef.current.querySelector('svg');
        if (svgEl) {
          svgEl.removeAttribute('width');
          svgEl.removeAttribute('height');
          svgEl.style.maxWidth = width ? `${width}px` : '100%';
          svgEl.style.height = 'auto';
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Diagram render failed');
        }
      }
    }

    render();
    return () => { cancelled = true; };
  // Re-render when source, theme, or width changes
  }, [source, theme, width, diagramId]);

  if (error) {
    return (
      <div className="mermaid-diagram mermaid-error" role="alert">
        <p className="text-sm text-[var(--color-muted)] font-mono">
          ⚠ Mermaid diagram error: {error}
        </p>
      </div>
    );
  }

  return <div ref={containerRef} className="mermaid-diagram" />;
}
