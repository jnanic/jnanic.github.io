'use client';

import { useEffect, useId, useRef, useState, type CSSProperties } from 'react';

export type MermaidSize = 'compact' | 'standard' | 'wide';

interface Props {
  /** Raw Mermaid source text. */
  source: string;
  theme: 'dark' | 'light';
  size: MermaidSize;
  /** Visible figure caption supplied by the Markdown fence metadata. */
  caption?: string;
}

const diagramFont = "var(--font-inter), Inter, ui-sans-serif, system-ui, sans-serif";
const compactMaxRenderedHeight = 720;
const compactMaxAspectRatio = 1.5;

const sharedThemeVariables = {
  fontFamily: diagramFont,
  fontSize: '15px',
};

const diagramPalettes = {
  light: {
    canvas: '#f7f9fc',
    canvasBorder: '#e8edf2',
    controlFill: '#ffffff',
    controlBorder: '#315b7d',
    controlText: '#17212b',
    sourceFill: '#e5f3ff',
    sourceBorder: '#397fbe',
    sourceText: '#0c61a5',
    approvedFill: '#edf7ef',
    approvedBorder: '#2f7d3b',
    approvedText: '#153b20',
    deniedFill: '#fff0ee',
    deniedBorder: '#b53a31',
    deniedText: '#6e231d',
    decisionFill: '#fff2d6',
    decisionBorder: '#b98620',
    decisionText: '#5a3c08',
    clusterFill: '#e8edf2',
    clusterBorder: '#e8edf2',
    clusterText: '#263543',
    connector: '#2b82d2',
    edgeLabelFill: '#f7f9fc',
    edgeLabelBorder: '#3978b8',
    edgeLabelText: '#1f4b70',
  },
  dark: {
    canvas: '#111111',
    canvasBorder: '#2b2b2b',
    controlFill: '#37393b',
    controlBorder: '#315b7d',
    controlText: '#f4f4f5',
    sourceFill: '#001f36',
    sourceBorder: '#234b68',
    sourceText: '#62b9f5',
    approvedFill: '#343936',
    approvedBorder: '#2f8f3d',
    approvedText: '#f4f4f5',
    deniedFill: '#383433',
    deniedBorder: '#c94436',
    deniedText: '#f4f4f5',
    decisionFill: '#40361f',
    decisionBorder: '#b9892f',
    decisionText: '#fff4d8',
    clusterFill: '#2b2b2b',
    clusterBorder: '#2b2b2b',
    clusterText: '#f4f4f5',
    connector: '#58a6dc',
    edgeLabelFill: '#111111',
    edgeLabelBorder: '#438fc0',
    edgeLabelText: '#f4f4f5',
  },
};

const themeVariables = {
  light: {
    ...sharedThemeVariables,
    darkMode: false,
    background: diagramPalettes.light.canvas,
    primaryColor: diagramPalettes.light.controlFill,
    primaryTextColor: diagramPalettes.light.controlText,
    primaryBorderColor: diagramPalettes.light.controlBorder,
    secondaryColor: diagramPalettes.light.sourceFill,
    secondaryTextColor: diagramPalettes.light.sourceText,
    secondaryBorderColor: diagramPalettes.light.sourceBorder,
    tertiaryColor: diagramPalettes.light.decisionFill,
    tertiaryTextColor: diagramPalettes.light.decisionText,
    tertiaryBorderColor: diagramPalettes.light.decisionBorder,
    lineColor: diagramPalettes.light.connector,
    textColor: diagramPalettes.light.controlText,
    nodeTextColor: diagramPalettes.light.controlText,
    mainBkg: diagramPalettes.light.controlFill,
    nodeBorder: diagramPalettes.light.controlBorder,
    clusterBkg: diagramPalettes.light.clusterFill,
    clusterBorder: diagramPalettes.light.clusterBorder,
    titleColor: diagramPalettes.light.clusterText,
    edgeLabelBackground: diagramPalettes.light.edgeLabelFill,
  },
  dark: {
    ...sharedThemeVariables,
    darkMode: true,
    background: diagramPalettes.dark.canvas,
    primaryColor: diagramPalettes.dark.controlFill,
    primaryTextColor: diagramPalettes.dark.controlText,
    primaryBorderColor: diagramPalettes.dark.controlBorder,
    secondaryColor: diagramPalettes.dark.sourceFill,
    secondaryTextColor: diagramPalettes.dark.sourceText,
    secondaryBorderColor: diagramPalettes.dark.sourceBorder,
    tertiaryColor: diagramPalettes.dark.decisionFill,
    tertiaryTextColor: diagramPalettes.dark.decisionText,
    tertiaryBorderColor: diagramPalettes.dark.decisionBorder,
    lineColor: diagramPalettes.dark.connector,
    textColor: diagramPalettes.dark.controlText,
    nodeTextColor: diagramPalettes.dark.controlText,
    mainBkg: diagramPalettes.dark.controlFill,
    nodeBorder: diagramPalettes.dark.controlBorder,
    clusterBkg: diagramPalettes.dark.clusterFill,
    clusterBorder: diagramPalettes.dark.clusterBorder,
    titleColor: diagramPalettes.dark.clusterText,
    edgeLabelBackground: diagramPalettes.dark.edgeLabelFill,
  },
};

