import type { Metadata } from 'next';

import { LeaderboardView } from '@/components/LeaderboardView';

/* Matches the provider's upstream cache: five minutes. */
export const revalidate = 300;

export const metadata: Metadata = {
  title: 'Unbox.gg leaderboard',
  description:
    'The Mocker-EN Unbox.gg leaderboard: $1,000 every two weeks across six places. Play under code mocker to enter.',
  alternates: { canonical: '/unbox' },
};

export default function UnboxLeaderboardPage() {
  return <LeaderboardView casinoId="unbox" />;
}
