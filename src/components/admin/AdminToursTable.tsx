'use client';

import { useState } from 'react';
import Link from 'next/link';
import { DeleteTourButton } from './DeleteTourButton';

type Tour = {
  id: string;
  slug: string;
  title_en: string | null;
  title_es: string | null;
  published: boolean | null;
  featured: boolean | null;
};

export function AdminToursTable({ initialTours }: { initialTours: Tour[] }) {
  // Only track IDs we deleted this session (so they disappear from the list).
  // The list itself comes from the server (initialTours) so new tours show when you navigate back.
  const [deletedIds, setDeletedIds] = useState<Set<string>>(new Set());
  const tours = initialTours.filter((t) => !deletedIds.has(t.id));

  const onDeleted = (tourId: string) => {
    setDeletedIds((prev) => new Set(prev).add(tourId));
  };

  return (
    <>
      <p className="text-sm text-primary-600 mt-0.5 mb-6">
        Showing {tours.length} tour{tours.length !== 1 ? 's' : ''}
      </p>
      <div className="bg-white rounded-xl shadow border border-primary-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-primary-50">
            <tr>
              <th className="text-left px-4 py-3 font-semibold text-primary-800">Tour</th>
              <th className="text-left px-4 py-3 font-semibold text-primary-800">EN</th>
              <th className="text-left px-4 py-3 font-semibold text-primary-800">ES</th>
              <th className="text-left px-4 py-3 font-semibold text-primary-800">Status</th>
              <th className="text-left px-4 py-3 font-semibold text-primary-800">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tours.map((tour) => (
              <tr key={tour.id} className="border-t border-primary-100">
                <td className="px-4 py-3">{tour.slug}</td>
                <td className="px-4 py-3">
                  {tour.title_en ? (
                    <span className="text-green-600">✓</span>
                  ) : (
                    <span className="text-amber-600">Missing</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  {tour.title_es ? (
                    <span className="text-green-600">✓</span>
                  ) : (
                    <span className="text-amber-600">Missing</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  {tour.published ? (
                    <span className="text-green-600">Published</span>
                  ) : (
                    <span className="text-gray-500">Draft</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center gap-4">
                    <Link
                      href={`/admin/tours/${tour.id}`}
                      className="text-primary-600 hover:text-primary-800 font-medium"
                    >
                      Edit
                    </Link>
                    <DeleteTourButton
                      tourId={tour.id}
                      tourSlug={tour.slug}
                      onDeleted={() => onDeleted(tour.id)}
                    />
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
