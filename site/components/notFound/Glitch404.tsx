import Link from 'next/link';

export default function Glitch404() {
  return (
    <section className="relative flex min-h-screen items-center justify-center px-4">
      <div className="text-center">
        <div className="glitch-container">
          <h1 className="glitch" data-text="404">404</h1>
        </div>
        <p className="mt-4 text-xl text-muted">This page short-circuited.</p>
        <div className="mt-8">
          <Link href="/" className="rounded-lg border-2 border-brand-zaffre px-6 py-3 font-medium transition-all hover:bg-brand-zaffre hover:text-white">Back Home</Link>
        </div>
      </div>
    </section>
  );
}
