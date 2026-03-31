import type { Metadata } from 'next';
import Link from 'next/link';

import ProjectEditorForm from '@/components/ProjectEditorForm';
import { deleteProjectAction, lockPanel, saveProjectsJsonAction, unlockPanel } from './actions';
import { isPanelAuthenticated, isPanelPasswordEnabled } from '@/utils/panel-auth';
import { getProjects } from '@/utils/projects';

interface PanelPageProps {
  searchParams?: Promise<{
    status?: string;
    error?: string;
  }>;
}

export const metadata: Metadata = {
  title: 'Portfolio Panel',
  description: 'Hidden CMS page for managing portfolio projects.',
  robots: {
    index: false,
    follow: false,
  },
};

const statusMessages: Record<string, string> = {
  authenticated: 'Panel unlocked successfully.',
  created: 'New project saved.',
  updated: 'Project updated.',
  deleted: 'Project deleted.',
  locked: 'Panel locked.',
  'json-saved': 'projects.json was updated successfully.',
};

const errorMessages: Record<string, string> = {
  'bad-password': 'The panel password is incorrect.',
  unauthorized: 'Please unlock the panel first.',
  'invalid-id': 'That project could not be found.',
  'missing-fields': 'Title, description, and details are required.',
  'invalid-json': 'The JSON format is invalid or missing required fields.',
  'missing-json': 'Please paste JSON content before saving.',
};

export default async function PanelPage({ searchParams }: PanelPageProps) {
  const resolvedSearchParams = (await searchParams) ?? {};
  const statusMessage = resolvedSearchParams.status ? statusMessages[resolvedSearchParams.status] : undefined;
  const errorMessage = resolvedSearchParams.error ? errorMessages[resolvedSearchParams.error] : undefined;
  const passwordEnabled = isPanelPasswordEnabled();
  const authenticated = await isPanelAuthenticated();

  if (!authenticated) {
    return (
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto max-w-xl px-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-cyan-700">Hidden route</p>
            <h1 className="text-3xl font-bold text-slate-900">Portfolio panel</h1>
            <p className="mt-3 text-slate-600">
              This page is intentionally not linked anywhere. Enter the panel password to manage projects.
            </p>

            {errorMessage && (
              <div className="mt-4 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {errorMessage}
              </div>
            )}

            <form action={unlockPanel} className="mt-6 space-y-4">
              <label className="block text-sm font-medium text-slate-700">
                Panel password
                <input
                  type="password"
                  name="password"
                  required
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200"
                />
              </label>
              <button className="rounded-lg bg-cyan-600 px-4 py-2 font-semibold text-white transition hover:bg-cyan-700">
                Unlock panel
              </button>
            </form>

            <Link href="/" className="mt-5 inline-block text-sm font-semibold text-cyan-700 hover:text-cyan-800">
              ← Back to home
            </Link>
          </div>
        </div>
      </section>
    );
  }

  const projects = await getProjects();

  return (
    <section className="py-12 bg-slate-50">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="mb-8 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-700">Hidden CMS</p>
            <h1 className="text-3xl font-bold text-slate-900">Portfolio control panel</h1>
            <p className="mt-2 max-w-2xl text-slate-600">
              Add new projects, update existing content, and edit the markdown article shown on each project page.
            </p>
            {!passwordEnabled && (
              <p className="mt-3 text-sm text-amber-700">
                Tip: add <code className="rounded bg-amber-100 px-1 py-0.5">CMS_PANEL_PASSWORD</code> to <code className="rounded bg-amber-100 px-1 py-0.5">.env.local</code> to protect this page with a password.
              </p>
            )}
          </div>

          <div className="flex flex-wrap gap-3">
            <Link href="/" className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
              View site
            </Link>
            {passwordEnabled && (
              <form action={lockPanel}>
                <button className="rounded-lg border border-rose-200 px-4 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-50">
                  Lock panel
                </button>
              </form>
            )}
          </div>
        </div>

        {statusMessage && (
          <div className="mb-6 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {statusMessage}
          </div>
        )}

        {errorMessage && (
          <div className="mb-6 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {errorMessage}
          </div>
        )}

        <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4">
            <h2 className="text-xl font-bold text-slate-900">Edit raw `projects.json`</h2>
            <p className="mt-2 text-sm text-slate-600">
              If you want full control, edit the complete JSON array here and save it directly.
            </p>
          </div>

          <form action={saveProjectsJsonAction} className="space-y-4">
            <textarea
              name="projectsJson"
              defaultValue={JSON.stringify(projects, null, 2)}
              rows={18}
              spellCheck={false}
              className="w-full rounded-xl border border-slate-300 bg-slate-950 p-4 font-mono text-sm text-cyan-100 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200"
            />
            <button className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
              Save `projects.json`
            </button>
          </form>
        </section>

        <div className="grid gap-8 xl:grid-cols-[0.9fr,1.4fr]">
          <aside className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm xl:sticky xl:top-24 xl:self-start">
            <h2 className="text-xl font-bold text-slate-900">Add a new project</h2>
            <p className="mt-2 mb-5 text-sm text-slate-600">
              Fill out the form below to publish a new project card and detail page.
            </p>
            <ProjectEditorForm submitLabel="Create project" />
          </aside>

          <div className="space-y-6">
            {projects.map((project) => (
              <article key={project.id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">{project.title}</h2>
                    <p className="text-sm text-slate-500">Public URL: /projects/{project.id}</p>
                  </div>
                  <form action={deleteProjectAction}>
                    <input type="hidden" name="id" value={project.id} />
                    <button className="rounded-lg border border-rose-200 px-4 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-50">
                      Delete project
                    </button>
                  </form>
                </div>

                <ProjectEditorForm project={project} submitLabel="Save changes" />
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
