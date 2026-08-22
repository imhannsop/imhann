"use client";

import { useEffect, useState } from "react";
import { stats } from "@/lib/data";

const BLURB = "I write code, build full-stack web tools, and dive into problem-solving.";

export default function Hero() {
  const [typed, setTyped] = useState("");

  useEffect(() => {
    let i = 0;
    const id = setInterval(() => {
      i++;
      setTyped(BLURB.slice(0, i));
      if (i >= BLURB.length) clearInterval(id);
    }, 22);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="hero" id="home">
      <div className="panel hero-panel">
        <div className="identity-header">
          <div className="avatar">
            EK<span className="avatar-tag">placeholder</span>
          </div>
          <div className="identity-name">
            <h1>EKOUBUYOI</h1>
            <div className="role">CS @ USA · Competitive Prog &amp; Web Dev</div>
          </div>
        </div>
        <p className="blurb">
          {typed}
          <span className="cursor-blink" />
        </p>
        <div className="links">
          <a href="https://github.com" target="_blank" rel="noreferrer">
            GitHub ↗
          </a>
          <a href="/resume.pdf" target="_blank" rel="noreferrer">
            Resume ↗
          </a>
        </div>
      </div>

      <div className="panel stats-panel">
        <div className="panel-title">fastfetch</div>
        <div className="arch-badge">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 3 4.5 20h5.2L12 13.5 14.3 20h5.2z" fill="var(--cyan)" />
          </svg>
          <span className="who">ekoubu@yoi</span>
        </div>
        <div className="ff-specs">
          {stats.map((s) => (
            <div className="ff-row" key={s.label}>
              <span className="label">{s.label}</span>
              <span className="value">{s.value}</span>
            </div>
          ))}
          <div className="ff-row">
            <span className="label">Status</span>
            <span className="value status-active">
              <span className="led" />
              Active
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
