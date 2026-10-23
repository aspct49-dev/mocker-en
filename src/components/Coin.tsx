import { formatAmount } from '@/lib/format';
import type { Casino } from '@/lib/types';

/**
 * An amount in the casino's own unit: the coin mark, then the figure — or,
 * for a board paid in a currency, its symbol ("$1,500"). The mark is
 * decorative; the unit is spelled out for screen readers instead.
 */
export function Coin({
  casino,
  amount,
  cents,
  className,
}: {
  casino: Casino;
  amount: number;
  cents?: boolean;
  className?: string;
}) {
  const { icon, symbol, name } = casino.unit;
  if (symbol) {
    return (
      <span className={`coin ${className ?? ''}`}>
        <span className="coin-val">
          {symbol}
          {formatAmount(amount, { cents })}
        </span>
      </span>
    );
  }
  return (
    <span className={`coin ${className ?? ''}`}>
      {/* eslint-disable-next-line @next/next/no-img-element -- 48px sprite */}
      <img className="coin-mark" src={icon} alt="" width="48" height="49" />
      <span className="coin-val">{formatAmount(amount, { cents })}</span>
      <span className="sr-only"> {name}</span>
    </span>
  );
}
