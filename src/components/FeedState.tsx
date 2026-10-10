'use client';

import { useEffect, useState } from 'react';

/**
 * When the standings were last pulled. An empty board looks the same whether
 * the race is quiet or the feed is down; this is the line that tells the two
 * apart, so it renders in both cases.
 */
export function FeedState({ at, live, source }: { at: string; live: boolean; source: string }) {
  const [age, setAge] = useState<string | null>(null);

  useEffect(() => {
    const pulled = new Date(at).getTime();
    const tick = () => {
      const secs = Math.max(0, Math.round((Date.now() - pulled) / 1000));
      if (secs < 60) setAge('just now');
      else if (secs < 3600) setAge(`${Math.floor(secs / 60)} min ago`);
      else setAge(`${Math.floor(secs / 3600)} hr ago`);
    };
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, [at]);

  return (
    <p className="feed" data-live={live || undefined}>
      <span className="feed-dot" aria-hidden />
      {live ? `Live from ${source}` : 'Feed unavailable'}
      {age && live && <span className="feed-age">· updated {age}</span>}
    </p>
  );
}