const sharedThemeCss = `
  .nodeLabel, .nodeLabel p, .edgeLabel, .edgeLabel p, .cluster-label, .cluster-label p {
    font-family: ${diagramFont};
  }
  .nodeLabel, .nodeLabel p {
    font-size: 15px;
    font-weight: 600;
    line-height: 1.25;
  }
  .nodeLabel p {
    padding: 0 6px;
  }
  .edgeLabel, .edgeLabel p {
    font-size: 11px;
    font-weight: 600;
    line-height: 1.25;
  }
  .cluster-label, .cluster-label p {
    font-size: 13px;
    font-weight: 600;
    line-height: 1.3;
  }
`;

const semanticRoleSelector = [
  '.node.source',
  '.node.control',
  '.node.approved',
  '.node.denied',
  '.node.decision',
].join(', ');

interface PreparedSvg {
  markup: string;
  naturalWidth: number;
  naturalHeight: number;
  hasSemanticRoles: boolean;
}

interface MermaidBounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

function getTranslation(element: Element) {
  const transform = element.getAttribute('transform') ?? '';
  const match = transform.match(
    /translate\(\s*(-?(?:\d+(?:\.\d+)?|\.\d+))[,\s]+(-?(?:\d+(?:\.\d+)?|\.\d+))\s*\)/,
  );
  if (!match) return { x: 0, y: 0 };
  return { x: Number(match[1]), y: Number(match[2]) };
}

function getNodeBounds(node: SVGGElement): MermaidBounds | null {
  const translation = getTranslation(node);
  const rect = node.querySelector<SVGRectElement>('rect.label-container');
  if (!rect) return null;

  const x = translation.x + Number(rect.getAttribute('x') ?? 0);
  const y = translation.y + Number(rect.getAttribute('y') ?? 0);
  const width = Number(rect.getAttribute('width') ?? 0);
  const height = Number(rect.getAttribute('height') ?? 0);
  if (![x, y, width, height].every(Number.isFinite) || width <= 0 || height <= 0) return null;

  return { x, y, width, height };
}

function includePanelInViewBox(
  svgElement: SVGSVGElement,
  root: SVGGElement,
  panelBounds: MermaidBounds,
) {
  const values = svgElement.getAttribute('viewBox')?.trim().split(/[\s,]+/).map(Number);
  if (!values || values.length !== 4 || values.some((value) => !Number.isFinite(value))) return;

  const [viewX, viewY, viewWidth, viewHeight] = values;
  const rootTranslation = getTranslation(root);
  const margin = 2;
  const panelLeft = panelBounds.x + rootTranslation.x - margin;
  const panelTop = panelBounds.y + rootTranslation.y - margin;
  const panelRight = panelBounds.x + panelBounds.width + rootTranslation.x + margin;
  const panelBottom = panelBounds.y + panelBounds.height + rootTranslation.y + margin;
  const nextX = Math.min(viewX, panelLeft);
  const nextY = Math.min(viewY, panelTop);
  const nextRight = Math.max(viewX + viewWidth, panelRight);
  const nextBottom = Math.max(viewY + viewHeight, panelBottom);

  svgElement.setAttribute(
    'viewBox',
    `${nextX} ${nextY} ${nextRight - nextX} ${nextBottom - nextY}`,
  );
}

