import 'server-only';

import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

import { get, list, put } from '@vercel/blob';

import type { ArchivedRace, CasinoId, Leaderboard } from '../types';
import { SEED_RACES } from './seed';

/**
 * Where finished races are kept.
 *
 * In production, Vercel Blob: one JSON file per race, `races/<casino>/<id>.json`,
 * and one per running race's latest standings, `snapshots/<casino>/<id>.json`.
 * Blob is turned on per project in the Vercel dashboard, which sets
 * BLOB_READ_WRITE_TOKEN; without it the archive is off and the site simply
 * shows no past races.
 *
 * In local development with no token, the same files go to `.archive/` in the
 * project (gitignored), so the whole flow can be exercised without Vercel.
 *
 * A Blob store is created public or private, and every call has to say which.
 * BLOB_ACCESS can say so; otherwise private is tried first and public second,
 * and whichever works is remembered.
 */

const LOCAL_DIR = path.join(process.cwd(), '.archive');

type Access = 'public' | 'private';
let access: Access | null = (process.env.BLOB_ACCESS as Access | undefined) ?? null;

export function archiveMode(): 'blob' | 'local' | 'off' {
  if (process.env.BLOB_READ_WRITE_TOKEN) return 'blob';
  return process.env.NODE_ENV === 'production' && process.env.VERCEL ? 'off' : 'local';
}

/** Run `op` with the store's access type, finding it on first use. */
async function withAccess<T>(op: (a: Access) => Promise<T>): Promise<T> {
  if (access) return op(access);
  try {
    const result = await op('private');
    access = 'private';
    return result;
  } catch (err) {
    if (!/access/i.test(String((err as Error)?.message))) throw err;
    const result = await op('public');
    access = 'public';
    return result;
  }
}

async function writeJson(key: string, value: unknown) {
  const body = JSON.stringify(value, null, 2);
  if (archiveMode() === 'local') {
    const file = path.join(LOCAL_DIR, key);
    await mkdir(path.dirname(file), { recursive: true });
    await writeFile(file, body);
    return;
  }
  await withAccess((a) =>
    put(key, body, {
      access: a,
      contentType: 'application/json',
      addRandomSuffix: false,
      allowOverwrite: true,
      cacheControlMaxAge: 60,
    }),
  );
}

async function readJson<T>(key: string): Promise<T | null> {
  if (archiveMode() === 'local') {
    try {
      return JSON.parse(await readFile(path.join(LOCAL_DIR, key), 'utf8')) as T;
    } catch {
      return null;
    }
  }
  const result = await withAccess((a) => get(key, { access: a, useCache: false }));
  if (!result?.stream) return null;
  return JSON.parse(await new Response(result.stream).text()) as T;
}

/** Keys under `prefix`, e.g. `races/unbox/`. */
async function keys(prefix: string): Promise<string[]> {
  if (archiveMode() === 'local') {
    try {
      const files = await readdir(path.join(LOCAL_DIR, prefix));
      return files.filter((f) => f.endsWith('.json')).map((f) => prefix + f);
    } catch {
      return [];
    }
  }
  const found: string[] = [];
  let cursor: string | undefined;
  do {
    const page = await list({ prefix, cursor, limit: 1000 });
    found.push(...page.blobs.map((b) => b.pathname));
    cursor = page.hasMore ? page.cursor : undefined;
  } while (cursor);
  return found;
}

const raceKey = (casino: CasinoId, id: string) => `races/${casino}/${id}.json`;
const snapshotKey = (casino: CasinoId, id: string) => `snapshots/${casino}/${id}.json`;

/** The race's id: its start day in UTC. */
export const raceId = (startIso: string) => startIso.slice(0, 10);

/** A live board, as a record that can be kept. */
export function toArchived(board: Leaderboard, final: boolean): ArchivedRace {
  return {
    casinoId: board.casinoId,
    id: raceId(board.periodStart),
    start: board.periodStart,
    end: board.periodEnd,
    prizes: board.entries.map((e) => e.prize),
    prizePool: board.prizePool,
    entries: board.entries,
    stats: board.stats,
    takenAt: board.updatedAt,
    final,
  };
}

export async function saveRace(race: ArchivedRace) {
  await writeJson(raceKey(race.casinoId, race.id), { ...race, final: true });
}

export async function saveSnapshot(race: ArchivedRace) {
  await writeJson(snapshotKey(race.casinoId, race.id), { ...race, final: false });
}

export async function hasRace(casino: CasinoId, id: string) {
  return (await keys(`races/${casino}/`)).includes(raceKey(casino, id));
}

export async function getRace(casino: CasinoId, id: string): Promise<ArchivedRace | null> {
  const stored = archiveMode() === 'off' ? null : await readJson<ArchivedRace>(raceKey(casino, id));
  return stored ?? SEED_RACES.find((r) => r.casinoId === casino && r.id === id) ?? null;
}

export async function getSnapshot(casino: CasinoId, id: string) {
  return readJson<ArchivedRace>(snapshotKey(casino, id));
}

/** Ids of the running-race snapshots kept for a casino. */
export async function snapshotIds(casino: CasinoId) {
  return (await keys(`snapshots/${casino}/`)).map((k) => k.slice(k.lastIndexOf('/') + 1, -5));
}

/**
 * Every finished race for a casino, newest first: the kept ones plus the
 * seeded ones from before the archive existed (a kept copy of a race wins).
 */
export async function listRaces(casino: CasinoId): Promise<ArchivedRace[]> {
  const found = archiveMode() === 'off' ? [] : await keys(`races/${casino}/`);
  const stored = (await Promise.all(found.map((k) => readJson<ArchivedRace>(k)))).filter(
    (r): r is ArchivedRace => r !== null,
  );
  const ids = new Set(stored.map((r) => r.id));
  const seeded = SEED_RACES.filter((r) => r.casinoId === casino && !ids.has(r.id));
  return [...stored, ...seeded].sort((a, b) => Date.parse(b.start) - Date.parse(a.start));
}
