import { notFound } from 'next/navigation';
import { createAdminSupabaseClient } from '@/lib/supabase/server';
import { TourEditor } from '@/components/admin/TourEditor';

export default async function AdminTourEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = createAdminSupabaseClient();
  const { data: tour } = await supabase.from('tours').select('*').eq('id', id).single();

  if (!tour) notFound();

  return (
    <div>
      <h1 className="text-2xl font-bold text-primary-900 mb-6">Edit Tour: {tour.slug}</h1>
      <TourEditor tour={tour} />
    </div>
  );
}
