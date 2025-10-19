'use client'

import { motion } from 'framer-motion'
import { FiGithub, FiExternalLink } from 'react-icons/fi'
import { projects } from '@/data/projects'

const ProjectCard = ({ project, index }: { project: any; index: number }) => {
  const isLarge = index % 3 === 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      className={`group relative glass-effect rounded-2xl p-6 hover:glow-effect transition-all duration-300 ${
        isLarge ? 'md:col-span-2 md:row-span-2' : ''
      }`}
    >
      {/* Gradient border on hover */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-cyber-blue-500/20 via-deep-purple-500/20 to-neon-blue-500/20 -z-10 blur-xl" />

      <div className="relative h-full flex flex-col">
        {/* Project number */}
        <div className="text-4xl font-bold text-gray-800 dark:text-gray-800/50 mb-4">
          {String(index + 1).padStart(2, '0')}
        </div>

        {/* Title */}
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-gradient transition-colors">
          {project.title}
        </h3>

        {/* Description */}
        <p className="text-gray-600 dark:text-gray-400 mb-4 flex-grow leading-relaxed">
          {project.description}
        </p>

        {/* Tech stack */}
        <div className="flex flex-wrap gap-2 mb-4">
          {project.tech.map((tech: string) => (
            <span
              key={tech}
              className="px-3 py-1 text-xs font-medium rounded-full bg-cyber-blue-500/10 text-cyber-blue-400 border border-cyber-blue-500/20"
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Links */}
        <div className="flex gap-4">
          <a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-cyber-blue-400 transition-colors"
          >
            <FiGithub className="text-lg" />
            <span>View Code</span>
          </a>
          {project.demo && (
            <a
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-gray-400 hover:text-cyber-blue-400 transition-colors"
            >
              <FiExternalLink className="text-lg" />
              <span>Live Demo</span>
            </a>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default function Projects() {
  return (
    <section id="projects" className="min-h-screen py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-dark-bg">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4">
            <span className="text-gradient">Selected Projects</span>
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
            A collection of projects I&apos;ve built, from APIs to distributed systems
          </p>
        </motion.div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-fr">
          {projects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>

        {/* View more on GitHub */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <a
            href="https://github.com/yash1337"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 glass-effect px-6 py-3 rounded-lg text-cyber-blue-400 hover:text-cyber-blue-300 hover:glow-effect transition-all duration-300 font-semibold"
          >
            <FiGithub className="text-xl" />
            View More on GitHub
          </a>
        </motion.div>
      </div>
    </section>
  )
}
