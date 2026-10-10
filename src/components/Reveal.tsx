'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

/**
 * Scroll reveals for anything marked `data-reveal`: it rises in once, the
 * first time it enters the viewport, and then stays put.
 *
 * Opt-in from script, so the page is complete without it: the hidden starting
 * state only applies under `html.reveal-ready`, which is set here. Anything
 * already on screen is marked revealed in the same frame the class goes on,
 * so nothing above the fold ever blinks out and back. Re-scans on every
 * client navigation, since the layout — and so this — outlives the page.
 *
 * Renders nothing.
 */
export function Reveal() {
  const pathname = usePathname();

  useEffect(() => {
    const els = Array.from(
      document.querySelectorAll<HTMLElement>('[data-reveal]:not([data-revealed])'),
    );
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const show = (el: HTMLElement, how: 'instant' | 'scroll' = 'instant') =>
      el.setAttribute('data-revealed', how);

    if (reduce || !('IntersectionObserver' in window)) {
      els.forEach((el) => show(el));
      return;
    }

    const fold = window.innerHeight;
    els.forEach((el) => {
      if (el.getBoundingClientRect().top < fold) show(el);
    });
    document.documentElement.classList.add('reveal-ready');

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          show(entry.target as HTMLElement, 'scroll');
          io.unobserve(entry.target);
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.05 },
    );
    els.filter((el) => !el.hasAttribute('data-revealed')).forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [pathname]);

  return null;
}
