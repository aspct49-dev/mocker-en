import 'server-only';

import { rainProvider } from '../providers/rain';
import { NoActiveRaceError } from '../providers/shared';
import {
  getSnapshot,
  hasRace,
  raceId,
  saveRace,
  saveSnapshot,
  snapshotIds,
  toArchived,
} from './store';

/**
 * Keeps every finished race, run by the cron job (`/api/archive`).
 *
 * Rain runs its own races, and its API only ever shows the one that is
 * running. So each run keeps the running race's latest standings as a
 * snapshot (the board also does this itself in a race's last hours), and once
 * a race has been over for SETTLE_MS its last snapshot becomes the result.
 *
 * Nothing here starts a race; Rain's are created on Rain.
 */

/** Wait this long after a race ends before keeping it, so late wagers land. */
const SETTLE_MS = 30 * 60_000;

export async function runArchive(now = Date.now()): Promise<string[]> {
  const report: string[] = [];
  const note = (line: string) => {
    report.push(line);
    console.log(`[archive] ${line}`);
  };

  // --- Rain: snapshot the running race, then keep any that have finished ---
  try {
    const board = await rainProvider.fetchLeaderboard({ fresh: true });
    await saveSnapshot(toArchived(board, false));
    note(`rain: snapshot of ${raceId(board.periodStart)} saved`);
  } catch (err) {
    if (err instanceof NoActiveRaceError) note('rain: no race running');
    else note(`rain: snapshot failed — ${(err as Error).message}`);
  }
  for (const id of await snapshotIds('rain')) {
    const snap = await getSnapshot('rain', id);
    if (!snap || now < Date.parse(snap.end) + SETTLE_MS) continue;
    if (await hasRace('rain', id)) continue;
    await saveRace(snap);
    note(`rain: race ${id} kept (standings as of ${snap.takenAt})`);
  }

  return report;
}
