import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { z } from 'zod';
import { sendTourRequestEmail } from '@/lib/email';

const tourRequestSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  tourId: z.string().uuid().optional(),
  locale: z.enum(['en', 'es']),
  preferredDate: z.string().optional().nullable(),
  preferredTime: z.string().optional().nullable(),
  numberOfGuests: z.number().min(1).max(30).optional().nullable(),
  message: z.string().min(10),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = tourRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid request', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const data = parsed.data;

    const supabase = await createServerSupabaseClient();
    const { data: tourRequest, error: insertError } = await supabase
      .from('tour_requests')
      .insert({
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        tour_id: data.tourId || null,
        locale: data.locale,
        preferred_date: data.preferredDate || null,
        preferred_time: data.preferredTime || null,
        number_of_guests: data.numberOfGuests ?? null,
        message: data.message,
      })
      .select()
      .single();

    if (insertError) {
      console.error('Supabase insert error:', insertError);
      return NextResponse.json({ error: 'Failed to save request' }, { status: 500 });
    }

    await sendTourRequestEmail({
      to: process.env.CONTACT_EMAIL || process.env.RESEND_FROM_EMAIL || 'contact@example.com',
      locale: data.locale,
      request: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        message: data.message,
        preferredDate: data.preferredDate,
        preferredTime: data.preferredTime,
        numberOfGuests: data.numberOfGuests,
      },
    });

    return NextResponse.json({ success: true, id: tourRequest?.id });
  } catch (err) {
    console.error('Tour request API error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
