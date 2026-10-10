import { Silhouette } from './icons';

/**
 * A player picture, or the silhouette where the operator has none. Remote
 * pictures load lazily and never send a referrer to the image host.
 */
export function Avatar({ src, className }: { src: string | null; className?: string }) {
  return (
    <span className={`avatar ${className ?? ''}`}>
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element -- remote avatar host
        <img src={src} alt="" loading="lazy" referrerPolicy="no-referrer" width="64" height="64" />
      ) : (
        <Silhouette className="avatar-none" />
      )}
    </span>
  );
}
