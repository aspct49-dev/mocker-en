import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { Board } from '@/components/Board';
import { Coin } from '@/components/Coin';
import { Podium } from '@/components/Podium';
import { archivedToBoard, pastRace } from '@/lib/archive/read';
import { boardPath, CASINOS } from '@/lib/casinos';
import { rangeLabel } from '@/lib/format';
import type { CasinoId } from '@/lib/types';

/**
 * One finished race's final standings: the same podium and table as the live
 * board, read from the archive. Finished races do not change, so the page is
 * kept for six hours at a time.
 */

export const revalidate = 21600;

type Params = Promise<{ casino: string; id: string }>;

/** Only casinos with a board on this site have kept races. */
function casinoFor(id: string) {
  const casino = CASINOS[id as CasinoId];
  return casino && casino.board.at === 'here' ? casino : null;
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { casino: casinoId, id } = await params;
  const casino = casinoFor(casinoId);
  if (!casino) return {};
  return {
    title: `${casino.name} race of ${id}`,
    description: `Final standings of the Mocker-EN ${casino.name} leaderboard that started ${id}.`,
    alternates: { canonical: `/past/${casino.id}/${id}` },
  };
}

export default async function PastRacePage({ params }: { params: Params }) {
  const { casino: casinoId, id } = await params;
  const casino = casinoFor(casinoId);
  if (!casino || !/^\d{4}-\d{2}-\d{2}$/.test(id)) notFound();
  const race = await pastRace(casino.id, id);
  if (!race) notFound();

  const board = archivedToBoard(race);
  const [logoW, logoH] = casino.logoSize;
  const back = boardPath(casino.id);

  return (
    <div
      className="board-page past-page"
      data-casino={casino.id}
      style={casino.coinColor ? { ['--coin' as string]: casino.coinColor } : undefined}
    >
      <section className="hero">
        <div className="wrap hero-inner">
          <Link className="past-back" href={`${back}#past`}>
            <span aria-hidden>← </span>All past leaderboards
          </Link>
          {/* eslint-disable-next-line @next/next/no-img-element -- operator mark */}
          <img
            className="hero-partner"
            data-casino={casino.id}
            src={casino.logo}
            alt={casino.name}
            width={logoW}
            height={logoH}
          />
          <h1 className="hero-title">Final results</h1>
          <p className="hero-lede">
            <Coin casino={casino} amount={race.prizePool} className="hero-pool" /> across{' '}
            {race.entries.length} places · {rangeLabel(race.start, race.end)}
          </p>

          <div className="hero-podium">
            <div className="podium-stage">
              <Podium board={board} casino={casino} />
            </div>
          </div>
        </div>
      </section>

      <section className="section wrap" aria-labelledby="standings-h">
        <div className="section-head">
          <h2 className="h2" id="standings-h">
            Standings
          </h2>
          <p className="section-sub">
            {race.final ? 'Final' : 'Last read'}{' '}
            {new Date(race.takenAt).toLocaleString('en-US', {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              timeZone: 'UTC',
              timeZoneName: 'short',
            })}
          </p>
        </div>

        <Board board={board} casino={casino} />

        {race.stats.players > 0 && (
          <p className="board-total">
            {race.stats.players.toLocaleString('en-US')} players wagered{' '}
            <Coin casino={casino} amount={race.stats.totalWagered} /> in this race.
          </p>
        )}

        <div className="steps-cta">
          <Link className="btn btn-primary" href={back}>
            See the current {casino.name} race
          </Link>
        </div>
      </section>
    </div>
  );
}
