'use client';
import { useState } from 'react';

export default function BookingForm({ stationId }: { stationId: string }) {
  const [slotTime, setSlotTime] = useState('');
  const [msg, setMsg] = useState('');

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setMsg('');

    const res = await fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: 'demo', // replace with Clerk user.id
        stationId,
        slotTime,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      // if slot is unavailable
      setMsg(data.error);
      return;
    }

    setMsg('Booking confirmed!');
    setSlotTime('');
  }

  return (
    <form onSubmit={submit} className='space-y-4'>
      <input
        type='datetime-local'
        value={slotTime}
        required
        onChange={(e) => setSlotTime(e.target.value)}
        className='border p-2 w-full'
      />

      <button className='bg-blue-600 text-white px-4 py-2 rounded'>
        Book Slot
      </button>

      {msg && <p className='text-red-500'>{msg}</p>}
    </form>
  );
}
