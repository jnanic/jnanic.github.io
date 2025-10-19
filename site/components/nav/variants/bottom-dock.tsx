"use client";

import Link from "next/link";
import type { Route } from "next";
import { NAV_LINKS } from "@/components/nav/nav-links";

export function BottomDockNav() {
  return (
    <div className="nav-lab__dock" aria-label="Bottom dock navigation">
      <nav>
        <ul>
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              {link.href.startsWith("#") ? (
                <a href={link.href}>
                  <span className="nav-lab__icon" aria-hidden />
                  <span className="sr-only">{link.label}</span>
                </a>
              ) : (
                <Link href={link.href as Route}>
                  <span className="nav-lab__icon" aria-hidden />
                  <span className="sr-only">{link.label}</span>
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
