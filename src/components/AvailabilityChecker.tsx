'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

type TourOption = { id: string; slug: string; title: string };

export function AvailabilityChecker({ tours, locale }: { tours: TourOption[]; locale: string }) {
  const t = useTranslations('availability');
  const [tourId, setTourId] = useState('');
  const [date, setDate] = useState('');
  const [slots, setSlots] = useState<{ time: string }[]>([]);
  const [loading, setLoading] = useState(false);

  const checkAvailability = async () => {
    if (!tourId || !date) return;
    setLoading(true);
    setSlots([]);
    try {
      const res = await fetch(`/api/availability?tourId=${tourId}&date=${date}`);
      const data = await res.json();
      setSlots(data.slots || []);
    } catch {
      setSlots([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-primary-700 mb-1">{t('selectTour')}</label>
        <select
          value={tourId}
          onChange={(e) => setTourId(e.target.value)}
          className="w-full px-4 py-2 rounded-lg border border-primary-200 focus:ring-2 focus:ring-primary-500"
        >
          <option value="">{t('selectTour')}</option>
          {tours.map((tour) => (
            <option key={tour.id} value={tour.id}>
              {tour.title}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-primary-700 mb-1">{t('selectDate')}</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          min={new Date().toISOString().split('T')[0]}
          className="w-full px-4 py-2 rounded-lg border border-primary-200 focus:ring-2 focus:ring-primary-500"
        />
      </div>
      <button
        type="button"
        onClick={checkAvailability}
        disabled={!tourId || !date || loading}
        className="w-full px-6 py-3 rounded-lg bg-accent-500 text-white font-semibold hover:bg-accent-600 disabled:opacity-50 transition-colors"
      >
        {loading ? '...' : t('submitRequest')}
      </button>
      {slots.length > 0 && (
        <div className="mt-6">
          <h3 className="font-semibold text-primary-800 mb-2">{t('availableSlots')}</h3>
          <div className="flex flex-wrap gap-2">
            {slots.map((slot, i) => (
              <Link
                key={i}
                href={{ pathname: '/contact', query: { tour: tourId, date, time: slot.time } }}
                className="px-4 py-2 rounded-lg bg-primary-100 text-primary-800 hover:bg-primary-200 transition-colors"
              >
                {slot.time}
              </Link>
            ))}
          </div>
        </div>
      )}
      {!loading && tourId && date && slots.length === 0 && (
        <p className="text-primary-600">{t('noSlots')}</p>
      )}
    </div>
  );
}
