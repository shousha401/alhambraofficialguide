import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const tourId = searchParams.get('tourId');
  const date = searchParams.get('date');

  if (!tourId || !date) {
    return NextResponse.json({ slots: [] }, { status: 400 });
  }

  const supabase = await createServerSupabaseClient();
  const { data: slots } = await supabase
    .from('availability_slots')
    .select('slot_time, max_guests, booked_guests')
    .eq('tour_id', tourId)
    .eq('slot_date', date)
    .gt('max_guests', 0);

  const available = (slots || [])
    .filter((s) => (s.max_guests || 0) > (s.booked_guests || 0))
    .map((s) => ({
      time: typeof s.slot_time === 'string' ? s.slot_time.slice(0, 5) : s.slot_time,
    }));

  return NextResponse.json({ slots: available });
}
