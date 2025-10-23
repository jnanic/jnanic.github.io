import Image from 'next/image';

/**
 * About section component
 * Displays bio and avatar image
 */
export default function About() {
  return (
    <section id="about" className="relative px-4 py-12 md:py-16">
      <div className="relative z-10 mx-auto max-w-4xl">
        <h2 className="mb-12 text-left text-4xl font-bold md:text-5xl">About</h2>
        
        <div className="flex flex-col items-center gap-8 md:flex-row-reverse md:gap-12">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <div className="relative h-64 w-64 overflow-hidden rounded-full border-4 border-brand-zaffre shadow-lg transition-transform hover:scale-105">
              <Image
                src="/avatar.jpeg"
                alt="Yash Sharma"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>

          {/* Bio */}
          <div className="flex-1 text-center md:text-left">
            <p className="mb-4 text-lg leading-relaxed md:text-xl">
              Hi! I'm <span className="font-semibold text-primary">Yash Sharma</span>, 
              a passionate student and engineer who loves building innovative solutions 
              to real-world problems.
            </p>
            <p className="mb-4 text-lg leading-relaxed text-muted md:text-xl">
              I specialize in full-stack development, with experience in Python, React, 
              and modern web technologies. I enjoy leading teams and bringing ideas to life 
              through clean, efficient code.
            </p>
            <p className="text-lg leading-relaxed text-muted md:text-xl">
              When I'm not coding, you'll find me exploring new technologies, 
              contributing to open source, or working on exciting hackathon projects.
            </p>
            
            {/* CV Link */}
            <div className="mt-6">
              <a
                href="/cv.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border-2 border-brand-zaffre px-6 py-3 text-base font-medium text-brand-zaffre transition-all hover:scale-105 hover:bg-brand-zaffre/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-zaffre"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                Download CV
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
