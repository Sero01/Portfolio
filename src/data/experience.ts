export interface Experience {
  year: string;
  role: string;
  company: string;
  description: string;
}

export const experience: Experience[] = [
  {
    year: "2026",
    role: "Senior Analyst",
    company: "Northern Trust",
    description:
      "Built a RAG pipeline for an AS/400 legacy codebase using Azure GAI and Neo4j graph database.",
  },
  {
    year: "2024",
    role: "Analyst",
    company: "Northern Trust",
    description: "Brief description of role and impact.",
  },
  {
    year: "2022",
    role: "",
    company: "Skoda Volkswagen",
    description: "Brief description of role and impact.",
  },
];
