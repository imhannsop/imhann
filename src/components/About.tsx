export default function About() {
  return (
    <div
      id="about"
      className="relative flex flex-col justify-between h-full rounded-xl border-3 border-black bg-bg-panel p-8 max-sm:p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] scroll-mt-24 sm:scroll-mt-28"
    >
      <div className="mb-5 text-xs tracking-[.14em] font-semibold text-text-dim uppercase">about me</div>
      <div className="w-full space-y-3.5 text-sm sm:text-base leading-[1.7] text-text">
        <p>
          I&apos;m currently pursuing my Computer Science degree at the University of San Agustin.
          A lot of my focus is geared toward algorithmic problem-solving and training for competitive programming contests in C++.
        </p>
        <p>
          Beyond algorithms, I enjoy building highly tactile web applications, optimizing workflows, and setting up automated build pipelines.
          I am eager to apply my systems automation knowledge in DevOps roles, and I am actively looking for internships and collaborative software projects.
        </p>
      </div>
    </div>
  );
}