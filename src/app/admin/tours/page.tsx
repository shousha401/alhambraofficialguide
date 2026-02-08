import Link from 'next/link';
import { AdminToursListClient } from '@/components/admin/AdminToursListClient';

export const dynamic = 'force-dynamic';

export default function AdminToursPage() {
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
      <AdminToursListClient />
    </div>
  );
}
