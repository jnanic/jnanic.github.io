"use client";

import { useMemo } from "react";
import Link from "next/link";
import type { Route } from "next";
import { NAV_LINKS } from "@/components/nav/nav-links";

export function VerticalRailNav() {
  const routeLinks = useMemo(
    () =>
      NAV_LINKS.map((link) => ({
        ...link,
        isAnchor: link.href.startsWith("#"),
      })),
    []
  );

  return (
    <div className="nav-lab__rail" aria-label="Vertical rail navigation">
      <ul>
        {routeLinks.map((link) => (
          <li key={link.href}>
            {link.isAnchor ? (
              <a href={link.href}>
                <span className="nav-lab__dot" aria-hidden />
                <span className="sr-only">{link.label}</span>
              </a>
            ) : (
              <Link href={link.href as Route}>
                <span className="nav-lab__dot" aria-hidden />
                <span className="sr-only">{link.label}</span>
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
