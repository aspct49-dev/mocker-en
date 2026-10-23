import 'server-only';

import { getCasino } from '../casinos';
import { currentMonth } from '../format';
import { casebattleProvider } from '../providers/casebattle';
import { rainProvider } from '../providers/rain';
import { buildEntries } from '../providers/shared';
import type { CasinoId, Leaderboard, LeaderboardProvider } from '../types';

/**
 * The only leaderboard entry point the app uses. Components ask this for a
 * board and never touch a provider. Gamdom gets an entry here when its
 * provider exists.
 */
const PROVIDERS: Partial<Record<CasinoId, LeaderboardProvider>> = {
  rain: rainProvider,
  casebattle: casebattleProvider,
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
  // A race defined here keeps its own window while the feed is down; one set
  // by the operator falls back to the calendar month.
  const { start, end } = casino.period
    ? { start: new Date(casino.period.start), end: new Date(casino.period.end) }
    : currentMonth();
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
    return await provider.fetchLeaderboard();
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error(`[leaderboard] ${casinoId} provider failed:`, message);
    return emptyBoard(casinoId, message);
  }
}
