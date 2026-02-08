'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type Tour = {
  id: string;
  slug: string;
  title_en: string;
  title_es: string;
  short_description_en: string;
  short_description_es: string;
  description_en: string | null;
  description_es: string | null;
  itinerary_en: string | null;
  itinerary_es: string | null;
  inclusions_en: string[] | null;
  inclusions_es: string[] | null;
  exclusions_en: string[] | null;
  exclusions_es: string[] | null;
  duration_minutes: number;
  max_group_size: number;
  languages: string[] | null;
  price_from_cents: number | null;
  image_url: string | null;
  featured: boolean;
  sort_order: number;
  published: boolean;
};

export function TourEditor({ tour }: { tour: Tour }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title_en: tour.title_en,
    title_es: tour.title_es,
    short_description_en: tour.short_description_en,
    short_description_es: tour.short_description_es,
    description_en: tour.description_en || '',
    description_es: tour.description_es || '',
    itinerary_en: tour.itinerary_en || '',
    itinerary_es: tour.itinerary_es || '',
    inclusions_en: (tour.inclusions_en || []).join('\n'),
    inclusions_es: (tour.inclusions_es || []).join('\n'),
    exclusions_en: (tour.exclusions_en || []).join('\n'),
    exclusions_es: (tour.exclusions_es || []).join('\n'),
    duration_minutes: tour.duration_minutes,
    max_group_size: tour.max_group_size,
    image_url: tour.image_url || '',
    featured: tour.featured,
    published: tour.published,
  });

  const hasMissingEn = !form.title_en || !form.short_description_en;
  const hasMissingEs = !form.title_es || !form.short_description_es;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/tours/${tour.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          inclusions_en: form.inclusions_en.split('\n').filter(Boolean),
          inclusions_es: form.inclusions_es.split('\n').filter(Boolean),
          exclusions_en: form.exclusions_en.split('\n').filter(Boolean),
          exclusions_es: form.exclusions_es.split('\n').filter(Boolean),
        }),
      });
      if (res.ok) router.refresh();
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {(hasMissingEn || hasMissingEs) && (
        <div className="p-4 rounded-lg bg-amber-100 text-amber-800 border border-amber-200">
          <strong>Warning:</strong> Some translations are missing. {hasMissingEn && 'English: '} {hasMissingEn && (form.title_en ? '' : 'title/short description ')}
          {hasMissingEs && 'Spanish: '} {hasMissingEs && (form.title_es ? '' : 'title/short description ')}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h2 className="font-semibold text-primary-800 border-b pb-2">English</h2>
          <div>
            <label className="block text-sm font-medium mb-1">Title (EN)</label>
            <input
              value={form.title_en}
              onChange={(e) => setForm({ ...form, title_en: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Short Description (EN)</label>
            <textarea
              value={form.short_description_en}
              onChange={(e) => setForm({ ...form, short_description_en: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border rounded-lg"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description (EN)</label>
            <textarea
              value={form.description_en}
              onChange={(e) => setForm({ ...form, description_en: e.target.value })}
              rows={5}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Itinerary (EN)</label>
            <textarea
              value={form.itinerary_en}
              onChange={(e) => setForm({ ...form, itinerary_en: e.target.value })}
              rows={5}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Inclusions (EN, one per line)</label>
            <textarea
              value={form.inclusions_en}
              onChange={(e) => setForm({ ...form, inclusions_en: e.target.value })}
              rows={4}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Exclusions (EN, one per line)</label>
            <textarea
              value={form.exclusions_en}
              onChange={(e) => setForm({ ...form, exclusions_en: e.target.value })}
              rows={4}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="font-semibold text-primary-800 border-b pb-2">Spanish</h2>
          <div>
            <label className="block text-sm font-medium mb-1">Title (ES)</label>
            <input
              value={form.title_es}
              onChange={(e) => setForm({ ...form, title_es: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Short Description (ES)</label>
            <textarea
              value={form.short_description_es}
              onChange={(e) => setForm({ ...form, short_description_es: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border rounded-lg"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description (ES)</label>
            <textarea
              value={form.description_es}
              onChange={(e) => setForm({ ...form, description_es: e.target.value })}
              rows={5}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Itinerary (ES)</label>
            <textarea
              value={form.itinerary_es}
              onChange={(e) => setForm({ ...form, itinerary_es: e.target.value })}
              rows={5}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Inclusions (ES, one per line)</label>
            <textarea
              value={form.inclusions_es}
              onChange={(e) => setForm({ ...form, inclusions_es: e.target.value })}
              rows={4}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Exclusions (ES, one per line)</label>
            <textarea
              value={form.exclusions_es}
              onChange={(e) => setForm({ ...form, exclusions_es: e.target.value })}
              rows={4}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4 pt-4">
        <div>
          <label className="block text-sm font-medium mb-1">Duration (minutes)</label>
          <input
            type="number"
            value={form.duration_minutes}
            onChange={(e) => setForm({ ...form, duration_minutes: parseInt(e.target.value, 10) })}
            className="w-full px-3 py-2 border rounded-lg"
            min={1}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Max Group Size</label>
          <input
            type="number"
            value={form.max_group_size}
            onChange={(e) => setForm({ ...form, max_group_size: parseInt(e.target.value, 10) })}
            className="w-full px-3 py-2 border rounded-lg"
            min={1}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Image URL</label>
          <input
            value={form.image_url}
            onChange={(e) => setForm({ ...form, image_url: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>
        <div className="flex gap-4 items-center">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => setForm({ ...form, featured: e.target.checked })}
            />
            Featured
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.published}
              onChange={(e) => setForm({ ...form, published: e.target.checked })}
            />
            Published
          </label>
        </div>
      </div>

      <button
        type="submit"
        disabled={saving}
        className="px-6 py-2 rounded-lg bg-accent-500 text-white font-semibold hover:bg-accent-600 disabled:opacity-50"
      >
        {saving ? 'Saving...' : 'Save'}
      </button>
    </form>
  );
}
