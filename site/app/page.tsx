import dynamic from 'next/dynamic';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';

// Defer heavy client components to reduce first-load JS
const GlobalParticles = dynamic(() => import('@/components/GlobalParticles'), { ssr: false, loading: () => null });
const Projects = dynamic(() => import('@/components/Projects'), { ssr: false, loading: () => (
  <section id="projects" className="py-8 md:py-12 px-4">
    <div className="mx-auto max-w-4xl">
      <h2 className="mb-16 text-center text-4xl font-bold md:text-5xl">Projects</h2>
      <div className="space-y-8">
        <div className="h-48 rounded-3xl border border-brand-zaffre/20 bg-[var(--color-bg)]/40" />
        <div className="h-48 rounded-3xl border border-brand-zaffre/20 bg-[var(--color-bg)]/40" />
      </div>
    </div>
  </section>
)});

export default function Home() {
  return (
    <main className="min-h-screen relative z-10">
      <Hero />
      <About />
      <Projects />
      <Contact />
      <Footer />
    </main>
  );
}
