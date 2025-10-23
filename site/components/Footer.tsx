'use client';

/**
 * Footer component
 * Minimal footer with copyright
 */
export default function Footer() {
  return (
    <footer className="px-4 pt-2 pb-3">
      <div className="flex items-center justify-center text-xs leading-none text-muted">
        <span>&copy; {new Date().getFullYear()} Yash Sharma • Made with ❤️ and vibes!</span>
      </div>
    </footer>
  );
}
