// Daily maintenance:
// Prefer updating this file with `node scripts/update-habit-checkin.mjs --habit mindfulness`.
// The script creates the current YYYY-MM key automatically when a new month starts.
// Manual edits are still allowed as a fallback, and old month keys can stay here as history.
export const mindfulnessCheckins: Record<string, number[]> = {
  "2026-03": [22, 23, 24, 26, 27, 28]
};
