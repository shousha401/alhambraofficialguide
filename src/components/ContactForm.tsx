'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslations } from 'next-intl';
import { useState, useEffect } from 'react';

const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  tourId: z.string().optional(),
  preferredDate: z.string().optional(),
  numberOfGuests: z.number().min(1).max(30).optional().nullable(),
  message: z.string().min(10),
});

type ContactFormData = z.infer<typeof contactSchema>;

type ContactFormProps = {
  locale: string;
  initialTourId?: string;
  initialDate?: string;
  initialTime?: string;
};

export function ContactForm({ locale, initialTourId, initialDate, initialTime }: ContactFormProps) {
  const t = useTranslations('contact');
  const tForms = useTranslations('forms');
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      numberOfGuests: undefined,
      tourId: initialTourId,
      preferredDate: initialDate,
    },
  });

  useEffect(() => {
    if (initialDate) setValue('preferredDate', initialDate);
    if (initialTourId) setValue('tourId', initialTourId);
  }, [initialDate, initialTourId, setValue]);

  const onSubmit = async (data: ContactFormData) => {
    try {
      const res = await fetch('/api/tour-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          locale,
          tourId: data.tourId || initialTourId,
          preferredDate: data.preferredDate || initialDate || null,
          preferredTime: initialTime || null,
          numberOfGuests: data.numberOfGuests ?? null,
        }),
      });
      if (!res.ok) throw new Error('Request failed');
      setStatus('success');
      reset();
    } catch {
      setStatus('error');
    }
  };

  const getError = (key: keyof ContactFormData) => {
    const err = errors[key];
    if (!err?.message) return null;
    const msg = String(err.message);
    if (msg.includes('Email')) return tForms('invalidEmail');
    if (msg.includes('1') && msg.includes('30')) return tForms('maxGuests');
    if (msg.includes('10') || msg.includes('2')) return tForms('minLength');
    return tForms('required');
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {status === 'success' && (
        <div className="p-4 rounded-lg bg-accent-100 text-accent-800">{t('success')}</div>
      )}
      {status === 'error' && (
        <div className="p-4 rounded-lg bg-red-100 text-red-800">{t('error')}</div>
      )}

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-primary-700 mb-1">{t('name')}</label>
        <input
          id="name"
          {...register('name')}
          className="w-full px-4 py-2 rounded-lg border border-primary-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
        {errors.name && <p className="mt-1 text-sm text-red-600">{getError('name')}</p>}
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-primary-700 mb-1">{t('email')}</label>
        <input
          id="email"
          type="email"
          {...register('email')}
          className="w-full px-4 py-2 rounded-lg border border-primary-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
        {errors.email && <p className="mt-1 text-sm text-red-600">{getError('email')}</p>}
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-primary-700 mb-1">{t('phone')}</label>
        <input
          id="phone"
          type="tel"
          {...register('phone')}
          className="w-full px-4 py-2 rounded-lg border border-primary-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
      </div>

      <div>
        <label htmlFor="preferredDate" className="block text-sm font-medium text-primary-700 mb-1">{t('date')}</label>
        <input
          id="preferredDate"
          type="date"
          {...register('preferredDate')}
          className="w-full px-4 py-2 rounded-lg border border-primary-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
      </div>

      <div>
        <label htmlFor="numberOfGuests" className="block text-sm font-medium text-primary-700 mb-1">{t('guests')}</label>
        <input
          id="numberOfGuests"
          type="number"
          min={1}
          max={30}
          {...register('numberOfGuests', { valueAsNumber: true })}
          className="w-full px-4 py-2 rounded-lg border border-primary-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
        {errors.numberOfGuests && <p className="mt-1 text-sm text-red-600">{getError('numberOfGuests')}</p>}
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-primary-700 mb-1">{t('message')}</label>
        <textarea
          id="message"
          rows={4}
          {...register('message')}
          className="w-full px-4 py-2 rounded-lg border border-primary-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
        {errors.message && <p className="mt-1 text-sm text-red-600">{getError('message')}</p>}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full px-6 py-3 rounded-lg bg-accent-500 text-white font-semibold hover:bg-accent-600 disabled:opacity-50 transition-colors"
      >
        {isSubmitting ? '...' : t('submit')}
      </button>
    </form>
  );
}
