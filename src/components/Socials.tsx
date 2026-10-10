import { SOCIALS } from '@/lib/site';
import { KickIcon, XIcon } from './icons';

const ICONS = { kick: KickIcon, x: XIcon } as const;

/**
 * Kick and X. `compact` is the top bar's icon-only row, where each link still
 * carries the platform and handle as its accessible name; the full version is
 * the footer's, with the handle written out.
 */
export function Socials({ compact = false }: { compact?: boolean }) {
  return (
    <ul className={compact ? 'socials socials-compact' : 'socials'}>
      {SOCIALS.map((s) => {
        const Icon = ICONS[s.id];
        return (
          <li key={s.id}>
            <a
              className="social"
              data-platform={s.id}
              href={s.href}
              target="_blank"
              rel="noreferrer"
              aria-label={compact ? `${s.name} ${s.handle}` : undefined}
            >
              <Icon />
              {!compact && (
                <span>
                  {s.name} <span className="social-handle">{s.handle}</span>
                </span>
              )}
            </a>
          </li>
        );
      })}
    </ul>
  );
}
