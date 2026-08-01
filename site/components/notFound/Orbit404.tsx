import Link from 'next/link';

export default function Orbit404() {
  return (
    <section className="relative flex min-h-screen items-center justify-center px-4">
      <div className="relative h-64 w-64">
        <div className="orbit-center">404</div>
        <div className="orbit-dot orbit-1" />
        <div className="orbit-dot orbit-2" />
        <div className="orbit-dot orbit-3" />
      </div>
      <div className="absolute bottom-20 w-full text-center">
        <p className="text-lg text-muted">Page not found — try the home route.</p>
        <div className="mt-4">
          <Link href="/" className="rounded-lg border-2 border-brand-zaffre px-6 py-3 font-medium transition-all hover:bg-brand-zaffre hover:text-white">Back Home</Link>
        </div>
      </div>
    </section>
  );
}
