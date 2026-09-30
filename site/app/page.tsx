import Hero from '@/components/Hero';
import About from '@/components/About';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import LazyProjects from '@/components/LazyProjects';
import WritingPreview from '@/components/WritingPreview';

export default function Home() {
  return (
    <main className="min-h-screen relative z-10">
      <Hero />
      <About />
      <section id="projects" className="relative py-8 md:py-12">
        <LazyProjects />
      </section>
      <WritingPreview />
      <Contact />
      <Footer />
    </main>
  );
}
