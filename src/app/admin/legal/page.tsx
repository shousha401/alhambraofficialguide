import Link from 'next/link';
import { createAdminSupabaseClient } from '@/lib/supabase/server';

export default async function AdminLegalPage() {
  const supabase = createAdminSupabaseClient();
  const { data: pages } = await supabase.from('legal_pages').select('*').order('slug');

  return (
    <div>
      <h1 className="text-2xl font-bold text-primary-900 mb-6">Legal Pages</h1>
      <div className="grid gap-4">
        {(pages || []).map((page) => (
          <Link
            key={page.id}
            href={`/admin/legal/${page.slug}`}
            className="block p-4 bg-white rounded-xl shadow border border-primary-200 hover:shadow-md"
          >
            <h2 className="font-semibold text-primary-800">{page.slug}</h2>
            <p className="text-sm text-primary-500">
              EN: {page.title_en} | ES: {page.title_es}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
