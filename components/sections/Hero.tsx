'use client';

import { motion } from 'framer-motion';
import { FiGithub, FiLinkedin, FiMail, FiArrowRight } from 'react-icons/fi';
import AnimatedBackground from '../AnimatedBackground';

const Hero = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <AnimatedBackground />
      
      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
        {/* Name */}
        <div className="mb-8">
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-cyber-blue-400 to-deep-purple-blue-400 bg-clip-text text-transparent">
              YASH SHARMA
            </span>
          </h1>
        </div>

        {/* Role & Description */}
        <div className="space-y-4 mb-12">
          <p className="text-2xl md:text-3xl font-semibold">
            <span className="text-cyber-blue-400">Software Engineer</span>
            <span className="text-gray-400"> @ </span>
            <span className="text-white">Microsoft</span>
          </p>
          
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto">
            Building intelligent systems with AI & distributed systems
          </p>
        </div>

        {/* CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <a
            href="#projects"
            className="group px-8 py-4 bg-cyber-blue-500 rounded-lg font-semibold hover:bg-cyber-blue-400 transition-all duration-300 flex items-center gap-2 shadow-lg shadow-cyber-blue-500/50"
          >
            View Projects
            <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
          </a>
          
          <div className="flex gap-3">
            <SocialIcon href="https://github.com/yash1337" icon={<FiGithub />} />
            <SocialIcon href="https://linkedin.com/in/tellsharmayash" icon={<FiLinkedin />} />
            <SocialIcon href="mailto:tellsharmayash@gmail.com" icon={<FiMail />} />
          </div>
        </div>
      </div>
    </section>
  );
};

const SocialIcon = ({ href, icon }: { href: string; icon: React.ReactNode }) => (
  <motion.a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="p-3 rounded-full bg-white/5 border border-white/10 hover:border-cyber-blue-400/50 hover:bg-cyber-blue-500/10 transition-all duration-300 text-gray-400 hover:text-cyber-blue-400"
    whileHover={{ scale: 1.1, rotate: 5 }}
    whileTap={{ scale: 0.95 }}
  >
    {icon}
  </motion.a>
);

export default Hero;
