"use client";

import { useState } from "react";
import Link from "next/link";
import type { Route } from "next";
import { ThemeToggle } from "@/components/theme-toggle";
import { NAV_LINKS } from "@/components/nav/nav-links";

export function FloatingOrbNav() {
  const [open, setOpen] = useState(false);

  return (
    <div className={`nav-lab__floating ${open ? "nav-lab__floating--open" : ""}`.trim()}>
      <button
        type="button"
        className="nav-lab__floating-trigger"
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <span className="nav-lab__floating-bars" aria-hidden>
          <span />
          <span />
          <span />
        </span>
        <span className="sr-only">{open ? "Close navigation" : "Open navigation"}</span>
      </button>

      <div className="nav-lab__floating-dock" aria-hidden={!open}>
        <nav aria-label="Floating orb navigation">
          <ul>
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                {link.href.startsWith("#") ? (
                  <a href={link.href}>{link.label}</a>
                ) : (
                  <Link href={link.href as Route}>{link.label}</Link>
                )}
              </li>
            ))}
          </ul>
        </nav>
        <ThemeToggle />
      </div>
    </div>
  );
}
