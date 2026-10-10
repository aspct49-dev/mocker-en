import { SITE } from '@/lib/site';

export function SiteFooter() {
  return (
    <footer className="foot">
      <div className="wrap foot-inner">
        {/* eslint-disable-next-line @next/next/no-img-element -- the wordmark is the logo */}
        <img className="foot-mark" src="/mocker-wordmark.webp" alt={SITE.name} width="1200" height="357" />

        <p className="foot-age">
          <span className="foot-18">18+</span>
          Gambling can be addictive. Play for fun, set limits, and stop when it stops being fun. Help
          is available at{' '}
          <a href="https://www.begambleaware.org" target="_blank" rel="noreferrer">
            BeGambleAware.org
          </a>
          .
        </p>

        <p className="foot-note">
          {SITE.name} is a community leaderboard. Wager figures and prizes come from the casinos&rsquo;
          own affiliate races; {SITE.name} is not operated by or affiliated with any casino beyond
          its affiliate code.
        </p>

        <p className="foot-copy">© {new Date().getUTCFullYear()} {SITE.name}</p>
      </div>
    </footer>
  );
}
