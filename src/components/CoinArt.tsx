/**
 * Drawn coins, so the art is sharp at any size and costs no image.
 *
 *   `rain`       — Rain's coin: gold, with its star stamped in the face.
 *   `cash`       — a mint coin with a dollar sign, in Gamdom's colour.
 *   `casebattle` — the same dollar coin in CaseBattle's orange.
 *
 * Each has a darker edge drawn under the face for thickness. Gradient ids
 * take an `id` prefix, so any number of coins can share a page without two
 * sharing a definition.
 */

type Variant = 'rain' | 'cash' | 'casebattle';

const PALETTE: Record<Variant, { edge: string; rimTop: string; rimBottom: string; faceA: string; faceB: string; ring: string; glyph: string }> = {
  rain: {
    edge: '#b86a00',
    rimTop: '#ffd75e',
    rimBottom: '#f0a00c',
    faceA: '#f9b726',
    faceB: '#ffc93f',
    ring: '#d88a06',
    glyph: '#a65f00',
  },
  cash: {
    edge: '#007a3d',
    rimTop: '#7dffc0',
    rimBottom: '#00d870',
    faceA: '#00e679',
    faceB: '#3dffa0',
    ring: '#00b85f',
    glyph: '#005c2c',
  },
  casebattle: {
    edge: '#a85f00',
    rimTop: '#ffd27a',
    rimBottom: '#f59c0a',
    faceA: '#ffa911',
    faceB: '#fab12f',
    ring: '#d98200',
    glyph: '#7a4300',
  },
};

const STAR =
  'M2.696 25.907c-1.244-.166-2.433-1.3-2.184-2.571l.276-1.19c.056-.248.166-.69.304-.884.36-.58.913-.857 1.715-.94l6.331-.94c10.922-.802 9.76-6.11 11.364-10.203l2.516-7.575C23.239.58 23.875 0 24.981 0h1.908c1.106 0 1.686.58 1.465 1.604l-.442 7.714c-.553 6.082.055 8.82 6.331 9.677l6.885 1.382s1.935.304 1.659 2.019l-.415 1.935a1.698 1.698 0 0 1-1.686 1.41l-6.747.857c-6.359.58-8.073-.083-10.174 7.687l-2.71 9.704c-.138 1.023-.857 1.604-1.963 1.604H16.41c-1.106 0-1.631-.58-1.466-1.604l.775-9.456c.332-6.055-1.825-6.94-7.106-7.658l-5.945-.996.028.028Z';

export function CoinMark({
  id,
  variant = 'rain',
  className,
}: {
  id: string;
  variant?: Variant;
  className?: string;
}) {
  const c = PALETTE[variant];
  const rim = `coin-rim-${id}`;
  const face = `coin-face-${id}`;
  return (
    <svg className={className} viewBox="0 0 64 66" aria-hidden>
      <defs>
        <linearGradient id={rim} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={c.rimTop} />
          <stop offset="1" stopColor={c.rimBottom} />
        </linearGradient>
        <linearGradient id={face} x1="0.2" y1="0" x2="0.8" y2="1">
          <stop offset="0" stopColor={c.faceA} />
          <stop offset="1" stopColor={c.faceB} />
        </linearGradient>
      </defs>
      <circle cx="32" cy="34" r="31" fill={c.edge} />
      <circle cx="32" cy="31" r="31" fill={`url(#${rim})`} />
      <circle cx="32" cy="31" r="23.5" fill={`url(#${face})`} stroke={c.ring} strokeWidth="2" />
      {variant === 'rain' ? (
        <svg x="20" y="18" width="24" height="26" viewBox="0 0 43 46">
          <path fill={c.glyph} d={STAR} />
        </svg>
      ) : (
        <text
          x="32"
          y="41"
          textAnchor="middle"
          fontSize="28"
          fontWeight="700"
          fill={c.glyph}
          style={{ fontFamily: 'var(--font-display)' }}
        >
          $
        </text>
      )}
    </svg>
  );
}
