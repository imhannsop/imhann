"use client";

import { useState } from "react";

export default function Contact() {
  const [sent, setSent] = useState(false);

  return (
    <div className="panel section" id="contact">
      <div className="section-label">contact</div>
      <div className="contact-note">design only for now — no backend wired up yet.</div>
      <div className="contact-form">
        <div className="field">
          <label>name</label>
          <input type="text" placeholder="your name" />
        </div>
        <div className="field">
          <label>email</label>
          <input type="email" placeholder="you@email.com" />
        </div>
        <div className="field">
          <label>message</label>
          <textarea rows={4} placeholder="write your message..." />
        </div>
        <button className="send-btn" onClick={() => setSent(true)}>
          send message
        </button>
        {sent && (
          <div className="send-status ok">queued — no backend connected yet (design preview only)</div>
        )}
      </div>
    </div>
  );
}
