export interface Project {
  id: number;
  title: string;
  description: string;
  tags: string[];
  metric?: string;
  metricLabel?: string;
  readTime: string;
  href: string;
  image?: string;
}

export const projects: Project[] = [
  {
    id: 1,
    title: "Project Name One",
    description: "A brief description of this project and the problem it solves.",
    tags: ["React", "Node.js", "PostgreSQL"],
    metric: "50K+",
    metricLabel: "Users Served",
    readTime: "5 min read",
    href: "#",
  },
  {
    id: 2,
    title: "Project Name Two",
    description: "A brief description of this project and the problem it solves.",
    tags: ["Next.js", "TypeScript", "Tailwind"],
    metric: "99.9%",
    metricLabel: "Uptime",
    readTime: "4 min read",
    href: "#",
  },
  {
    id: 3,
    title: "Project Name Three",
    description: "A brief description of this project and the problem it solves.",
    tags: ["Python", "FastAPI", "Docker"],
    metric: "3x",
    metricLabel: "Performance Gain",
    readTime: "6 min read",
    href: "#",
  },
  {
    id: 4,
    title: "Project Name Four",
    description: "A brief description of this project and the problem it solves.",
    tags: ["React Native", "Firebase"],
    readTime: "3 min read",
    href: "#",
  },
];
