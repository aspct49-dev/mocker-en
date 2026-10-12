import 'server-only';

import { getCasino } from '../casinos';
import { buildEntries, type RawPlayer } from './shared';
import type { Leaderboard, LeaderboardProvider } from '../types';

/**
 * CSGOBig, through its partner wagerStats endpoint.
 *
 *   GET https://csgobig.com/api/partners/wagerStats/{key}?time={from ms}&to={to ms}
 *   → { success: true, results: [{ name, img, total }] }
 *
 * The race window and prize split are ours (`period` and `fallbackPrizes` in
 * lib/casinos.ts); CSGOBig only reports what each referred player wagered in
 * that window. Names come back already masked by CSGOBig.
 *
 * The endpoint allows one request per key every 15 minutes and answers 429
 * past that, so this caches for 20 minutes. Do not lower it — and note that
 * anything else using the same key (a test from a terminal, another site)
 * spends the same allowance.
 *
 * Before the race opens there is nothing to ask for, so no request is made.
 */

const ENDPOINT = 'https://csgobig.com/api/partners/wagerStats';
const REVALIDATE_SECONDS = 1200;

interface BigPlayer {
  name: string;
  img?: string;
  total: number;
}

/** CSGOBig serves a site-relative placeholder for hidden avatars. */
function avatarOf(p: BigPlayer): string | null {
  if (!p.img || !/^https?:\/\//.test(p.img) || p.img.includes('censored')) return null;
  return p.img;
}

export const csgobigProvider: LeaderboardProvider = {
  casinoId: 'csgobig',

  async fetchLeaderboard(): Promise<Leaderboard> {
    const casino = getCasino('csgobig');
    const period = casino.period!;
    const prizes = casino.fallbackPrizes;
    const start = Date.parse(period.start);
    const end = Date.parse(period.end);

    const base = {
      casinoId: 'csgobig' as const,
      prizePool: prizes.reduce((sum, n) => sum + n, 0),
      periodStart: period.start,
      periodEnd: period.end,
      updatedAt: new Date().toISOString(),
      source: 'live' as const,
    };

    if (Date.now() < start) {
      return {
        ...base,
        entries: buildEntries([], prizes),
        stats: { players: 0, totalWagered: 0 },
      };
    }

    const key = process.env.CSGOBIG_API_KEY;
    if (!key) throw new Error('CSGOBIG_API_KEY is not set');

    // `to` is the race's end even while it is running: the URL stays the same
    // for the whole race, so it is one cache entry rather than a new one per
    // request.
    const res = await fetch(`${ENDPOINT}/${encodeURIComponent(key)}?time=${start}&to=${end}`, {
      headers: { accept: 'application/json' },
      next: { revalidate: REVALIDATE_SECONDS },
    });
    const body = (await res.json().catch(() => null)) as {
      success: boolean;
      results?: BigPlayer[];
      error?: string;
    } | null;
    if (!res.ok || !body?.success) {
      throw new Error(`CSGOBig responded ${res.status}: ${body?.error ?? 'no body'}`);
    }

    const ranked = (body.results ?? [])
      .filter((p) => p.total > 0)
      .sort((a, b) => b.total - a.total);

    const players: RawPlayer[] = ranked.map((p) => ({
      username: p.name,
      wagered: p.total,
      avatar: avatarOf(p),
    }));

    return {
      ...base,
      entries: buildEntries(players, prizes),
      stats: {
        players: ranked.length,
        totalWagered: ranked.reduce((sum, p) => sum + p.total, 0),
      },
    };
  },
};
