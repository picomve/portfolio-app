'use server';

import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { deleteProjectById, updateProjectsFromJson, upsertProject } from '@/utils/projects';
import { createPanelSessionToken, getPanelPassword, isPanelAuthenticated, panelCookieName } from '@/utils/panel-auth';

const panelCookieOptions = {
  httpOnly: true,
  sameSite: 'lax' as const,
  secure: process.env.NODE_ENV === 'production',
  path: '/',
  maxAge: 60 * 60 * 12,
};

function getTextValue(value: FormDataEntryValue | null) {
  return typeof value === 'string' ? value.trim() : '';
}

async function ensurePanelAccess() {
  const authenticated = await isPanelAuthenticated();

  if (!authenticated) {
    redirect('/panel?error=unauthorized');
  }
}

export async function unlockPanel(formData: FormData) {
  const expectedPassword = getPanelPassword();

  if (!expectedPassword) {
    redirect('/panel');
  }

  const submittedPassword = getTextValue(formData.get('password'));

  if (submittedPassword !== expectedPassword) {
    redirect('/panel?error=bad-password');
  }

  const cookieStore = await cookies();
  cookieStore.set(panelCookieName, createPanelSessionToken(expectedPassword), panelCookieOptions);
  redirect('/panel?status=authenticated');
}

export async function lockPanel() {
  const cookieStore = await cookies();
  cookieStore.delete(panelCookieName);
  redirect('/panel?status=locked');
}

export async function saveProjectAction(formData: FormData) {
  await ensurePanelAccess();

  const idValue = getTextValue(formData.get('id'));
  const title = getTextValue(formData.get('title'));
  const description = getTextValue(formData.get('description'));
  const image = getTextValue(formData.get('image')) || '/example-project1.jpg';
  const technologies = getTextValue(formData.get('technologies'))
    .split(',')
    .map((technology) => technology.trim())
    .filter(Boolean);
  const githubUrl = getTextValue(formData.get('githubUrl')) || undefined;
  const liveUrl = getTextValue(formData.get('liveUrl')) || undefined;
  const details = getTextValue(formData.get('details'));

  if (!title || !description || !details) {
    redirect('/panel?error=missing-fields');
  }

  const savedProject = await upsertProject({
    id: idValue ? Number(idValue) : undefined,
    title,
    description,
    image,
    technologies,
    githubUrl,
    liveUrl,
    details,
  });

  revalidatePath('/');
  revalidatePath('/panel');
  revalidatePath(`/projects/${savedProject.id}`);
  redirect(`/panel?status=${idValue ? 'updated' : 'created'}`);
}

export async function saveProjectsJsonAction(formData: FormData) {
  await ensurePanelAccess();

  const projectsJson = getTextValue(formData.get('projectsJson'));

  if (!projectsJson) {
    redirect('/panel?error=missing-json');
  }

  try {
    await updateProjectsFromJson(projectsJson);
  } catch {
    redirect('/panel?error=invalid-json');
  }

  revalidatePath('/');
  revalidatePath('/panel');
  redirect('/panel?status=json-saved');
}

export async function deleteProjectAction(formData: FormData) {
  await ensurePanelAccess();

  const id = Number(getTextValue(formData.get('id')));

  if (!Number.isFinite(id)) {
    redirect('/panel?error=invalid-id');
  }

  await deleteProjectById(id);

  revalidatePath('/');
  revalidatePath('/panel');
  revalidatePath(`/projects/${id}`);
  redirect('/panel?status=deleted');
}
