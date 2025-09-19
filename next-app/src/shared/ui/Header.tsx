'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-center px-4">
        <Link href="/" className="inline-flex items-center" aria-label="AgilityFeat Home">
          <Image
            src="https://agilityfeat.com/wp-content/uploads/2025/09/agilityfeat-main-logo-09-25.svg"
            alt="AgilityFeat logo"
            width={132}
            height={46}
            priority
          />
        </Link>
      </div>
    </header>
  );
}