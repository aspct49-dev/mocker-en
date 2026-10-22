/**
 * Domain types. No React, no fetch — these are the shapes every provider
 * normalises down to, so the components never learn which casino a row came
 * from.
 */

export type CasinoId = 'rain' | 'gamdom';

export interface Casino {
  id: CasinoId;
  name: string;
  /** Referral code the player enters at signup. */
  code: string;
  signupUrl: string;
  /** Operator wordmark, served from /public. */
  logo: string;
  /** Its intrinsic size, so the space is reserved before it loads. */
  logoSize: [width: number, height: number];
  /** What the prizes and wagers are counted in. */
  unit: { name: string; icon: string };
  /**
   * Where this casino's board lives.
   *
   *   `here`     — a page on this site, fed by a provider.
   *   `external` — another site; `/{id}` redirects there, so the switcher
   *                and any shared link go through one URL we control.
   *   `soon`     — shown in the switcher as coming, with no page.
   */
  board: { at: 'here' } | { at: 'external'; url: string } | { at: 'soon' };
  /**
   * The payout table used only when the operator's own one cannot be read.
   * For Rain the live race carries its own distribution and that wins.
   */
  fallbackPrizes: number[];
  /** Brand colour for coin figures on this casino's board. */
  coinColor?: string;
  /** "How it works", in order. */
  steps?: { title: string; body: string }[];
  /** The rules shown under the board. */
  rules?: { title: string; body: string }[];
  /** One line under the Rules heading after the prize sentence. */
  clockNote?: string;
}

export interface LeaderboardEntry {
  rank: number;
  /** Masked for display — the provider never hands a full username to the UI. */
  username: string;
  /** Null where the operator only has its default silhouette. */
  avatar: string | null;
  wagered: number;
  prize: number;
  /** A paying seat nobody has taken yet. */
  unclaimed: boolean;
}

export interface BoardStats {
  players: number;
  totalWagered: number;
}

export interface Leaderboard {
  casinoId: CasinoId;
  prizePool: number;
  /** Always as long as the prize table — unfilled seats come back unclaimed. */
  entries: LeaderboardEntry[];
  stats: BoardStats;
  periodStart: string;
  periodEnd: string;
  updatedAt: string;
  source: 'live' | 'empty';
  /** Set when the live call failed and an empty board was served instead. */
  error?: string;
}

/** What a casino integration implements. Adding a casino = adding one of these. */
export interface LeaderboardProvider {
  readonly casinoId: CasinoId;
  fetchLeaderboard(): Promise<Leaderboard>;
}

/** One casino's offer under the code, shown on /bonuses. */
export interface Bonus {
  casino: CasinoId;
  accent: string;
  /** Text on the accent: dark, since both accents are light. */
  accentInk: string;
  /** The headline figure, and the words after it. */
  amount: string;
  amountSuffix: string;
  features: string[];
  /** Whether the small print under the button adds "Contact us for more info". */
  contact?: boolean;
}
