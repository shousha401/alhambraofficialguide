'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-cream">
      <h1 className="font-serif text-2xl font-bold text-primary-900 mb-2">Something went wrong</h1>
      <p className="text-primary-600 mb-6 text-center max-w-md">
        We couldn&apos;t load this page. This can happen if the connection to our data service is temporarily unavailable.
      </p>
      <button
        onClick={() => reset()}
        className="px-6 py-2 rounded-lg bg-accent-500 text-white font-semibold hover:bg-accent-600"
      >
        Try again
      </button>
    </div>
  );
}
