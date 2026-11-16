import 'server-only';

import { unstable_cache } from 'next/cache';

import { getRace, listRaces } from './store';
import type { ArchivedRace, CasinoId, Leaderboard } from '../types';

/**
 * Cached reads of the archive for pages. Finished races do not change, so a
 * page reads the store at most every six hours; the cron route clears the
 * `archive` tag the moment it keeps a new race, so a new result still shows
 * straight away. (Listing the store is a metered Blob operation — reading it
 * on every page render would spend the free allowance in days.)
 */

const SIX_HOURS = 6 * 60 * 60;

export const pastRaces = (casino: CasinoId): Promise<ArchivedRace[]> =>
  unstable_cache(() => listRaces(casino), ['past-races', casino], {
    revalidate: SIX_HOURS,
    tags: ['archive'],
  })();

export const pastRace = (casino: CasinoId, id: string): Promise<ArchivedRace | null> =>
  unstable_cache(() => getRace(casino, id), ['past-race', casino, id], {
    revalidate: SIX_HOURS,
    tags: ['archive'],
  })();

/** A kept race in the shape the podium and standings components take. */
export function archivedToBoard(race: ArchivedRace): Leaderboard {
  return {
    casinoId: race.casinoId,
    prizePool: race.prizePool,
    entries: race.entries,
    stats: race.stats,
    periodStart: race.start,
    periodEnd: race.end,
    updatedAt: race.takenAt,
    source: 'live',
  };
}
