'use client';

import TypingAnimation from './TypingAnimation';

/**
 * Hero section component
 */
export default function Hero() {
  return (
    <section id="hero" className="relative flex min-h-screen items-center overflow-hidden px-4">
      {/* Content */}
      <div className="relative z-10 w-full max-w-6xl pl-8 text-left md:pl-16 lg:pl-24">
        <div className="fade-up">
          <p className="mb-4 text-2xl text-muted md:text-3xl lg:text-4xl">Hi, my name is</p>
        </div>

        <h1 className="mb-6 text-5xl font-bold leading-tight md:text-7xl lg:text-8xl fade-in-delay-1">
          Yash Sharma
        </h1>

        <div className="mb-8 fade-in-delay-2">
          <p className="text-3xl text-muted md:text-4xl lg:text-5xl">
            I am <TypingAnimation words={["a Student", "an Engineer", "a Nerd"]} period={2000} />
          </p>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row fade-up-delay-3">
          <a
            href="#contact"
            className="rounded-lg border-2 border-brand-zaffre px-8 py-3 font-medium transition-all hover:scale-105 hover:bg-brand-zaffre hover:text-white"
          >
            Get In Touch
          </a>
        </div>
      </div>
    </section>
  );
}
