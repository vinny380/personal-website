"use client";

import { useRef, useState } from "react";

type Day = {
  date: string;
  count: number;
  level: number;
};

type MonthLabel = {
  column: number;
  name: string;
};

type Tooltip = {
  text: string;
  left: number;
  top: number;
};

function formatDate(date: string) {
  return new Date(date + "T00:00:00Z").toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

function describe(day: Day) {
  const amount = day.count === 0 ? "No" : day.count;
  const noun = day.count === 1 ? "contribution" : "contributions";
  return `${amount} ${noun} on ${formatDate(day.date)}`;
}

export default function GitHubGrid({
  weeks,
  monthLabels,
}: {
  weeks: (Day | null)[][];
  monthLabels: MonthLabel[];
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [tooltip, setTooltip] = useState<Tooltip | null>(null);

  function showTooltip(event: React.MouseEvent, day: Day) {
    const container = containerRef.current;
    if (!container) return;

    const containerBox = container.getBoundingClientRect();
    const cellBox = event.currentTarget.getBoundingClientRect();
    setTooltip({
      text: describe(day),
      left: cellBox.left - containerBox.left + cellBox.width / 2,
      top: cellBox.top - containerBox.top,
    });
  }

  function hideTooltip() {
    setTooltip(null);
  }

  return (
    <div className="gh-interactive" ref={containerRef}>
      <div className="gh-graph-area">
        <div className="gh-months">
          {monthLabels.map((label) => (
            <span
              key={label.column}
              style={{ left: `${(label.column / weeks.length) * 100}%` }}
            >
              {label.name}
            </span>
          ))}
        </div>

        <div className="gh-graph">
          <div className="gh-days">
            <span />
            <span>Mon</span>
            <span />
            <span>Wed</span>
            <span />
            <span>Fri</span>
            <span />
          </div>

          <div className="gh-grid">
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="gh-col">
                {week.map((day, dayIndex) => {
                  if (!day) {
                    return <div key={dayIndex} className="gh-cell gh-cell-out" />;
                  }
                  return (
                    <div
                      key={dayIndex}
                      className="gh-cell"
                      data-level={day.level}
                      onMouseEnter={(event) => showTooltip(event, day)}
                      onMouseLeave={hideTooltip}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        <div className="gh-foot">
          <div className="gh-legend">
            <span className="gh-legend-txt">Less</span>
            <div className="gh-cell" data-level={0} />
            <div className="gh-cell" data-level={1} />
            <div className="gh-cell" data-level={2} />
            <div className="gh-cell" data-level={3} />
            <div className="gh-cell" data-level={4} />
            <span className="gh-legend-txt">More</span>
          </div>
        </div>
      </div>

      {tooltip && (
        <div
          className="gh-tooltip"
          style={{ left: tooltip.left, top: tooltip.top }}
        >
          {tooltip.text}
        </div>
      )}
    </div>
  );
}
