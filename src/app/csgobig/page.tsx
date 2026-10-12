import type { Metadata } from 'next';

import { LeaderboardView } from '@/components/LeaderboardView';

/* Matches the provider's upstream cache. CSGOBig allows one request per key
   every 15 minutes, so this is 20. Do not lower it. */
export const revalidate = 1200;

export const metadata: Metadata = {
  title: 'CSGOBig leaderboard',
  description:
    'The Mocker-EN CSGOBig leaderboard: 5,000 coins across ten places. Play under code Mocker to enter.',
  alternates: { canonical: '/csgobig' },
};

export default function CsgobigLeaderboardPage() {
  return <LeaderboardView casinoId="csgobig" />;
}
