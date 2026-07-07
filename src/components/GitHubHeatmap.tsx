import GitHubGrid from "@/components/GitHubGrid";

type Day = {
  date: string;
  count: number;
  level: number;
};

type ContributionsResponse = {
  total: { lastYear: number };
  contributions: Day[];
};

const MONTH_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

function weekdayOf(date: string) {
  return new Date(date + "T00:00:00Z").getUTCDay();
}

function monthOf(date: string) {
  return new Date(date + "T00:00:00Z").getUTCMonth();
}

// GitHub draws one column per week, each column running Sunday to Saturday.
// Pad the first week with blanks so the first real day lands on its weekday,
// then pad the last week so every column is seven rows tall.
function groupIntoWeeks(days: Day[]) {
  const leadingBlanks: (Day | null)[] = Array(weekdayOf(days[0].date)).fill(null);
  const padded: (Day | null)[] = [...leadingBlanks, ...days];
  while (padded.length % 7 !== 0) {
    padded.push(null);
  }

  const weeks: (Day | null)[][] = [];
  for (let start = 0; start < padded.length; start += 7) {
    weeks.push(padded.slice(start, start + 7));
  }
  return weeks;
}

// Label a column whenever its week begins a new month, skipping the last
// column so a label never spills past the right edge of the grid.
function monthLabelsFor(weeks: (Day | null)[][]) {
  const labels: { column: number; name: string }[] = [];
  let previousMonth = -1;

  weeks.forEach((week, column) => {
    const firstDay = week.find((day) => day !== null);
    if (!firstDay) return;

    const month = monthOf(firstDay.date);
    if (month === previousMonth) return;
    previousMonth = month;

    if (column < weeks.length - 1) {
      labels.push({ column, name: MONTH_NAMES[month] });
    }
  });

  return labels;
}

// Matches the claude-token-heatmap widget's geometry via the .gh-heatmap styles.
export default async function GitHubHeatmap({ user }: { user: string }) {
  const response = await fetch(
    `https://github-contributions-api.jogruber.de/v4/${user}?y=last`,
    { next: { revalidate: 3600 } },
  );
  const { total, contributions }: ContributionsResponse = await response.json();

  const weeks = groupIntoWeeks(contributions);
  const monthLabels = monthLabelsFor(weeks);

  return (
    <div className="gh-heatmap mt-4">
      <div className="gh-card">
        <div className="gh-caption">
          {total.lastYear.toLocaleString()} contributions in the last year
        </div>
        <GitHubGrid weeks={weeks} monthLabels={monthLabels} />
      </div>
    </div>
  );
}
