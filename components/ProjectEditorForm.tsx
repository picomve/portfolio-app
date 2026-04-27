'use client';

import Image from 'next/image';
import { useState } from 'react';
import { saveProjectAction } from '@/app/panel/actions';
import { Project } from '@/utils/projects';
import { deleteProjectAction } from '@/app/panel/actions';

interface ProjectEditorFormProps {
  project?: Project;
  submitLabel: string;
}

const inputClassName =
  'mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200';

export default function ProjectEditorForm({ project, submitLabel }: ProjectEditorFormProps) {
  const [imageUrl, setImageUrl] = useState<string>(project?.image ?? '');
  const [preview, setPreview] = useState<string>('');
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string>('');

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadError('');

    console.log('🖼️ File selected:', file.name, file.type, file.size, 'bytes');

    // Show preview immediately
    const reader = new FileReader();
    reader.onload = (event) => {
      setPreview(event.target?.result as string);
    };
    reader.readAsDataURL(file);

    try {
      const formData = new FormData();
      formData.append('file', file);

      console.log('📤 Uploading to /api/upload...');
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      console.log('📨 Response status:', response.status, response.statusText);

      if (!response.ok) {
        let errorMessage = 'Upload failed';
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch {
          errorMessage = `Upload failed with status ${response.status}`;
        }
        
        console.error('❌ Upload error:', errorMessage);
        setUploadError(errorMessage);
        setPreview('');
        return;
      }

      const { url } = await response.json();
      console.log('✅ Upload successful:', url);
      setImageUrl(url);
      setUploadError('');
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      console.error('❌ Upload exception:', errorMsg);
      setUploadError('Upload failed. Please check browser console for details.');
      setPreview('');
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <form action={saveProjectAction} className="space-y-4">
        <input type="hidden" name="id" defaultValue={project?.id ?? ''} />
        <input type="hidden" name="image" value={imageUrl} />

      <div className="grid gap-4 md:grid-cols-2">
        <label className="block text-sm font-medium text-slate-700">
          Title
          <input name="title" defaultValue={project?.title ?? ''} required className={inputClassName} />
        </label>

        <label className="block text-sm font-medium text-slate-700">
          Project Image
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handleFileSelect}
            disabled={uploading}
            className="mt-1 block w-full text-sm text-slate-500 file:rounded-lg file:border-0 file:bg-sky-100 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-sky-700 hover:file:bg-sky-200"
          />
        </label>
      </div>

      {uploadError && (
        <div className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
          {uploadError}
        </div>
      )}

      {preview && (
        <div className="relative h-48 w-full overflow-hidden rounded-lg border border-slate-300 bg-slate-100">
          <Image
            src={preview}
            alt="Preview"
            fill
            className="object-cover"
            sizes="100%"
          />
          {uploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
              <div className="text-sm font-medium text-white">Uploading...</div>
            </div>
          )}
        </div>
      )}

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

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={uploading}
          className="inline-flex items-center rounded-lg bg-sky-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-700 disabled:opacity-50"
        >
          {submitLabel}
        </button>
      </div>
      </form>

      {project && (
        <form action={deleteProjectAction} className="mt-3">
          <input type="hidden" name="id" value={project.id} />
          <button
            type="submit"
            className="inline-flex items-center rounded-lg border border-rose-200 px-4 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-50"
          >
            Delete Project
          </button>
        </form>
      )}
    </>
  );
}
