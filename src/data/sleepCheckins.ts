// Daily maintenance:
// Prefer updating this file with `node scripts/update-habit-checkin.mjs --habit sleep`.
// The script creates the current YYYY-MM key automatically when a new month starts.
// Manual edits are still allowed as a fallback, and old month keys can stay here as history.
export const sleepCheckins: Record<string, number[]> = {
  "2026-03": [22, 23, 25, 26, 27, 29, 30, 31],
  "2026-04": [1, 2]
};
