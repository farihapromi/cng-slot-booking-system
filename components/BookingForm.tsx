'use client';

import { useState } from 'react';

export default function BookingForm({ stationId }: { stationId: string }) {
  const [slotTime, setSlotTime] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setMessage('');
    setLoading(true);
    try {
      // TODO: replace userId with logged-in user's id (from Clerk) when auth is integrated
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 'demo-user-id', // replace with real id after adding auth
          stationId,
          slotTime: new Date(slotTime).toISOString(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setMessage(data.error || 'Booking failed');
      } else {
        setMessage('Booking confirmed');
        setSlotTime('');
      }
    } catch (err) {
      setMessage('Network error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className='space-y-3'>
      <label className='block'>
        <span className='text-sm'>Choose time</span>
        <input
          type='datetime-local'
          value={slotTime}
          onChange={(e) => setSlotTime(e.target.value)}
          required
          className='mt-1 block w-full rounded border p-2'
        />
      </label>

      <button
        type='submit'
        className='px-4 py-2 bg-blue-600 text-white rounded'
        disabled={loading}
      >
        {loading ? 'Booking...' : 'Book Slot'}
      </button>

      {message && <p className='text-sm mt-2'>{message}</p>}
    </form>
  );
}
