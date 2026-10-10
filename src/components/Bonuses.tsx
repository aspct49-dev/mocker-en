import { BONUSES, getCasino } from '@/lib/casinos';
import { SOCIALS } from '@/lib/site';
import type { Bonus } from '@/lib/types';
import { CheckIcon, ExternalIcon } from './icons';

/**
 * The offer cards on /bonuses, one per casino: the logo, then the bonus in an
 * inset box — the figure and what it is, the list of what is included — then
 * the way in and the code in small print.
 *
 * Each card's casino colour (`--accent`) is spent sparingly: the top edge, the
 * figure's suffix, the ticks and the button. A third casino is one entry in
 * `BONUSES` and no CSS.
 */
export function Bonuses() {
  return (
    <div className="offers">
      {BONUSES.map((bonus) => (
        <OfferCard key={bonus.casino} bonus={bonus} />
      ))}
    </div>
  );
}

/** Where "Contact us" goes: DMs on X. */
const X_URL = SOCIALS.find((s) => s.id === 'x')!.href;

function OfferCard({ bonus }: { bonus: Bonus }) {
  const casino = getCasino(bonus.casino);
  const [width, height] = casino.logoSize;

  return (
    <article
      className="offer"
      aria-labelledby={`offer-${casino.id}`}
      style={{
        ['--accent' as string]: bonus.accent,
        ['--accent-ink' as string]: bonus.accentInk,
      }}
    >
      <h2 className="offer-logo-wrap" id={`offer-${casino.id}`}>
        {/* eslint-disable-next-line @next/next/no-img-element -- operator mark */}
        <img
          className="offer-logo"
          data-casino={casino.id}
          src={casino.logo}
          alt={casino.name}
          width={width}
          height={height}
        />
      </h2>

      <div className="offer-box">
        <span className="offer-box-label">Exclusive bonus</span>
        <p className="offer-amount">
          <span className="offer-amount-value">{bonus.amount}</span>
          <span className="offer-amount-suffix">{bonus.amountSuffix}</span>
        </p>
        <ul className="offer-features">
          {bonus.features.map((feature) => (
            <li key={feature}>
              <span className="offer-tick" aria-hidden>
                <CheckIcon />
              </span>
              {feature}
            </li>
          ))}
        </ul>
      </div>

      <a className="btn offer-cta" href={casino.signupUrl} target="_blank" rel="noreferrer">
        Claim {casino.name} bonus
        <ExternalIcon />
      </a>

      <p className="offer-note">
        Sign up with code <b>{casino.code}</b>.
        {bonus.contact && (
          <>
            {' '}
            <a href={X_URL} target="_blank" rel="noreferrer">
              Contact us
            </a>{' '}
            for more info.
          </>
        )}
      </p>
    </article>
  );
}
