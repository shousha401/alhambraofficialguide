'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

type Props = { requestId: string; status: string };

export function RequestStatusActions({ requestId, status }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState<'confirm' | 'deny' | 'clear' | null>(null);

  const updateStatus = async (newStatus: 'confirmed' | 'cancelled') => {
    setLoading(newStatus === 'confirmed' ? 'confirm' : 'deny');
    try {
      const res = await fetch(`/api/admin/requests/${requestId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        alert(data?.error ?? 'Failed to update');
        return;
      }
      router.refresh();
    } finally {
      setLoading(null);
    }
  };

  const deleteRequest = async () => {
    setLoading('clear');
    try {
      const res = await fetch(`/api/admin/requests/${requestId}`, { method: 'DELETE' });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        alert(data?.error ?? 'Failed to delete');
        return;
      }
      router.refresh();
    } finally {
      setLoading(null);
    }
  };

  if (status !== 'pending') {
    return (
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          deleteRequest();
        }}
        disabled={loading === 'clear'}
        className="px-2 py-1 rounded text-sm font-medium bg-primary-100 text-primary-800 hover:bg-primary-200 disabled:opacity-50"
      >
        {loading === 'clear' ? '…' : 'Clear'}
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          updateStatus('confirmed');
        }}
        disabled={!!loading}
        className="px-2 py-1 rounded text-sm font-medium bg-green-100 text-green-800 hover:bg-green-200 disabled:opacity-50"
      >
        {loading === 'confirm' ? '…' : 'Confirm'}
      </button>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          updateStatus('cancelled');
        }}
        disabled={!!loading}
        className="px-2 py-1 rounded text-sm font-medium bg-red-100 text-red-800 hover:bg-red-200 disabled:opacity-50"
      >
        {loading === 'deny' ? '…' : 'Deny'}
      </button>
    </div>
  );
}
