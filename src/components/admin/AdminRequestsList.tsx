'use client';

import { useState, useEffect, useCallback } from 'react';

type RequestRow = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  preferred_date: string | null;
  number_of_guests: number | null;
  locale: string;
  status: string;
  created_at: string;
  tour_id: string | null;
  tourTitle: string;
};

function fetchRequests(): Promise<{ requests: RequestRow[]; error?: string }> {
  const url = '/api/admin/requests?t=' + Date.now();
  return fetch(url, { cache: 'no-store', headers: { Pragma: 'no-cache' } })
    .then(async (res) => {
      const data = await res.json().catch(() => ({}));
      const requests = Array.isArray(data.requests) ? data.requests : [];
      const error = res.ok ? undefined : (typeof data.error === 'string' ? data.error : `Request failed (${res.status})`);
      return { requests, error };
    });
}

export function AdminRequestsList() {
  const [requests, setRequests] = useState<RequestRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    setLoading(true);
    setError(null);
    fetchRequests()
      .then((data) => {
        if (data.error) {
          setError(data.error);
          setRequests([]);
        } else {
          setRequests(data.requests);
        }
      })
      .catch((e) => {
        setError(e.message || 'Failed to load');
        setRequests([]);
      })
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

  if (loading && requests === null) {
    return <p className="text-primary-600">Loading requests…</p>;
  }

  if (error) {
    return (
      <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-red-800">
        <p className="font-semibold">Could not load tour requests</p>
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

  const list = requests ?? [];

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm text-primary-600">
          {list.length} request{list.length !== 1 ? 's' : ''}
        </p>
        <button
          type="button"
          onClick={load}
          disabled={loading}
          className="px-4 py-2 rounded-lg bg-primary-700 text-white text-sm font-medium hover:bg-primary-800 disabled:opacity-50"
        >
          {loading ? 'Refreshing…' : '↻ Refresh list'}
        </button>
      </div>
      {list.length === 0 && (
        <div className="mb-4 p-4 rounded-lg bg-primary-50 border border-primary-200 text-primary-700 text-sm">
          No requests yet. If you just submitted the contact form, click &quot;Refresh list&quot; above to load the latest.
        </div>
      )}
      <div className="bg-white rounded-xl shadow border border-primary-200 overflow-x-auto">
        <table className="w-full">
          <thead className="bg-primary-50">
            <tr>
              <th className="text-left px-4 py-3 font-semibold text-primary-800">Date</th>
              <th className="text-left px-4 py-3 font-semibold text-primary-800">Name</th>
              <th className="text-left px-4 py-3 font-semibold text-primary-800">Email</th>
              <th className="text-left px-4 py-3 font-semibold text-primary-800">Tour</th>
              <th className="text-left px-4 py-3 font-semibold text-primary-800">Locale</th>
              <th className="text-left px-4 py-3 font-semibold text-primary-800">Status</th>
            </tr>
          </thead>
          <tbody>
            {list.map((r) => (
              <tr key={r.id} className="border-t border-primary-100">
                <td className="px-4 py-3 text-sm">
                  {new Date(r.created_at).toLocaleString()}
                </td>
                <td className="px-4 py-3">{r.name}</td>
                <td className="px-4 py-3">
                  <a href={`mailto:${r.email}`} className="text-primary-600 hover:underline">{r.email}</a>
                </td>
                <td className="px-4 py-3">{r.tourTitle}</td>
                <td className="px-4 py-3">{r.locale}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded text-sm ${
                    r.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                    r.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {r.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
