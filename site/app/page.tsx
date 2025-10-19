import Link from "next/link";
import { SiteHeader } from "@/components/site-header";

const EMAIL = "hello@jnanic.dev";
const PROJECTS = [
  {
    title: "SpartaHack API",
    summary:
      "Led a three-person engineering team to migrate SpartaHack's API from Ruby on Rails to Python.",
    details:
      "Designed Flask routing, Postgres data models, and handled authentication for application submissions.",
    tech: ["Flask", "Postgres", "Python", "Team Leadership"],
  },
  {
    title: "#BIKES4ERP Tracking Initiative",
    summary:
      "Shipped multi-platform tools that help administrators and mechanics oversee bike fleets and maintenance.",
    details:
      "Maintained the Firebase backend and React dashboards to keep low-connectivity environments synchronized.",
    tech: ["Firebase", "React", "TypeScript", "Data Visualization"],
  },
];

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main className="page" id="top">
        <section id="hero" className="section section--hero">
          <h1>Yash Sharma</h1>
          <p className="lead">
            I build human-centered software that bridges design, data, and accessible engineering.
          </p>
          <div className="cta-group" role="group" aria-label="Primary actions">
            <Link className="button button--primary" href="#projects">
              View projects
            </Link>
            <Link className="button" href={`mailto:${EMAIL}`}>
              Contact me
            </Link>
            <a className="button button--outline" href="/yash-sharma-cv.pdf">
              Download CV
            </a>
          </div>
        </section>

        <section id="about" className="section">
          <h2>About</h2>
          <p>
            I am a student engineer blending product thinking with full-stack experience. My focus is on
            resilient systems that stay fast, accessible, and maintainable in real-world conditions.
          </p>
          <p>
            Outside of coursework, I collaborate with teams to ship features, refine developer workflows, and
            mentor peers on modern web stacks.
          </p>
        </section>

        <section id="projects" className="section">
          <h2>Projects</h2>
          <div className="project-grid">
            {PROJECTS.map((project) => (
              <article key={project.title} className="project-card">
                <h3>{project.title}</h3>
                <p>{project.summary}</p>
                <p className="project-detail">{project.details}</p>
                <ul className="tag-list">
                  {project.tech.map((tech) => (
                    <li key={tech}>{tech}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section id="contact" className="section">
          <h2>Contact</h2>
          <p>
            Ready to collaborate or want to chat? Email me or connect through the platforms below.
          </p>
          <div className="cta-group">
            <Link className="button button--primary" href={`mailto:${EMAIL}`}>
              Email Yash
            </Link>
            <Link className="button" href="https://github.com/jnanic" target="_blank" rel="noreferrer">
              GitHub
            </Link>
            <Link
              className="button"
              href="https://www.linkedin.com/in/jnanic/"
              target="_blank"
              rel="noreferrer"
            >
              LinkedIn
            </Link>
          </div>
        </section>
      </main>
      <footer className="site-footer">
        <p>© {new Date().getFullYear()} Yash Sharma. All rights reserved.</p>
      </footer>
    </>
  );
}
