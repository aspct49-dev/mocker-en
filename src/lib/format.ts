/** Formatting and masking. Shared by the providers and the components. */

/**
 * First and last character kept, everything between starred — "D*****K".
 * The run of stars is capped so a long name does not push the row wider.
 */
export function maskUsername(name: string | null | undefined): string {
  if (!name) return '****';
  if (name.length <= 2) return `${name[0]}***`;
  const stars = Math.min(Math.max(name.length - 2, 2), 6);
  return name[0] + '*'.repeat(stars) + name[name.length - 1];
}

/** Coin figures. Wagers carry cents; prizes are whole unless they are not. */
export function formatAmount(n: number, opts: { cents?: boolean } = {}): string {
  const cents = opts.cents ?? !Number.isInteger(n);
  return n.toLocaleString('en-US', {
    minimumFractionDigits: cents ? 2 : 0,
    maximumFractionDigits: cents ? 2 : 0,
  });
}

/** "Oct 2", on the race's clock — UTC unless the casino sets its own. */
export function dayLabel(iso: string, timeZone = 'UTC'): string {
  return new Date(iso).toLocaleString('en-US', { month: 'short', day: 'numeric', timeZone });
}

/** "Oct 2 – Nov 1". */
export function rangeLabel(start: string, end: string, timeZone?: string): string {
  return `${dayLabel(start, timeZone)} – ${dayLabel(end, timeZone)}`;
}

/** An amount in words, for sentences: "$1,500" or "5,000 coins". */
export function amountText(unit: { name: string; symbol?: string }, n: number): string {
  return unit.symbol ? `${unit.symbol}${formatAmount(n)}` : `${formatAmount(n)} ${unit.name}`;
}

/** The current calendar month, used only when no live race says otherwise. */
export function currentMonth(now: Date = new Date()): { start: Date; end: Date } {
  const start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
  const end = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1) - 1000);
  return { start, end };
}
