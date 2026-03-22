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

export const projects: Project[] = [
  {
    id: 1,
    title: "Picomve's portfolio app",
    description: 'A basic PWA web application to showcase my skills and projects',
    image: '/example-project1.jpg',
    technologies: ['React', 'Node.js', 'next.js', 'TailwindCSS', 'TypeScript'],
    githubUrl: 'https://github.com/picomve/portfolio-app',
    liveUrl: 'https://www.picomve.info',
    details:
      `## Project Overview\n\nI developed this high-performance, responsive **Progressive Web App (PWA)** using Next.js to effectively showcase my full-stack development skills and featured projects.\n\n## Key Features\n\n- **Responsive Design** - Works seamlessly across all devices\n- **PWA Capabilities** - Offline support and fast loading times\n- **SEO Optimized** - Built-in search engine optimization\n- **Modern Architecture** - Clean, modular codebase\n\n## Technical Stack\n\nThe application leverages modern web standards including:\n\n1. Next.js for server-side rendering\n2. React for dynamic UI components\n3. TypeScript for type safety\n4. Tailwind CSS for styling\n5. Node.js backend services\n\n## Impact\n\nThis project serves as a living portfolio of my technical journey and demonstrates my commitment to delivering user-centric digital solutions with polished UI/UX design.`,
  }
];

export function getProjectById(id: number) {
  return projects.find((project) => project.id === id);
}
