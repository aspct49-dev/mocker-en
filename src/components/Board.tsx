import { Avatar } from './Avatar';
import { Coin } from './Coin';
import type { Casino, Leaderboard } from '@/lib/types';

/**
 * Places four and down. The podium already carries the top three, so
 * repeating them here would only push the rest of the board further down.
 *
 * The prize table decides how many rows there are, not how many players
 * turned up, so an unclaimed place still shows what it pays.
 */
export function Board({ board, casino }: { board: Leaderboard; casino: Casino }) {
  const rows = board.entries.slice(3);
  if (rows.length === 0) return null;

  return (
    <div className="board" role="table" aria-label="Standings, places 4 and below">
      <div className="board-head" role="row">
        <span role="columnheader">Place</span>
        <span role="columnheader">Player</span>
        <span role="columnheader">Wagered</span>
        <span role="columnheader">Prize</span>
      </div>

      {rows.map((entry) => (
        <div className="board-row" role="row" key={entry.rank} data-open={entry.unclaimed || undefined}>
          <span className="board-rank" role="cell">
            {entry.rank}
          </span>
          <span className="board-player" role="cell">
            <Avatar src={entry.avatar} className="board-avatar" />
            <span className="board-name">{entry.unclaimed ? 'Open seat' : entry.username}</span>
          </span>
          <span className="board-wagered" role="cell">
            {entry.unclaimed ? (
              <span className="board-dash">—</span>
            ) : (
              <Coin casino={casino} amount={entry.wagered} cents />
            )}
          </span>
          <span className="board-prize" role="cell">
            <Coin casino={casino} amount={entry.prize} />
          </span>
        </div>
      ))}
    </div>
  );
}
