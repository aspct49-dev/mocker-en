import 'server-only';

import { after } from 'next/server';

import { archiveMode, saveSnapshot, toArchived } from '../archive/store';
import { getCasino } from '../casinos';
import { currentMonth, scheduledPeriod } from '../format';
import { rainProvider } from '../providers/rain';
import { unboxProvider } from '../providers/unbox';
import { buildEntries, NoActiveRaceError } from '../providers/shared';
import type { CasinoId, Leaderboard, LeaderboardProvider } from '../types';

/**
 * The only leaderboard entry point the app uses. Components ask this for a
 * board and never touch a provider. Gamdom gets an entry here when its
 * provider exists.
 */
const PROVIDERS: Partial<Record<CasinoId, LeaderboardProvider>> = {
  rain: rainProvider,
  unbox: unboxProvider,
};

/**
 * What the board looks like when the live call failed.
 *
 * Empty rather than seeded with sample rows: a hardcoded row renders as a real
 * player with a real-looking figure, so an outage or a missing key would show
 * invented standings as though they were current.
 */
function emptyBoard(casinoId: CasinoId, error: string): Leaderboard {
  const casino = getCasino(casinoId);
  // A race scheduled here keeps its own window while the feed is down; one
  // set by the operator falls back to the calendar month.
  const { start, end } = casino.schedule ? scheduledPeriod(casino.schedule) : currentMonth();
  return {
    casinoId,
    prizePool: casino.fallbackPrizes.reduce((sum, n) => sum + n, 0),
    entries: buildEntries([], casino.fallbackPrizes),
    stats: { players: 0, totalWagered: 0 },
    periodStart: start.toISOString(),
    periodEnd: end.toISOString(),
    updatedAt: new Date().toISOString(),
    source: 'empty',
    error,
  };
}

export async function getLeaderboard(casinoId: CasinoId): Promise<Leaderboard> {
  const provider = PROVIDERS[casinoId];
  if (!provider) return emptyBoard(casinoId, 'No provider');
  try {
    const board = await provider.fetchLeaderboard();
    keepNearTheEnd(board);
    return board;
  } catch (err) {
    if (err instanceof NoActiveRaceError) {
      // Between races: not an error, and nothing to log.
      return { ...emptyBoard(casinoId, ''), error: undefined, idle: true };
    }
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error(`[leaderboard] ${casinoId} provider failed:`, message);
    return emptyBoard(casinoId, message);
  }
}

/** How close to its end an operator-run race starts having its standings kept. */
const FINAL_HOURS = 6;

/**
 * Rain only reports a race while it runs, so its final standings have to be
 * caught before it ends. In a race's last hours, every fresh read of the board
 * (at most every ten minutes, the page's cache) also saves a snapshot, after
 * the response is sent; the archive job keeps the last one as the result.
 * Races scheduled here (Unbox) are fetched whole after they end instead.
 */
function keepNearTheEnd(board: Leaderboard) {
  if (getCasino(board.casinoId).schedule || archiveMode() === 'off') return;
  const left = Date.parse(board.periodEnd) - Date.now();
  if (left <= 0 || left > FINAL_HOURS * 3_600_000) return;
  try {
    after(() =>
      saveSnapshot(toArchived(board, false)).catch((err: Error) =>
        console.error(`[archive] ${board.casinoId} snapshot failed:`, err.message),
      ),
    );
  } catch {
    // Outside a request (a build), there is nothing to defer to; the cron
    // job's own snapshot covers it.
  }
}

