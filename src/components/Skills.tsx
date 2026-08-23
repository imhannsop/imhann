import { skillGroups } from "@/lib/data";

export default function Skills() {
  return (
    <div className="relative scroll-mt-24 sm:scroll-mt-28 rounded-xl border-3 border-black bg-bg-panel p-8 max-sm:p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" id="skills">
      <div className="absolute -top-[9px] left-4 bg-bg px-2 text-xs tracking-[.14em] font-semibold text-text-dim uppercase">
        tech stack
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-2">
        {skillGroups.map((group) => (
          <div key={group.title}>
            <h3 className="mb-4 text-sm sm:text-base font-bold tracking-[.06em] text-blue">{group.title}</h3>
            {group.items.map((item) => (
              <div className="mb-4 last:mb-0" key={item.name}>
                <div className="mb-1.5 flex justify-between text-sm sm:text-base">
                  <span className="font-medium text-text-bright">{item.name}</span>
                  <span className="text-xs sm:text-sm text-text-dim">{item.level}</span>
                </div>
                <div className="h-[9px] overflow-hidden rounded-[3px] border border-border-dim bg-bg-raised">
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