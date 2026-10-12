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
 * CSGOBig's race is defined here, not on CSGOBig: the window is the `time` /
 * `to` pair sent to its wagerStats endpoint, and the prize split is ours.
 *
 * Starts 13 Oct 2026, 08:45 IST (03:15 UTC) and runs one month. To move it,
 * change these two instants — the provider, countdown, dates in the hero and
 * the "starts in" state all read them.
 */
const CSGOBIG_PERIOD = {
  start: '2026-10-13T03:15:00.000Z',
  end: '2026-11-13T03:15:00.000Z',
};

/** 5,000 coins over ten places. The pool is summed from this, never typed. */
const CSGOBIG_PRIZES = [2000, 1000, 600, 400, 300, 250, 175, 125, 100, 50];

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
    flank: 'rain',
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
  csgobig: {
    id: 'csgobig',
    name: 'CSGOBig',
    code: 'mocker',
    signupUrl: 'https://csgobig.com/r/mocker',
    logo: '/csgobig-logo.png',
    logoSize: [800, 183],
    unit: { name: 'coins', icon: '/csgobig-coin.svg' },
    board: { at: 'here' },
    fallbackPrizes: CSGOBIG_PRIZES,
    period: CSGOBIG_PERIOD,
    coinColor: '#e1b56f',
    flank: 'big',
    steps: [
      {
        title: 'Sign up on CSGOBig',
        body: 'Create your CSGOBig account through the link on this page.',
      },
      {
        title: 'Use code mocker',
        body: 'Enter mocker as your affiliate code so your play is tied to the community race.',
      },
      {
        title: 'Wager and climb',
        body: 'Every coin you wager while the race is running counts. The top ten are paid when it ends.',
      },
    ],
    rules: [
      {
        title: 'Code mocker only',
        body: 'Only wagers on accounts using affiliate code mocker count towards this race.',
      },
      {
        title: 'No wager abuse',
        body: 'Hedged or matched betting, cycling stakes between accounts and anything CSGOBig flags as abuse do not count, and can forfeit a prize.',
      },
      {
        title: 'Paid in CSGOBig coins',
        body: 'The top ten are paid in CSGOBig coins once the race closes.',
      },
    ],
    clockNote: 'Starts 13 Oct at 08:45 IST and runs one month.',
  },
  gamdom: {
    id: 'gamdom',
    name: 'Gamdom',
    code: 'mocker',
    signupUrl: 'https://gamdom.com/r/mocker',
    logo: '/gamdom-logo.png',
    logoSize: [232, 54],
    unit: { name: 'dollars', icon: '' },
    // The Gamdom board is run on Mocker Rewards; /gamdom redirects there.
    board: { at: 'external', url: 'https://mockerrewards.com' },
    fallbackPrizes: [],
  },
};

/** Order in the switcher. */
export const CASINO_ORDER: CasinoId[] = ['rain', 'csgobig', 'gamdom'];

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
    casino: 'rain',
    accent: '#f7b016',
    accentInk: '#1d1200',
    amount: '10–20%',
    amountSuffix: 'Deposit bonus',
    features: ['10–20% deposit bonus, based on your deposit', '3 free cases', 'Leaderboard access'],
    contact: true,
  },
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
