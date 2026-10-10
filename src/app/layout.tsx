import type { Metadata, Viewport } from 'next';
import { Chakra_Petch, Russo_One } from 'next/font/google';

import { SiteFooter } from '@/components/SiteFooter';
import { SiteNav } from '@/components/SiteNav';
import { SITE } from '@/lib/site';
import './globals.css';
import './leaderboard.css';
import './bonuses.css';

/* Russo One for display: heavy, squared and slightly condensed, the closest
   Google face to the wordmark's varsity block letters. Chakra Petch for
   everything read and every figure — its cut corners echo the same esports
   feel, and it has tabular numerals, so the columns of coin figures line up. */
const display = Russo_One({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-display-face',
  display: 'swap',
});
const sans = Chakra_Petch({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-sans-face',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — Rain.gg leaderboard`,
    template: `%s — ${SITE.name}`,
  },
  description: SITE.description,
  applicationName: SITE.name,
  openGraph: {
    type: 'website',
    siteName: SITE.name,
    title: `${SITE.name} — Rain.gg leaderboard`,
    description: SITE.description,
    url: '/',
  },
  // Gambling-adjacent content: state the audience rather than leave it implied.
  other: { rating: 'adult' },
};

export const viewport: Viewport = {
  themeColor: '#040806',
  colorScheme: 'dark',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`}>
      <body>
        <a className="skip" href="#main">
          Skip to content
        </a>
        <SiteNav />
        <main id="main">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
