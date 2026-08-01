import Link from 'next/link';

export default function Ascii404() {
  return (
    <section className="relative flex min-h-screen items-center justify-center px-4">
      <pre className="text-left text-sm leading-4 text-primary">
{String.raw` 
   ______  _____   ____  
  / __  / / ___/  / __ \ 
 / /_/ / / /__   / / / /
/_____/  \___/  /_/ /_/ 

   ( 4 0 4 )
`}
      </pre>
      <div className="ml-8 max-w-md">
        <h2 className="text-2xl font-semibold">This page doesn\'t exist.</h2>
        <p className="mt-2 text-muted">Double-check the URL or return to the homepage.</p>
        <div className="mt-6">
          <Link href="/" className="rounded-lg border-2 border-brand-zaffre px-6 py-3 font-medium transition-all hover:bg-brand-zaffre hover:text-white">Back Home</Link>
        </div>
      </div>
    </section>
  );
}
