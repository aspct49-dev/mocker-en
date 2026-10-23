import type { Metadata } from 'next';

import { LeaderboardView } from '@/components/LeaderboardView';

/* Matches the provider's upstream cache: five minutes. */
export const revalidate = 300;

export const metadata: Metadata = {
  title: 'CaseBattle leaderboard',
  description:
    'The Mocker-EN CaseBattle leaderboard: $1,500 across ten places. Play under code mocker to enter.',
  alternates: { canonical: '/casebattle' },
};

export default function CasebattleLeaderboardPage() {
  return <LeaderboardView casinoId="casebattle" />;
}
