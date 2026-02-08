import { NextRequest, NextResponse } from 'next/server';
import { createAdminSupabaseClient } from '@/lib/supabase/server';

// TODO: Add auth check - verify admin session

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json(
        { error: 'SUPABASE_SERVICE_ROLE_KEY is not set.' },
        { status: 500 }
      );
    }
    const { id } = await params;
    const supabase = createAdminSupabaseClient();

    // Delete related rows first (tour_requests has FK to tours without CASCADE)
    await supabase.from('tour_requests').update({ tour_id: null }).eq('tour_id', id);
    await supabase.from('availability_slots').delete().eq('tour_id', id);

    const { error } = await supabase.from('tours').delete().eq('id', id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Internal error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json(
        { error: 'SUPABASE_SERVICE_ROLE_KEY is not set. Add it to .env.local for admin updates.' },
        { status: 500 }
      );
    }
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
        published: body.published ?? false,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Internal error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
