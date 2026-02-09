import { NextResponse } from 'next/server';
import { createAdminSupabaseClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    let supabase;
    try {
      supabase = createAdminSupabaseClient();
    } catch (clientErr) {
      const msg = clientErr instanceof Error ? clientErr.message : 'Missing Supabase admin client';
      return NextResponse.json({ error: msg, requests: [] }, { status: 500, headers: { 'Cache-Control': 'no-store' } });
    }
    const { data: requests, error: reqError } = await supabase
      .from('tour_requests')
      .select('id, name, email, phone, message, preferred_date, number_of_guests, locale, status, created_at, tour_id')
      .order('created_at', { ascending: false });

    if (reqError) {
      return NextResponse.json({ error: reqError.message }, { status: 500 });
    }

    const list = requests ?? [];
    const tourIds = list.reduce<string[]>((acc, r) => {
      const id = r.tour_id;
      if (id && !acc.includes(id)) acc.push(id);
      return acc;
    }, []);

    const { data: tours } = tourIds.length > 0
      ? await supabase.from('tours').select('id, title_en, title_es').in('id', tourIds)
      : { data: [] };
    const tourMap = new Map((tours || []).map((t) => [t.id, t]));

    const getTourTitle = (r: { tour_id?: string | null; locale: string }) => {
      if (!r.tour_id) return 'General';
      const t = tourMap.get(r.tour_id);
      return t ? (r.locale === 'es' ? t.title_es : t.title_en) : '-';
    };

    const rows = list.map((r) => ({
      id: r.id,
      name: r.name,
      email: r.email,
      phone: r.phone,
      message: r.message,
      preferred_date: r.preferred_date,
      number_of_guests: r.number_of_guests,
      locale: r.locale,
      status: r.status,
      created_at: r.created_at,
      tour_id: r.tour_id,
      tourTitle: getTourTitle(r),
    }));

    return NextResponse.json({ requests: rows }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (err) {
    console.error('Admin requests API error:', err);
    const msg = err instanceof Error ? err.message : 'Internal error';
    return NextResponse.json({ error: msg, requests: [] }, { status: 500, headers: { 'Cache-Control': 'no-store' } });
  }
}
