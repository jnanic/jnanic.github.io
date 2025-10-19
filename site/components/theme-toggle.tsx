"use client";

import { useCallback, useEffect, useState } from "react";

const THEME_STORAGE_KEY = "theme";
type Theme = "light" | "dark";
type ThemeToggleVariant = "default" | "compact";

function getInitialTheme(): Theme {
  if (typeof document === "undefined") {
    return "dark";
  }

  const { dataset } = document.documentElement;
  const existing = dataset.theme;
  if (existing === "light" || existing === "dark") {
    return existing;
  }

  if (typeof window !== "undefined") {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    return media.matches ? "dark" : "light";
  }

  return "dark";
}

type ThemeToggleProps = {
  variant?: ThemeToggleVariant;
};

export function ThemeToggle({ variant = "default" }: ThemeToggleProps) {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    if (typeof document === "undefined") return;
    const next = theme;

    document.documentElement.dataset.theme = next;
    document.documentElement.style.colorScheme = next;

    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // ignore write errors
    }
  }, [theme]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (event: MediaQueryListEvent) => {
      setTheme(event.matches ? "dark" : "light");
    };

    media.addEventListener("change", handler);
    return () => media.removeEventListener("change", handler);
  }, []);

  const toggle = useCallback(() => {
    setTheme((current) => (current === "dark" ? "light" : "dark"));
  }, []);

  const isDark = theme === "dark";

  const ariaLabel = isDark ? "Switch to light theme" : "Switch to dark theme";
  const className = [
    "theme-toggle",
    variant === "compact" ? "theme-toggle--compact" : null,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type="button"
      onClick={toggle}
      className={className}
      aria-pressed={isDark}
      aria-label={ariaLabel}
    >
      {variant === "compact" ? (
        <>
          <span aria-hidden className="theme-toggle__glyph">
            {isDark ? "☾" : "☀"}
          </span>
          <span className="sr-only">{ariaLabel}</span>
        </>
      ) : (
        <>
          <span aria-hidden className="theme-toggle__icon theme-toggle__icon--sun">
            ☀
          </span>
          <span aria-hidden className="theme-toggle__icon theme-toggle__icon--moon">
            ☾
          </span>
          <span className="theme-toggle__label">{isDark ? "Dark" : "Light"}</span>
        </>
      )}
    </button>
  );
}
