import type { Bonus, Casino, CasinoId } from './types';

/**
 * The casino registry. Codes, links and fallback prize tables live here and
 * nowhere else.
 *
 * Rain's live race carries its own payout distribution, so `fallbackPrizes` is
 * only what the board shows while the feed is down. Keep it in step with the
 * race configured on Rain (currently 5,000 coins over ten places).
 */
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
  },
  gamdom: {
    id: 'gamdom',
    name: 'Gamdom',
    code: 'Mocker',
    signupUrl: 'https://gamdom.com',
    logo: '/gamdom-logo.png',
    logoSize: [232, 54],
    unit: { name: 'dollars', icon: '' },
    // The Gamdom board is run on Mocker Rewards; /gamdom redirects there.
    board: { at: 'external', url: 'https://mockerrewards.com' },
    fallbackPrizes: [],
  },
};

/** Order in the switcher. */
export const CASINO_ORDER: CasinoId[] = ['rain', 'gamdom'];

export function getCasino(id: CasinoId): Casino {
  return CASINOS[id];
}

/** Three steps, in the order the page states them. */
export const JOIN_STEPS = [
  {
    n: 1,
    title: 'Sign up on Rain.gg',
    body: 'Create your Rain.gg account through the link on this page.',
  },
  {
    n: 2,
    title: `Use code ${CASINOS.rain.code}`,
    body: `Enter ${CASINOS.rain.code} as your affiliate code so your play is tied to the community race.`,
  },
  {
    n: 3,
    title: 'Wager and climb',
    body: 'Every coin you wager while the race is running counts. The top ten are paid when it ends.',
  },
] as const;

/** The rules a player needs before they have anything at stake. */
export const RULES = [
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
] as const;

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
