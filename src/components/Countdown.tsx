'use client';

import { useEffect, useState } from 'react';

/**
 * Time left in the race. Renders placeholders until mounted: the server's
 * clock and the visitor's do not agree to the second, and a hydration mismatch
 * on the most-watched number on the page is not worth it.
 *
 * Not a live region. A screen reader announcing every second is noise; the
 * end date is stated in text beside it instead.
 */
export function Countdown({ endsAt }: { endsAt: string }) {
  const [left, setLeft] = useState<number | null>(null);

  useEffect(() => {
    const target = new Date(endsAt).getTime();
    const tick = () => setLeft(Math.max(0, target - Date.now()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [endsAt]);

  const s = Math.floor((left ?? 0) / 1000);
  const cells: [number, string][] = [
    [Math.floor(s / 86400), 'Days'],
    [Math.floor(s / 3600) % 24, 'Hours'],
    [Math.floor(s / 60) % 60, 'Mins'],
    [s % 60, 'Secs'],
  ];

  const ends = new Date(endsAt).toLocaleString('en-US', {
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'UTC',
    timeZoneName: 'short',
  });

  return (
    <div className="cd">
      <p className="cd-label">{left === 0 ? 'Race has ended' : 'Race ends in'}</p>
      <div className="cd-cells" aria-hidden>
        {cells.map(([value, unit], i) => (
          <div className="cd-group" key={unit}>
            {i > 0 && <span className="cd-sep">:</span>}
            <div className="cd-cell">
              <span className="cd-num">{left === null ? '--' : String(value).padStart(2, '0')}</span>
              <span className="cd-unit">{unit}</span>
            </div>
          </div>
        ))}
      </div>
      <p className="cd-ends">Closes {ends}</p>
    </div>
  );
}
