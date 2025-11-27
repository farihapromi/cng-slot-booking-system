'use client';

import Navbar from '@/components/Navbar';
import { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';

interface Booking {
  id: string;
  user: { name: string };
  station: { name: string };
  slotTime: string;
  status: string;
  createdAt: string;
}

export default function AdminDashboard() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch bookings from admin API
  useEffect(() => {
    async function fetchBookings() {
      try {
        const res = await fetch('/api/admin/bookings');
        const data = await res.json();

        if (!res.ok) {
          toast.error(data.error || 'Failed to fetch bookings');
          console.error(data.error);
        } else {
          setBookings(data.bookings);
        }
      } catch (err) {
        console.error(err);
        toast.error('Failed to fetch bookings');
      } finally {
        setLoading(false);
      }
    }

    fetchBookings();
  }, []);

  // Update booking status
  // AdminDashboard.tsx
  async function updateStatus(id: string, status: string) {
    const res = await fetch(`/api/admin/bookings/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
      credentials: 'include', // ✅ Include cookies for Clerk
    });
    const data = await res.json();
    if (!res.ok) {
      toast.error(data.error || 'Failed to update status');
    } else {
      toast.success('Status updated!');
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status } : b))
      );
    }
  }

  if (loading) return <p className='p-8'>Loading bookings...</p>;

  return (
    <div className='min-h-screen bg-gray-100'>
      <Navbar />
      <Toaster position='top-right' />
      <main className='container mx-auto py-8'>
        <h1 className='text-3xl font-bold mb-6'>Admin Dashboard</h1>

        {bookings.length === 0 ? (
          <p>No bookings yet.</p>
        ) : (
          <div className='overflow-x-auto bg-white rounded shadow'>
            <table className='min-w-full divide-y divide-gray-200'>
              <thead className='bg-gray-50'>
                <tr>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    User
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Station
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Slot Time
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Status
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className='bg-white divide-y divide-gray-200'>
                {bookings.map((b) => (
                  <tr key={b.id}>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      {b.user.name}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      {b.station.name}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      {new Date(b.slotTime).toLocaleString()}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>{b.status}</td>
                    <td className='px-6 py-4 whitespace-nowrap flex space-x-2'>
                      {b.status !== 'COMPLETED' && (
                        <button
                          className='bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700'
                          onClick={() => updateStatus(b.id, 'COMPLETED')}
                        >
                          Complete
                        </button>
                      )}
                      {b.status !== 'CANCELLED' && (
                        <button
                          className='bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700'
                          onClick={() => updateStatus(b.id, 'CANCELLED')}
                        >
                          Cancel
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
