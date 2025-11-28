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

      {/* Center form */}
      <main className='flex justify-center items-center min-h-screen bg-gray-100 px-4'>
        <div className='bg-white shadow-lg rounded-xl p-8 w-full max-w-lg'>
          <h1 className='text-3xl font-bold mb-6 text-center'>
            Create Station
          </h1>

          <form onSubmit={submit} className='space-y-4'>
            {/* Station Name */}
            <div>
              <label className='block mb-2 font-medium'>Station Name</label>
              <input
                type='text'
                placeholder='Enter station name'
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className='w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none'
              />
            </div>

            {/* Address */}
            <div>
              <label className='block mb-2 font-medium'>Address</label>
              <input
                type='text'
                placeholder='Enter address'
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className='w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none'
              />
            </div>

            {/* Capacity */}
            <div>
              <label className='block mb-2 font-medium'>Capacity</label>
              <input
                type='number'
                placeholder='Capacity'
                min={1}
                value={capacity}
                onChange={(e) => setCapacity(parseInt(e.target.value))}
                required
                className='w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none'
              />
            </div>

            {/* Button */}
            <button
              type='submit'
              className='w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg text-lg font-semibold transition '
            >
              Create Station
            </button>
          </form>

          {message && (
            <p className='mt-4 text-center text-green-600 font-medium'>
              {message}
            </p>
          )}
        </div>
      </main>
    </div>
  );
}
