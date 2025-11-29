'use client';
import React from 'react';

export default function BookingCardRow({ booking, currentUser }) {
  const canUpdate =
    currentUser.role === 'ADMIN' && currentUser.stationId === booking.stationId;

  async function updateStatus(status) {
    const res = await fetch(`/api/bookings/${booking.id}/checkin`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });

    const data = await res.json();

    if (data.success) {
      window.location.reload();
    } else {
      alert(data.error || 'Error updating booking');
    }
  }

  return (
    <tr className='border-b'>
      <td className='p-2'>{booking.station?.name}</td>

      <td className='p-2'>{booking.user?.name}</td>

      <td className='p-2'>{new Date(booking.slotTime).toLocaleString()}</td>

      <td className='p-2'>
        <span
          className={`px-2 py-1 rounded text-white ${
            booking.status === 'PENDING'
              ? 'bg-yellow-500'
              : booking.status === 'COMPLETED'
              ? 'bg-green-500'
              : 'bg-red-500'
          }`}
        >
          {booking.status}
        </span>
      </td>

      {/*  Booked At */}
      <td className='p-2'>{new Date(booking.createdAt).toLocaleString()}</td>

      {/*Action (only for admins) */}
      {currentUser.role !== 'DRIVER' && (
        <td className='p-2 space-x-2'>
          {booking.status === 'PENDING' && canUpdate && (
            <>
              <button
                className='px-2 py-1 bg-green-500 text-white rounded'
                onClick={() => updateStatus('COMPLETED')}
              >
                Complete
              </button>
              <button
                className='px-2 py-1 bg-red-500 text-white rounded'
                onClick={() => updateStatus('CANCELLED')}
              >
                Cancel
              </button>
            </>
          )}
        </td>
      )}
    </tr>
  );
}
