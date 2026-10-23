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

/**
 * CaseBattle's mark (its helmeted C), from casebattle.com/images/branding.
 * The body takes `currentColor`; the eyes stay white as in the original. The
 * CaseBattle board's spark, where Rain's board has Rain's star.
 */
export function CaseBattleMark({ className }: P) {
  return (
    <svg className={className} viewBox="0 0 34 24" fill="none" aria-hidden>
      <path fill="currentColor" d="M8.99813 10.9684L0 16.6794C0 16.6794 2.79609 17.6635 5.33873 16.4121C5.50458 16.3305 5.70289 16.5122 5.62159 16.6782L4.5 18.9684C4.5 18.9684 9.04124 18.7961 8.34201 13.0622C8.60446 12.4555 8.82754 11.7626 9 10.9684H8.99813Z" />
      <path fill="currentColor" d="M24.2167 7.82854C28.5774 7.82854 32.1114 8.21545 33.1891 8.3943C33.374 8.42613 33.5423 8.28366 33.5423 8.09571V3.70323C33.5423 2.44064 32.5752 1.39025 31.3172 1.28567L15.8403 0.00792504C15.334 -0.0329992 14.8263 0.0852263 14.3912 0.347444L9.3121 3.40312C8.58304 3.84116 8.13742 4.62933 8.13742 5.48116V11.3257V12.5004V18.5208C8.13742 19.3727 8.58304 20.1608 9.3121 20.5989L14.3867 23.653C14.8247 23.9168 15.3355 24.035 15.8448 23.991L31.3248 22.6648C32.5798 22.5572 33.5423 21.5068 33.5423 20.2487V15.8755C33.5423 15.6921 33.3816 15.5497 33.1997 15.5739C32.0523 15.7285 28.2009 16.321 24.301 16.321C20.8285 16.321 16.7785 16.068 14.8384 15.9635C14.2064 18.5431 15.0518 20.7027 15.2956 22.5288H14.9393C14.8758 22.5288 14.8159 22.4986 14.7788 22.4471C12.8032 19.7029 12.6695 15.967 12.5945 15.0816C12.5854 14.9664 12.7021 15.1225 12.5945 15.0816L9.09445 14.5L11.0945 12.5004L9.59445 10L12.5945 9.5C12.6568 8.65515 12.9432 5.60893 14.1854 2.75953C14.2286 2.66036 14.3436 2.61496 14.4435 2.65656L14.7742 2.79437C14.5543 4.11495 14.3912 6.79285 14.7056 8.2014C16.529 8.07257 20.3182 7.82854 24.2167 7.82854Z" />
      <path fill="#fff" d="M22.9363 12.3967C22.5626 13.5688 21.3265 14.3321 19.9846 14.1504C18.4905 13.9482 17.4339 12.6521 17.6232 11.2538C17.7163 10.5661 18.0927 9.98439 18.6315 9.59301L22.9363 12.3967ZM31.1338 11.5038C31.244 12.8493 30.4088 14.0146 29.2683 14.108C28.1277 14.2014 27.1811 13.2519 27.0182 11.9714L30.4134 9.8603C30.8113 10.2676 31.08 10.8456 31.1338 11.5038Z" />
    </svg>
  );
}
