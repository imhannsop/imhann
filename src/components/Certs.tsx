import { certs } from "@/lib/data";

export default function Certs() {
  return (
    <div className="relative scroll-mt-5 rounded-[3px] border border-border bg-bg-panel px-5 py-[22px]" id="certs">
      <div className="mb-3.5 text-[11px] tracking-[.12em] text-text-dim uppercase">certifications</div>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-3">
        {certs.map((c, i) => (
          <div
            className="flex flex-col gap-2 rounded-[3px] border border-border-dim p-3.5"
            key={i}
          >
            <div className="flex h-[70px] items-center justify-center rounded-[3px] border border-dashed border-border bg-[repeating-linear-gradient(45deg,var(--color-bg-raised)_0_8px,var(--color-bg-panel)_8px_16px)] text-[10.5px] tracking-[.06em] text-text-dim uppercase">
              certificate
            </div>
            <div className="text-[12.5px] font-bold text-text-bright">{c.name}</div>
            <div className="flex justify-between text-[11px] text-text-dim">
              <span>{c.issuer}</span>
              <span>{c.year}</span>
            </div>
            <a href="#" className="text-[11px] text-blue no-underline hover:text-purple">
              view ↗
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}