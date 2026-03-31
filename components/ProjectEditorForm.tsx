import { saveProjectAction } from '@/app/panel/actions';
import { Project } from '@/utils/projects';

interface ProjectEditorFormProps {
  project?: Project;
  submitLabel: string;
}

const inputClassName =
  'mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200';

export default function ProjectEditorForm({ project, submitLabel }: ProjectEditorFormProps) {
  return (
    <form action={saveProjectAction} className="space-y-4">
      <input type="hidden" name="id" defaultValue={project?.id ?? ''} />

      <div className="grid gap-4 md:grid-cols-2">
        <label className="block text-sm font-medium text-slate-700">
          Title
          <input name="title" defaultValue={project?.title ?? ''} required className={inputClassName} />
        </label>

        <label className="block text-sm font-medium text-slate-700">
          Image path
          <input
            name="image"
            defaultValue={project?.image ?? '/example-project1.jpg'}
            placeholder="/project-cover.jpg"
            className={inputClassName}
          />
        </label>
      </div>

      <label className="block text-sm font-medium text-slate-700">
        Short description
        <input
          name="description"
          defaultValue={project?.description ?? ''}
          required
          className={inputClassName}
        />
      </label>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="block text-sm font-medium text-slate-700">
          GitHub URL
          <input
            name="githubUrl"
            type="url"
            defaultValue={project?.githubUrl ?? ''}
            placeholder="https://github.com/username/repo"
            className={inputClassName}
          />
        </label>

        <label className="block text-sm font-medium text-slate-700">
          Live URL
          <input
            name="liveUrl"
            type="url"
            defaultValue={project?.liveUrl ?? ''}
            placeholder="https://your-project.com"
            className={inputClassName}
          />
        </label>
      </div>

      <label className="block text-sm font-medium text-slate-700">
        Technologies
        <input
          name="technologies"
          defaultValue={project?.technologies.join(', ') ?? ''}
          placeholder="React, Next.js, Tailwind CSS"
          className={inputClassName}
        />
      </label>

      <label className="block text-sm font-medium text-slate-700">
        Details / article content (Markdown supported)
        <textarea
          name="details"
          defaultValue={project?.details ?? ''}
          rows={12}
          required
          className={`${inputClassName} min-h-56 resize-y`}
        />
      </label>

      <button
        type="submit"
        className="inline-flex items-center rounded-lg bg-cyan-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-cyan-700"
      >
        {submitLabel}
      </button>
    </form>
  );
}