function addSyntheticManagementPanels(svgElement: SVGSVGElement, source: string) {
  const panelPattern = /^\s*%%\s*panel\s+([\w-]+)\s+"([^"]+)"\s*:\s*([\w-]+(?:\s*,\s*[\w-]+)+)\s*(?:%%)?\s*$/gm;
  const nodes = Array.from(svgElement.querySelectorAll<SVGGElement>('.node[id], .node[data-id]'));

  for (const match of source.matchAll(panelPattern)) {
    const [, panelId, panelLabel, memberList] = match;
    const memberIds = memberList.split(',').map((id) => id.trim());
    const members = memberIds.map((id) => nodes.find((node) => {
      if (node.dataset.id === id || node.id === id) return true;

      // Mermaid namespaces rendered IDs with the SVG ID, for example
      // "mermaid-r1-flowchart-DEV-2". Match the complete source ID and counter.
      const prefix = `${svgElement.id}-`;
      const localId = node.id.startsWith(prefix) ? node.id.slice(prefix.length) : node.id;
      const nodePrefix = `flowchart-${id}-`;
      return localId.startsWith(nodePrefix) && /^\d+$/.test(localId.slice(nodePrefix.length));
    }));
    const missingIds = memberIds.filter((_, index) => !members[index]);
    if (missingIds.length) {
      throw new Error(`Management panel "${panelLabel}" could not find nodes: ${missingIds.join(', ')}`);
    }

    const memberNodes = members as SVGGElement[];
    memberNodes.forEach((node) => node.setAttribute('data-management-panel', panelId));
    const bounds = memberNodes.map(getNodeBounds);
    if (bounds.some((box) => !box)) {
      throw new Error(`Management panel "${panelLabel}" requires rectangular nodes with valid bounds.`);
    }

    const memberBounds = bounds as MermaidBounds[];
    const left = Math.min(...memberBounds.map((box) => box.x));
    const top = Math.min(...memberBounds.map((box) => box.y));
    const right = Math.max(...memberBounds.map((box) => box.x + box.width));
    const bottom = Math.max(...memberBounds.map((box) => box.y + box.height));
    const root = memberNodes[0].closest<SVGGElement>('g.root');
    if (!root || memberNodes.some((node) => node.closest('g.root') !== root)) {
      throw new Error(`Management panel "${panelLabel}" requires nodes in the same top-level flow.`);
    }

    const horizontalPadding = 26;
    const titleSpace = 38;
    const bottomPadding = 26;
    const panelX = left - horizontalPadding;
    const panelY = top - titleSpace;
    const panelWidth = right - left + horizontalPadding * 2;
    const panelHeight = bottom - top + titleSpace + bottomPadding;
    // Center the heading above the top row, even when a lower branch extends
    // the panel sideways. This keeps it between the two incoming lane arrows.
    const topRowBounds = memberBounds.filter((box) => Math.abs(box.y - top) < 1);
    const titleX = (
      Math.min(...topRowBounds.map((box) => box.x))
      + Math.max(...topRowBounds.map((box) => box.x + box.width))
    ) / 2;

    const panel = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    panel.setAttribute('class', 'cluster management synthetic-management-panel');
    panel.setAttribute('data-id', panelId);
    panel.setAttribute('aria-hidden', 'true');
    panel.setAttribute('pointer-events', 'none');

    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('x', String(panelX));
    rect.setAttribute('y', String(panelY));
    rect.setAttribute('width', String(panelWidth));
    rect.setAttribute('height', String(panelHeight));
    panel.appendChild(rect);

    const label = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    label.setAttribute('class', 'cluster-label');
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', String(titleX));
    text.setAttribute('y', String(panelY + 18));
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('dominant-baseline', 'middle');
    text.textContent = panelLabel;
    label.appendChild(text);
    panel.appendChild(label);

    // SVG paint order puts this surface behind every connector and node.
    // It is added after layout, so it cannot change any edge's route or endpoint.
    root.insertBefore(panel, root.firstChild);
    includePanelInViewBox(svgElement, root, {
      x: panelX,
      y: panelY,
      width: panelWidth,
      height: panelHeight,
    });
  }
}

