'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function NewTourForm() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    slug: '',
    title_en: '',
    title_es: '',
    short_description_en: '',
    short_description_es: '',
    description_en: '',
    description_es: '',
    itinerary_en: '',
    itinerary_es: '',
    inclusions_en: '',
    inclusions_es: '',
    exclusions_en: '',
    exclusions_es: '',
    duration_minutes: 120,
    max_group_size: 15,
    image_url: '',
    featured: false,
    published: true,
    sort_order: 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      const res = await fetch('/api/admin/tours', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          inclusions_en: form.inclusions_en.split('\n').filter(Boolean),
          inclusions_es: form.inclusions_es.split('\n').filter(Boolean),
          exclusions_en: form.exclusions_en.split('\n').filter(Boolean),
          exclusions_es: form.exclusions_es.split('\n').filter(Boolean),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to create tour');
        return;
      }
      if (data.id) router.push(`/admin/tours/${data.id}`);
      else router.push('/admin/tours');
      router.refresh();
    } catch {
      setError('Something went wrong');
    } finally {
      setSaving(false);
    }
  };

  const inputClass = 'w-full px-3 py-2 border border-primary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent';
  const labelClass = 'block text-sm font-medium text-primary-700 mb-1';

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
      {error && (
        <div className="p-4 rounded-lg bg-red-100 text-red-800 text-sm">{error}</div>
      )}

      <div>
        <label className={labelClass}>Slug (URL-friendly, e.g. alhambra-generalife) *</label>
        <input
          type="text"
          value={form.slug}
          onChange={(e) => setForm({ ...form, slug: e.target.value })}
          className={inputClass}
          placeholder="alhambra-generalife"
          required
        />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h2 className="font-semibold text-primary-800 border-b pb-2">English</h2>
          <div>
            <label className={labelClass}>Title (EN) *</label>
            <input value={form.title_en} onChange={(e) => setForm({ ...form, title_en: e.target.value })} className={inputClass} required />
          </div>
          <div>
            <label className={labelClass}>Short description (EN) *</label>
            <textarea value={form.short_description_en} onChange={(e) => setForm({ ...form, short_description_en: e.target.value })} rows={3} className={inputClass} required />
          </div>
          <div>
            <label className={labelClass}>Description (EN)</label>
            <textarea value={form.description_en} onChange={(e) => setForm({ ...form, description_en: e.target.value })} rows={5} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Itinerary (EN)</label>
            <textarea value={form.itinerary_en} onChange={(e) => setForm({ ...form, itinerary_en: e.target.value })} rows={5} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Inclusions (EN, one per line)</label>
            <textarea value={form.inclusions_en} onChange={(e) => setForm({ ...form, inclusions_en: e.target.value })} rows={4} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Exclusions (EN, one per line)</label>
            <textarea value={form.exclusions_en} onChange={(e) => setForm({ ...form, exclusions_en: e.target.value })} rows={4} className={inputClass} />
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="font-semibold text-primary-800 border-b pb-2">Spanish</h2>
          <div>
            <label className={labelClass}>Title (ES) *</label>
            <input value={form.title_es} onChange={(e) => setForm({ ...form, title_es: e.target.value })} className={inputClass} required />
          </div>
          <div>
            <label className={labelClass}>Short description (ES) *</label>
            <textarea value={form.short_description_es} onChange={(e) => setForm({ ...form, short_description_es: e.target.value })} rows={3} className={inputClass} required />
          </div>
          <div>
            <label className={labelClass}>Description (ES)</label>
            <textarea value={form.description_es} onChange={(e) => setForm({ ...form, description_es: e.target.value })} rows={5} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Itinerary (ES)</label>
            <textarea value={form.itinerary_es} onChange={(e) => setForm({ ...form, itinerary_es: e.target.value })} rows={5} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Inclusions (ES, one per line)</label>
            <textarea value={form.inclusions_es} onChange={(e) => setForm({ ...form, inclusions_es: e.target.value })} rows={4} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Exclusions (ES, one per line)</label>
            <textarea value={form.exclusions_es} onChange={(e) => setForm({ ...form, exclusions_es: e.target.value })} rows={4} className={inputClass} />
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4 pt-4">
        <div>
          <label className={labelClass}>Duration (minutes)</label>
          <input type="number" value={form.duration_minutes} onChange={(e) => setForm({ ...form, duration_minutes: parseInt(e.target.value, 10) })} className={inputClass} min={1} />
        </div>
        <div>
          <label className={labelClass}>Max group size</label>
          <input type="number" value={form.max_group_size} onChange={(e) => setForm({ ...form, max_group_size: parseInt(e.target.value, 10) })} className={inputClass} min={1} />
        </div>
        <div className="md:col-span-2">
          <label className={labelClass}>Image URL</label>
          <input value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Sort order</label>
          <input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value, 10) })} className={inputClass} />
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex gap-4 items-center">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} />
              Featured
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} />
              Published
            </label>
          </div>
          <p className="text-sm text-primary-600">
            Published = visible on Tours page. Featured = also shown on Home page (max 3). New tours are published by default.
          </p>
        </div>
      </div>

      <button type="submit" disabled={saving} className="px-6 py-2 rounded-lg bg-accent-500 text-white font-semibold hover:bg-accent-600 disabled:opacity-50">
        {saving ? 'Creating...' : 'Create Tour'}
      </button>
    </form>
  );
}
