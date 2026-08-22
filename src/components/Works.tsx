"use client";

import { useState } from "react";
import { projects } from "@/lib/data";

export default function Works() {
  const [openFile, setOpenFile] = useState<string | null>(null);

  return (
    <div className="panel section" id="works">
      <div className="section-label">selected works — click to inspect, or run `cat &lt;file&gt;` below</div>

      {projects.map((p) => {
        const isOpen = openFile === p.file;
        return (
          <div className={`project${isOpen ? " open" : ""}`} key={p.file} data-file={p.file}>
            <div className="project-head" onClick={() => setOpenFile(isOpen ? null : p.file)}>
              <div className="name">
                <span className="idx">{p.idx}</span> {p.name}
              </div>
              <div className="toggle">{isOpen ? "cat ▴" : "cat ▾"}</div>
            </div>
            <div className="project-desc">{p.desc}</div>
            <div className="tags">
              {p.tags.map((t) => (
                <span className="tag" key={t}>
                  {t}
                </span>
              ))}
            </div>
            <div className="project-body">
              <div className="project-body-inner">
                <div className="line">cat {p.file}</div>
                {p.detail}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
