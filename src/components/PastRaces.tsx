import Link from 'next/link';

import { Avatar } from './Avatar';
import { Coin } from './Coin';
import { rangeLabel } from '@/lib/format';
import type { ArchivedRace, Casino } from '@/lib/types';

/**
 * Finished races, newest first: one card each with its dates, its pool and
 * its top three, linking to the full final standings. The row scrolls
 * sideways once there are more cards than fit, snapping card to card.
 */
export function PastRaces({ casino, races }: { casino: Casino; races: ArchivedRace[] }) {
  if (races.length === 0) return null;

  return (
    <section className="section wrap" id="past" aria-labelledby="past-h">
      <div className="section-head" data-reveal>
        <h2 className="h2" id="past-h">
          Past leaderboards
        </h2>
        <p className="section-sub">
          {races.length} finished {races.length === 1 ? 'race' : 'races'} on {casino.name}
        </p>
      </div>

      <ol className="past-row">
        {races.map((race, i) => {
          const top = race.entries.filter((e) => !e.unclaimed).slice(0, 3);
          return (
            <li
              className="past-card"
              key={race.id}
              data-reveal
              style={{ ['--i' as string]: Math.min(i, 3) }}
            >
              <p className="past-dates">{rangeLabel(race.start, race.end)}</p>
              <p className="past-pool">
                <Coin casino={casino} amount={race.prizePool} />
                <span className="past-pool-label">prize pool</span>
              </p>

              {top.length > 0 ? (
                <ol className="past-top">
                  {top.map((e) => (
                    <li key={e.rank} data-place={e.rank}>
                      <span className="past-rank">{e.rank}</span>
                      <Avatar src={e.avatar} className="past-avatar" />
                      <span className="past-name">{e.username}</span>
                      <Coin casino={casino} amount={e.wagered} className="past-wager" />
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="past-empty">No one wagered in this race.</p>
              )}

              <Link className="past-link" href={`/past/${casino.id}/${race.id}`}>
                Full standings
                <span aria-hidden> →</span>
              </Link>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
