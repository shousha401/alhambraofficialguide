import { NextRequest, NextResponse } from 'next/server';
import { createAdminSupabaseClient } from '@/lib/supabase/server';

// TODO: Add auth check - verify admin session
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const supabase = createAdminSupabaseClient();
    const { error } = await supabase
      .from('tours')
      .update({
        title_en: body.title_en,
        title_es: body.title_es,
        short_description_en: body.short_description_en,
        short_description_es: body.short_description_es,
        description_en: body.description_en || null,
        description_es: body.description_es || null,
        itinerary_en: body.itinerary_en || null,
        itinerary_es: body.itinerary_es || null,
        inclusions_en: body.inclusions_en || [],
        inclusions_es: body.inclusions_es || [],
        exclusions_en: body.exclusions_en || [],
        exclusions_es: body.exclusions_es || [],
        duration_minutes: body.duration_minutes,
        max_group_size: body.max_group_size,
        image_url: body.image_url || null,
        featured: body.featured ?? false,
        published: body.published ?? true,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
