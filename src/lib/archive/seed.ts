import type { ArchivedRace } from '../types';

/**
 * Races that finished before the archive existed, kept in the code so they
 * show without a Blob store. A copy of the same race in the store wins.
 *
 * Rain's October 2026 race was rebuilt after it ended from Rain's date-range
 * wager endpoint (code Mocker, 2026-10-02T00:00:00.000Z to 2026-11-01T23:59:59.999Z), with that race's prize
 * split. That endpoint counts raw wagers, without the boosts Rain's race
 * ranking adds, so amounts can sit slightly below what Rain's race showed.
 */
export const SEED_RACES: ArchivedRace[] = [
  {
    casinoId: 'rain',
    id: '2026-10-02',
    start: '2026-10-02T00:00:00.000Z',
    end: '2026-11-01T23:59:59.999Z',
    prizes: [2000, 1200, 800, 500, 250, 100, 50, 50, 25, 25],
    prizePool: 5000,
    entries: [
      {
        rank: 1,
        username: 'k**z',
        avatar: 'https://avatars.steamstatic.com/19c6fa0ba96030c8cc25130dca324362ee965212.jpg',
        wagered: 21077.75,
        prize: 2000,
        unclaimed: false,
      },
      {
        rank: 2,
        username: 'h****t',
        avatar: null,
        wagered: 16474.55,
        prize: 1200,
        unclaimed: false,
      },
      {
        rank: 3,
        username: 'j******e',
        avatar: null,
        wagered: 10586.3,
        prize: 800,
        unclaimed: false,
      },
      {
        rank: 4,
        username: 'P***s',
        avatar: 'https://avatars.steamstatic.com/43fd6cf5354e9b6c31a4d09fdd1849b33598ff8e.jpg',
        wagered: 2417.92,
        prize: 500,
        unclaimed: false,
      },
      {
        rank: 5,
        username: 'R******s',
        avatar: 'https://avatars.steamstatic.com/0c64830a17bf87c7782bd1b47d38dd85bbecb58e.jpg',
        wagered: 1563.84,
        prize: 250,
        unclaimed: false,
      },
      {
        rank: 6,
        username: 'H***y',
        avatar: 'https://avatars.steamstatic.com/8425398ac63b307ac935760ec68c2ed606671a44.jpg',
        wagered: 487.38,
        prize: 100,
        unclaimed: false,
      },
      {
        rank: 7,
        username: 'r******x',
        avatar: null,
        wagered: 153.45,
        prize: 50,
        unclaimed: false,
      },
      {
        rank: 8,
        username: 'k******o',
        avatar: null,
        wagered: 117.05,
        prize: 50,
        unclaimed: false,
      },
      {
        rank: 9,
        username: 'L******e',
        avatar: 'https://avatars.steamstatic.com/107e4add8def335d45c74533e3042b6de9766bab.jpg',
        wagered: 113.71,
        prize: 25,
        unclaimed: false,
      },
      {
        rank: 10,
        username: 'I******W',
        avatar: null,
        wagered: 110,
        prize: 25,
        unclaimed: false,
      },
    ],
    stats: {
      players: 21,
      totalWagered: 53463.28,
    },
    takenAt: '2026-11-16T16:31:41.385Z',
    final: true,
  },
];
