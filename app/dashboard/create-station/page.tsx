'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';

export default function CreateStation() {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [capacity, setCapacity] = useState(1);
  const [message, setMessage] = useState('');

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setMessage('');
    try {
      const res = await fetch('/api/stations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, address, capacity }),
      });
      const data = await res.json();
      if (!res.ok) setMessage(data.error || 'Failed');
      else {
        setMessage('Station created successfully');
        setName('');
        setAddress('');
        setCapacity(1);
      }
    } catch {
      setMessage('Network error');
    }
  }

  return (
    <div>
      <Navbar />
      <main className='container py-8'>
        <h1 className='text-2xl font-bold mb-4'>Create Station</h1>
        <form onSubmit={submit} className='space-y-4'>
          <input
            type='text'
            placeholder='Station Name'
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className='w-full border p-2 rounded'
          />
          <input
            type='text'
            placeholder='Address'
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className='w-full border p-2 rounded'
          />
          <input
            type='number'
            placeholder='Capacity'
            value={capacity}
            min={1}
            onChange={(e) => setCapacity(parseInt(e.target.value))}
            required
            className='w-full border p-2 rounded'
          />
          <button
            type='submit'
            className='px-4 py-2 bg-blue-600 text-white rounded'
          >
            Create
          </button>
        </form>
        {message && <p className='mt-2'>{message}</p>}
      </main>
    </div>
  );
}
