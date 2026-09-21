'use client';

import { useEffect, useId, useRef, useState } from 'react';

export type MermaidSize = 'compact' | 'standard' | 'wide';

interface Props {
  /** Raw Mermaid source text. */
  source: string;
  theme: 'dark' | 'light';
  size: MermaidSize;
  /** Visible figure caption supplied by the Markdown fence metadata. */
  caption?: string;
}

const sharedThemeVariables = {
  fontFamily: "var(--font-inter), Inter, ui-sans-serif, system-ui, sans-serif",
  fontSize: '16px',
};

const themeVariables = {
  light: {
    ...sharedThemeVariables,
    background: '#ffffff',
    primaryColor: '#e8f7fc',
    primaryTextColor: '#102a33',
    primaryBorderColor: '#006f8f',
    secondaryColor: '#f2f5f6',
    secondaryTextColor: '#102a33',
    secondaryBorderColor: '#49656f',
    tertiaryColor: '#fff7df',
    tertiaryTextColor: '#332b12',
    tertiaryBorderColor: '#806514',
    lineColor: '#3d5963',
    textColor: '#102a33',
    nodeTextColor: '#102a33',
    mainBkg: '#e8f7fc',
    nodeBorder: '#006f8f',
    clusterBkg: '#f6fafb',
    clusterBorder: '#49656f',
    edgeLabelBackground: '#ffffff',
  },
  dark: {
    ...sharedThemeVariables,
    background: '#000500',
    primaryColor: '#08242d',
    primaryTextColor: '#f7fbfc',
    primaryBorderColor: '#57cfff',
    secondaryColor: '#17242a',
    secondaryTextColor: '#f7fbfc',
    secondaryBorderColor: '#8aa3ad',
    tertiaryColor: '#2d2612',
    tertiaryTextColor: '#fff8df',
    tertiaryBorderColor: '#d9b84f',
    lineColor: '#c1d2d8',
    textColor: '#f7fbfc',
    nodeTextColor: '#f7fbfc',
    mainBkg: '#08242d',
    nodeBorder: '#57cfff',
    clusterBkg: '#071317',
    clusterBorder: '#8aa3ad',
    edgeLabelBackground: '#000500',
  },
};

function prepareSvg(svg: string): { markup: string; naturalWidth: number } {
  const host = document.createElement('div');
  host.innerHTML = svg;

  const svgElement = host.querySelector('svg');
  if (!svgElement) return { markup: svg, naturalWidth: 0 };

  const viewBox = svgElement.getAttribute('viewBox')?.trim().split(/[\s,]+/);
  const naturalWidth = viewBox && viewBox.length === 4 ? Number(viewBox[2]) : 0;

  svgElement.removeAttribute('width');
  svgElement.removeAttribute('height');
  svgElement.style.removeProperty('width');
  svgElement.style.removeProperty('height');
  svgElement.style.removeProperty('max-width');
  svgElement.setAttribute('preserveAspectRatio', 'xMidYMid meet');

  return {
    markup: svgElement.outerHTML,
    naturalWidth: Number.isFinite(naturalWidth) ? naturalWidth : 0,
  };
}

