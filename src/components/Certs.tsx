import { certs } from "@/lib/data";

export default function Certs() {
  return (
    <div className="relative scroll-mt-5 rounded-[3px] border border-border bg-bg-panel px-6 py-6" id="certs">
      <div className="mb-4 text-xs tracking-[.12em] text-text-dim uppercase">certifications</div>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-4">
        {certs.map((c, i) => (
          <div
            className="flex flex-col gap-2.5 rounded-[3px] border border-border-dim p-4"
            key={i}
          >
            <div className="flex h-[80px] items-center justify-center rounded-[3px] border border-dashed border-border bg-[repeating-linear-gradient(45deg,var(--color-bg-raised)_0_8px,var(--color-bg-panel)_8px_16px)] text-xs tracking-[.06em] text-text-dim uppercase">
              certificate
            </div>
            <div className="text-sm font-bold text-text-bright">{c.name}</div>
            <div className="flex justify-between text-xs text-text-dim">
              <span>{c.issuer}</span>
              <span>{c.year}</span>
            </div>
            <a href="#" className="text-xs text-blue no-underline hover:text-purple">
              view ↗
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}