import { Board } from '@/components/Board';
import { CasinoSwitch } from '@/components/CasinoSwitch';
import { Coin } from '@/components/Coin';
import { CopyCode } from '@/components/CopyCode';
import { Countdown } from '@/components/Countdown';
import { FeedState } from '@/components/FeedState';
import { ExternalIcon } from '@/components/icons';
import { Podium } from '@/components/Podium';
import { PodiumFlank } from '@/components/PodiumFlank';
import { getCasino, JOIN_STEPS, RULES } from '@/lib/casinos';
import { formatAmount, rangeLabel } from '@/lib/format';
import { getLeaderboard } from '@/lib/services/leaderboard';

/* Matches the provider's upstream cache. Rain asks for ten minutes at least. */
export const revalidate = 600;

export default async function RainLeaderboardPage() {
  const casino = getCasino('rain');
  const board = await getLeaderboard('rain');
  const live = board.source === 'live';

  return (
    <>
      <section className="hero">
        <div className="wrap hero-inner">
          {/* eslint-disable-next-line @next/next/no-img-element -- operator mark */}
          <img className="hero-partner" src={casino.logo} alt={casino.name} width="610" height="120" />
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

          <CasinoSwitch active="rain" />
          <p className="hero-unit">All prizes are paid in {casino.name} coins</p>

          <div className="hero-podium" id="board">
            {board.error && (
              <p className="notice">
                <span className="notice-mark" aria-hidden>
                  !
                </span>
                Standings are temporarily unavailable. The prizes shown are correct; the places
                fill back in once the feed returns.
              </p>
            )}
            <div className="podium-stage">
              <PodiumFlank side="left" />
              <Podium board={board} casino={casino} />
              <PodiumFlank side="right" />
            </div>
          </div>

          <Countdown endsAt={board.periodEnd} />
        </div>
      </section>

      <section className="section wrap" aria-labelledby="standings-h">
        <div className="section-head">
          <h2 className="h2" id="standings-h">
            Standings
          </h2>
          <FeedState at={board.updatedAt} live={live} source={casino.name} />
        </div>

        <Board board={board} casino={casino} />

        {board.stats.players > 0 && (
          <p className="board-total">
            {board.stats.players.toLocaleString('en-US')} players have wagered{' '}
            <Coin casino={casino} amount={board.stats.totalWagered} /> this race.
          </p>
        )}
      </section>

      <section className="section wrap" id="how" aria-labelledby="how-h">
        <div className="section-head">
          <h2 className="h2" id="how-h">
            How it works
          </h2>
          <p className="section-sub">
            Already on Rain.gg under another code? Only play on code {casino.code} counts.
          </p>
        </div>
        <ol className="steps">
          {JOIN_STEPS.map((step) => (
            <li className="step" key={step.n}>
              <span className="step-n" aria-hidden>
                {step.n}
              </span>
              <h3 className="step-title">{step.title}</h3>
              <p className="step-body">{step.body}</p>
            </li>
          ))}
        </ol>
        <div className="steps-cta">
          <a className="btn btn-primary" href={casino.signupUrl} target="_blank" rel="noreferrer">
            Sign up with code {casino.code}
            <ExternalIcon />
          </a>
        </div>
      </section>

      <section className="section wrap" id="rules" aria-labelledby="rules-h">
        <div className="section-head">
          <h2 className="h2" id="rules-h">
            Rules
          </h2>
          <p className="section-sub">
            Top {board.entries.length} share {formatAmount(board.prizePool)} coins. The race closes
            on Rain&rsquo;s clock, in UTC.
          </p>
        </div>
        <ul className="rules">
          {RULES.map((rule) => (
            <li className="rule" key={rule.title}>
              <h3 className="rule-title">{rule.title}</h3>
              <p className="rule-body">{rule.body}</p>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
