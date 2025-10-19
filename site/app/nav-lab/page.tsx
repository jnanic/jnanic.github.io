import Link from "next/link";
import { FloatingOrbNav } from "@/components/nav/variants/floating-orb";
import { VerticalRailNav } from "@/components/nav/variants/vertical-rail";
import { BottomDockNav } from "@/components/nav/variants/bottom-dock";

export const metadata = {
  title: "Navigation Lab",
  description: "Preview different icon-only navigation concepts.",
};

export default function NavLabPage() {
  return (
    <main className="nav-lab">
      <header className="nav-lab__header">
        <h1>Navigation Lab</h1>
        <p>Select the concept you like. Once chosen, we can integrate it into the main page.</p>
        <Link href="/" className="nav-lab__back">
          ← Back to home
        </Link>
      </header>
      <section className="nav-lab__grid">
        <article className="nav-lab__card">
          <h2>Floating Orb</h2>
          <p>
            A floating circular trigger that expands into a compact hovercard of links with a theme toggle.
            The menu scales in and out.
          </p>
          <div className="nav-lab__preview">
            <FloatingOrbNav />
          </div>
        </article>

        <article className="nav-lab__card">
          <h2>Vertical Rail</h2>
          <p>
            Minimal dot-based vertical rail aligned to the right edge. Hover or focus reveals labels. Ideal
            for a futuristic vibe.
          </p>
          <div className="nav-lab__preview">
            <VerticalRailNav />
          </div>
        </article>

        <article className="nav-lab__card">
          <h2>Bottom Dock</h2>
          <p>
            A pill-shaped dock anchored near the bottom right, featuring geometric icons that scale on
            focus. Great for mobile-like interactions.
          </p>
          <div className="nav-lab__preview">
            <BottomDockNav />
          </div>
        </article>
      </section>
    </main>
  );
}
