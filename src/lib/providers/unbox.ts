import 'server-only';

import { getCasino } from '../casinos';
import { scheduledPeriod } from '../format';
import { buildEntries, type RawPlayer } from './shared';
import type { Leaderboard, LeaderboardProvider } from '../types';

/**
 * Unbox.gg, through its public affiliate applicants endpoint.
 *
 *   GET https://api.unbox.gg/affiliates/public/applicants
 *       ?token=…&skip=0&take=…&order=DESC&from=<ISO>&to=<ISO>
 *   → { totalCount, list: [...] }
 *
 * The race is ours, not Unbox's: a fortnightly window from `schedule` in
 * lib/casinos.ts, with our prize split. Unbox only reports what each referred
 * player wagered between `from` and `to`.
 *
 * The shape of an entry in `list` is undocumented, and the endpoint had no
 * entries yet when this was written, so the reader accepts the usual names
 * for each field. If an entry carries none of them it throws — naming the
 * fields it did get — and the board shows "temporarily unavailable" rather
 * than a page of zeros. Once real entries arrive, pin the names here.
 */

const ENDPOINT = 'https://api.unbox.gg/affiliates/public/applicants';
const REVALIDATE_SECONDS = 300;
/** Unbox rejects `take` above 30 with a 400, so the list is read in pages. */
const PAGE = 30;
/** Enough for any realistic fortnight; stops a runaway loop if counts drift. */
const MAX_PAGES = 10;

type Entry = Record<string, unknown>;

const NAME_KEYS = ['username', 'name', 'displayName', 'nickname', 'user.username', 'user.name'];
const WAGER_KEYS = [
  'wagered',
  'wager',
  'totalWagered',
  'totalWager',
  'wageredAmount',
  'wagerAmount',
  'amount',
  'total',
  'value',
];
const AVATAR_KEYS = ['avatar', 'avatarUrl', 'image', 'picture', 'user.avatar', 'user.avatarUrl'];

/** The first of `keys` (dot paths allowed) that is present on `entry`. */
function pick(entry: Entry, keys: string[]): unknown {
  for (const key of keys) {
    const value = key
      .split('.')
      .reduce<unknown>(
        (v, part) => (v && typeof v === 'object' ? (v as Entry)[part] : undefined),
        entry,
      );
    if (value !== undefined && value !== null && value !== '') return value;
  }
  return undefined;
}

function toPlayer(entry: Entry): RawPlayer {
  const wager = Number(pick(entry, WAGER_KEYS));
  if (!Number.isFinite(wager)) {
    throw new Error(`Unrecognised Unbox entry; fields: ${Object.keys(entry).join(', ')}`);
  }
  const name = pick(entry, NAME_KEYS);
  const avatar = pick(entry, AVATAR_KEYS);
  return {
    username: typeof name === 'string' ? name : 'Hidden',
    wagered: wager,
    avatar: typeof avatar === 'string' && /^https?:\/\//.test(avatar) ? avatar : null,
  };
}

export const unboxProvider: LeaderboardProvider = {
  casinoId: 'unbox',

  async fetchLeaderboard(): Promise<Leaderboard> {
    const casino = getCasino('unbox');
    const prizes = casino.fallbackPrizes;
    const { start, end } = scheduledPeriod(casino.schedule!);

    const base = {
      casinoId: 'unbox' as const,
      prizePool: prizes.reduce((sum, n) => sum + n, 0),
      periodStart: start.toISOString(),
      periodEnd: end.toISOString(),
      updatedAt: new Date().toISOString(),
      source: 'live' as const,
    };

    if (Date.now() < start.getTime()) {
      return { ...base, entries: buildEntries([], prizes), stats: { players: 0, totalWagered: 0 } };
    }

    const token = process.env.UNBOX_TOKEN;
    if (!token) throw new Error('UNBOX_TOKEN is not set');

    // Every page, so the totals under the board count every player and not
    // just the first thirty.
    const list: Entry[] = [];
    let totalCount = 0;
    for (let page = 0; page < MAX_PAGES; page++) {
      const url = new URL(ENDPOINT);
      url.searchParams.set('token', token);
      url.searchParams.set('skip', String(page * PAGE));
      url.searchParams.set('take', String(PAGE));
      url.searchParams.set('order', 'DESC');
      url.searchParams.set('from', start.toISOString());
      // The race's end even while it runs, so the URL — and the cache
      // entry — stays the same for the whole fortnight.
      url.searchParams.set('to', end.toISOString());

      const res = await fetch(url, {
        headers: { accept: 'application/json' },
        next: { revalidate: REVALIDATE_SECONDS },
      });
      if (!res.ok) throw new Error(`Unbox responded ${res.status}`);

      const body = (await res.json()) as { totalCount?: number; list?: Entry[] };
      const rows = body.list ?? [];
      totalCount = body.totalCount ?? totalCount;
      list.push(...rows);
      if (rows.length < PAGE || list.length >= totalCount) break;
    }

    const ranked = list
      .map(toPlayer)
      .filter((p) => p.wagered > 0)
      .sort((a, b) => b.wagered - a.wagered);

    return {
      ...base,
      entries: buildEntries(ranked, prizes),
      stats: {
        players: Math.max(totalCount, ranked.length),
        totalWagered: ranked.reduce((sum, p) => sum + p.wagered, 0),
      },
    };
  },
};
