"use client";

import { useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import { projects } from "@/lib/data";
import CoverflowCarousel, {
  type CoverflowSlide,
} from "@/components/ui/coverflow-carousel";

const ALL_CATEGORY = "All";

export default function Works() {
  const categories = useMemo(() => {
    const unique = Array.from(new Set(projects.map((p) => p.category)));
    return [ALL_CATEGORY, ...unique];
  }, []);

  const [category, setCategory] = useState<string>(ALL_CATEGORY);

  const filteredProjects = useMemo(
    () =>
      category === ALL_CATEGORY
        ? projects
        : projects.filter((p) => p.category === category),
    [category],
  );

  const slides: CoverflowSlide[] = filteredProjects.map((p) => ({
    src: p.image,
    alt: `${p.name} screenshot`,
    title: p.name,
    subtitle: p.desc,
    tags: p.tags,
    githubUrl: p.githubUrl,
    liveUrl: p.liveUrl,
  }));

  return (
    <div
      className="relative scroll-mt-24 sm:scroll-mt-28 rounded-xl border-3 border-black bg-bg-panel p-8 max-sm:p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
      id="works"
    >
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="text-xs tracking-[.14em] font-semibold text-text-dim uppercase">
          selected works — swipe or use arrows to browse
        </div>

        {/* category filter */}
        <div className="relative">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            aria-label="Filter works by category"
            className="cursor-pointer appearance-none rounded-xl border-3 border-black bg-bg-panel py-1.5 pl-3 pr-8 text-xs font-semibold text-text-bright shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-colors hover:bg-bg-raised focus:outline-none"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <ChevronDown
            size={14}
            className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-text-bright"
          />
        </div>
      </div>

      {slides.length > 0 ? (
        // key={category} forces a remount so `active` resets to 0
        // whenever the filtered slide count changes.
        <CoverflowCarousel
          key={category}
          slides={slides}
          showCaption
          showNavigation
          showPagination
        />
      ) : (
        <div className="py-16 text-center text-sm text-text-dim">
          No projects in this category yet.
        </div>
      )}
    </div>
  );
}
