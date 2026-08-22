import { certs } from "@/lib/data";

export default function Certs() {
  return (
    <div className="panel section" id="certs">
      <div className="section-label">certifications</div>
      <div className="cert-grid">
        {certs.map((c, i) => (
          <div className="cert-card" key={i}>
            <div className="cert-thumb">certificate</div>
            <div className="cert-name">{c.name}</div>
            <div className="cert-meta">
              <span>{c.issuer}</span>
              <span>{c.year}</span>
            </div>
            <a href="#" className="cert-link">
              view ↗
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
