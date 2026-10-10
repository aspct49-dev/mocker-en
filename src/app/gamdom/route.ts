import { NextResponse } from 'next/server';

import { CASINOS } from '@/lib/casinos';

/**
 * The Gamdom board lives on Mocker Rewards. This is a plain HTTP redirect
 * rather than a page, so it works for shared links and crawlers alike.
 *
 * 307, not 308: browsers cache a permanent redirect indefinitely, and the
 * board may move onto this site later. If it does, set `board` in
 * `lib/casinos.ts` and replace this file with a page.
 */
export function GET(request: Request) {
  const { board } = CASINOS.gamdom;
  const to = board.at === 'external' ? board.url : new URL('/', request.url);
  return NextResponse.redirect(to, 307);
}
