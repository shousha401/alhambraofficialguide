import { NextRequest, NextResponse } from 'next/server';
import { createAdminSupabaseClient } from '@/lib/supabase/server';

// TODO: Add auth check - verify admin session

export async function GET() {
  try {
    const supabase = createAdminSupabaseClient();
    const { data: tours, error } = await supabase
      .from('tours')
      .select('id, slug, title_en, title_es, published, featured')
      .order('sort_order', { ascending: true })
      .limit(500);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ tours: tours ?? [] });
  } catch (err) {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const slug = (body.slug || '').trim().toLowerCase().replace(/\s+/g, '-');
    if (!slug) {
      return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
    }

    const supabase = createAdminSupabaseClient();

    const { data: existing } = await supabase.from('tours').select('id').eq('slug', slug).single();
    if (existing) {
      return NextResponse.json({ error: 'A tour with this slug already exists' }, { status: 400 });
    }

    const { data: tour, error } = await supabase
      .from('tours')
      .insert({
        slug,
        title_en: body.title_en || '',
        title_es: body.title_es || '',
        short_description_en: body.short_description_en || '',
        short_description_es: body.short_description_es || '',
        description_en: body.description_en || null,
        description_es: body.description_es || null,
        itinerary_en: body.itinerary_en || null,
        itinerary_es: body.itinerary_es || null,
        inclusions_en: body.inclusions_en || [],
        inclusions_es: body.inclusions_es || [],
        exclusions_en: body.exclusions_en || [],
        exclusions_es: body.exclusions_es || [],
        duration_minutes: body.duration_minutes ?? 120,
        max_group_size: body.max_group_size ?? 15,
        image_url: body.image_url || null,
        featured: body.featured ?? false,
        published: body.published ?? true,
        sort_order: body.sort_order ?? 0,
      })
      .select('id')
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ success: true, id: tour?.id });
  } catch (err) {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
