import Link from 'next/link';
import { createAdminSupabaseClient } from '@/lib/supabase/server';

export default async function AdminFaqsPage() {
  const supabase = createAdminSupabaseClient();
  const { data: faqs } = await supabase
    .from('faqs')
    .select('*')
    .order('sort_order', { ascending: true });

  return (
    <div>
      <h1 className="text-2xl font-bold text-primary-900 mb-6">FAQs</h1>
      <div className="bg-white rounded-xl shadow border border-primary-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-primary-50">
            <tr>
              <th className="text-left px-4 py-3 font-semibold text-primary-800">Question (EN/ES)</th>
              <th className="text-left px-4 py-3 font-semibold text-primary-800">Status</th>
              <th className="text-left px-4 py-3 font-semibold text-primary-800">Actions</th>
            </tr>
          </thead>
          <tbody>
            {(faqs || []).map((faq) => (
              <tr key={faq.id} className="border-t border-primary-100">
                <td className="px-4 py-3">
                  <span className="block truncate max-w-md">{faq.question_en}</span>
                  <span className="block truncate max-w-md text-sm text-primary-500">{faq.question_es}</span>
                </td>
                <td className="px-4 py-3">
                  {faq.question_en && faq.question_es && faq.answer_en && faq.answer_es ? (
                    <span className="text-green-600">Complete</span>
                  ) : (
                    <span className="text-amber-600">Missing translations</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <Link href={`/admin/faqs/${faq.id}`} className="text-primary-600 hover:text-primary-800 font-medium">
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Link
        href="/admin/faqs/new"
        className="inline-block mt-4 px-4 py-2 rounded-lg bg-accent-500 text-white font-semibold hover:bg-accent-600"
      >
        Add FAQ
      </Link>
    </div>
  );
}
