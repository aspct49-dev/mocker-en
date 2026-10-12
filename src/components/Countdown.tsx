'use client';

import { useEffect, useState } from 'react';

/**
 * Time to the start of the race while it has not opened, then time to the end
 * — it switches over by itself at the start, without a reload.
 *
 * Renders placeholders until mounted: the server's clock and the visitor's do
 * not agree to the second, and a hydration mismatch on the most-watched number
 * on the page is not worth it. The date line is written in UTC on the server
 * and swapped for the visitor's own time zone once mounted, which is an update
 * rather than a mismatch.
 *
 * Not a live region. A screen reader announcing every second is noise; the
 * date is stated in text beside it instead.
 */

type Phase = 'upcoming' | 'running' | 'ended';

function format(iso: string, timeZone?: string) {
  return new Date(iso).toLocaleString('en-US', {
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone,
    timeZoneName: 'short',
  });
}

export function Countdown({
  startsAt,
  endsAt,
  upcoming = false,
}: {
  startsAt?: string;
  endsAt: string;
  /** The server's view at render time, used until the client clock takes over. */
  upcoming?: boolean;
}) {
  const [now, setNow] = useState<number | null>(null);
  const [local, setLocal] = useState(false);

  useEffect(() => {
    const tick = () => setNow(Date.now());
    tick();
    setLocal(true);
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const start = startsAt ? Date.parse(startsAt) : 0;
  const end = Date.parse(endsAt);
  const phase: Phase =
    now === null
      ? upcoming
        ? 'upcoming'
        : 'running'
      : now < start
        ? 'upcoming'
        : now >= end
          ? 'ended'
          : 'running';
  const target = phase === 'upcoming' ? start : end;
  const left = now === null ? null : Math.max(0, target - now);

  const s = Math.floor((left ?? 0) / 1000);
  const cells: [number, string][] = [
    [Math.floor(s / 86400), 'Days'],
    [Math.floor(s / 3600) % 24, 'Hours'],
    [Math.floor(s / 60) % 60, 'Mins'],
    [s % 60, 'Secs'],
  ];

  const zone = local ? undefined : 'UTC';
  const label = { upcoming: 'Race starts in', running: 'Race ends in', ended: 'Race has ended' }[
    phase
  ];
  const line =
    phase === 'upcoming' && startsAt
      ? `Opens ${format(startsAt, zone)}`
      : `Closes ${format(endsAt, zone)}`;

  return (
    <div className="cd" data-phase={phase}>
      <p className="cd-label">{label}</p>
      <div className="cd-cells" aria-hidden>
        {cells.map(([value, unit], i) => (
          <div className="cd-group" key={unit}>
            {i > 0 && <span className="cd-sep">:</span>}
            <div className="cd-cell">
              {/* Keyed on the value, so each change remounts the figure and
                  replays its roll-in. */}
              <span className="cd-num" key={left === null ? 'idle' : value}>
                {left === null ? '--' : String(value).padStart(2, '0')}
              </span>
              <span className="cd-unit">{unit}</span>
            </div>
          </div>
        ))}
      </div>
      <p className="cd-ends">{line}</p>
    </div>
  );
}
