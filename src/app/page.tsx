import { LeaderboardView } from '@/components/LeaderboardView';

/* Matches the provider's upstream cache. Rain asks for ten minutes at least. */
export const revalidate = 600;

export default function RainLeaderboardPage() {
  return <LeaderboardView casinoId="rain" />;
}
