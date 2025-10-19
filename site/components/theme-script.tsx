const THEME_STORAGE_KEY = "theme";

const scriptContent = `(() => {
  const root = document.documentElement;
  const setTheme = (theme) => {
    root.dataset.theme = theme;
    root.style.colorScheme = theme;
  };

  try {
    const stored = localStorage.getItem('${THEME_STORAGE_KEY}');
    if (stored === 'light' || stored === 'dark') {
      setTheme(stored);
      return;
    }
  } catch {
    // Ignore storage errors (e.g., private mode)
  }

  const media = window.matchMedia('(prefers-color-scheme: dark)');
  const theme = media.matches ? 'dark' : 'light';
  setTheme(theme);
})();`;

export function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: scriptContent }} />;
}
