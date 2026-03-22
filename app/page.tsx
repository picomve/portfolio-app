import Projects from '../components/Projects';

export default function Home() {
  return (
    <div className="relative overflow-hidden">
      <section className="bg-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6">Look at my portfolio</h1>
          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto mb-8">
            Explore my projects, read about me, and get in touch. Clean, responsive, and professional design.
          </p>
          <div className="inline-flex gap-4">
            <a href="#projects" className="bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-3 rounded-lg font-semibold transition">
              View Projects
            </a>
            <a href="/contact" className="border border-cyan-600 text-cyan-600 px-6 py-3 rounded-lg hover:bg-cyan-50 transition">
              Contact Me
            </a>
          </div>
        </div>
      </section>

      <section id="projects">
        <Projects />
      </section>
    </div>
  );
}
