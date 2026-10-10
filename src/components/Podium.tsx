import { Avatar } from './Avatar';
import { Coin } from './Coin';
import type { Casino, Leaderboard, LeaderboardEntry } from '@/lib/types';

/**
 * The top three, drawn in CSS so names and figures stay live text.
 *
 * Gold, silver and bronze — the podium is the one place a convention carries
 * meaning the brand green cannot. Second and third sit level and first is
 * raised, so the board reads as two steps, not three.
 */

const PLACES = [2, 1, 3] as const;

export function Podium({ board, casino }: { board: Leaderboard; casino: Casino }) {
  return (
    <ol className="podium" aria-label="Top three">
      {PLACES.map((place) => (
        <PodiumCard key={place} entry={board.entries[place - 1]} place={place} casino={casino} />
      ))}
    </ol>
  );
}

function PodiumCard({
  entry,
  place,
  casino,
}: {
  entry: LeaderboardEntry | undefined;
  place: number;
  casino: Casino;
}) {
  const open = !entry || entry.unclaimed;

  return (
    <li className="pod" data-place={place} data-open={open || undefined}>
      <div className="pod-card">
        <div className="pod-portrait">
          <Avatar src={open ? null : entry.avatar} className="pod-avatar" />
          <span className="pod-place" aria-label={`Place ${place}`}>
            {place}
          </span>
        </div>

        <p className="pod-name">{open ? 'Open seat' : entry.username}</p>

        <p className="pod-label">Wagered</p>
        <Coin casino={casino} amount={open ? 0 : entry.wagered} cents className="pod-wagered" />

        <div className="pod-prize">
          <span className="sr-only">Prize </span>
          <Coin casino={casino} amount={entry?.prize ?? 0} />
        </div>
      </div>
    </li>
  );
}
