'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import ProjectEditorForm from './ProjectEditorForm';
import { Project } from '@/utils/projects';

interface ProjectsPanelProps {
  projects: Project[];
}

export default function ProjectsPanel({ projects }: ProjectsPanelProps) {
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  return (
    <>
      <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-4">
          <h2 className="text-xl font-bold text-slate-900">Manage Projects</h2>
          <p className="mt-2 text-sm text-slate-600">
            View all your projects below. Click the edit button on any project to update its details.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div key={project.id} className="bg-white rounded-2xl shadow-lg overflow-hidden border border-slate-200">
              <div className="relative h-48">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                <p className="text-slate-600 mb-4 text-sm line-clamp-2">{project.description}</p>
                <div className="flex flex-wrap gap-1 mb-4">
                  {project.technologies.slice(0, 3).map((tech, index) => (
                    <span
                      key={index}
                      className="bg-cyan-100 text-cyan-800 text-xs font-semibold uppercase tracking-wide px-2 py-1 rounded"
                    >
                      {tech}
                    </span>
                  ))}
                  {project.technologies.length > 3 && (
                    <span className="text-xs text-slate-500">+{project.technologies.length - 3} more</span>
                  )}
                </div>
                <button
                  onClick={() => setEditingProject(project)}
                  className="w-full bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg font-semibold transition text-sm"
                >
                  Edit Project
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {editingProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-slate-900">Edit Project</h3>
                <button
                  onClick={() => setEditingProject(null)}
                  className="text-slate-400 hover:text-slate-600 text-2xl"
                >
                  ×
                </button>
              </div>
            </div>
            <div className="p-6">
              <ProjectEditorForm project={editingProject} submitLabel="Save Changes" />
            </div>
          </div>
        </div>
      )}
    </>
  );
}