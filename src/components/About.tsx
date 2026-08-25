export default function About() {
  return (
    <div
      id="home"
      className="relative flex flex-col justify-between h-full rounded-xl border-3 border-black bg-bg-panel p-8 max-sm:p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] scroll-mt-3 md:scroll-mt-20"
    >
      <div className="absolute -top-[9px] left-4 bg-bg px-2 text-xs tracking-[.14em] font-semibold text-text-dim uppercase">
        about me
      </div>

      <div className="w-full space-y-3.5 text-sm sm:text-base leading-[1.7] text-text mt-2">
        <p>
          CS sophomore focused on building fast, functional web tools and running lightweight Linux configurations.
          3+ years of daily-driver Linux experience with a focus on system customization, efficiency, and developer workflow automation.
        </p>
        <p>
          Beyond web development, I’m fascinated by systems automation, developer tooling, and workflow optimization.   Currently building side projects, sharpening my C++ fundamentals, and looking for Software Engineering, Web Development, or DevOps internships.
        </p>
      </div>
    </div>
  );
}