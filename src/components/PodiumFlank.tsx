import { CoinMark } from './CoinArt';
import { Sparkle } from './icons';

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

export function PodiumFlank({ side }: { side: Side }) {
  return (
    <div className="flank" data-side={side} aria-hidden>
      <span className="flank-glow" />

      <CoinMark id={`${side}-far`} className="flank-coin flank-coin-far" />
      <CoinMark id={`${side}-mid`} className="flank-coin flank-coin-mid" />
      <CoinMark id={`${side}-near`} className="flank-coin flank-coin-near" />

      <Sparkle className="flank-star flank-star-lit" />
      <Sparkle className="flank-star flank-star-dim" />
      <Sparkle className="flank-star flank-star-tiny" />

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
