import Link from 'next/link';

export default function Home() {
  return (
    <main className="p-6">
    <Link className="underline" href="/underwriting">
      Go to Underwriting
    </Link>
  </main>
  );
}
