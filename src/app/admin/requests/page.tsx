import { unstable_noStore } from 'next/cache';
import Link from 'next/link';
import { createAdminSupabaseClient } from '@/lib/supabase/server';
import { RequestStatusActions } from '@/components/admin/RequestStatusActions';

export const dynamic = 'force-dynamic';

export default async function AdminRequestsPage() {
  unstable_noStore();

  const supabase = createAdminSupabaseClient();
  const { data: requests, error } = await supabase
    .from('tour_requests')
    .select('id, name, email, phone, message, preferred_date, number_of_guests, locale, status, created_at, tour_id')
    .order('created_at', { ascending: false });

  if (error) {
    return (
      <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-red-800">
        <p className="font-semibold">Could not load tour requests</p>
        <p className="text-sm mt-1">{error.message}</p>
        <p className="text-sm mt-2">
          Ensure <code className="bg-red-100 px-1">SUPABASE_SERVICE_ROLE_KEY</code> is set in .env.local (same as for the contact form).
        </p>
      </div>
    );
  }

  const list = requests ?? [];
  const tourIds = list.reduce<string[]>((acc, r) => {
    const id = r.tour_id;
    if (id && !acc.includes(id)) acc.push(id);
    return acc;
  }, []);

  const { data: tours } = tourIds.length > 0
    ? await supabase.from('tours').select('id, title_en, title_es').in('id', tourIds)
    : { data: [] };
  const tourMap = new Map((tours || []).map((t) => [t.id, t]));

  const getTourTitle = (r: { tour_id?: string | null; locale: string }) => {
    if (!r.tour_id) return 'General';
    const t = tourMap.get(r.tour_id);
    return t ? (r.locale === 'es' ? t.title_es : t.title_en) : '-';
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-primary-900">Tour Requests</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-primary-600">
            {list.length} request{list.length !== 1 ? 's' : ''}
          </span>
          <Link
            href="/admin/requests"
            className="px-4 py-2 rounded-lg bg-primary-700 text-white text-sm font-medium hover:bg-primary-800"
          >
            ↻ Refresh
          </Link>
        </div>
      </div>
      {list.length === 0 && (
        <div className="mb-4 p-4 rounded-lg bg-primary-50 border border-primary-200 text-primary-700 text-sm">
          No requests yet. When someone submits the contact form, they appear here. Use Refresh to load the latest.
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
              <th className="text-left px-4 py-3 font-semibold text-primary-800">Actions</th>
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
                <td className="px-4 py-3">{getTourTitle(r)}</td>
                <td className="px-4 py-3">{r.locale}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded text-sm ${
                    r.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                    r.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                    r.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {r.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <RequestStatusActions requestId={r.id} status={r.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
