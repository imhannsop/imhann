"use client";

import { useState, useEffect } from "react";

interface DayContribution {
  date: string;
  count: number;
  level: number;
  dateStr?: string;
}

interface MonthLabel {
  index: number;
  name: string;
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export default function GitHubCalendar() {
  const [hoveredDay, setHoveredDay] = useState<DayContribution | null>(null);
  const [weeks, setWeeks] = useState<DayContribution[][]>([]);
  const [monthLabels, setMonthLabels] = useState<MonthLabel[]>([]);
  const [totalContributions, setTotalContributions] = useState(297);
  const [currentStreak, setCurrentStreak] = useState(2);
  const [maxStreak, setMaxStreak] = useState(4);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchContributions() {
      try {
        const res = await fetch("https://github-contributions-api.jogruber.de/v4/imhannsop?y=last");
        if (!res.ok) throw new Error("Failed to fetch contributions");
        const data = await res.json();
        const rawList: DayContribution[] = data.contributions || [];

        if (rawList.length === 0) return;

        // Total
        const total = data.total?.lastYear ?? rawList.reduce((sum, d) => sum + d.count, 0);
        setTotalContributions(total);

        // Calculate streaks
        let tempStreak = 0;
        let highest = 0;
        for (const d of rawList) {
          if (d.count > 0) {
            tempStreak++;
            if (tempStreak > highest) highest = tempStreak;
          } else {
            tempStreak = 0;
          }
        }
        setMaxStreak(highest);

        let activeStreak = 0;
        let idx = rawList.length - 1;
        // If today has 0 contributions so far, check starting from yesterday
        if (rawList[idx].count === 0 && idx > 0) idx--;
        while (idx >= 0 && rawList[idx].count > 0) {
          activeStreak++;
          idx--;
        }
        setCurrentStreak(activeStreak);

        // Format dates & group into weeks of 7
        const formattedList = rawList.map((d) => {
          const dateObj = new Date(d.date + "T00:00:00");
          const dateStr = dateObj.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          });
          return { ...d, dateStr };
        });

        const groupedWeeks: DayContribution[][] = [];
        for (let i = 0; i < formattedList.length; i += 7) {
          groupedWeeks.push(formattedList.slice(i, i + 7));
        }

        // Pad last week to 7 days
        const lastWeek = groupedWeeks[groupedWeeks.length - 1];
        while (lastWeek && lastWeek.length < 7) {
          lastWeek.push({ date: "", count: 0, level: 0 });
        }

        // Calculate month labels aligned with week columns
        const labels: MonthLabel[] = [];
        let lastMonth = -1;
        groupedWeeks.forEach((week, wIdx) => {
          const firstValidDay = week.find((d) => d.date);
          if (firstValidDay) {
            const m = new Date(firstValidDay.date + "T00:00:00").getMonth();
            if (m !== lastMonth) {
              labels.push({ index: wIdx, name: MONTHS[m] });
              lastMonth = m;
            }
          }
        });

        setWeeks(groupedWeeks);
        setMonthLabels(labels);
      } catch (err) {
        console.error("Error fetching live github activity:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchContributions();
  }, []);

