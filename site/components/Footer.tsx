'use client';

/**
 * Footer component
 * Minimal footer with copyright
 */
export default function Footer() {
  return (
    <footer className="px-4 py-0 h-6">
      <div className="flex h-full items-center justify-center text-xs leading-none text-muted">
        <span>&copy; {new Date().getFullYear()} Yash Sharma • Made with ❤️ and vibes!</span>
      </div>
    </footer>
  );
}