function prepareSvg(svg: string, source: string): PreparedSvg {
  const host = document.createElement('div');
  host.innerHTML = svg;

  const svgElement = host.querySelector('svg');
  if (!svgElement) {
    return { markup: svg, naturalWidth: 0, naturalHeight: 0, hasSemanticRoles: false };
  }

  svgElement.removeAttribute('width');
  svgElement.removeAttribute('height');
  svgElement.style.removeProperty('width');
  svgElement.style.removeProperty('height');
  svgElement.style.removeProperty('max-width');
  svgElement.setAttribute('preserveAspectRatio', 'xMidYMid meet');

  addSyntheticManagementPanels(svgElement, source);

  const viewBox = svgElement.getAttribute('viewBox')?.trim().split(/[\s,]+/);
  const naturalWidth = viewBox && viewBox.length === 4 ? Number(viewBox[2]) : 0;
  const naturalHeight = viewBox && viewBox.length === 4 ? Number(viewBox[3]) : 0;

  const hasSemanticRoles = Boolean(svgElement.querySelector(semanticRoleSelector));
  if (hasSemanticRoles) {
    svgElement.querySelectorAll('.node > rect.label-container').forEach((node) => {
      node.setAttribute('rx', '14');
      node.setAttribute('ry', '14');
    });
    svgElement.querySelectorAll('.cluster > rect').forEach((cluster) => {
      const isManagementPanel = cluster.parentElement?.classList.contains('management');
      cluster.setAttribute('rx', isManagementPanel ? '0' : '8');
      cluster.setAttribute('ry', isManagementPanel ? '0' : '8');
    });
  }

  return {
    markup: svgElement.outerHTML,
    naturalWidth: Number.isFinite(naturalWidth) ? naturalWidth : 0,
    naturalHeight: Number.isFinite(naturalHeight) ? naturalHeight : 0,
    hasSemanticRoles,
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
  const [naturalHeight, setNaturalHeight] = useState(0);
  const [viewportContentWidth, setViewportContentWidth] = useState(0);
  const [hasSemanticRoles, setHasSemanticRoles] = useState(false);
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
          look: 'classic',
          fontFamily: sharedThemeVariables.fontFamily,
          themeVariables: themeVariables[theme],
          themeCSS: sharedThemeCss,
          flowchart: {
            useMaxWidth: false,
            htmlLabels: true,
            curve: 'linear',
            nodeSpacing: 44,
            rankSpacing: 56,
            padding: 18,
            wrappingWidth: 170,
          },
        });

        const { svg } = await mermaid.render(diagramId, source);
        if (cancelled) return;

        const prepared = prepareSvg(svg, source);
        setRenderedSvg(prepared.markup);
        setNaturalWidth(prepared.naturalWidth);
        setNaturalHeight(prepared.naturalHeight);
        setHasSemanticRoles(prepared.hasSemanticRoles);
        setError(null);
      } catch (err) {
        if (!cancelled) {
          setRenderedSvg('');
          setNaturalWidth(0);
          setNaturalHeight(0);
          setHasSemanticRoles(false);
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
      const styles = window.getComputedStyle(viewport);
      const horizontalPadding = parseFloat(styles.paddingLeft) + parseFloat(styles.paddingRight);
      const contentWidth = viewport.clientWidth - horizontalPadding;
      setViewportContentWidth(Math.max(contentWidth, 0));
      setIsOverfull(naturalWidth > contentWidth + 1);
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

  const availableInlineWidth = viewportContentWidth || naturalWidth;
  const unconstrainedInlineWidth = Math.min(naturalWidth, availableInlineWidth);
  const unconstrainedInlineHeight = naturalWidth > 0
    ? naturalHeight * (unconstrainedInlineWidth / naturalWidth)
    : 0;
  const compactHeightLimit = Math.min(
    compactMaxRenderedHeight,
    availableInlineWidth * compactMaxAspectRatio,
  );
  const isCompactHeightConstrained = size === 'compact'
    && unconstrainedInlineHeight > compactHeightLimit;
  const inlineScale = isCompactHeightConstrained
    ? compactHeightLimit / unconstrainedInlineHeight
    : 1;
  const inlineDiagramWidth = unconstrainedInlineWidth * inlineScale;

  const canExpand = Boolean(renderedSvg)
    && (size === 'wide' || isOverfull || isCompactHeightConstrained);

  const openExpanded = () => {
    setInlineHeight(inlineViewportRef.current?.getBoundingClientRect().height ?? 0);
    setIsExpanded(true);
  };

  const handleDialogClose = () => {
    setIsExpanded(false);
    requestAnimationFrame(() => expandButtonRef.current?.focus());
  };

  const palette = diagramPalettes[theme];
  const figureStyle = {
    '--mermaid-canvas': palette.canvas,
    '--mermaid-canvas-border': palette.canvasBorder,
    '--mermaid-control-fill': palette.controlFill,
    '--mermaid-control-border': palette.controlBorder,
    '--mermaid-control-text': palette.controlText,
    '--mermaid-source-fill': palette.sourceFill,
    '--mermaid-source-border': palette.sourceBorder,
    '--mermaid-source-text': palette.sourceText,
    '--mermaid-approved-fill': palette.approvedFill,
    '--mermaid-approved-border': palette.approvedBorder,
    '--mermaid-approved-text': palette.approvedText,
    '--mermaid-denied-fill': palette.deniedFill,
    '--mermaid-denied-border': palette.deniedBorder,
    '--mermaid-denied-text': palette.deniedText,
    '--mermaid-decision-fill': palette.decisionFill,
    '--mermaid-decision-border': palette.decisionBorder,
    '--mermaid-decision-text': palette.decisionText,
    '--mermaid-cluster-fill': palette.clusterFill,
    '--mermaid-cluster-border': palette.clusterBorder,
    '--mermaid-cluster-text': palette.clusterText,
    '--mermaid-connector': palette.connector,
    '--mermaid-edge-label-fill': palette.edgeLabelFill,
    '--mermaid-edge-label-border': palette.edgeLabelBorder,
    '--mermaid-edge-label-text': palette.edgeLabelText,
  } as CSSProperties;

  return (
    <figure
      className={`mermaid-figure mermaid-figure--${size}${hasSemanticRoles ? ' mermaid-figure--semantic' : ''}`}
      style={figureStyle}
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
            style={inlineDiagramWidth ? { inlineSize: `${inlineDiagramWidth}px` } : undefined}
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
