// All repeatable content lives here as data, not hand-written JSX.
// Sections map over these arrays instead of copy-pasting markup.

export const crumbLinks = [
  { id: "home", value: "about", label: "About" },
  { id: "works", value: "works", label: "Works" },
  { id: "certs", value: "certs", label: "Certs" },
  { id: "blogs", value: "blogs", label: "Blogs" },
  { id: "contact", value: "contact", label: "Contact" },
] as const;

export const mobileNavItems = [
  { sectionId: "home", value: "home", label: "Home", icon: "home" as const },
  { sectionId: "home", value: "about", label: "About", icon: "about" as const },
  { sectionId: "works", value: "projects", label: "Projects", icon: "works" as const },
  { sectionId: "certs", value: "certs", label: "Certs", icon: "certs" as const },
  { sectionId: "blogs", value: "blogs", label: "Blogs", icon: "blogs" as const },
  { sectionId: "contact", value: "contact", label: "Contact", icon: "contact" as const },
] as const;

export const stats = [
  { label: "OS", value: "Arch Linux" },
  { label: "Host", value: "EXT-215-54" },
  { label: "WM", value: "niri" },
  { label: "Shell", value: "bash" },
];

export const skillGroups = [
  {
    title: "LANGUAGES",
    items: [
      { name: "C / C++", level: "advanced", pct: 85 },
      { name: "TypeScript / JS", level: "advanced", pct: 85 },
      { name: "Python", level: "intermediate", pct: 65 },
      { name: "Bash / Lua", level: "intermediate", pct: 60 },
    ],
  },
  {
    title: "FRAMEWORKS & RUNTIMES",
    items: [
      { name: "Next.js", level: "advanced", pct: 85 },
      { name: "React", level: "advanced", pct: 80 },
      { name: "Tailwind CSS", level: "advanced", pct: 90 },
      { name: "Node.js", level: "intermediate", pct: 65 },
      { name: "Expo", level: "learning", pct: 45 },
    ],
  },
  {
    title: "TOOLS & INFRASTRUCTURE",
    items: [
      { name: "Linux / Arch", level: "advanced", pct: 90 },
      { name: "Git", level: "advanced", pct: 80 },
      { name: "Supabase / Firebase", level: "intermediate", pct: 65 },
      { name: "CMake", level: "intermediate", pct: 60 },
      { name: "Figma", level: "beginner", pct: 40 },
    ],
  },
];

import type { StaticImageData } from "next/image";

// ESM imports — Next.js resolves these to hashed paths that include basePath automatically.
// This prevents broken images when deployed to GitHub Pages with a subpath (e.g. /imhann/).
import sacmImg from "@/../public/images/projects/1/SACM2.jpg";
import ragbotImg from "@/../public/images/projects/2/ragbot.png";
import overcastImg from "@/../public/images/projects/3/overcast.jpg";
import devfestImg from "@/../public/images/certs/devfest.png";

export interface Project {
  file?: string;
  idx?: string;
  name: string;
  desc: string;
  /** High-level grouping used to filter the Works carousel */
  category: string;
  tags: string[];
  detail?: string;
  /** Imported StaticImageData (preferred) or raw string path */
  image: string | StaticImageData;
  githubUrl?: string;
  liveUrl?: string;
}

export const projects: Project[] = [
  {
    file: "01-clinic-portal.md",
    idx: "01.",
    name: "San Agustin Clinic Portal",
    desc: "Full-stack health administration system for student services.",
    category: "Web App",
    tags: ["C++", "TypeScript", "Tailwind"],
    detail:
      "Appointment scheduling, patient records, and staff dashboards for campus health services. Auth, role-based access, and audit logging included.",
    image: sacmImg,
    githubUrl: "https://github.com/matchaejayyy/Computer-Programming-2-",
    liveUrl: "https://computer-programming-2.vercel.app/login?fbclid=IwcGRvZgNleHRuA2FlbQIxMQBzcnRjBmFwcF9pZA80Mzc2MjYzMTY5NzM3ODgAAR57Pwh7E9uDuYdknINY0-rcH_g0uRjr5USNeNAg04GqzgYCPVx60WC0ILaGlw_aem_ym1PgBTryLDa9YbHTyi_Yw",
  },
  {
    file: "02-ragbot-ai.md",
    idx: "02.",
    name: "RAGBOT AI",
    desc: "Disaster response coordination platform for barangay safety.",
    category: "Web App",
    tags: ["Full-Stack", "RAG"],
    detail:
      "Retrieval-augmented assistant surfacing local emergency protocols, built for low-bandwidth, high-urgency use at the barangay level.",
    image: ragbotImg,
    githubUrl: "https://github.com/imhannsop/Ragbot"
  },
  {
    file: "03-overcast.md",
    idx: "03.",
    name: "Overcast",
    desc: "niri rice.",
    category: "Systems",
    tags: ["QML", "Linux"],
    detail:
      "A qt-based shell with blur and fuzzy-search features.",
    image: overcastImg,
    githubUrl: "https://github.com/ekoubuyoi/overcast",
  },
];

export type Cert = {
  name: string;
  issuer: string;
  year: string | number;
  /** High-level grouping used to filter the Certs section: "Events" or "Certifications" */
  category: "Events" | "Certifications";
  /** Imported StaticImageData (preferred) or raw string path */
  image?: string | StaticImageData;
  url?: string;
  summary?: string;   // add
  tags?: string[];    // add
};

export const certs: Cert[] = [
  {
    name: "DevFest 2025 Bacolod",
    issuer: "Google Developer Group",
    year: "2025",
    // Participation/workshop attendance rather than an issued credential —
    // change to "Certifications" if you'd rather file it there.
    category: "Events",
    image: devfestImg,
    url: "#",
    summary: "Participation and workshop completion at DevFest 2025.",
    tags: ["Workshops", "Web"],
  },
];

export const books = [
  {
    color: "c1",
    title: "Sample blog post",
    meta: "Aug 2026 · 4 min read",
    excerpt: "wa uh",
  },
];

// terminal: files "cat" can read, and sections "cd" can jump to
export const terminalFiles: Record<string, string> = {
  "about.txt": "EKOUBUYOI — CS @ USA. Competitive programming & full-stack web dev.",
  "01-clinic-portal.md":
    "San Agustin Clinic Portal — full-stack health administration system for student services. Next.js / TypeScript / Tailwind.",
  "02-ragbot-ai.md":
    "RAGBOT AI — disaster response coordination platform for barangay safety. C++ / Full-Stack / RAG.",
};

export const terminalSections = ["about", "skills", "works", "certs", "blogs", "contact"];
