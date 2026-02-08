'use client';

import { useState } from 'react';

export function DeleteTourButton({
  tourId,
  tourSlug,
  onDeleted,
}: {
  tourId: string;
  tourSlug: string;
  onDeleted?: () => void;
}) {
  const [deleting, setDeleting] = useState(false);
  const [confirming, setConfirming] = useState(false);

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (deleting) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/tours/${tourId}`, { method: 'DELETE' });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setConfirming(false);
        onDeleted?.();
      } else {
        alert(data.error || 'Failed to delete');
      }
    } catch {
      alert('Network error');
    } finally {
      setDeleting(false);
    }
  };

  const handleConfirmClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setConfirming(true);
  };

  const handleCancelClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!deleting) setConfirming(false);
  };

  if (confirming) {
    return (
      <span className="inline-flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
        <span className="text-xs text-red-600">Delete &quot;{tourSlug}&quot;?</span>
        <button
          type="button"
          onClick={handleDelete}
          disabled={deleting}
          className="text-xs px-2 py-1 rounded bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
        >
          {deleting ? '…' : 'Yes'}
        </button>
        <button
          type="button"
          onClick={handleCancelClick}
          disabled={deleting}
          className="text-xs px-2 py-1 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
        >
          No
        </button>
      </span>
    );
  }

  return (
    <button
      type="button"
      onClick={handleConfirmClick}
      className="text-red-600 hover:text-red-800 text-sm font-medium underline"
    >
      Delete
    </button>
  );
}
