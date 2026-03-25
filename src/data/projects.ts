export interface Project {
  id: number;
  title: string;
  description: string;
  tags: string[];
  metric?: string;
  metricLabel?: string;
  href: string;
  image?: string;
  featured?: boolean;
}

export const projects: Project[] = [
  {
    id: 1,
    title: "Project Name One",
    description: "A brief description of this project and the problem it solves. Built to serve thousands of users with a focus on performance and reliability.",
    tags: ["React", "Node.js", "PostgreSQL"],
    metric: "50K+",
    metricLabel: "Users Served",
    href: "#",
    featured: true,
  },
  {
    id: 2,
    title: "Project Name Two",
    description: "A brief description of this project and the problem it solves.",
    tags: ["Next.js", "TypeScript", "Tailwind"],
    href: "#",
  },
  {
    id: 3,
    title: "Project Name Three",
    description: "A brief description of this project and the problem it solves.",
    tags: ["Python", "FastAPI", "Docker"],
    href: "#",
  },
  {
    id: 4,
    title: "Project Name Four",
    description: "A brief description of this project and the problem it solves. An augmented reality experience pushing the boundaries of web technology.",
    tags: ["React Native", "Firebase"],
    href: "#",
    featured: true,
  },
];
