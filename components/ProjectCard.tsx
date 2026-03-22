import React from 'react';
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
    <Link href={`/projects/${project.id}`} className="block"> 
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300 transform hover:-translate-y-1">
        <div className="relative h-56">
          <Image
            src={project.image}
            alt={project.title}
            fill
            className="object-cover"
          />
        </div>
        <div className="p-6">
          <h3 className="text-2xl font-semibold mb-2">{project.title}</h3>
          <p className="text-slate-600 mb-4">{project.description}</p>
          <div className="flex flex-wrap gap-2 mb-4">
            {project.technologies.map((tech, index) => (
              <span
                key={index}
                className="bg-cyan-100 text-cyan-800 text-xs font-semibold uppercase tracking-wide px-2 py-1 rounded"
              >
                {tech}
              </span>
            ))}
          </div>
          <span className="text-sm font-bold text-cyan-700">View details →</span>
        </div>
      </div>
    </Link>
  );
};

export default ProjectCard;