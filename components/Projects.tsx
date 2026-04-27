import ProjectCard from './ProjectCard';
import { getProjects } from '../utils/projects';

const Projects = async () => {
  const projects = await getProjects();

  return (
    <section className="relative py-32 px-4">
      <div className="absolute inset-x-0 top-0 h-96 bg-[radial-gradient(ellipse_at_center,rgba(56,189,248,0.12),transparent_70%)] pointer-events-none" />
      <div className="container mx-auto">
        <div className="mb-16 text-center">
          <p className="mb-4 text-sm uppercase tracking-[0.35em] text-sky-700 font-semibold">
            Portfolio
          </p>
          <h2 className="mx-auto max-w-3xl text-5xl font-bold tracking-tight text-slate-900 sm:text-6xl">
            My Projects
          </h2>
          <p className="mt-6 mx-auto max-w-2xl text-lg text-slate-600">
            A curated selection of work that showcases clean design, modern technology, and high-impact solutions.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;