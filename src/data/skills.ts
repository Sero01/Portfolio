export interface Skill {
  label: string;
  size?: "sm" | "md" | "lg";
}

export const skills: Skill[] = [
  { label: "React", size: "lg" },
  { label: "Next.js", size: "md" },
  { label: "TypeScript", size: "lg" },
  { label: "Python", size: "md" },
  { label: "Node.js", size: "md" },
  { label: "Spring Boot", size: "md" },
  { label: "PostgreSQL", size: "sm" },
  { label: "Docker", size: "sm" },
  { label: "AWS", size: "sm" },
  { label: "AI/ML", size: "lg" },
  { label: "REST APIs", size: "sm" },
  { label: "GraphQL", size: "sm" },
  { label: "Tailwind CSS", size: "md" },
  { label: "Git", size: "sm" },
];

export const softSkills: Skill[] = [
  { label: "Problem Solving", size: "lg" },
  { label: "System Design", size: "md" },
  { label: "Open Source", size: "md" },
  { label: "Collaboration", size: "lg" },
  { label: "Critical Thinking", size: "md" },
  { label: "Communication", size: "md" },
];
