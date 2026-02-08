import { createAdminSupabaseClient } from '@/lib/supabase/server';
import Link from 'next/link';

export default async function AdminDashboardPage() {
  const supabase = createAdminSupabaseClient();
  const [toursRes, requestsRes, faqsRes] = await Promise.all([
    supabase.from('tours').select('id', { count: 'exact', head: true }),
    supabase.from('tour_requests').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('faqs').select('id', { count: 'exact', head: true }),
  ]);

  const toursCount = toursRes.count ?? 0;
  const pendingRequests = requestsRes.count ?? 0;
  const faqsCount = faqsRes.count ?? 0;

  return (
    <div>
      <h1 className="text-2xl font-bold text-primary-900 mb-6">Admin Dashboard</h1>
      <div className="grid md:grid-cols-3 gap-6">
        <Link href="/admin/tours" className="block p-6 bg-white rounded-xl shadow border border-primary-200 hover:shadow-md">
          <h2 className="font-semibold text-primary-800">Tours</h2>
          <p className="text-3xl font-bold text-primary-600 mt-2">{toursCount}</p>
        </Link>
        <Link href="/admin/requests" className="block p-6 bg-white rounded-xl shadow border border-primary-200 hover:shadow-md">
          <h2 className="font-semibold text-primary-800">Pending Requests</h2>
          <p className="text-3xl font-bold text-accent-600 mt-2">{pendingRequests}</p>
        </Link>
        <Link href="/admin/faqs" className="block p-6 bg-white rounded-xl shadow border border-primary-200 hover:shadow-md">
          <h2 className="font-semibold text-primary-800">FAQs</h2>
          <p className="text-3xl font-bold text-primary-600 mt-2">{faqsCount}</p>
        </Link>
      </div>
    </div>
  );
}
