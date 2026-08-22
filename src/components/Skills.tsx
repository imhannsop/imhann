import { skillGroups } from "@/lib/data";

export default function Skills() {
  return (
    <div className="relative scroll-mt-5 rounded-[3px] border border-border bg-bg-panel px-5 py-[22px]" id="skills">
      <div className="mb-3.5 text-[11px] tracking-[.12em] text-text-dim uppercase">tech stack</div>
      <div className="grid grid-cols-3 gap-[18px] max-sm:grid-cols-1">
        {skillGroups.map((group) => (
          <div key={group.title}>
            <h3 className="mb-2.5 text-[12px] tracking-[.04em] text-blue">{group.title}</h3>
            {group.items.map((item) => (
              <div className="mb-[9px]" key={item.name}>
                <div className="mb-[3px] flex justify-between text-[12.5px]">
                  <span className="text-text-bright">{item.name}</span>
                  <span className="text-[11px] text-text-dim">{item.level}</span>
                </div>
                <div className="h-[5px] overflow-hidden rounded-[3px] border border-border-dim bg-bg-raised">
                  <div
                    className="h-full bg-gradient-to-r from-green to-blue"
                    style={{ width: `${item.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}