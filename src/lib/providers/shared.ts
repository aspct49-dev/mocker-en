import { maskUsername } from '../format';
import type { LeaderboardEntry } from '../types';

/**
 * What a provider knows about a player before ranks and prizes are applied.
 * `username` is the operator's raw name; masking happens in `buildEntries` so
 * a new integration cannot forget it.
 */
export interface RawPlayer {
  username: string;
  wagered: number;
  avatar: string | null;
}

/**
 * Turns however many players the operator returned into exactly as many seats
 * as the prize table pays. A seat nobody has taken renders with its prize
 * still attached, which is the honest picture early in a race.
 */
export function buildEntries(players: RawPlayer[], prizes: number[]): LeaderboardEntry[] {
  return prizes.map((prize, i) => {
    const player = players[i];
    if (!player) {
      return { rank: i + 1, username: '', avatar: null, wagered: 0, prize, unclaimed: true };
    }
    return {
      rank: i + 1,
      username: maskUsername(player.username),
      avatar: player.avatar,
      wagered: player.wagered,
      prize,
      unclaimed: false,
    };
  });
}
