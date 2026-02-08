import Link from 'next/link';
import { NewTourForm } from '@/components/admin/NewTourForm';

export default function AdminNewTourPage() {
  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/tours" className="text-primary-600 hover:text-primary-800 font-medium">
          ← Back to Tours
        </Link>
      </div>
      <h1 className="text-2xl font-bold text-primary-900 mb-6">Add New Tour</h1>
      <NewTourForm />
    </div>
  );
}
