import { NextResponse } from 'next/server';
import { createAdminSupabaseClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

const ALLOWED_STATUSES = ['confirmed', 'cancelled'] as const;

export async function PATCH(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: 'Missing request id' }, { status: 400 });
    }
    const body = await _request.json();
    const status = body?.status;
    if (!status || !ALLOWED_STATUSES.includes(status)) {
      return NextResponse.json(
        { error: 'Body must include status: "confirmed" or "cancelled"' },
        { status: 400 }
      );
    }
    const supabase = createAdminSupabaseClient();
    const { data, error } = await supabase
      .from('tour_requests')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select('id, status')
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ ok: true, request: data });
  } catch (err) {
    console.error('Admin PATCH request error:', err);
    const msg = err instanceof Error ? err.message : 'Internal error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: 'Missing request id' }, { status: 400 });
    }
    const supabase = createAdminSupabaseClient();
    const { error } = await supabase.from('tour_requests').delete().eq('id', id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Admin DELETE request error:', err);
    const msg = err instanceof Error ? err.message : 'Internal error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
