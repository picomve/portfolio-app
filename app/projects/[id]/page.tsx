import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Markdown from 'react-markdown';
import { getProjectById, projects } from '../../../utils/projects';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ProjectPage({ params }: Props) {
  const { id } = await params;
  const projectId = Number(id);
  const project = getProjectById(projectId);

  if (!project) {
    notFound();
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 max-w-5xl">
        <Link href="/" className="text-cyan-600 hover:text-cyan-700 font-semibold mb-4 inline-block">
          ← Back to home
        </Link>
        <div className="grid gap-10 lg:grid-cols-3 items-start">
          <div className="lg:col-span-2">
            <h1 className="text-4xl font-bold text-slate-900 mb-6">{project?.title}</h1>
            <div className="prose prose-sm max-w-none mb-8 text-slate-700">
              <Markdown
                components={{
                  h2: ({ node, ...props }) => <h2 className="text-2xl font-bold text-slate-900 mt-6 mb-4" {...props} />,
                  h3: ({ node, ...props }) => <h3 className="text-xl font-semibold text-slate-800 mt-4 mb-3" {...props} />,
                  p: ({ node, ...props }) => <p className="mb-4 leading-relaxed" {...props} />,
                  ul: ({ node, ...props }) => <ul className="list-disc list-inside mb-4 space-y-2" {...props} />,
                  ol: ({ node, ...props }) => <ol className="list-decimal list-inside mb-4 space-y-2" {...props} />,
                  li: ({ node, ...props }) => <li className="text-slate-600" {...props} />,
                  strong: ({ node, ...props }) => <strong className="font-semibold text-slate-900" {...props} />,
                }}
              >
                {project?.details || ''}
              </Markdown>
            </div>
            <div className="flex flex-wrap gap-2 mb-6">
              {project?.technologies.map((tech) => (
                <span key={tech} className="bg-cyan-100 text-cyan-800 px-3 py-1 rounded-full text-sm">
                  {tech}
                </span>
              ))}
            </div>
            <div className="flex gap-4">
              {project?.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-cyan-700 hover:text-cyan-900"
                >
                  GitHub Repository
                </a>
              )}
              {project?.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-cyan-700 hover:text-cyan-900"
                >
                  Live Demo
                </a>
              )}
            </div>
          </div>
          <div className="rounded-2xl overflow-hidden shadow-lg h-72 relative">
            <Image src={project?.image ?? ''} alt={project?.title ?? 'Project image'} fill className="object-cover" />
          </div>
        </div>
        <div className="mt-12 text-slate-500">
          <span className="font-semibold text-slate-700">Other projects:</span>
          <div className="mt-3 flex flex-wrap gap-2">
            {projects
              .filter((p) => p.id !== project?.id)
              .map((p) => (
                <Link key={p.id} href={`/projects/${p.id}`} className="text-sm text-cyan-600 hover:text-cyan-800">
                  {p.title}
                </Link>
              ))}
          </div>
        </div>
      </div>
    </section>
  );
}
