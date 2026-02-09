import { unstable_noStore } from 'next/cache';
import Link from 'next/link';
import { createAdminSupabaseClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  unstable_noStore();
  const supabase = createAdminSupabaseClient();
  const [toursRes, requestsTotalRes, requestsPendingRes, faqsRes] = await Promise.all([
    supabase.from('tours').select('id', { count: 'exact', head: true }),
    supabase.from('tour_requests').select('id', { count: 'exact', head: true }),
    supabase.from('tour_requests').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('faqs').select('id', { count: 'exact', head: true }),
  ]);

  const toursCount = toursRes.count ?? 0;
  const requestsTotal = requestsTotalRes.count ?? 0;
  const pendingRequests = requestsPendingRes.count ?? 0;
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
          <h2 className="font-semibold text-primary-800">Requests</h2>
          <p className="text-3xl font-bold text-accent-600 mt-2">{requestsTotal}</p>
          <p className="text-sm text-primary-600 mt-1">{pendingRequests} pending</p>
        </Link>
        <Link href="/admin/faqs" className="block p-6 bg-white rounded-xl shadow border border-primary-200 hover:shadow-md">
          <h2 className="font-semibold text-primary-800">FAQs</h2>
          <p className="text-3xl font-bold text-primary-600 mt-2">{faqsCount}</p>
        </Link>
      </div>
    </div>
  );
}
