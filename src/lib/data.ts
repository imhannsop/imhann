// All repeatable content lives here as data, not hand-written JSX.
// Sections map over these arrays instead of copy-pasting markup.

export const crumbLinks = ["about", "skills", "works", "certs", "blogs", "contact"] as const;

export const mobileNavItems = [
  { id: "home", label: "Home", icon: "home" as const },
  { id: "about", label: "About", icon: "about" as const },
  { id: "works", label: "Works", icon: "works" as const },
  { id: "blogs", label: "Blogs", icon: "blogs" as const },
  { id: "contact", label: "Contact", icon: "contact" as const },
];

export const stats = [
  { label: "OS", value: "Arch Linux" },
  { label: "Host", value: "ThinkPad T420" },
  { label: "WM", value: "niri / SwayFX" },
  { label: "Shell", value: "zsh + nvim" },
  { label: "Lang", value: "C++, TS" },
];

export const skillGroups = [
  {
    title: "LANGUAGES",
    items: [
      { name: "C++", level: "advanced", pct: 90 },
      { name: "TypeScript", level: "advanced", pct: 82 },
      { name: "Python", level: "proficient", pct: 70 },
    ],
  },
  {
    title: "FRAMEWORKS",
    items: [
      { name: "Next.js", level: "proficient", pct: 78 },
      { name: "React", level: "proficient", pct: 80 },
      { name: "Tailwind", level: "comfortable", pct: 65 },
    ],
  },
  {
    title: "TOOLS & PLATFORMS",
    items: [
      { name: "Git", level: "advanced", pct: 88 },
      { name: "Docker", level: "comfortable", pct: 60 },
      { name: "Linux / Arch", level: "advanced", pct: 85 },
    ],
  },
];

export const projects = [
  {
    file: "01-clinic-portal.md",
    idx: "01.",
    name: "San Agustin Clinic Portal",
    desc: "Full-stack health administration system for student services.",
    tags: ["Next.js", "TypeScript", "Tailwind"],
    detail:
      "Appointment scheduling, patient records, and staff dashboards for campus health services. Auth, role-based access, and audit logging included.",
  },
  {
    file: "02-ragbot-ai.md",
    idx: "02.",
    name: "RAGBOT AI",
    desc: "Disaster response coordination platform for barangay safety.",
    tags: ["C++", "Full-Stack", "RAG"],
    detail:
      "Retrieval-augmented assistant surfacing local emergency protocols, built for low-bandwidth, high-urgency use at the barangay level.",
  },
];

export const certs = [
  { name: "Certificate Name", issuer: "Issuer", year: "2025" },
  { name: "Certificate Name", issuer: "Issuer", year: "2025" },
  { name: "Certificate Name", issuer: "Issuer", year: "2024" },
];

export const books = [
  {
    color: "c1",
    title: "Notes on Competitive Programming",
    meta: "Aug 2026 · 4 min read",
    excerpt:
      "Placeholder excerpt — thoughts on training for contests, pattern recognition, and the grind of upsolving.",
  },
  {
    color: "c2",
    title: "Building RagBot AI",
    meta: "Jul 2026 · 6 min read",
    excerpt:
      "Placeholder excerpt — how the retrieval pipeline came together for barangay-level disaster response.",
  },
  {
    color: "c3",
    title: "Arch + Nvim Setup",
    meta: "Jun 2026 · 3 min read",
    excerpt:
      "Placeholder excerpt — the dotfiles, plugins, and workflow that make up the daily driver setup.",
  },
  {
    color: "c4",
    title: "Full-Stack Lessons",
    meta: "May 2026 · 5 min read",
    excerpt:
      "Placeholder excerpt — things learned shipping the clinic portal end to end, from schema to deploy.",
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
