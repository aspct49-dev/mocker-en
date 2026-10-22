/**
 * Inline icons. Stroke icons follow the Lucide grid (24, 2px stroke) so they
 * sit together; the sparkle is Rain's own four-point star.
 */

type P = { className?: string };

export function CopyIcon({ className }: P) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect x="9" y="9" width="13" height="13" rx="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

export function CheckIcon({ className }: P) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

export function ExternalIcon({ className }: P) {
  return (
    <svg
      className={className}
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M15 3h6v6" />
      <path d="M10 14 21 3" />
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    </svg>
  );
}

export function LockIcon({ className }: P) {
  return (
    <svg
      className={className}
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect x="3" y="11" width="18" height="11" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

/** Rain's four-point star, from the brand favicon. */
export function Sparkle({ className }: P) {
  return (
    <svg className={className} viewBox="0 0 43 46" fill="currentColor" aria-hidden>
      <path d="M2.696 25.907c-1.244-.166-2.433-1.3-2.184-2.571l.276-1.19c.056-.248.166-.69.304-.884.36-.58.913-.857 1.715-.94l6.331-.94c10.922-.802 9.76-6.11 11.364-10.203l2.516-7.575C23.239.58 23.875 0 24.981 0h1.908c1.106 0 1.686.58 1.465 1.604l-.442 7.714c-.553 6.082.055 8.82 6.331 9.677l6.885 1.382s1.935.304 1.659 2.019l-.415 1.935a1.698 1.698 0 0 1-1.686 1.41l-6.747.857c-6.359.58-8.073-.083-10.174 7.687l-2.71 9.704c-.138 1.023-.857 1.604-1.963 1.604H16.41c-1.106 0-1.631-.58-1.466-1.604l.775-9.456c.332-6.055-1.825-6.94-7.106-7.658l-5.945-.996.028.028Z" />
    </svg>
  );
}

/** Stand-in for a player with no picture. */
export function Silhouette({ className }: P) {
  return (
    <svg className={className} viewBox="0 0 64 64" aria-hidden>
      <circle cx="32" cy="24" r="12" fill="currentColor" />
      <path d="M10 60c2-13 11-20 22-20s20 7 22 20z" fill="currentColor" />
    </svg>
  );
}

/** X's mark. */
export function XIcon({ className }: P) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

/** Kick's blocky K. */
export function KickIcon({ className }: P) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M3 2h6v6h2V6h2V4h2V2h6v6h-2v2h-2v4h2v2h2v6h-6v-2h-2v-2h-2v-2H9v6H3z" />
    </svg>
  );
}
