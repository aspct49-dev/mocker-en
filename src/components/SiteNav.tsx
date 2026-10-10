'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

import { CASINOS } from '@/lib/casinos';
import { SITE } from '@/lib/site';
import { ExternalIcon } from './icons';

/**
 * The top bar. Transparent over the hero, opaque once the page has moved. The
 * links are real hrefs, so they work before hydration and with the keyboard.
 */

/* `page` is the route a link belongs to, so the one for the page you are on
   can be marked current. Section anchors on the leaderboard have none. */
const LINKS = [
  { label: 'Leaderboard', href: '/#board', page: '/' },
  { label: 'Bonuses', href: '/bonuses', page: '/bonuses' },
  { label: 'How it works', href: '/#how' },
  { label: 'Rules', href: '/#rules' },
];

export function SiteNav() {
  const [stuck, setStuck] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setStuck(window.scrollY > 16);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className="nav" data-stuck={stuck || undefined}>
      <div className="wrap nav-inner">
        <Link href="/" className="nav-brand" aria-label={`${SITE.name} home`}>
          {/* eslint-disable-next-line @next/next/no-img-element -- the wordmark is the logo */}
          <img src="/mocker-wordmark.webp" alt={SITE.name} width="1200" height="357" />
        </Link>

        <nav className="nav-links" aria-label="Main">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} aria-current={l.page === pathname ? 'page' : undefined}>
              {l.label}
            </a>
          ))}
        </nav>

        <a className="btn btn-primary nav-cta" href={CASINOS.rain.signupUrl} target="_blank" rel="noreferrer">
          Join Rain.gg
          <ExternalIcon />
        </a>
      </div>
    </header>
  );
}
