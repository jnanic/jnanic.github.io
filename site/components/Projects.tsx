'use client';

import { projects } from '@/data/projects';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { useRef, useState } from 'react';

/**
 * Projects section component
 * Displays project cards in a parallax timeline layout
 */
export default function Projects() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start']
  });

  return (
    <section id="projects" className="relative py-8 md:py-12" ref={containerRef}>
      <div className="relative z-10 mx-auto max-w-4xl px-4">
        <motion.h2 
          initial={{ opacity: 0, y: -50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 text-center text-4xl font-bold md:text-5xl"
        >
          Projects
        </motion.h2>
        
        <div className="relative space-y-8">
          {projects.map((project, index) => {
            // Alternate left/right layout
            const isLeft = index % 2 === 0;
            
            // Reduced parallax for smoother animation
            const yOffset = useTransform(
              scrollYProgress,
              [0, 1],
              [index * 20, -index * 20]
            );

            return (
              <div key={project.id} className="relative">
                <ProjectCard project={project} index={index} isLeft={isLeft} yOffset={yOffset} />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// Separate card component with 3D tilt effect and glassmorphism
function ProjectCard({ 
  project, 
  index, 
  isLeft,
  yOffset 
}: { 
  project: typeof projects[0]; 
  index: number; 
  isLeft: boolean;
  yOffset: any;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  
  // Mouse position for 3D tilt
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  // Smooth spring animation for tilt
  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);
  
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7.5deg", "-7.5deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7.5deg", "7.5deg"]);
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    
    x.set(xPct);
    y.set(yPct);
  };
  
  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  };

  return (
    <motion.article
      style={{ y: yOffset }}
      className="relative flex items-center justify-center perspective-1000"
    >
      <motion.div
        ref={cardRef}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ 
          duration: 0.6,
          ease: [0.25, 0.46, 0.45, 0.94],
        }}
        viewport={{ once: true, margin: "-50px" }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className={`group relative w-full max-w-md ${
          isLeft ? 'md:mr-auto md:translate-x-8' : 'md:ml-auto md:-translate-x-8'
        }`}
      >
        {/* Glow effect */}
        <motion.div
          animate={{
            opacity: isHovered ? 0.6 : 0.3,
          }}
          className="absolute -inset-1 bg-gradient-to-r from-cyan-500/30 via-brand-zaffre/40 to-violet-500/30 blur-2xl rounded-3xl"
        />

        {/* Card container with glassmorphism */}
        <div className="relative backdrop-blur-xl bg-[var(--color-bg)]/60 border border-brand-zaffre/20 rounded-3xl overflow-hidden shadow-2xl">

          {/* Content */}
          <div className="p-6 relative" style={{ transform: "translateZ(50px)" }}>
            {/* Gradient overlay for depth */}
            <div className="absolute inset-0 bg-gradient-to-br from-brand-zaffre/5 via-transparent to-violet-500/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100 pointer-events-none" />
            
            <div className="relative">
              <h3 className="mb-3 text-2xl font-bold text-primary transition-colors duration-300 group-hover:text-brand-zaffre">
                {project.title}
              </h3>

              <p className="mb-4 text-sm leading-relaxed text-muted line-clamp-3">
                {project.description}
              </p>

              {/* Tags */}
              <div className="mb-4 flex flex-wrap gap-2">
                {project.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-full backdrop-blur-md bg-brand-zaffre/10 border border-brand-zaffre/30 px-3 py-1 text-xs font-medium text-primary hover:bg-brand-zaffre/20 hover:border-brand-zaffre transition-all cursor-default"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              {/* Link icons */}
              <div className="flex items-center gap-3">
                {project.links?.github && (
                  <motion.a
                    href={project.links.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex h-9 w-9 items-center justify-center rounded-full backdrop-blur-md bg-brand-zaffre/10 border border-brand-zaffre/30 text-brand-zaffre hover:bg-brand-zaffre hover:text-white hover:border-brand-zaffre transition-all"
                    title="View on GitHub"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </motion.a>
                )}
                {project.links?.demo && (
                  <motion.a
                    href={project.links.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-zaffre text-white hover:bg-brand-zaffre/80 transition-all shadow-md shadow-brand-zaffre/30"
                    title="View Demo"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </motion.a>
                )}
                {project.links?.website && (
                  <motion.a
                    href={project.links.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex h-9 w-9 items-center justify-center rounded-full backdrop-blur-md bg-brand-zaffre/10 border border-brand-zaffre/30 text-brand-zaffre hover:bg-brand-zaffre hover:text-white hover:border-brand-zaffre transition-all"
                    title="View Website"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                  </motion.a>
                )}
              </div>
            </div>
          </div>

          {/* Corner accent */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-brand-zaffre/20 to-transparent rounded-bl-full pointer-events-none" />
        </div>
      </motion.div>
    </motion.article>
  );
}
