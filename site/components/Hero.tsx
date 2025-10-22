'use client';

import { motion } from 'framer-motion';
import TypingAnimation from './TypingAnimation';

/**
 * Hero section component
 */
export default function Hero() {
  return (
    <section id="hero" className="relative flex min-h-screen items-center overflow-hidden px-4">
      {/* Content */}
      <div className="relative z-10 w-full max-w-6xl pl-8 text-left md:pl-16 lg:pl-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <p className="mb-4 text-2xl text-muted md:text-3xl lg:text-4xl">Hi, my name is</p>
        </motion.div>

        <motion.h1
          className="mb-6 text-5xl font-bold leading-tight md:text-7xl lg:text-8xl"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Yash Sharma
        </motion.h1>

        <motion.div
          className="mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <p className="text-3xl text-muted md:text-4xl lg:text-5xl">
            I am <TypingAnimation words={['a Student', 'an Engineer', 'a Nerd']} period={2000} />
          </p>
        </motion.div>

        <motion.div
          className="flex flex-col gap-4 sm:flex-row"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <motion.a
            href="#contact"
            className="rounded-lg border-2 border-brand-zaffre px-8 py-3 font-medium transition-all hover:bg-brand-zaffre hover:text-white"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Get In Touch
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
