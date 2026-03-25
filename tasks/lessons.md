# Lessons

| # | Mistake | Rule | Context |
|---|---------|------|---------|
| 1 | Put project structure setup as last task (Task 13) instead of first | Always follow global claude.md init guide BEFORE any implementation — project structure comes first | Project initialization |
| 2 | Used `useEffect(() => setState(...))` for mount detection | Use `useSyncExternalStore` pattern for hydration guards — React compiler ESLint rules block setState in useEffect | Theme toggle / client-only rendering |
| 3 | Used narrow Tailwind dark variant `(&:is(.dark *))` | Use `(&:where(.dark, .dark *))` for class-based dark mode to include the .dark element itself, not just descendants | Tailwind v4 dark mode setup |
| 4 | Left default scaffold assets (next.svg, vercel.svg, etc.) in public/ | Clean up scaffold assets after project init — they bloat deployment and cause confusion | Project initialization |
