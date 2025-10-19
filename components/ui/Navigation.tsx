'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiMenu, FiX } from 'react-icons/fi'
import ThemeToggle from './ThemeToggle'

const navLinks = [
  { name: 'Home', href: '#home' },
  { name: 'Projects', href: '#projects' },
  { name: 'Contact', href: '#contact' },
]

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href)
    element?.scrollIntoView({ behavior: 'smooth' })
    setIsOpen(false)
  }

  return (
    <>
      {/* Fixed navigation controls */}
      <div className="fixed top-6 right-6 z-50 flex items-center gap-4">
        <ThemeToggle />
        
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          className="glass-effect p-3 rounded-full hover:glow-effect transition-all duration-300"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Toggle menu"
        >
          {isOpen ? (
            <FiX className="text-xl text-gray-900 dark:text-white" />
          ) : (
            <FiMenu className="text-xl text-gray-900 dark:text-white" />
          )}
        </motion.button>
      </div>

      {/* Menu overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute right-0 top-0 h-full w-full sm:w-96 glass-effect border-l border-white/10"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col h-full p-8 pt-24">
                <nav className="space-y-6">
                  {navLinks.map((link, index) => (
                    <motion.button
                      key={link.name}
                      onClick={() => scrollToSection(link.href)}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="block w-full text-left text-3xl font-bold text-gray-900 dark:text-white hover:text-gradient transition-colors"
                    >
                      {link.name}
                    </motion.button>
                  ))}
                </nav>

                {/* Decorative element */}
                <div className="mt-auto">
                  <div className="w-20 h-1 bg-gradient-to-r from-cyber-blue-500 via-deep-purple-500 to-neon-blue-500 rounded-full" />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
