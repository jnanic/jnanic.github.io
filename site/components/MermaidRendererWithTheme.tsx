'use client';

import MermaidRenderer from '@/components/MermaidRenderer';
import { useTheme } from './ThemeProvider';

export default function MermaidRendererWithTheme() {
  const { theme } = useTheme();

  return theme === null ? null : <MermaidRenderer theme={theme} />;
}
