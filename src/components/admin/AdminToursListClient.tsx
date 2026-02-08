'use client';

import { useState, useEffect, useCallback } from 'react';
import { AdminToursTable } from './AdminToursTable';

type Tour = {
  id: string;
  slug: string;
  title_en: string | null;
  title_es: string | null;
  published: boolean | null;
  featured: boolean | null;
};

function fetchTours(): Promise<Tour[]> {
  return fetch('/api/admin/tours', { cache: 'no-store' })
    .then((res) => {
      if (!res.ok) throw new Error('Failed to load tours');
      return res.json();
    })
    .then((data) => data.tours ?? []);
}

export function AdminToursListClient() {
  const [tours, setTours] = useState<Tour[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    setLoading(true);
    setError(null);
    fetchTours()
      .then(setTours)
      .catch((e) => setError(e.message || 'Failed to load'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    const onFocus = () => load();
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, [load]);

  if (loading && tours === null) {
    return (
      <p className="text-primary-600">Loading tours…</p>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-red-800">
        <p className="font-semibold">Could not load tours</p>
        <p className="text-sm mt-1">{error}</p>
        <button
          type="button"
          onClick={load}
          className="mt-2 px-3 py-1 rounded bg-red-100 text-red-800 text-sm font-medium hover:bg-red-200"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      <button
        type="button"
        onClick={load}
        disabled={loading}
        className="mb-4 text-sm text-primary-600 hover:text-primary-800 font-medium disabled:opacity-50"
      >
        {loading ? 'Refreshing…' : '↻ Refresh list'}
      </button>
      <AdminToursTable initialTours={tours ?? []} />
    </div>
  );
}
