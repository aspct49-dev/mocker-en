import { CoinMark } from './CoinArt';
import { Crosshair, Sparkle } from './icons';

/**
 * The display around the podium: a spill of Rain coins and Rain stars on
 * each flank, tucked partly behind the outer cards so the three frames look
 * set into it rather than placed on top.
 *
 * Depth comes from three cues — size, blur and opacity — so the near coin is
 * large and sharp and the far ones are small and soft. Everything is drawn in
 * SVG and CSS. Positions are percentages of the flank and sizes are `cqi`, so
 * a flank scales as one piece. The right flank is mirrored but arranged
 * differently, so the two read as a pair rather than as a reflection.
 */

type Side = 'left' | 'right';

/** [left %, top %, length in cqi, rotation deg, opacity] */
type Ember = [number, number, number, number, number];

const EMBERS: Record<Side, Ember[]> = {
  left: [
    [40, 12, 3, -30, 0.9],
    [46, 10.5, 2, -20, 0.6],
    [36, 15, 1.6, -35, 0.5],
    [24, 52, 3.2, -25, 0.85],
    [30, 55.5, 1.8, -15, 0.55],
    [20, 57, 2.4, -30, 0.7],
    [56, 82, 2.6, -20, 0.8],
    [62, 79.5, 1.6, -35, 0.5],
  ],
  right: [
    [30, 22, 2.8, -25, 0.85],
    [36, 19.5, 1.8, -15, 0.55],
    [26, 25.5, 1.4, -30, 0.5],
    [48, 66, 3, -20, 0.9],
    [54, 69, 1.8, -35, 0.6],
    [43, 70.5, 2.2, -10, 0.7],
  ],
};

/**
 * `variant` picks the coin: Rain's, drawn, or CSGOBig's chip from its own
 * SVG — and the spark beside it: Rain's star, or a CS crosshair. Sparks and
 * embers take the board's `--coin` colour, so they match the coin on show.
 */
export function PodiumFlank({ side, variant = 'rain' }: { side: Side; variant?: 'rain' | 'big' }) {
  const coin = (depth: 'far' | 'mid' | 'near') =>
    variant === 'big' ? (
      // eslint-disable-next-line @next/next/no-img-element -- decorative vector art
      <img
        className={`flank-coin flank-coin-${depth}`}
        src="/csgobig-coin.svg"
        alt=""
        width="172"
        height="172"
      />
    ) : (
      <CoinMark id={`${side}-${depth}`} className={`flank-coin flank-coin-${depth}`} />
    );

  const Spark = variant === 'big' ? Crosshair : Sparkle;

  return (
    <div className="flank" data-side={side} data-variant={variant} aria-hidden>
      <span className="flank-glow" />

      {coin('far')}
      {coin('mid')}
      {coin('near')}

      {/* Rain's star is Rain's mark, so it only appears on Rain's board;
          CSGOBig's gets a CS crosshair in the same places. */}
      <Spark className="flank-star flank-star-lit" />
      <Spark className="flank-star flank-star-dim" />
      <Spark className="flank-star flank-star-tiny" />

      {EMBERS[side].map(([x, y, len, rot, op], i) => (
        <span
          key={i}
          className="flank-ember"
          style={{
            left: `${x}%`,
            top: `${y}%`,
            width: `${len}cqi`,
            rotate: `${rot}deg`,
            opacity: op,
          }}
        />
      ))}
    </div>
  );
}
