// Single source of truth for the current tournament event metadata.
// Update these constants to switch to a future edition.

export const EVENT_YEAR = 2026;
export const EVENT_START_ISO = "2026-05-13";
export const EVENT_END_ISO = "2026-05-18";
export const EVENT_START_DATE = new Date(EVENT_START_ISO + "T00:00:00+09:00");
export const EVENT_END_DATE = new Date(EVENT_END_ISO + "T23:59:59+09:00");

// IANSEO competition slug for the current edition. Used by /api/results.
export const EVENT_IANSEO_ID = "2026/28161";

/**
 * Computes a D-Day style label relative to the event start date.
 * Returns "D-7" before, "D-DAY" on the day, and "D+1" after.
 * `inEvent` is true while the event is in progress.
 */
export function getDDay(now: Date = new Date()): { label: string; inEvent: boolean; ended: boolean } {
  const dayMs = 1000 * 60 * 60 * 24;
  const diffStart = Math.floor((EVENT_START_DATE.getTime() - now.getTime()) / dayMs);
  const ended = now.getTime() > EVENT_END_DATE.getTime();
  const inEvent = now.getTime() >= EVENT_START_DATE.getTime() && !ended;

  let label: string;
  if (diffStart > 0) label = `D-${diffStart}`;
  else if (diffStart === 0) label = "D-DAY";
  else label = `D+${Math.abs(diffStart)}`;

  return { label, inEvent, ended };
}
