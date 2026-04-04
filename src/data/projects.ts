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
    title: "Norman — Local AI Agent",
    description:
      "A fully local, tool-using AI agent on CPU-only hardware (Intel i5, 8 GB RAM) with sub-3-second tool-use latency and zero cloud dependency. Features a four-zone agentic harness with persistent memory, multi-tool execution, context compaction, and fast/deep reasoning mode toggle. Deployed via FastAPI gateway and Telegram bot.",
    tags: ["Python", "Ollama", "Qwen3 4B", "FastAPI", "httpx"],
    metric: "<3s",
    metricLabel: "Tool-Use Latency",
    href: "https://github.com/Sero01/Norman",
    image: "/projects/Norman.png",
    featured: true,
  },
  {
    id: 2,
    title: "agentguides.dev",
    description:
      "A public documentation site covering AI agents, MCP (Model Context Protocol), and agentic workflow patterns — attracting 1,320+ requests and 89 unique visitors since launch.",
    tags: ["Astro 5", "Starlight", "Cloudflare Pages"],
    metric: "1.3K+",
    metricLabel: "Requests",
    href: "https://github.com/Sero01/ai-agents-guide",
    image: "/projects/agentguides.png",
  },
  {
    id: 3,
    title: "WhispnoteAI — AI Voice Note App",
    description:
      "A mobile-first AI voice note app that transcribes speech via OpenAI Whisper and structures notes into cards and decks using GPT-4o — from raw voice to searchable, tagged note in under 4 seconds. Features local-first SQLite storage, Zustand state management, and masonry card layout with pinning, tagging, and full-text search.",
    tags: ["React Native", "Expo", "TypeScript", "Whisper", "GPT-4o", "SQLite", "Zustand"],
    metric: "<4s",
    metricLabel: "Voice to Note",
    href: "https://github.com/Sero01/WhispnoteAI",
    image: "/projects/whispnoteai.png",
  },
  {
    id: 5,
    title: "Watch Party",
    description:
      "A self-hosted two-person watch party app streaming video in sync across the internet — host controls propagate to guests in real time via WebRTC peer-to-peer voice and Socket.io signaling.",
    tags: ["Node.js", "Express", "Socket.io", "WebRTC", "Cloudflare Tunnel"],
    href: "https://github.com/Sero01/watchparty",
    image: "/projects/watchparty.png",
    featured: true,
  },
];
