import Link from 'next/link';
import { createAdminSupabaseClient } from '@/lib/supabase/server';

export default async function AdminToursPage() {
  const supabase = createAdminSupabaseClient();
  const { data: tours } = await supabase
    .from('tours')
    .select('id, slug, title_en, title_es, published, featured')
    .order('sort_order', { ascending: true });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-primary-900">Tours</h1>
        <Link
          href="/admin/tours/new"
          className="px-4 py-2 rounded-lg bg-accent-500 text-white font-semibold hover:bg-accent-600"
        >
          Add Tour
        </Link>
      </div>
      <div className="bg-white rounded-xl shadow border border-primary-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-primary-50">
            <tr>
              <th className="text-left px-4 py-3 font-semibold text-primary-800">Tour</th>
              <th className="text-left px-4 py-3 font-semibold text-primary-800">EN</th>
              <th className="text-left px-4 py-3 font-semibold text-primary-800">ES</th>
              <th className="text-left px-4 py-3 font-semibold text-primary-800">Status</th>
              <th className="text-left px-4 py-3 font-semibold text-primary-800">Actions</th>
            </tr>
          </thead>
          <tbody>
            {(tours || []).map((tour) => (
              <tr key={tour.id} className="border-t border-primary-100">
                <td className="px-4 py-3">{tour.slug}</td>
                <td className="px-4 py-3">
                  {tour.title_en ? (
                    <span className="text-green-600">✓</span>
                  ) : (
                    <span className="text-amber-600">Missing</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  {tour.title_es ? (
                    <span className="text-green-600">✓</span>
                  ) : (
                    <span className="text-amber-600">Missing</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  {tour.published ? (
                    <span className="text-green-600">Published</span>
                  ) : (
                    <span className="text-gray-500">Draft</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/tours/${tour.id}`}
                    className="text-primary-600 hover:text-primary-800 font-medium"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
