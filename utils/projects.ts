import { promises as fs } from 'node:fs';
import path from 'node:path';

export interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  details: string;
}

export type ProjectInput = Omit<Project, 'id'> & { id?: number };

const dataFilePath = path.join(process.cwd(), 'data', 'projects.json');

const fallbackProjects: Project[] = [
  {
    id: 1,
    title: "Picomve's portfolio app",
    description: 'A basic PWA web application to showcase my skills and projects',
    image: '/example-project1.jpg',
    technologies: ['React', 'Node.js', 'Next.js', 'Tailwind CSS', 'TypeScript'],
    githubUrl: 'https://github.com/picomve/portfolio-app',
    liveUrl: 'https://www.picomve.info',
    details:
      `## Project Overview\n\nI developed this high-performance, responsive **Progressive Web App (PWA)** using Next.js to effectively showcase my full-stack development skills and featured projects.\n\n## Key Features\n\n- **Responsive Design** - Works seamlessly across all devices\n- **PWA Capabilities** - Offline support and fast loading times\n- **SEO Optimized** - Built-in search engine optimization\n- **Modern Architecture** - Clean, modular codebase\n\n## Technical Stack\n\nThe application leverages modern web standards including:\n\n1. Next.js for server-side rendering\n2. React for dynamic UI components\n3. TypeScript for type safety\n4. Tailwind CSS for styling\n5. Node.js backend services\n\n## Impact\n\nThis project serves as a living portfolio of my technical journey and demonstrates my commitment to delivering user-centric digital solutions with polished UI/UX design.`,
  },
];

async function ensureProjectsFile() {
  try {
    await fs.access(dataFilePath);
  } catch {
    await fs.mkdir(path.dirname(dataFilePath), { recursive: true });
    await fs.writeFile(dataFilePath, `${JSON.stringify(fallbackProjects, null, 2)}\n`, 'utf8');
  }
}

async function readProjectsFile(): Promise<Project[]> {
  await ensureProjectsFile();
  const fileContents = await fs.readFile(dataFilePath, 'utf8');
  const parsedProjects = JSON.parse(fileContents) as Project[];

  return parsedProjects.sort((left, right) => left.id - right.id);
}

async function writeProjectsFile(projects: Project[]) {
  await fs.mkdir(path.dirname(dataFilePath), { recursive: true });
  await fs.writeFile(dataFilePath, `${JSON.stringify(projects, null, 2)}\n`, 'utf8');
}

export async function updateProjectsFromJson(rawJson: string) {
  const parsedJson = JSON.parse(rawJson) as unknown;

  if (!Array.isArray(parsedJson)) {
    throw new Error('Projects JSON must be an array.');
  }

  const normalizedProjects: Project[] = parsedJson.map((item, index) => {
    if (!item || typeof item !== 'object') {
      throw new Error(`Project at index ${index} must be an object.`);
    }

    const project = item as Partial<Project>;

    if (
      typeof project.id !== 'number' ||
      typeof project.title !== 'string' ||
      typeof project.description !== 'string' ||
      typeof project.image !== 'string' ||
      !Array.isArray(project.technologies) ||
      project.technologies.some((tech) => typeof tech !== 'string') ||
      typeof project.details !== 'string'
    ) {
      throw new Error(`Project at index ${index} is missing required fields.`);
    }

    return {
      id: project.id,
      title: project.title.trim(),
      description: project.description.trim(),
      image: project.image.trim() || '/example-project1.jpg',
      technologies: project.technologies.map((tech) => tech.trim()).filter(Boolean),
      githubUrl: typeof project.githubUrl === 'string' ? project.githubUrl.trim() || undefined : undefined,
      liveUrl: typeof project.liveUrl === 'string' ? project.liveUrl.trim() || undefined : undefined,
      details: project.details.trim(),
    };
  });

  await writeProjectsFile(normalizedProjects);
}

function normalizeProject(input: ProjectInput, nextId: number): Project {
  return {
    id: nextId,
    title: input.title.trim(),
    description: input.description.trim(),
    image: input.image.trim() || '/example-project1.jpg',
    technologies: input.technologies.map((tech) => tech.trim()).filter(Boolean),
    githubUrl: input.githubUrl?.trim() || undefined,
    liveUrl: input.liveUrl?.trim() || undefined,
    details: input.details.trim(),
  };
}

export async function getProjects(): Promise<Project[]> {
  return readProjectsFile();
}

export async function getProjectById(id: number) {
  const projects = await readProjectsFile();
  return projects.find((project) => project.id === id);
}

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

export async function deleteProjectById(id: number) {
  const projects = await readProjectsFile();
  const nextProjects = projects.filter((project) => project.id !== id);

  if (nextProjects.length === projects.length) {
    return false;
  }

  await writeProjectsFile(nextProjects);
  return true;
}
