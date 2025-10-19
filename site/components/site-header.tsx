"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Link from "next/link";
import type { Route } from "next";
import { NAV_LINKS } from "@/components/nav/nav-links";
import { ThemeToggle } from "@/components/theme-toggle";

type LinkItem = {
  href: string;
  label: string;
  isAnchor: boolean;
};

export function SiteHeader() {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  const items = useMemo<LinkItem[]>(
    () =>
      NAV_LINKS.map((link) => ({
        href: link.href,
        label: link.label,
        isAnchor: link.href.startsWith("#"),
      })),
    []
  );

  const close = useCallback(
    (focusTrigger = false) => {
      setOpen(false);
      if (focusTrigger && triggerRef.current) {
        triggerRef.current.focus();
      }
    },
    []
  );

  const toggle = useCallback(() => {
    setOpen((state) => !state);
  }, []);

  useEffect(() => {
    if (!open) return;

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close(true);
      }
    };

    const handleClick = (event: MouseEvent) => {
      const panel = panelRef.current;
      const trigger = triggerRef.current;
      if (!panel || !trigger) return;

      if (
        event.target instanceof Node &&
        !panel.contains(event.target) &&
        !trigger.contains(event.target)
      ) {
        close();
      }
    };

    window.addEventListener("keydown", handleKey);
    window.addEventListener("pointerdown", handleClick);
    return () => {
      window.removeEventListener("keydown", handleKey);
      window.removeEventListener("pointerdown", handleClick);
    };
  }, [close, open]);

  const handleLinkClick = useCallback(() => {
    close();
  }, [close]);

  return (
    <div className={`site-rail ${open ? "site-rail--open" : ""}`.trim()}>
      <button
        ref={triggerRef}
        type="button"
        className="site-rail__trigger"
        aria-controls="site-rail-panel"
        aria-expanded={open}
        onClick={toggle}
      >
        <span className="site-rail__trigger-bars" aria-hidden>
          <span />
          <span />
        </span>
        <span className="sr-only">{open ? "Close navigation" : "Open navigation"}</span>
      </button>

      <div
        ref={panelRef}
        id="site-rail-panel"
        className="site-rail__panel"
        data-state={open ? "open" : "closed"}
        aria-hidden={!open}
        onMouseEnter={() => setOpen(true)}
        onFocusCapture={() => setOpen(true)}
      >
        <nav aria-label="Primary">
          <ul className="site-rail__list">
            {items.map((item) => (
              <li key={item.href}>
                {item.isAnchor ? (
                  <a href={item.href} onClick={handleLinkClick}>
                    <span className="site-rail__dot" aria-hidden />
                    <span className="sr-only">{item.label}</span>
                  </a>
                ) : (
                  <Link href={item.href as Route} onClick={handleLinkClick}>
                    <span className="site-rail__dot" aria-hidden />
                    <span className="sr-only">{item.label}</span>
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>
        <div className="site-rail__theme">
          <ThemeToggle variant="compact" />
        </div>
      </div>
    </div>
  );
}
