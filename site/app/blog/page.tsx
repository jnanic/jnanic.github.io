import Link from "next/link";

export const metadata = {
  title: "Blog | Yash Sharma",
  description: "Blog posts are coming soon. Stay tuned for long-form thoughts and notes.",
};

export default function BlogPage() {
  return (
    <main className="page">
      <section className="section">
        <h1>Blog</h1>
        <p>
          Writing is in progress. Subscribe to updates or check back later for articles on engineering,
          systems design, and community projects.
        </p>
        <Link className="button" href="mailto:hello@jnanic.dev?subject=Blog%20updates">
          Get notified
        </Link>
      </section>
    </main>
  );
}
