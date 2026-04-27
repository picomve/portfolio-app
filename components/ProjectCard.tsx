import Image from 'next/image';
import Link from 'next/link';

interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
}

interface ProjectCardProps {
  project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  return (
    <Link href={`/projects/${project.id}`} className="group block h-full">
      <div className="relative h-full rounded-3xl overflow-hidden bg-linear-to-br from-white to-slate-50 border border-slate-200 shadow-[0_8px_32px_rgba(15,23,42,0.08)] transition-all duration-300 hover:shadow-[0_24px_48px_rgba(56,189,248,0.15)] hover:border-sky-300 hover:-translate-y-2">
        <div className="relative h-64 overflow-hidden bg-slate-200">
          <Image
            src={project.image}
            alt={project.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            loading="eager"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-linear-to-t from-slate-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
        <div className="p-7">
          <h3 className="text-2xl font-bold mb-3 text-slate-900">{project.title}</h3>
          <p className="text-slate-600 mb-6 line-clamp-2">{project.description}</p>
          <div className="flex flex-wrap gap-2 mb-6">
            {project.technologies.slice(0, 3).map((tech, index) => (
              <span
                key={index}
                className="bg-linear-to-r from-sky-100 to-blue-100 text-sky-800 text-xs font-semibold uppercase tracking-wider px-3 py-1.5 rounded-full"
              >
                {tech}
              </span>
            ))}
            {project.technologies.length > 3 && (
              <span className="text-xs text-slate-500 font-medium px-3 py-1.5">+{project.technologies.length - 3}</span>
            )}
          </div>
          <div className="flex items-center gap-2 text-sm font-bold text-sky-600 group-hover:text-sky-700 transition-colors">
            <span>View details</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProjectCard;