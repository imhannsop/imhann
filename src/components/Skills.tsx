import { skillGroups } from "@/lib/data";

export default function Skills() {
  return (
    <div className="relative scroll-mt-5 rounded-[3px] border border-border bg-bg-panel px-6 py-6" id="skills">
      <div className="mb-4 text-xs tracking-[.12em] text-text-dim uppercase">tech stack</div>
      <div className="grid grid-cols-3 gap-5 max-sm:grid-cols-1">
        {skillGroups.map((group) => (
          <div key={group.title}>
            <h3 className="mb-3 text-sm tracking-[.04em] text-blue">{group.title}</h3>
            {group.items.map((item) => (
              <div className="mb-3" key={item.name}>
                <div className="mb-1 flex justify-between text-sm">
                  <span className="text-text-bright">{item.name}</span>
                  <span className="text-xs text-text-dim">{item.level}</span>
                </div>
                <div className="h-[7px] overflow-hidden rounded-[3px] border border-border-dim bg-bg-raised">
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