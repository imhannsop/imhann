"use client";

import { useState } from "react";
import { books } from "@/lib/data";

export default function Blogs() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const [flipped, setFlipped] = useState(false);

  const open = (idx: number) => {
    setOpenIdx(idx);
    setTimeout(() => setFlipped(true), 120);
  };
  const close = () => {
    setFlipped(false);
    setTimeout(() => setOpenIdx(null), 300);
  };

  const book = openIdx !== null ? books[openIdx] : null;

  return (
    <>
      <div className="panel section" id="blogs">
        <div className="section-label">blogs — the library</div>
        <div className="shelf-wrap">
          <div className="shelf">
            {books.map((b, i) => (
              <div className={`book-spine ${b.color}`} key={b.title} onClick={() => open(i)}>
                <span className="title">{b.title}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {openIdx !== null && (
        <div className={`book-overlay show${flipped ? " open" : ""}`} onClick={(e) => e.target === e.currentTarget && close()}>
          <div className="book-stage">
            <div className="book3d">
              <button className="book-close" onClick={close}>
                ×
              </button>
              <div className="pages">
                <h4>{book!.title}</h4>
                <div className="meta">{book!.meta}</div>
                <p>{book!.excerpt}</p>
              </div>
              <div className="cover">
                <div>
                  <div className="cover-title">{book!.title}</div>
                  <div className="cover-sub">tap to open</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
