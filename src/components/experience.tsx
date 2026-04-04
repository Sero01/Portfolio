"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ScrollReveal } from "./scroll-reveal";

interface Milestone {
  id: number;
  company: string;
  role: string;
  location: string;
  period: string;
  highlights: string[];
}

const milestones: Milestone[] = [
  {
    id: 1,
    company: "Northern Trust",
    role: "Senior Analyst, Software Engineer",
    location: "Bengaluru, India",
    period: "2026 – Present",
    highlights: [
      "Architected a Retrieval-Augmented Generation pipeline over a legacy AS/400 codebase, leveraging Azure Generative AI for semantic search and Neo4j graph database for dependency mapping — enabling developers to query and understand decades-old business logic in natural language.",
    ],
  },
  {
    id: 2,
    company: "Northern Trust",
    role: "Analyst, Software Engineer",
    location: "Bengaluru, India",
    period: "Aug 2024 – 2026",
    highlights: [
      "Led end-to-end migration of 21 Spring Boot microservices from v2.1.x to v2.7.x, resolving dependency conflicts and ensuring zero-downtime rollout across enterprise banking infrastructure.",
      "Remediated 800+ container vulnerabilities across 21 microservices by upgrading dependencies and hardening container configurations.",
      "Engineered a Python-based report conversion tool that transforms large TLM HTML reports into optimised XLSX files — reducing load time from minutes to seconds. Adopted company-wide.",
      "Automated CI/CD pipelines using GitHub Actions and Shell scripting, cutting deployment time by 40%.",
      "Designed and maintained full-stack enterprise applications (React, Spring Boot, Snowflake) in an Agile/Scrum model.",
    ],
  },
  {
    id: 3,
    company: "Northern Trust",
    role: "Front-End Engineering Intern",
    location: "Bengaluru, India",
    period: "Jun 2023 – Sep 2023",
    highlights: [
      "Built modular, reusable React components that accelerated UI development across internal platforms.",
      "Improved frontend performance by 25% and accessibility scores via Lighthouse audits and targeted optimisations.",
      "Integrated REST APIs to power dynamic, data-driven components for financial dashboards.",
    ],
  },
  {
    id: 4,
    company: "Skoda Volkswagen Training Academy",
    role: "Full-Stack Developer Intern",
    location: "Pune, India",
    period: "Oct 2022 – Mar 2023",
    highlights: [
      "Developed a full-stack Decision Support System using Django, React, PostgreSQL, and Docker for sales and HR analytics across 100+ dealership branches.",
      "Implemented real-time data visualisation and caching strategies, reducing report generation time by 90%.",
      "Applied user authentication, RBAC, and structured logging to secure and monitor system activity.",
    ],
  },
];

export function Experience() {
  const [activeId, setActiveId] = useState<number | null>(null);

  return (
    <section id="experience" className="py-24 sm:py-32">
      <div className="max-w-6xl mx-auto px-6">
        <ScrollReveal>
          <h2 className="font-[family-name:var(--font-display)] text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight mb-16">
            Experience
          </h2>
        </ScrollReveal>

        {/* Roadmap timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-4 sm:left-6 top-0 bottom-0 w-px bg-[var(--color-border)]" />

          <div className="space-y-2">
            {milestones.map((milestone, index) => (
              <ScrollReveal key={milestone.id} delay={index * 0.1}>
                <div
                  className="relative pl-12 sm:pl-16 group"
                  onMouseEnter={() => setActiveId(milestone.id)}
                  onMouseLeave={() => setActiveId(null)}
                >
                  {/* Dot on timeline */}
                  <div
                    className={`absolute left-2.5 sm:left-4.5 top-2 w-3 h-3 rounded-full border-2 transition-colors duration-200 ${
                      activeId === milestone.id
                        ? "bg-[var(--color-accent)] border-[var(--color-accent)]"
                        : "bg-[var(--color-bg)] border-[var(--color-muted)]"
                    }`}
                  />

                  {/* Milestone header */}
                  <div className="cursor-pointer py-4">
                    <p className="text-sm uppercase tracking-widest text-[var(--color-muted)] mb-1">
                      {milestone.period}
                    </p>
                    <h3 className="font-[family-name:var(--font-display)] text-xl sm:text-2xl font-bold group-hover:text-[var(--color-accent)] transition-colors">
                      {milestone.role}
                    </h3>
                    <p className="text-base text-[var(--color-muted)]">
                      {milestone.company} &middot; {milestone.location}
                    </p>
                  </div>

                  {/* Expandable details on hover */}
                  <AnimatePresence>
                    {activeId === milestone.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <ul className="pb-6 space-y-2">
                          {milestone.highlights.map((highlight, i) => (
                            <li
                              key={i}
                              className="text-base text-[var(--color-muted)] leading-relaxed pl-4 border-l-2 border-[var(--color-border)]"
                            >
                              {highlight}
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </ScrollReveal>
            ))}

          </div>
        </div>
      </div>
    </section>
  );
}
