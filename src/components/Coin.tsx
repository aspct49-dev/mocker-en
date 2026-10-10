import { formatAmount } from '@/lib/format';
import type { Casino } from '@/lib/types';

/**
 * An amount in the casino's own unit: the coin mark, then the figure. The
 * mark is decorative; the unit is spelled out for screen readers instead.
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
  return (
    <span className={`coin ${className ?? ''}`}>
      {/* eslint-disable-next-line @next/next/no-img-element -- 48px sprite */}
      <img className="coin-mark" src={casino.unit.icon} alt="" width="48" height="49" />
      <span className="coin-val">{formatAmount(amount, { cents })}</span>
      <span className="sr-only"> {casino.unit.name}</span>
    </span>
  );
}
