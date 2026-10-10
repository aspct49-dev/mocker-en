import type { Metadata } from 'next';

import { Bonuses } from '@/components/Bonuses';
import { CASINOS } from '@/lib/casinos';

export const metadata: Metadata = {
  title: 'Bonuses',
  description:
    'Deposit bonuses, cash rewards and free cases on Rain.gg and Gamdom for playing under code Mocker.',
  alternates: { canonical: '/bonuses' },
};

export default function BonusesPage() {
  return (
    <section className="offers-page wrap" aria-labelledby="bonuses-h">
      <header className="offers-head">
        <h1 className="offers-title" id="bonuses-h">
          Bonuses
        </h1>
        <p className="offers-lede">
          Claim your <span className="offers-lit">bonuses</span> with code{' '}
          <b>{CASINOS.rain.code}</b> while supporting the community.
        </p>
      </header>

      <Bonuses />
    </section>
  );
}