  return (
    <div className="relative flex flex-col justify-between h-full rounded-xl border-3 border-black bg-bg-panel p-8 max-sm:p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
      <div className="absolute -top-[9px] left-4 bg-bg px-2 text-xs tracking-[.14em] font-semibold text-text-dim uppercase">
        github activity (@imhannsop)
      </div>

      <div className="flex flex-col gap-4">
        {/* Stats Summary */}
        <div className="flex flex-wrap items-end justify-between gap-2 border-b border-border-dim pb-3">
          <div>
            <div className="text-xl sm:text-2xl font-extrabold text-text-bright tracking-tight">
              {totalContributions.toLocaleString()} contributions
            </div>
            <div className="text-xs font-semibold text-text-dim uppercase tracking-[.06em] mt-0.5">
              in the last year on GitHub
            </div>
          </div>
          <div className="flex gap-4 text-xs sm:text-sm font-medium text-text">
            <div>
              <span className="text-text-dim">Streak:</span>{" "}
              <span className="font-bold text-text-bright">{currentStreak} {currentStreak === 1 ? "day" : "days"}</span>
            </div>
            <div>
              <span className="text-text-dim">Max:</span>{" "}
              <span className="font-bold text-text-bright">{maxStreak} days</span>
            </div>
          </div>
        </div>

        {/* Calendar Grid wrapper for horizontal scroll on mobile */}
        <div className="overflow-x-auto pb-2 scrollbar-thin">
          <div className="min-w-[1080px] flex flex-col gap-1.5 pt-2">
            {/* Month Labels */}
            <div className="grid grid-cols-[30px_1fr] gap-3 text-[10px] font-semibold text-text-dim uppercase select-none">
              <div />
              <div className="relative h-[16px]">
                {monthLabels.map((m) => (
                  <span
                    key={`${m.name}-${m.index}`}
                    className="absolute"
                    style={{ left: `${m.index * 20}px` }}
                  >
                    {m.name}
                  </span>
                ))}
              </div>
            </div>

            {/* Grid Container */}
            <div className="grid grid-cols-[30px_1fr] gap-3">
              {/* Day of Week Labels */}
              <div className="flex flex-col justify-between text-[10px] py-1 font-semibold text-text-dim uppercase h-[136px] select-none">
                <span>Mon</span>
                <span>Wed</span>
                <span>Fri</span>
              </div>

              {/* Grid block (53 weeks x 7 days) */}
              <div className="grid grid-flow-col auto-cols-[16px] grid-rows-7 gap-[4px] h-[136px]">
                {weeks.map((week, wIdx) =>
                  week.map((day, dIdx) => {
                    if (!day.date) {
                      return <div key={`empty-${wIdx}-${dIdx}`} className="h-[16px] w-[16px] opacity-0" />;
                    }

                    return (
                      <div
                        key={`${wIdx}-${dIdx}-${day.date}`}
                        onMouseEnter={() => setHoveredDay(day)}
                        onMouseLeave={() => setHoveredDay(null)}
                        className={`h-[16px] w-[16px] rounded-[2px] transition-all cursor-pointer ${day.level === 0
                            ? "bg-bg-raised border border-border-dim hover:bg-border"
                            : day.level === 1
                              ? "bg-[#22c55e]/20 hover:scale-115"
                              : day.level === 2
                                ? "bg-[#22c55e]/40 hover:scale-115"
                                : day.level === 3
                                  ? "bg-[#22c55e]/70 hover:scale-115"
                                  : "bg-[#22c55e] hover:scale-115"
                          }`}
                        style={{
                          border: day.level > 0 ? "1px solid black" : undefined,
                          boxShadow: day.level > 2 ? "1.5px 1.5px 0px black" : undefined,
                        }}
                      />
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Legend and Active Tooltip Info */}
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 text-xs text-text-dim border-t border-border-dim pt-3">
          <div className="min-h-[16px]">
            {hoveredDay ? (
              <span className="font-bold text-text">
                {hoveredDay.count} contribution{hoveredDay.count !== 1 ? "s" : ""} on {hoveredDay.dateStr}
              </span>
            ) : (
              <span>Hover squares to inspect daily stats</span>
            )}
          </div>

          <div className="flex items-center gap-1.5 select-none">
            <span>Less</span>
            <div className="h-4 w-4 rounded-[2px] border border-border-dim bg-bg-raised" />
            <div className="h-4 w-4 rounded-[2px] border border-black bg-[#22c55e]/20" />
            <div className="h-4 w-4 rounded-[2px] border border-black bg-[#22c55e]/40" />
            <div className="h-4 w-4 rounded-[2px] border border-black bg-[#22c55e]/70" />
            <div className="h-4 w-4 rounded-[2px] border border-black bg-[#22c55e]" />
            <span>More</span>
          </div>
        </div>
      </div>
    </div>
  );
}
