import Link from 'next/link';
import Projects from '../components/Projects';

export default function Home() {
  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.18),transparent_50%)] pointer-events-none" />
      <section className="relative py-24">
        <div className="container mx-auto px-4">

          <div className="mt-16 lg:mt-1">
            <p className="mb-6 text-sm uppercase tracking-[0.35em] text-sky-700 font-semibold">
              Digital identity
            </p>
            <h1 className="text-6xl font-bold tracking-tight text-slate-900 sm:text-7xl lg:text-8xl leading-tight">
              Build your digital
              <br className="hidden xl:block" />
              <span className="bg-linear-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent">
                identity
              </span>
              <br className="hidden xl:block" />
              with clarity.
            </h1>
            <p className="mt-10 max-w-2xl text-lg leading-8 text-slate-600">
              I craft premium websites and product experiences that feel polished, modern, and effortless.
              Every pixel is designed to engage and convert.
            </p>
            <div className="mt-12 flex flex-wrap gap-4">
              <a
                href="#projects"
                className="inline-flex items-center justify-center rounded-full bg-linear-to-r from-sky-600 to-blue-600 px-10 py-4 text-sm font-bold text-white shadow-lg transition hover:shadow-xl hover:scale-105"
              >
                See projects
              </a>
              <Link
                href="/about"
                className="inline-flex items-center justify-center rounded-full border-2 border-slate-300 bg-white px-10 py-4 text-sm font-semibold text-slate-900 transition hover:border-sky-600 hover:bg-sky-50"
              >
                Learn more
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section id="projects">
        <Projects />
      </section>
    </div>
  );
}
