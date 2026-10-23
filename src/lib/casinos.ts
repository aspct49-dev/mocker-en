import type { Bonus, Casino, CasinoId } from './types';

/**
 * The casino registry. Codes, links, prize tables, race windows and the copy
 * each board shows live here and nowhere else.
 *
 * Rain's live race carries its own payout distribution, so its
 * `fallbackPrizes` is only what the board shows while the feed is down. Keep
 * it in step with the race configured on Rain (5,000 coins over ten places).
 */

/**
 * CaseBattle's race is defined here, not on CaseBattle: the window is the
 * `from` / `to` pair sent to its deal leaderboard endpoint, and the prize
 * split is ours.
 *
 * 23 Oct 2026 00:00 CEST to 22 Nov 2026 23:59:59 CET (clocks go back on
 * 25 Oct, hence the two offsets). To move it, change these two instants — the
 * provider, countdown, dates in the hero and the "starts in" state all read
 * them.
 */
const CASEBATTLE_PERIOD = {
  start: '2026-10-22T22:00:00.000Z',
  end: '2026-11-22T22:59:59.999Z',
};

/** $1,500 over ten places. The pool is summed from this, never typed. */
const CASEBATTLE_PRIZES = [600, 350, 200, 120, 80, 50, 40, 30, 20, 10];

export const CASINOS: Record<CasinoId, Casino> = {
  rain: {
    id: 'rain',
    name: 'Rain.gg',
    code: 'Mocker',
    signupUrl: 'https://rain.gg/r/Mocker',
    logo: '/rain-logo.png',
    logoSize: [610, 120],
    unit: { name: 'coins', icon: '/rain-coin.webp' },
    board: { at: 'here' },
    fallbackPrizes: [2000, 1200, 800, 500, 250, 100, 50, 50, 25, 25],
    coinColor: '#f7b016',
    steps: [
      {
        title: 'Sign up on Rain.gg',
        body: 'Create your Rain.gg account through the link on this page.',
      },
      {
        title: 'Use code Mocker',
        body: 'Enter Mocker as your affiliate code so your play is tied to the community race.',
      },
      {
        title: 'Wager and climb',
        body: 'Every coin you wager while the race is running counts. The top ten are paid when it ends.',
      },
    ],
    rules: [
      {
        title: 'Code Mocker only',
        body: 'Only wagers on accounts using affiliate code Mocker count towards this race.',
      },
      {
        title: 'One account per person',
        body: 'Alternate accounts are removed from the board, all of them, and the places below move up.',
      },
      {
        title: 'No wager abuse',
        body: 'Hedged or matched betting, cycling stakes between accounts and anything Rain.gg flags as abuse do not count, and can forfeit a prize.',
      },
      {
        title: 'Paid by Rain.gg',
        body: 'Prizes are Rain.gg coins, paid by Rain.gg straight to your account when the race closes.',
      },
    ],
    clockNote: 'The race closes on Rain’s clock, in UTC.',
  },
  casebattle: {
    id: 'casebattle',
    name: 'CaseBattle',
    code: 'mocker',
    signupUrl: 'https://casebattle.com/r/mocker',
    logo: '/casebattle-logo.svg',
    logoSize: [724, 120],
    unit: { name: 'dollars', symbol: '$' },
    paidIn: 'dollars',
    board: { at: 'here' },
    fallbackPrizes: CASEBATTLE_PRIZES,
    period: CASEBATTLE_PERIOD,
    timeZone: 'Europe/Berlin',
    coinColor: '#fab12f',
    flank: 'casebattle',
    steps: [
      {
        title: 'Sign up on CaseBattle',
        body: 'Create your CaseBattle account through the link on this page.',
      },
      {
        title: 'Use code mocker',
        body: 'Enter mocker as your affiliate code so your play is tied to the community race.',
      },
      {
        title: 'Wager and climb',
        body: 'Every dollar you wager while the race is running counts. The top ten are paid when it ends.',
      },
    ],
    rules: [
      {
        title: 'Code mocker only',
        body: 'Only wagers on accounts using affiliate code mocker count towards this race.',
      },
      {
        title: 'One account per person',
        body: 'Alternate accounts are removed from the board, all of them, and the places below move up.',
      },
      {
        title: 'No wager abuse',
        body: 'Hedged or matched betting, cycling stakes between accounts and anything CaseBattle flags as abuse do not count, and can forfeit a prize.',
      },
      {
        title: 'Paid when it closes',
        body: 'The top ten are paid once the race closes and the standings are checked.',
      },
    ],
    clockNote: 'Runs 23 Oct 00:00 to 22 Nov 23:59, Central European time.',
  },
  gamdom: {
    id: 'gamdom',
    name: 'Gamdom',
    code: 'mocker',
    signupUrl: 'https://gamdom.com/r/mocker',
    logo: '/gamdom-logo.png',
    logoSize: [232, 54],
    unit: { name: 'dollars', symbol: '$' },
    // The Gamdom board is run on Mocker Rewards; /gamdom redirects there.
    board: { at: 'external', url: 'https://mockerrewards.com' },
    fallbackPrizes: [],
  },
};

/** Order in the switcher. */
export const CASINO_ORDER: CasinoId[] = ['rain', 'casebattle', 'gamdom'];

export function getCasino(id: CasinoId): Casino {
  return CASINOS[id];
}

/** Where a casino's board lives on this site: Rain at the root, others by id. */
export function boardPath(id: CasinoId): string {
  return id === 'rain' ? '/' : `/${id}`;
}

/**
 * What playing under the code gets you, per casino — the cards on /bonuses.
 * The wording is the community's own offer, so change it here rather than in
 * the component. `accent` is the casino's own brand colour, from its logo.
 */
export const BONUSES: Bonus[] = [
  {
    casino: 'gamdom',
    accent: '#00ff86',
    accentInk: '#00210f',
    amount: '$2,000',
    amountSuffix: 'Per $1M wagered',
    features: [
      '$2,000 cash reward for every $1M wagered',
      '2× level rewards for Gold and above',
      '10% cash deposit bonus on deposits up to $50,000',
      'VIP transfer',
    ],
  },
];