export default function MermaidDiagram({ source, theme, size, caption }: Props) {
  const inlineViewportRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const expandButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const uid = useId().replace(/:/g, '');
  const diagramId = `mermaid-${uid}`;
  const captionId = `${diagramId}-caption`;
  const dialogTitleId = `${diagramId}-dialog-title`;

  const [error, setError] = useState<string | null>(null);
  const [renderedSvg, setRenderedSvg] = useState('');
  const [naturalWidth, setNaturalWidth] = useState(0);
  const [isOverfull, setIsOverfull] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [inlineHeight, setInlineHeight] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function render() {
      try {
        const mermaid = (await import('mermaid')).default;

        mermaid.initialize({
          startOnLoad: false,
          securityLevel: 'strict',
          theme: 'base',
          fontFamily: sharedThemeVariables.fontFamily,
          themeVariables: themeVariables[theme],
          flowchart: {
            useMaxWidth: false,
            htmlLabels: true,
            nodeSpacing: 32,
            rankSpacing: 44,
            padding: 12,
            wrappingWidth: 180,
          },
        });

        const { svg } = await mermaid.render(diagramId, source);
        if (cancelled) return;

        const prepared = prepareSvg(svg);
        setRenderedSvg(prepared.markup);
        setNaturalWidth(prepared.naturalWidth);
        setError(null);
      } catch (err) {
        if (!cancelled) {
          setRenderedSvg('');
          setNaturalWidth(0);
          setError(err instanceof Error ? err.message : 'Diagram render failed');
        }
      }
    }

    render();
    return () => { cancelled = true; };
  }, [source, theme, diagramId]);

  useEffect(() => {
    const viewport = inlineViewportRef.current;
    if (!viewport || !renderedSvg) return;

    const updateOverflow = () => {
      setIsOverfull(naturalWidth > viewport.clientWidth + 1);
    };

    updateOverflow();
    const observer = new ResizeObserver(updateOverflow);
    observer.observe(viewport);
    return () => observer.disconnect();
  }, [naturalWidth, renderedSvg]);

  useEffect(() => {
    if (!isExpanded) return;

    const dialog = dialogRef.current;
    if (!dialog) return;

    const previousBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    if (!dialog.open) dialog.showModal();
    closeButtonRef.current?.focus();

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      if (dialog.open) dialog.close();
    };
  }, [isExpanded]);

  const canExpand = Boolean(renderedSvg) && (size === 'wide' || isOverfull);

  const openExpanded = () => {
    setInlineHeight(inlineViewportRef.current?.getBoundingClientRect().height ?? 0);
    setIsExpanded(true);
  };

  const handleDialogClose = () => {
    setIsExpanded(false);
    requestAnimationFrame(() => expandButtonRef.current?.focus());
  };

  return (
    <figure
      className={`mermaid-figure mermaid-figure--${size}`}
      aria-labelledby={caption ? captionId : undefined}
    >
      <div
        ref={inlineViewportRef}
        className="mermaid-viewport"
        style={isExpanded && inlineHeight ? { minHeight: `${inlineHeight}px` } : undefined}
      >
        {!error && renderedSvg && !isExpanded && (
          <div
            className="mermaid-diagram"
            style={naturalWidth ? { inlineSize: `${naturalWidth}px` } : undefined}
            dangerouslySetInnerHTML={{ __html: renderedSvg }}
          />
        )}
        {!error && !renderedSvg && (
          <p className="mermaid-status" role="status">Rendering diagram…</p>
        )}
        {error && (
          <div className="mermaid-error" role="alert">
            <p>Mermaid diagram error: {error}</p>
          </div>
        )}
      </div>

      {caption && <figcaption id={captionId}>{caption}</figcaption>}

      {canExpand && (
        <button
          ref={expandButtonRef}
          type="button"
          className="mermaid-expand-button"
          aria-describedby={caption ? captionId : undefined}
          onClick={openExpanded}
        >
          Expand diagram
        </button>
      )}

      <dialog
        ref={dialogRef}
        className="mermaid-dialog"
        aria-labelledby={dialogTitleId}
        onClose={handleDialogClose}
      >
        <div className="mermaid-dialog__header">
          <p id={dialogTitleId}>{caption ?? 'Expanded diagram'}</p>
          <button
            ref={closeButtonRef}
            type="button"
            className="mermaid-dialog__close"
            onClick={() => dialogRef.current?.close()}
          >
            Close
          </button>
        </div>
        <div className="mermaid-dialog__viewport">
          {renderedSvg && isExpanded && (
            <div
              className="mermaid-diagram mermaid-diagram--expanded"
              style={naturalWidth ? { inlineSize: `${naturalWidth}px` } : undefined}
              dangerouslySetInnerHTML={{ __html: renderedSvg }}
            />
          )}
        </div>
      </dialog>
    </figure>
  );
}
