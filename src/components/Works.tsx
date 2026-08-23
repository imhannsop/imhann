"use client";

import { projects } from "@/lib/data";
import CoverflowCarousel, {
  type CoverflowSlide,
} from "@/components/ui/coverflow-carousel";

export default function Works() {
  const slides: CoverflowSlide[] = projects.map((p) => ({
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
      <div className="mb-6 text-xs tracking-[.14em] font-semibold text-text-dim uppercase">
        selected works — swipe or use arrows to browse
      </div>

      <CoverflowCarousel
        slides={slides}
        showCaption
        showNavigation
        showPagination
      />
    </div>
  );
}