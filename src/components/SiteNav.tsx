'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

import { boardPath, CASINO_ORDER, CASINOS } from '@/lib/casinos';
import { SITE } from '@/lib/site';
import { ExternalIcon } from './icons';
import { Socials } from './Socials';

/**
 * The top bar. Transparent over the hero, opaque once the page has moved. The
 * links are real hrefs, so they work before hydration and with the keyboard.
 */

/* The leaderboard pages on this site, by path, so the bar knows which board
   it is sitting over. */
const BOARDS = CASINO_ORDER.filter((id) => CASINOS[id].board.at === 'here').map((id) => ({
  id,
  path: boardPath(id),
}));

export function SiteNav() {
  const [stuck, setStuck] = useState(false);
  const pathname = usePathname();

  // On a board, its own sections and its own casino; anywhere else, Rain's.
  const board = BOARDS.find((b) => b.path === pathname);
  const base = board?.path ?? '/';
  const casino = CASINOS[board?.id ?? 'rain'];
  const links = [
    { label: 'Leaderboard', href: `${base}#board`, current: Boolean(board) },
    { label: 'Bonuses', href: '/bonuses', current: pathname === '/bonuses' },
    { label: 'How it works', href: `${base}#how`, current: false },
    { label: 'Rules', href: `${base}#rules`, current: false },
  ];

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
          {links.map((l) => (
            <a key={l.label} href={l.href} aria-current={l.current ? 'page' : undefined}>
              {l.label}
            </a>
          ))}
        </nav>

        <Socials compact />

        <a
          className="btn btn-primary nav-cta"
          href={casino.signupUrl}
          target="_blank"
          rel="noreferrer"
        >
          Join {casino.name}
          <ExternalIcon />
        </a>
      </div>
    </header>
  );
}
