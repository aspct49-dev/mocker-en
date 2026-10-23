import 'server-only';

import { getCasino } from '../casinos';
import { buildEntries, type RawPlayer } from './shared';
import type { Leaderboard, LeaderboardProvider } from '../types';

/**
 * CaseBattle, through the public leaderboard of our deal.
 *
 *   GET https://api.casebattle.com/deals/{deal}/leaderboard
 *         ?password={pw}&from={ISO}&to={ISO}&limit=50
 *   → [{ user: { username, avatar }, wagered }, …]
 *
 * The password is the deal's "public leaderboard password", set in the
 * CaseBattle deal dashboard; it lives in CASEBATTLE_LEADERBOARD_PASSWORD, never
 * in the repo. The race window and prize split are ours (`period` and
 * `fallbackPrizes` in lib/casinos.ts); CaseBattle only reports what each
 * referred player wagered in that window, in dollars.
 *
 * The row shape is CaseBattle's own leaderboard row (user, wagered), but the
 * endpoint is undocumented, so the reader below also accepts flat names and
 * the other figures CaseBattle uses (`amount`, `points`), and numbers sent as
 * strings. A row it cannot read is dropped rather than shown as zero.
 *
 * Before the race opens there is nothing to ask for, so no request is made.
 */

const DEAL_ID = '01m5jedc3fnpdsbprdrpfm565q';
const ENDPOINT = `https://api.casebattle.com/deals/${DEAL_ID}/leaderboard`;
const REVALIDATE_SECONDS = 300;

type Row = Record<string, unknown>;

function num(v: unknown): number | null {
  const n = typeof v === 'string' ? Number.parseFloat(v) : v;
  return typeof n === 'number' && Number.isFinite(n) ? n : null;
}

function str(v: unknown): string | null {
  return typeof v === 'string' && v.trim() ? v.trim() : null;
}

function readRow(row: Row): RawPlayer | null {
  const user = (row.user && typeof row.user === 'object' ? row.user : {}) as Row;
  const username =
    str(user.username) ?? str(user.name) ?? str(row.username) ?? str(row.name) ?? null;
  const wagered =
    num(row.wagered) ?? num(row.wager) ?? num(row.amount) ?? num(row.points) ?? num(row.total);
  if (wagered === null || wagered <= 0) return null;

  const avatar = str(user.avatar) ?? str(row.avatar);
  return {
    username: username ?? '',
    wagered,
    avatar: avatar && /^https?:\/\//.test(avatar) ? avatar : null,
  };
}

export const casebattleProvider: LeaderboardProvider = {
  casinoId: 'casebattle',

  async fetchLeaderboard(): Promise<Leaderboard> {
    const casino = getCasino('casebattle');
    const period = casino.period!;
    const prizes = casino.fallbackPrizes;

    const base = {
      casinoId: 'casebattle' as const,
      prizePool: prizes.reduce((sum, n) => sum + n, 0),
      periodStart: period.start,
      periodEnd: period.end,
      updatedAt: new Date().toISOString(),
      source: 'live' as const,
    };

    if (Date.now() < Date.parse(period.start)) {
      return {
        ...base,
        entries: buildEntries([], prizes),
        stats: { players: 0, totalWagered: 0 },
      };
    }

    const password = process.env.CASEBATTLE_LEADERBOARD_PASSWORD;
    if (!password) throw new Error('CASEBATTLE_LEADERBOARD_PASSWORD is not set');

    // `to` is the race's end even while it is running: the URL stays the same
    // for the whole race, so it is one cache entry rather than a new one per
    // request.
    const query = new URLSearchParams({
      password,
      from: period.start,
      to: period.end,
      limit: '50',
    });
    const res = await fetch(`${ENDPOINT}?${query}`, {
      headers: { accept: 'application/json' },
      next: { revalidate: REVALIDATE_SECONDS },
    });
    const body = (await res.json().catch(() => null)) as unknown;
    if (!res.ok) {
      const message = (body as { message?: string } | null)?.message ?? 'no body';
      throw new Error(`CaseBattle responded ${res.status}: ${message}`);
    }

    // A bare array today; `data` covers a paginated wrapper if it ever gains one.
    const rows = Array.isArray(body)
      ? body
      : Array.isArray((body as { data?: unknown } | null)?.data)
        ? (body as { data: unknown[] }).data
        : null;
    if (!rows) throw new Error('CaseBattle sent an unexpected body');

    const ranked = rows
      .map((r) => (r && typeof r === 'object' ? readRow(r as Row) : null))
      .filter((p): p is RawPlayer => p !== null)
      .sort((a, b) => b.wagered - a.wagered);

    return {
      ...base,
      entries: buildEntries(ranked, prizes),
      stats: {
        players: ranked.length,
        totalWagered: ranked.reduce((sum, p) => sum + p.wagered, 0),
      },
    };
  },
};
