import Link from 'next/link';

import { CASINO_ORDER, CASINOS } from '@/lib/casinos';
import type { Casino, CasinoId } from '@/lib/types';
import { ExternalIcon, LockIcon } from './icons';

/**
 * One tab per casino. A board hosted elsewhere links through `/{id}`, which
 * redirects, and carries the external mark so nobody is surprised to land on
 * another site. A casino with no board yet shows as coming rather than
 * linking to an empty page — a tab that opens onto nothing reads as broken.
 */
export function CasinoSwitch({ active }: { active: CasinoId }) {
  return (
    <div className="switch">
      <p className="switch-label">
        Switch between <b>{CASINO_ORDER.length}</b> leaderboards
      </p>
      <nav className="switch-tabs" aria-label="Casino leaderboards">
        {CASINO_ORDER.map((id) => {
          const casino = CASINOS[id];

          if (casino.board.at === 'soon') {
            return (
              <span key={id} className="switch-tab" aria-disabled="true">
                <span className="switch-name">{casino.name}</span>
                <span className="switch-soon">
                  <LockIcon />
                  Soon
                </span>
              </span>
            );
          }

          const external = casino.board.at === 'external';
          return (
            <Link
              key={id}
              href={id === 'rain' ? '/' : `/${id}`}
              className="switch-tab"
              aria-current={id === active ? 'page' : undefined}
              // A redirect off-site is a full navigation, not a client route.
              prefetch={external ? false : undefined}
            >
              <Logo casino={casino} />
              {external && (
                <span className="switch-ext">
                  <ExternalIcon />
                  <span className="sr-only">(opens Mocker Rewards)</span>
                </span>
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

function Logo({ casino }: { casino: Casino }) {
  // eslint-disable-next-line @next/next/no-img-element -- operator mark
  const [width, height] = casino.logoSize;
  return (
    <img
      className="switch-logo"
      data-casino={casino.id}
      src={casino.logo}
      alt={casino.name}
      width={width}
      height={height}
    />
  );
}
