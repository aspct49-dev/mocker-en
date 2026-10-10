'use client';

import { useState } from 'react';

import { CheckIcon, CopyIcon } from './icons';

/**
 * The affiliate code, click to copy. The state only says "Copied" once it
 * actually has, so nobody has to guess whether it worked.
 */
export function CopyCode({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard is unavailable over plain HTTP and in some browsers. The code
      // is on screen regardless, so failing quietly is right here.
    }
  }

  return (
    <button type="button" className="code" onClick={copy} aria-label={`Copy affiliate code ${code}`}>
      <span className="code-key">Code</span>
      <span className="code-val">{code}</span>
      <span className="code-state" data-copied={copied || undefined}>
        {copied ? <CheckIcon /> : <CopyIcon />}
      </span>
      <span className="sr-only" role="status">
        {copied ? 'Copied' : ''}
      </span>
    </button>
  );
}
