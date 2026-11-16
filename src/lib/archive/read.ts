import 'server-only';

import { unstable_cache } from 'next/cache';

import { SEED_RACES } from './seed';
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

/**
 * Part of every cache key. The data cache outlives a deploy (on Vercel too),
 * so a change to what the archive holds outside the store — SEED_RACES — has
 * to come with a new version here, or pages keep the old answer for hours.
 */
const VERSION = `v2-seed${SEED_RACES.length}`;

export const pastRaces = (casino: CasinoId): Promise<ArchivedRace[]> =>
  unstable_cache(() => listRaces(casino), ['past-races', VERSION, casino], {
    revalidate: SIX_HOURS,
    tags: ['archive'],
  })();

export const pastRace = (casino: CasinoId, id: string): Promise<ArchivedRace | null> =>
  unstable_cache(() => getRace(casino, id), ['past-race', VERSION, casino, id], {
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
