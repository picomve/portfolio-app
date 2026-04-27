# Portfolio App - Complete Starter Guide

A comprehensive walkthrough of every file and code block in the portfolio application.

---

## 📋 Table of Contents

1. [Project Architecture Overview](#-project-architecture-overview)
2. [Configuration Files](#-configuration-files)
3. [Entry Point: Root Layout](#-entry-point-appltxstyletsx--root-layout)
4. [Pages](#-pages)
5. [Server Actions - Backend Logic](#-server-actions--backend-logic)
6. [Utility Functions](#-utility-functions--helpers)
7. [Components - UI Blocks](#-components--ui-blocks)
8. [API Routes](#-api-routes)
9. [Data Flow Summary](#-data-flow-summary)

---

## 🏗️ Project Architecture Overview

```
portfolio-app/
├── app/                     # Next.js app directory (server-side)
├── components/              # Reusable React components (client/server)
├── utils/                   # Helper functions (server logic)
├── public/                  # Static assets (images)
├── data/                    # JSON data storage
└── Config files            # TypeScript, Next.js, Tailwind configs
```

---

## 📁 Configuration Files

### `tsconfig.json` — TypeScript Configuration

```json
{
  "compilerOptions": {
    "target": "ES2017",      // Compile to ES2017 JavaScript
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,          // Enable strict type checking
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "react-jsx",      // Use React 17+ JSX
    "incremental": true,
    "paths": {
      "@/*": ["./*"]         // Allow @/ alias to import from root
    }
  },
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    ".next/types/**/*.ts",
    ".next/dev/types/**/*.ts",
    "**/*.mts"
  ],
  "exclude": ["node_modules"]
}
```

**What it does:** 
- Configures TypeScript compiler to enable strict type safety
- Uses modern JavaScript (ES2017)
- Enables React JSX support
- Allows path aliases (`@/` means `./`)

---

### `next.config.ts` — Next.js Configuration

```typescript
import type { NextConfig } from 'next';

const normalizeOrigin = (value: string) => value.replace(/^https?:\/\//, '').replace(/\/$/, '');

const serverActionAllowedOrigins = [
  process.env.CMS_ALLOWED_ORIGIN,
  process.env.RAILWAY_PUBLIC_DOMAIN,
  process.env.RAILWAY_STATIC_URL,
  'picomve.com.tr',
  'www.picomve.com.tr',
]
  .filter((value): value is string => Boolean(value))
  .map(normalizeOrigin);

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.public.blob.vercel-storage.com',  // Allow Vercel Blob images
      },
    ],
  },
  output: 'standalone',  // Generate standalone app for deployment
  experimental: {
    serverActions: {
      allowedOrigins: serverActionAllowedOrigins,  // Security: only allow specific origins
      bodySizeLimit: '2mb',  // Max form data size
    },
  },
};

export default nextConfig;
```

**What it does:**
- Allows images from Vercel Blob (your uploaded images)
- Configures standalone mode for hosting on Railway
- Sets security rules for server actions
- Limits form submission size to 2MB

---

## 🎯 Entry Point: `app/layout.tsx` — Root Layout

```typescript
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Portfolio projects",
  description: "Build by picomve",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900">
        <Header />        {/* Navigation at top */}
        <main className="flex-1">{children}</main>  {/* Page content (grows to fill) */}
        <Footer />        {/* Footer at bottom */}
      </body>
    </html>
  );
}
```

**What it does:**
- Provides the global HTML structure for every page
- Imports Google fonts (Geist Sans & Mono)
- Sets page title and SEO description
- Wraps all pages with Header and Footer
- Uses `flex-1` to push Footer to bottom on short pages

---

## 📄 Pages

### `app/page.tsx` — Homepage

```typescript
import Link from 'next/link';
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
          <div className="inline-flex flex-wrap justify-center gap-4">
            <a href="#projects" className="bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-3 rounded-lg font-semibold transition">
              View Projects
            </a>
            <Link href="/contact" className="border border-cyan-600 text-cyan-600 px-6 py-3 rounded-lg hover:bg-cyan-50 transition">
              Contact Me
            </Link>
            <a
              href="https://github.com/picomve"
              target="_blank"
              rel="noopener noreferrer"
              className="border border-slate-300 text-slate-700 px-6 py-3 rounded-lg hover:bg-slate-50 transition"
            >
              GitHub
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
```

**What it does:**
- Shows hero section with intro text
- Displays call-to-action buttons (View Projects, Contact, GitHub)
- Renders all projects using the `<Projects />` component
- Links to other pages and external resources

---

### `app/contact/page.tsx` — Contact Form Page

```typescript
import { sendContactEmail } from './actions';

interface ContactPageProps {
  searchParams?: {
    status?: string;
    error?: string;
  };
}

const statusMessages: Record<string, string> = {
  sent: 'Your message was sent successfully. Thank you! I will reply as soon as possible.',
  'missing-fields': 'Please fill all fields before sending.',
  'invalid-email': 'Please enter a valid email address.',
  'api-key-missing': 'Resend API key is not configured. Please set RESEND_API_KEY in .env.local.',
  error: 'Sorry, there was an error sending your message. Please try again later.',
};

export default function ContactPage({ searchParams }: ContactPageProps) {
  const statusMessage = searchParams?.status ? statusMessages[searchParams.status] : undefined;

  return (
    <section className="py-16 bg-slate-50">
      <div className="container mx-auto px-4 max-w-2xl bg-white rounded-3xl shadow-lg p-10">
        <h2 className="text-4xl font-bold text-slate-900 mb-6">Contact</h2>
        <p className="text-slate-600 mb-8">
          Feel free to reach out for freelance work, open-source collaborations, or just a friendly chat.
        </p>
        {statusMessage && (
          <div className="mb-6 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {statusMessage}
          </div>
        )}
        <form action={sendContactEmail} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-2">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              rows={5}
              required
              className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>
          <button type="submit" className="bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-3 rounded-xl font-semibold">
            Send Message
          </button>
        </form>
      </div>
    </section>
  );
}
```

**What it does:**
- Shows contact form with name, email, message fields
- Displays status messages after form submission (success/error)
- Form submits to `sendContactEmail` server action
- Shows appropriate feedback messages based on query parameter status

---

### `app/about/page.tsx` — About Page

```typescript
export default function AboutPage() {
  return (
    // Static about content
  );
}
```

**What it does:** Displays static "about me" information.

---

### `app/projects/[id]/page.tsx` — Dynamic Project Detail Page

```typescript
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Markdown from 'react-markdown';
import { getProjectById, getProjects } from '../../../utils/projects';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ProjectPage({ params }: Props) {
  const { id } = await params;
  const projectId = Number(id);
  const project = await getProjectById(projectId);

  if (!project) {
    notFound();  // Show 404 page
  }

  const projects = await getProjects();

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 max-w-5xl">
        <Link href="/" className="text-cyan-600 hover:text-cyan-700 font-semibold mb-4 inline-block">
          ← Back to home
        </Link>
        <div className="grid gap-10 lg:grid-cols-3 items-start">
          <div className="lg:col-span-2">
            <h1 className="text-4xl font-bold text-slate-900 mb-6">{project.title}</h1>
            <div className="prose prose-sm max-w-none mb-8 text-slate-700">
              <Markdown>{project.details}</Markdown>  {/* Render markdown content */}
            </div>
            <div className="flex flex-wrap gap-2 mb-6">
              {project.technologies.map((tech) => (
                <span key={tech} className="bg-cyan-100 text-cyan-800 px-3 py-1 rounded-full text-sm">
                  {tech}
                </span>
              ))}
            </div>
            <div className="flex gap-4">
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-cyan-700 hover:text-cyan-900"
                >
                  GitHub Repository
                </a>
              )}
              {project.liveUrl && (
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
            <Image
              src={project.image}
              alt={project.title}
              fill
              className="object-cover"
              loading="eager"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        </div>
        <div className="mt-12 text-slate-500">
          <span className="font-semibold text-slate-700">Other projects:</span>
          <div className="mt-3 flex flex-wrap gap-2">
            {projects
              .filter((currentProject) => currentProject.id !== project.id)
              .map((currentProject) => (
                <Link key={currentProject.id} href={`/projects/${currentProject.id}`} className="text-sm text-cyan-600 hover:text-cyan-800">
                  {currentProject.title}
                </Link>
              ))}
          </div>
        </div>
      </div>
    </section>
  );
}
```

**What it does:**
- Shows detailed project page (e.g., `/projects/1`)
- Renders markdown content from `project.details`
- Shows GitHub & Live demo links if available
- Displays project image with optimized loading
- Lists links to other projects
- Shows 404 if project not found

---

### `app/panel/page.tsx` — Admin CMS Panel

```typescript
import type { Metadata } from 'next';
import Link from 'next/link';

import ProjectEditorForm from '@/components/ProjectEditorForm';
import ProjectsPanel from '@/components/ProjectsPanel';
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
};

const errorMessages: Record<string, string> = {
  'bad-password': 'The panel password is incorrect.',
  unauthorized: 'Please unlock the panel first.',
  'invalid-id': 'That project could not be found.',
  'missing-fields': 'Title, description, and details are required.',
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
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-sky-700">Hidden route</p>
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
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
                />
              </label>
              <button className="rounded-lg bg-sky-600 px-4 py-2 font-semibold text-white transition hover:bg-sky-700">
                Unlock panel
              </button>
            </form>

            <Link href="/" className="mt-5 inline-block text-sm font-semibold text-sky-700 hover:text-sky-800">
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
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-700">Hidden CMS</p>
            <h1 className="text-3xl font-bold text-slate-900">Portfolio control panel</h1>
            <p className="mt-2 max-w-2xl text-slate-600">
              Add new projects, update existing content, and edit the markdown article shown on each project page.
            </p>
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
          <div className="mb-6 rounded-lg border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-sky-700">
            {statusMessage}
          </div>
        )}

        {errorMessage && (
          <div className="mb-6 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {errorMessage}
          </div>
        )}

        <ProjectsPanel projects={projects} />

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
                <div className="mb-4">
                  <h2 className="text-xl font-bold text-slate-900">{project.title}</h2>
                  <p className="text-sm text-slate-500">Public URL: /projects/{project.id}</p>
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
```

**What it does:**
- Shows password screen if not authenticated
- Lists all projects in a visual grid (`ProjectsPanel`)
- Shows form to create new projects
- Shows edit form for each existing project
- Displays status and error messages
- Hides from search engines with robots meta tag

---

## 🔧 Server Actions — Backend Logic

### `app/panel/actions.ts` — Admin Actions

#### 1. **`unlockPanel()`** — Authenticate admin

```typescript
export async function unlockPanel(formData: FormData) {
  const expectedPassword = getPanelPassword();

  if (!expectedPassword) {
    redirect('/panel');
  }

  const submittedPassword = getTextValue(formData.get('password'));

  if (submittedPassword !== expectedPassword) {
    redirect('/panel?error=bad-password');  // Wrong password
  }

  const cookieStore = await cookies();
  cookieStore.set(panelCookieName, createPanelSessionToken(expectedPassword), panelCookieOptions);
  redirect('/panel?status=authenticated');  // Success, set cookie
}
```

**What it does:**
- Compares entered password with env variable `CMS_PANEL_PASSWORD`
- Creates a session token (hash of password)
- Stores token in secure HTTP-only cookie
- Redirects with success message

#### 2. **`lockPanel()`** — Logout

```typescript
export async function lockPanel() {
  const cookieStore = await cookies();
  cookieStore.delete(panelCookieName);  // Remove session cookie
  redirect('/panel?status=locked');
}
```

**What it does:** Deletes the session cookie (logs out admin).

#### 3. **`saveProjectAction()`** — Create/Update Project

```typescript
export async function saveProjectAction(formData: FormData) {
  await ensurePanelAccess();  // Check if authenticated

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

  revalidatePath('/');           // Refresh homepage cache
  revalidatePath('/panel');      // Refresh panel cache
  revalidatePath(`/projects/${savedProject.id}`);  // Refresh project page cache
  redirect(`/panel?status=${idValue ? 'updated' : 'created'}`);
}
```

**What it does:**
- Extracts form data (title, description, image URL, etc.)
- Validates required fields
- Saves to JSON file (creates new or updates existing)
- Revalidates cached pages so site shows latest data
- Redirects with success message

#### 4. **`deleteProjectAction()`** — Delete Project

```typescript
export async function deleteProjectAction(formData: FormData) {
  await ensurePanelAccess();

  const idValue = getTextValue(formData.get('id'));

  if (!idValue) {
    redirect('/panel?error=invalid-id');
  }

  await deleteProjectById(Number(idValue));

  revalidatePath('/');
  revalidatePath('/panel');
  redirect('/panel?status=deleted');
}
```

**What it does:** Deletes a project and refreshes cache.

---

### `app/contact/actions.ts` — Email Action

```typescript
import { Resend } from 'resend';
import { redirect } from 'next/navigation';

const recipientEmail = process.env.CONTACT_RECIPIENT_EMAIL ?? 'halilibrahim.ataylar@proton.me';

export async function sendContactEmail(formData: FormData) {
  'use server';

  const name = String(formData.get('name') ?? '').trim();
  const email = String(formData.get('email') ?? '').trim();
  const message = String(formData.get('message') ?? '').trim();

  // Validation
  if (!name || !email || !message) {
    redirect('/contact?status=missing-fields');
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    redirect('/contact?status=invalid-email');  // Invalid email format
  }

  const resendApiKey = process.env.RESEND_API_KEY;
  if (!resendApiKey) {
    redirect('/contact?status=api-key-missing');
  }

  const resend = new Resend(resendApiKey);
  let sendError = false;

  try {
    const result = await resend.emails.send({
      from: 'Portfolio Contact <onboarding@resend.dev>',
      to: recipientEmail,
      replyTo: email,  // User's email in reply-to
      subject: `Portfolio site contact form message from ${name}`,
      html: `
        <h2>New Contact Form Message</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br />')}</p>
      `,
    });

    if (result.error) {
      console.error('Email sending failed:', result.error);
      sendError = true;
    }
  } catch (error) {
    console.error('Email sending error:', error);
    sendError = true;
  }

  if (sendError) {
    redirect('/contact?status=error');
  }

  redirect('/contact?status=sent');  // Success
}
```

**What it does:**
- Gets form data (name, email, message)
- Validates email format
- Sends email via Resend API
- Redirects with success/error message

---

## 📦 Utility Functions — Helpers

### `utils/projects.ts` — Project Management

#### **`export interface Project`** — Data Structure

```typescript
export interface Project {
  id: number;              // Unique identifier
  title: string;           // Project name
  description: string;     // Short 1-2 line summary
  image: string;           // Image URL (from Vercel Blob)
  technologies: string[];  // Array of tech tags (React, Next.js, etc.)
  githubUrl?: string;      // Optional GitHub link
  liveUrl?: string;        // Optional live demo link
  details: string;         // Full markdown content
}

export type ProjectInput = Omit<Project, 'id'> & { id?: number };
```

#### **`getProjects()`** — Read All Projects

```typescript
export async function getProjects(): Promise<Project[]> {
  return readProjectsFile();  // Read from data/projects.json
}
```

#### **`getProjectById(id)`** — Read Single Project

```typescript
export async function getProjectById(id: number) {
  const projects = await readProjectsFile();
  return projects.find((project) => project.id === id);  // Find by ID
}
```

#### **`upsertProject(input)`** — Create or Update Project

```typescript
export async function upsertProject(input: ProjectInput): Promise<Project> {
  const projects = await readProjectsFile();
  const existingProject = typeof input.id === 'number' ? projects.find((project) => project.id === input.id) : undefined;
  const nextId = existingProject?.id ?? projects.reduce((maxId, project) => Math.max(maxId, project.id), 0) + 1;
  const normalizedProject = normalizeProject(input, nextId);

  const nextProjects = existingProject
    ? projects.map((project) => (project.id === nextId ? normalizedProject : project))
    : [...projects, normalizedProject];

  await writeProjectsFile(nextProjects);
  return normalizedProject;
}
```

**What it does:**
- If ID exists: update that project
- If no ID: create new project with next available ID
- Save to JSON file
- Return saved project

#### **`deleteProjectById(id)`** — Delete Project

```typescript
export async function deleteProjectById(id: number) {
  const projects = await readProjectsFile();
  const nextProjects = projects.filter((project) => project.id !== id);

  if (nextProjects.length === projects.length) {
    return false;  // Not found
  }

  await writeProjectsFile(nextProjects);
  return true;  // Successfully deleted
}
```

**What it does:** Removes project from JSON file.

---

### `utils/panel-auth.ts` — Authentication

```typescript
import { createHash } from 'node:crypto';
import { cookies } from 'next/headers';

export const panelCookieName = 'portfolio-panel-session';

export function getPanelPassword() {
  return process.env.CMS_PANEL_PASSWORD?.trim() ?? '';  // From .env.local
}

function getPanelSessionSecret() {
  return process.env.PANEL_SESSION_SECRET?.trim() || getPanelPassword();
}

export function createPanelSessionToken(password = getPanelPassword()) {
  return createHash('sha256')
    .update(`${password}:${getPanelSessionSecret()}`)
    .digest('hex');  // Hash the password
}

export function isPanelPasswordEnabled() {
  return getPanelPassword().length > 0;
}

export async function isPanelAuthenticated() {
  const expectedPassword = getPanelPassword();

  if (!expectedPassword) {
    return true;  // No password set, allow access
  }

  const cookieStore = await cookies();
  return cookieStore.get(panelCookieName)?.value === createPanelSessionToken(expectedPassword);
  // Check if cookie matches hash
}
```

**What it does:**
- Manages password authentication
- Creates secure session tokens
- Checks if user is authenticated

---

## 🎨 Components — UI Blocks

### `components/Header.tsx` — Navigation

```typescript
import Link from 'next/link';

export default function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/90 backdrop-blur-xl shadow-sm">
      <div className="container mx-auto flex flex-wrap items-center justify-between gap-4 px-4 py-4">
        <Link href="/" className="text-lg font-semibold tracking-tight text-slate-900">
          Picomve
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex">
          <Link href="/" className="transition hover:text-sky-700">
            Home
          </Link>
          <Link href="/about" className="transition hover:text-sky-700">
            About
          </Link>
        </nav>

        <Link
          href="/contact"
          className="inline-flex items-center justify-center rounded-full bg-sky-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-sky-700"
        >
          Contact
        </Link>
      </div>
    </header>
  );
}
```

**What it does:** Sticky navigation bar with logo and links.

---

### `components/Footer.tsx` — Footer

```typescript
export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white py-8">
      <div className="container mx-auto px-4 text-center">
        <p className="text-sm text-slate-600">
          © {new Date().getFullYear()} Picomve. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
```

**What it does:** Shows copyright footer.

---

### `components/Projects.tsx` — Server Component that Lists Projects

```typescript
import ProjectCard from './ProjectCard';
import { getProjects } from '../utils/projects';

const Projects = async () => {
  const projects = await getProjects();  // Fetch from JSON

  return (
    <section className="py-16 bg-slate-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-slate-900 mb-10">My Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />  {/* Show each as card */}
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
```

**What it does:** Fetches all projects and displays them as cards in 3-column grid.

---

### `components/ProjectCard.tsx` — Individual Project Card

```typescript
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
            loading="eager"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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
```

**What it does:**
- Shows project image with hover effect
- Displays title, description, tech tags
- Clickable to go to `/projects/{id}`

---

### `components/ProjectsPanel.tsx` — Admin Project Management

```typescript
'use client';

import { useState } from 'react';
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
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                <p className="text-slate-600 mb-4 text-sm line-clamp-2">{project.description}</p>
                <div className="flex flex-wrap gap-1 mb-4">
                  {project.technologies.slice(0, 3).map((tech, index) => (
                    <span
                      key={index}
                      className="bg-sky-100 text-sky-800 text-xs font-semibold uppercase tracking-wide px-2 py-1 rounded"
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
                  className="w-full bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-lg font-semibold transition text-sm"
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
```

**What it does:**
- Shows all projects in a grid
- Click "Edit" button to open modal
- Modal shows form to edit that project
- Click × to close modal

---

### `components/ProjectEditorForm.tsx` — Form for Creating/Editing Projects

```typescript
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

    // Show preview immediately
    const reader = new FileReader();
    reader.onload = (event) => {
      setPreview(event.target?.result as string);
    };
    reader.readAsDataURL(file);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        setUploadError(error.error || 'Upload failed');
        setPreview('');
        return;
      }

      const { url } = await response.json();
      setImageUrl(url);  // Store URL from Vercel Blob
      setUploadError('');
    } catch (error) {
      setUploadError('Upload failed. Please try again.');
      setPreview('');
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <form action={saveProjectAction} className="space-y-4">
        <input type="hidden" name="id" defaultValue={project?.id ?? ''} />
        <input type="hidden" name="image" value={imageUrl} />  {/* Store image URL */}

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

        {/* Show preview while uploading */}
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

        {/* Technologies (comma-separated) */}
        <label className="block text-sm font-medium text-slate-700">
          Technologies
          <input
            name="technologies"
            defaultValue={project?.technologies.join(', ') ?? ''}
            placeholder="React, Next.js, Tailwind CSS"
            className={inputClassName}
          />
        </label>

        {/* Markdown content */}
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

      {/* Delete button appears only for existing projects */}
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
```

**What it does:**
- File picker for images (uploads to Vercel Blob)
- Text input for title, description, URLs
- Tech tags (comma-separated)
- Markdown textarea for full project details
- Shows image preview
- Shows delete button only for existing projects

---

## 🌐 API Routes

### `app/api/upload/route.ts` — Image Upload Handler

```typescript
import { put } from '@vercel/blob';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed.' },
        { status: 400 }
      );
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File too large. Maximum 5MB allowed.' },
        { status: 400 }
      );
    }

    // Create unique filename
    const timestamp = Date.now();
    const filename = `portfolio-${timestamp}-${file.name}`;

    // Upload to Vercel Blob
    const blob = await put(filename, file, {
      access: 'public',
      addRandomSuffix: false,
    });

    return NextResponse.json({ url: blob.url });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Upload failed. Please try again.' },
      { status: 500 }
    );
  }
}
```

**What it does:**
- Receives image file from client
- Validates type (JPEG, PNG, WebP, GIF only)
- Validates size (max 5MB)
- Uploads to Vercel Blob storage
- Returns public URL for storing in JSON

---

## 📊 Data Flow Summary

### Viewing a Project

```
User visits /projects/1
    ↓
Next.js renders ProjectPage component
    ↓
Calls getProjectById(1)
    ↓
Reads projects.json
    ↓
Returns project data
    ↓
Renders <Image>, title, markdown content
    ↓
User sees project details
```

### Managing Projects (Admin Panel)

```
Admin goes to /panel
    ↓
Checks if authenticated (isPanelAuthenticated)
    ↓
Shows password form if not
    ↓
On success, cookie created
    ↓
Shows ProjectsPanel + ProjectEditorForm
    ↓
Admin uploads image
    ↓
Image uploaded to Vercel Blob
    ↓
URL returned & stored in form
    ↓
Admin submits form
    ↓
saveProjectAction called
    ↓
Project saved to projects.json
    ↓
Pages revalidated
    ↓
Site shows new/updated project
```

### Sending Contact Email

```
User fills contact form
    ↓
Submits form
    ↓
sendContactEmail server action called
    ↓
Validates name, email, message
    ↓
Checks Resend API key
    ↓
Sends email via Resend
    ↓
Redirects with success/error message
    ↓
User sees feedback
```

---

## 🎯 Summary

Your portfolio is a **full-stack Next.js application** with:

- **Frontend:** React components (Header, Projects, Cards)
- **Backend:** Server actions (create, update, delete projects & send emails)
- **Storage:** JSON file + Vercel Blob (images)
- **Authentication:** Password + session tokens
- **Email:** Resend API
- **Deployment:** Railway (Docker)

Every file has a specific purpose working together to create a complete portfolio CMS!
