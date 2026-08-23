import { skillGroups } from "@/lib/data";

export default function Skills() {
  return (
    <div className="relative scroll-mt-24 sm:scroll-mt-28 rounded-xl border-3 border-black bg-bg-panel p-8 max-sm:p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" id="skills">
      <div className="absolute -top-[9px] left-4 bg-bg px-2 text-xs tracking-[.14em] font-semibold text-text-dim uppercase">
        tech stack
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-2">
        {skillGroups.map((group, i) => (
          <div
            key={group.title}
            className={
              i > 0
                ? "md:border-l-2 md:border-black md:pl-8 border-t-2 border-black pt-6 md:border-t-0 md:pt-0"
                : ""
            }
          >
            <h3 className="mb-4 text-sm sm:text-base font-bold tracking-[.06em] text-blue">
              {group.title}
            </h3>
            <div className="flex flex-wrap gap-2.5">
              {group.items.map((item) => (
                <span
                  key={item.name}
                  className="rounded-lg border-3 border-black bg-bg-raised px-3 py-1.5 text-xs sm:text-sm font-semibold text-text-bright shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all hover:-translate-y-0.5 hover:bg-bg-panel hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                >
                  {item.name}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}