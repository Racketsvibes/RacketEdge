import React from 'react';
import Link from 'next/link';

export default function AffiliateDisclosure() {
  return (
    <p className="affiliate-disclosure-row">
      <em>As an Amazon Associate, RacketEdge earns from qualifying purchases. <Link href="/affiliate-disclosure">Affiliate Disclosure</Link></em>
    </p>
  );
}
