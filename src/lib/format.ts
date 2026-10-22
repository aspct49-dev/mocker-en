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

/** "Oct 2", in UTC, which is the clock the races run on. */
export function dayLabel(iso: string): string {
  return new Date(iso).toLocaleString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' });
}

/** "Oct 2 – Nov 1". */
export function rangeLabel(start: string, end: string): string {
  return `${dayLabel(start)} – ${dayLabel(end)}`;
}

/** The current calendar month, used only when no live race says otherwise. */
export function currentMonth(now: Date = new Date()): { start: Date; end: Date } {
  const start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
  const end = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1) - 1000);
  return { start, end };
}
