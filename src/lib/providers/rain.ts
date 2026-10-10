import 'server-only';

import { getCasino } from '../casinos';
import { buildEntries, type RawPlayer } from './shared';
import type { Leaderboard, LeaderboardProvider } from '../types';

/**
 * Rain.gg, through its affiliate races endpoint.
 *
 * The race is configured on Rain itself — name, dates and payout split — so
 * this reads the race rather than rebuilding one from the raw wager feed. That
 * way the board here and the race on rain.gg are the same race: same standings,
 * same prizes, same end time, and nothing to keep in step by hand.
 *
 * Rain rate-limits the endpoint and asks for at least ten minutes of caching,
 * hence `revalidate: 600`. Do not lower it.
 */

const ENDPOINT = 'https://api.rain.gg/v1/affiliates/races';
const REVALIDATE_SECONDS = 600;

interface RainParticipant {
  username: string;
  wagered: number;
  position: number;
  prize: number;
  avatar?: { small?: string; medium?: string; large?: string };
}

interface RainRace {
  id: string;
  name: string;
  status: string;
  code: string;
  starts_at: string;
  ends_at: string;
  /** Hundredths of a coin: 200000 is 2,000 coins. */
  payout_distribution: number[];
  participants: RainParticipant[] | null;
}

/** Rain serves a generic silhouette for players without a picture. */
function avatarOf(p: RainParticipant): string | null {
  const url = p.avatar?.medium ?? p.avatar?.small ?? null;
  if (!url || url.includes('/avatar/unknown_')) return null;
  return url;
}

export const rainProvider: LeaderboardProvider = {
  casinoId: 'rain',

  async fetchLeaderboard(): Promise<Leaderboard> {
    const key = process.env.RAIN_API_KEY;
    if (!key) throw new Error('RAIN_API_KEY is not set');

    const res = await fetch(`${ENDPOINT}?participant_count=50`, {
      headers: { 'x-api-key': key, accept: 'application/json' },
      next: { revalidate: REVALIDATE_SECONDS },
    });
    if (!res.ok) throw new Error(`Rain races responded ${res.status}`);

    const body = (await res.json()) as { results: RainRace[] | null };
    const casino = getCasino('rain');
    const active = (body.results ?? []).filter((r) => r.status === 'ACTIVE');

    // Our race is the one on our code. Falling back to any active race keeps
    // the board up if the code is ever re-cased on Rain's side.
    const race =
      active.find((r) => r.code.toLowerCase() === casino.code.toLowerCase()) ?? active[0];
    if (!race) throw new Error('No active Rain race');

    const prizes = race.payout_distribution.map((p) => p / 100);
    const participants = [...(race.participants ?? [])].sort((a, b) => a.position - b.position);

    const players: RawPlayer[] = participants.map((p) => ({
      username: p.username,
      wagered: p.wagered,
      avatar: avatarOf(p),
    }));

    return {
      casinoId: 'rain',
      prizePool: prizes.reduce((sum, n) => sum + n, 0),
      entries: buildEntries(players, prizes),
      stats: {
        players: participants.length,
        totalWagered: participants.reduce((sum, p) => sum + p.wagered, 0),
      },
      periodStart: race.starts_at,
      periodEnd: race.ends_at,
      updatedAt: new Date().toISOString(),
      source: 'live',
    };
  },
};
