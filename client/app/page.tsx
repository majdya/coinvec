import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 text-center">
      <h1 className="text-4xl font-bold mb-4">AI Crypto Advisor</h1>
      <p className="text-lg text-zinc-500 mb-8 max-w-md">
        Your daily crypto dashboard — prices, news, memes, and AI-powered tips.
      </p>
      <div className="flex gap-4">
        <Link
          href="/login"
          className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Sign In
        </Link>
        <Link
          href="/signup"
          className="rounded-lg border border-zinc-300 px-6 py-2 text-sm font-medium hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
        >
          Sign Up
        </Link>
      </div>
    </div>
  );
}
