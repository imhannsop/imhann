export default function About() {
  return (
    <div className="relative scroll-mt-5 rounded-[3px] border border-border bg-bg-panel px-5 py-[22px]" id="about">
      <div className="mb-3.5 text-[11px] tracking-[.12em] text-text-dim uppercase">about me</div>
      <div className="max-w-[66ch] text-[13.5px] leading-[1.75] text-text">
        <p>
          Placeholder bio — swap this for your real story. e.g. "I'm a{" "}
          <span className="text-amber">CS student</span> based in the US who spends most nights between{" "}
          <span className="text-amber">competitive programming</span> contests and shipping small full-stack
          tools that actually get used."
        </p>
        <p className="mt-2.5">
          What I'm currently exploring: <span className="text-amber">RAG systems</span>, distributed
          systems fundamentals, and building tools for local communities back home. Open to
          internships and collab on interesting side projects.
        </p>
      </div>
    </div>
  );
}