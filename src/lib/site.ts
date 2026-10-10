/**
 * The canonical origin: `NEXT_PUBLIC_SITE_URL` once a domain is attached,
 * else Vercel's production hostname, else the per-deployment one.
 */
function resolveUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, '');
  const host =
    process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_URL ?? 'localhost:3000';
  return `${host.startsWith('localhost') ? 'http' : 'https'}://${host.replace(/\/$/, '')}`;
}

export const SITE = {
  name: 'Mocker-EN',
  url: resolveUrl(),
  description:
    'The monthly Rain.gg wager leaderboard for the Mocker-EN community. Ten paying places, live standings. Play under code Mocker to enter.',
};
