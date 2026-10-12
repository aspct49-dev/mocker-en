import { Board } from './Board';
import { CasinoSwitch } from './CasinoSwitch';
import { Coin } from './Coin';
import { CopyCode } from './CopyCode';
import { Countdown } from './Countdown';
import { FeedState } from './FeedState';
import { ExternalIcon } from './icons';
import { Podium } from './Podium';
import { PodiumFlank } from './PodiumFlank';
import { getCasino } from '@/lib/casinos';
import { dayLabel, formatAmount, rangeLabel } from '@/lib/format';
import { getLeaderboard } from '@/lib/services/leaderboard';
import type { CasinoId } from '@/lib/types';

/**
 * One casino's leaderboard page: hero and podium, standings, how to enter,
 * rules. Rain's page at / and CSGOBig's at /csgobig are both this, so the two
 * boards cannot drift apart in structure — only in what lib/casinos.ts says.
 */
export async function LeaderboardView({ casinoId }: { casinoId: CasinoId }) {
  const casino = getCasino(casinoId);
  const board = await getLeaderboard(casinoId);
  const live = board.source === 'live';
  const [logoW, logoH] = casino.logoSize;
  // Rendered on the server, so this is as of the last regeneration; the
  // countdown itself is live and switches over at the start on its own.
  const upcoming = Date.now() < Date.parse(board.periodStart);

  return (
    <div
      className="board-page"
      data-casino={casino.id}
      style={casino.coinColor ? { ['--coin' as string]: casino.coinColor } : undefined}
    >
      <section className="hero">
        <div className="wrap hero-inner">
          {/* eslint-disable-next-line @next/next/no-img-element -- operator mark */}
          <img
            className="hero-partner"
            data-casino={casino.id}
            src={casino.logo}
            alt={casino.name}
            width={logoW}
            height={logoH}
          />
          <h1 className="hero-title">Leaderboard</h1>

          <p className="hero-lede">
            <Coin casino={casino} amount={board.prizePool} className="hero-pool" /> across{' '}
            {board.entries.length} places · {rangeLabel(board.periodStart, board.periodEnd)}
          </p>

          <div className="hero-actions">
            <CopyCode code={casino.code} />
            <a className="btn btn-primary" href={casino.signupUrl} target="_blank" rel="noreferrer">
              Play on {casino.name}
              <ExternalIcon />
            </a>
          </div>

          <CasinoSwitch active={casino.id} />
          <p className="hero-unit">All prizes are paid in {casino.name} coins</p>

          <div className="hero-podium" id="board">
            {board.error && (
              <p className="notice">
                <span className="notice-mark" aria-hidden>
                  !
                </span>
                Standings are temporarily unavailable. The prizes shown are correct; the places fill
                back in once the feed returns.
              </p>
            )}
            <div className="podium-stage">
              <PodiumFlank side="left" variant={casino.flank ?? 'rain'} />
              <Podium board={board} casino={casino} />
              <PodiumFlank side="right" variant={casino.flank ?? 'rain'} />
            </div>
          </div>

          <Countdown startsAt={board.periodStart} endsAt={board.periodEnd} upcoming={upcoming} />
        </div>
      </section>

      <section className="section wrap" aria-labelledby="standings-h">
        <div className="section-head" data-reveal>
          <h2 className="h2" id="standings-h">
            Standings
          </h2>
          {upcoming ? (
            <p className="feed">
              <span className="feed-dot" aria-hidden />
              Opens {dayLabel(board.periodStart)}
            </p>
          ) : (
            <FeedState at={board.updatedAt} live={live} source={casino.name} />
          )}
        </div>

        <Board board={board} casino={casino} />

        {board.stats.players > 0 && (
          <p className="board-total" data-reveal>
            {board.stats.players.toLocaleString('en-US')} players have wagered{' '}
            <Coin casino={casino} amount={board.stats.totalWagered} /> this race.
          </p>
        )}
      </section>

      {casino.steps && (
        <section className="section wrap" id="how" aria-labelledby="how-h">
          <div className="section-head" data-reveal>
            <h2 className="h2" id="how-h">
              How it works
            </h2>
            <p className="section-sub">
              Already on {casino.name} under another code? Only play on code {casino.code} counts.
            </p>
          </div>
          <ol className="steps">
            {casino.steps.map((step, i) => (
              <li className="step" key={step.title} data-reveal style={{ ['--i' as string]: i }}>
                <span className="step-n" aria-hidden>
                  {i + 1}
                </span>
                <h3 className="step-title">{step.title}</h3>
                <p className="step-body">{step.body}</p>
              </li>
            ))}
          </ol>
          <div className="steps-cta" data-reveal>
            <a className="btn btn-primary" href={casino.signupUrl} target="_blank" rel="noreferrer">
              Sign up with code {casino.code}
              <ExternalIcon />
            </a>
          </div>
        </section>
      )}

      {casino.rules && (
        <section className="section wrap" id="rules" aria-labelledby="rules-h">
          <div className="section-head" data-reveal>
            <h2 className="h2" id="rules-h">
              Rules
            </h2>
            <p className="section-sub">
              Top {board.entries.length} share {formatAmount(board.prizePool)} coins.
              {casino.clockNote && ` ${casino.clockNote}`}
            </p>
          </div>
          <ul className="rules">
            {casino.rules.map((rule, i) => (
              <li className="rule" key={rule.title} data-reveal style={{ ['--i' as string]: i }}>
                <h3 className="rule-title">{rule.title}</h3>
                <p className="rule-body">{rule.body}</p>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
