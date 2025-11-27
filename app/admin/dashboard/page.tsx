'use client';
import Navbar from '@/components/Navbar';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

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

  useEffect(() => {
    async function fetchBookings() {
      try {
        const res = await fetch('/api/admin/bookings');
        const data = await res.json();
        if (!res.ok) {
          console.error(data.error);
        } else {
          setBookings(data.bookings);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchBookings();
  }, []);

  async function updateStatus(id: string, status: string) {
    const res = await fetch(`/api/admin/bookings/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
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
      <main className='container mx-auto py-8'>
        <h1 className='text-3xl font-bold mb-6'>Admin Dashboard</h1>

        {bookings.length === 0 ? (
          <p>No bookings yet.</p>
        ) : (
          <div className='space-y-4'>
            {bookings.map((b) => (
              <div
                key={b.id}
                className='p-4 bg-white rounded shadow flex justify-between items-center'
              >
                <div>
                  <p>
                    <strong>User:</strong> {b.user.name}
                  </p>
                  <p>
                    <strong>Station:</strong> {b.station.name}
                  </p>
                  <p>
                    <strong>Slot:</strong>{' '}
                    {new Date(b.slotTime).toLocaleString()}
                  </p>
                  <p>
                    <strong>Status:</strong> {b.status}
                  </p>
                </div>
                <div className='flex space-x-2'>
                  {b.status !== 'COMPLETED' && (
                    <button
                      className='bg-green-600 text-white px-3 py-1 rounded'
                      onClick={() => updateStatus(b.id, 'COMPLETED')}
                    >
                      Complete
                    </button>
                  )}
                  {b.status !== 'CANCELLED' && (
                    <button
                      className='bg-red-600 text-white px-3 py-1 rounded'
                      onClick={() => updateStatus(b.id, 'CANCELLED')}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
