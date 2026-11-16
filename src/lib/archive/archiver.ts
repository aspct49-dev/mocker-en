import 'server-only';

import { getCasino } from '../casinos';
import { scheduledPeriod } from '../format';
import { rainProvider } from '../providers/rain';
import { NoActiveRaceError } from '../providers/shared';
import { fetchUnboxWindow } from '../providers/unbox';
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
 * Two kinds of race, kept two ways:
 *
 *   - **Rain** runs its own races, and its API only ever shows the one that is
 *     running. So each run keeps the running race's latest standings as a
 *     snapshot (the board also does this itself in a race's last hours), and
 *     once a race has been over for SETTLE_MS its last snapshot becomes the
 *     result.
 *   - **Unbox** races are ours: fortnights from `schedule`. Unbox answers for
 *     any window, so a finished race is fetched whole after it ends, and any
 *     missed ones are filled in, up to BACKFILL races back.
 *
 * Nothing here starts a race. Unbox's next race begins by itself the moment
 * the last ends; Rain's are created on Rain.
 */

/** Wait this long after a race ends before keeping it, so late wagers land. */
const SETTLE_MS = 30 * 60_000;
/** How many finished Unbox races to look back over for any not yet kept. */
const BACKFILL = 12;

export async function runArchive(now = Date.now()): Promise<string[]> {
  const report: string[] = [];
  const note = (line: string) => {
    report.push(line);
    console.log(`[archive] ${line}`);
  };

  // --- Rain: snapshot the running race, then keep any that have finished ---
  try {
    const board = await rainProvider.fetchLeaderboard();
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

  // --- Unbox: fetch and keep each finished fortnight not kept yet ---
  const schedule = getCasino('unbox').schedule!;
  const length = schedule.days * 86_400_000;
  const current = scheduledPeriod(schedule, new Date(now));
  for (let k = 1; k <= BACKFILL; k++) {
    const start = current.start.getTime() - k * length;
    if (start < Date.parse(schedule.anchor)) break;
    const end = start + length;
    if (now < end + SETTLE_MS) continue;
    const id = raceId(new Date(start).toISOString());
    if (await hasRace('unbox', id)) continue;
    try {
      const board = await fetchUnboxWindow(new Date(start), new Date(end));
      await saveRace(toArchived(board, true));
      note(`unbox: race ${id} kept`);
    } catch (err) {
      note(`unbox: race ${id} failed — ${(err as Error).message}`);
    }
  }

  return report;
}
