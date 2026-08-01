import Link from 'next/link';

export default function Neon404() {
  return (
    <section className="relative flex min-h-screen items-center justify-center px-4">
      <div className="relative z-10 text-center">
        {/* Stacked digits with individual glow colours for depth */}
        <div className="relative inline-flex gap-2 select-none">
          {['4', '0', '4'].map((char, i) => (
            <span
              key={i}
              className="text-[11rem] leading-none font-black tracking-tighter"
              style={{
                color: i === 1 ? 'transparent' : 'var(--color-primary)',
                WebkitTextStroke: i === 1 ? '2px var(--color-primary)' : undefined,
                textShadow:
                  i === 1
                    ? '0 0 30px rgba(10,190,255,0.5)'
                    : '0 0 12px rgba(10,190,255,1), 0 0 40px rgba(10,190,255,0.5), 0 0 80px rgba(124,58,237,0.3)',
                filter: i === 1 ? 'none' : 'brightness(1.15)',
              }}
            >
              {char}
            </span>
          ))}
        </div>
        <p className="mt-6 text-xl text-muted">Looks like you took a wrong turn in the circuit.</p>
        <div className="mt-8 flex items-center justify-center">
          <Link href="/" className="rounded-lg border-2 border-brand-zaffre px-6 py-3 font-medium transition-all hover:bg-brand-zaffre hover:text-white">Back Home</Link>
        </div>
      </div>
      <div className="pointer-events-none absolute inset-0 -z-10 from-brand-zaffre/10 to-violet-500/10 bg-[radial-gradient(closest-side,rgba(10,190,255,0.25),rgba(10,190,255,0)_60%)]" />
    </section>
  );
}
