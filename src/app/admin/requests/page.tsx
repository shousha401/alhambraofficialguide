import { createAdminSupabaseClient } from '@/lib/supabase/server';

export default async function AdminRequestsPage() {
  const supabase = createAdminSupabaseClient();
  const { data: requests } = await supabase
    .from('tour_requests')
    .select('id, name, email, phone, message, preferred_date, number_of_guests, locale, status, created_at, tour_id')
    .order('created_at', { ascending: false });

  const tourIds = (requests ?? []).reduce<string[]>((acc, r) => {
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
      <h1 className="text-2xl font-bold text-primary-900 mb-6">Tour Requests</h1>
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
            {(requests || []).map((r) => (
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
