const MOCK_HISTORY_DAYS = 84;

export type HabitHeatmapEntry = {
  date: string;
  completedHabits: number;
  totalHabits: number;
};

const formatLocalDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

/**
 * Parses a local ISO date string and anchors it at noon to avoid timezone edge cases.
 */
export const parseLocalDate = (date: string): Date => {
  const [year, month, day] = date.split("-").map(Number);
  return new Date(year, month - 1, day, 12, 0, 0, 0);
};

/**
 * Formats an ISO date string for compact heatmap tooltip display.
 */
export const formatTooltipDate = (date: string): string =>
  new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(
    new Date(`${date}T12:00:00`),
  );

/**
 * Returns the completion ratio for a heatmap entry.
 */
export const getCompletionRatio = (entry: HabitHeatmapEntry): number =>
  entry.totalHabits > 0 ? entry.completedHabits / entry.totalHabits : 0;

/**
 * Maps a completion ratio to the heatmap cell background styling.
 */
export const getCompletionStyles = (ratio: number): string => {
  if (ratio >= 0.85) return "bg-[#63d9ea] shadow-[0_8px_18px_rgba(99,217,234,0.18)]";
  if (ratio >= 0.6) return "bg-[#8be4ef]";
  if (ratio >= 0.3) return "bg-[#c4f0f5]";
  if (ratio > 0) return "bg-[#e8f8fb]";
  return "bg-[#f7fbfc]";
};

/**
 * Counts the current consecutive streak of non-zero completion entries.
 */
export const calculateHeatmapStreak = (entries: HabitHeatmapEntry[]): number => {
  if (entries.length === 0) return 0;
  let streak = 0;
  const lastIndex = entries.length - 1;
  const startIndex =
    getCompletionRatio(entries[lastIndex]) === 0 ? lastIndex - 1 : lastIndex;
  for (let index = startIndex; index >= 0; index -= 1) {
    if (getCompletionRatio(entries[index]) === 0) break;
    streak += 1;
  }
  return streak;
};

const getSeededRandom = (seed: number): number => {
  const value = Math.sin(seed) * 10000;
  return value - Math.floor(value);
};

const buildBackfilledMockEntry = (date: Date): HabitHeatmapEntry => {
  const totalHabits = 7;
  const dateKey = formatLocalDate(date);
  const daySeed = Number(dateKey.replaceAll("-", ""));
  const weekday = date.getDay();
  const weekdayBias = weekday === 0 ? -0.28 : weekday === 6 ? -0.14 : 0.05;
  const slowTrend = Math.sin(daySeed / 17) * 0.1;
  const mediumTrend = Math.cos(daySeed / 7) * 0.08;
  const noise = (getSeededRandom(daySeed + 41) - 0.5) * 0.18;
  let completionRatio = Math.max(
    0,
    Math.min(1, 0.46 + slowTrend + mediumTrend + weekdayBias + noise),
  );
  if (getSeededRandom(daySeed + 73) < (weekday === 0 ? 0.32 : 0.12)) {
    completionRatio = 0;
  } else if (completionRatio < 0.16) {
    completionRatio = 0;
  }
  return {
    date: dateKey,
    completedHabits: Math.round(completionRatio * totalHabits),
    totalHabits,
  };
};

/**
 * Builds seeded mock heatmap history so the dashboard demo has stable-looking activity.
 */
export function buildMockHabitHeatmapEntries(): HabitHeatmapEntry[] {
  const totalHabits = 7;
  const today = new Date();
  today.setHours(12, 0, 0, 0);
  const startDate = new Date(today);
  startDate.setDate(today.getDate() - (MOCK_HISTORY_DAYS - 1));
  let previousRatio = 0.52;

  return Array.from({ length: MOCK_HISTORY_DAYS }, (_, index) => {
    const entryDate = new Date(startDate);
    entryDate.setDate(startDate.getDate() + index);
    const dateKey = formatLocalDate(entryDate);
    const daySeed = Number(dateKey.replaceAll("-", ""));
    const weekday = entryDate.getDay();
    const weekdayBias = weekday === 0 ? -0.32 : weekday === 6 ? -0.18 : 0.06;
    const slowTrend = Math.sin(index / 8) * 0.11;
    const mediumTrend = Math.cos(index / 3.7) * 0.08;
    const noise = (getSeededRandom(daySeed) - 0.5) * 0.24;
    const driftedRatio =
      previousRatio * 0.58 + 0.34 + slowTrend + mediumTrend + weekdayBias + noise;
    const recoveryBoost =
      index > 0 && previousRatio === 0 && weekday !== 0 ? 0.16 : 0;
    let completionRatio = Math.max(0, Math.min(1, driftedRatio + recoveryBoost));
    if (getSeededRandom(daySeed + 17) < (weekday === 0 ? 0.42 : 0.14)) {
      completionRatio = 0;
    } else if (completionRatio < 0.14) {
      completionRatio = 0;
    }
    const daysFromToday = MOCK_HISTORY_DAYS - 1 - index;
    if (daysFromToday < 7 && completionRatio === 0 && weekday !== 0) {
      completionRatio = 0.32 + getSeededRandom(daySeed + 29) * 0.22;
    }
    const completedHabits = Math.round(completionRatio * totalHabits);
    previousRatio = completedHabits === 0 ? 0 : completedHabits / totalHabits;
    return { date: dateKey, completedHabits, totalHabits };
  });
}

/**
 * Prepends generated placeholder history so a partially filled grid still renders evenly.
 */
export function buildPaddedEntries(
  visibleEntries: HabitHeatmapEntry[],
  emptyCellCount: number,
): HabitHeatmapEntry[] {
  if (emptyCellCount === 0 || visibleEntries.length === 0) {
    return visibleEntries;
  }
  const firstVisibleDate = parseLocalDate(visibleEntries[0].date);
  const leadingEntries = Array.from({ length: emptyCellCount }, (_, index) => {
    const entryDate = new Date(firstVisibleDate);
    entryDate.setDate(firstVisibleDate.getDate() - (emptyCellCount - index));
    return buildBackfilledMockEntry(entryDate);
  });
  return [...leadingEntries, ...visibleEntries];
}
