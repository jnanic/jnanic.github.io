import Hero from '@/components/Hero';
import About from '@/components/About';
import Projects from '@/components/Projects';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import CircuitBackground from '@/components/CircuitBackground';
import GlobalParticles from '@/components/GlobalParticles';

export default function Home() {
  return (
    <>
      {/* Global Particle Network - rendered outside main to ensure true fixed positioning */}
      <GlobalParticles />
      
  <main className="min-h-screen relative z-10">
        {/* Global Circuit Background */}
        <CircuitBackground />
        
        {/* Hero Section */}
        <Hero />

      {/* About Section */}
      <About />

      {/* Projects Section */}
      <Projects />

      {/* Contact Section */}
      <Contact />

      {/* Footer */}
      <Footer />
    </main>
    </>
  );
}
