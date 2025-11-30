'use client';

import { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import Navbar from '@/components/Navbar';
import Link from 'next/link';

import { Station } from '@/types/station';
import { Booking } from '@/types/booking';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'bookings' | 'stations'>(
    'bookings'
  );
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [stations, setStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch bookings
  useEffect(() => {
    async function fetchBookings() {
      try {
        const res = await fetch('/api/admin/bookings');
        const data = await res.json();
        if (!res.ok) toast.error(data.error || 'Failed to fetch bookings');
        else setBookings(data.bookings);
      } catch (err) {
        console.error(err);
        toast.error('Failed to fetch bookings');
      } finally {
        setLoading(false);
      }
    }

    fetchBookings();
  }, []);

  // Fetch stations
  useEffect(() => {
    async function fetchStations() {
      try {
        const res = await fetch('/api/admin/stations');
        const data = await res.json();
        if (res.ok) setStations(data.stations);
        if (!res.ok) toast.error(data.error || 'Failed to fetch stations');
        else setStations(data.stations);
      } catch (err) {
        console.error(err);
        toast.error('Failed to fetch stations');
      }
    }

    fetchStations();
  }, []);

  async function updateStatus(id: string, status: string) {
    const res = await fetch(`/api/admin/bookings/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
      credentials: 'include',
    });
    const data = await res.json();
    if (!res.ok) toast.error(data.error || 'Failed to update status');
    else {
      toast.success('Status updated!');
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status } : b))
      );
    }
  }

  return (
    <div className='min-h-screen bg-gray-100'>
      <Navbar />
      <Toaster position='top-right' />

      <div className='flex flex-col md:flex-row'>
        {/* Sidebar */}
        <aside className='w-full md:w-60 bg-white shadow p-4 flex md:flex-col justify-around md:justify-start'>
          <h1 className='text-xl font-bold mb-6 text-blue-600'>
            Admin Dashboard
          </h1>
          <button
            className={`mb-2 p-3 w-full text-left rounded hover:bg-blue-100 ${
              activeTab === 'bookings' ? 'bg-blue-200 font-semibold' : ''
            }`}
            onClick={() => setActiveTab('bookings')}
          >
            Bookings
          </button>
          <button
            className={`mb-2 p-3 w-full text-left rounded hover:bg-blue-100 ${
              activeTab === 'stations' ? 'bg-blue-200 font-semibold' : ''
            }`}
            onClick={() => setActiveTab('stations')}
          >
            Stations
          </button>
        </aside>

        {/* Main Content */}
        <main className='flex-1 p-6'>
          {activeTab === 'bookings' && (
            <div>
              {loading ? (
                <p>Loading bookings...</p>
              ) : bookings.length === 0 ? (
                <p>No bookings yet.</p>
              ) : (
                <div>
                  {/* Heading moved above the table */}
                  <h1 className='text-xl font-bold mb-4 text-blue-600'>
                    All Bookings
                  </h1>

                  <div className='overflow-x-auto bg-white rounded shadow p-4'>
                    <table className='min-w-full divide-y divide-gray-200 text-center'>
                      <thead className='bg-gray-50'>
                        <tr>
                          <th className='px-6 py-3 text-xs font-medium text-gray-500 uppercase'>
                            User
                          </th>
                          <th className='px-6 py-3 text-xs font-medium text-gray-500 uppercase'>
                            Station
                          </th>
                          <th className='px-6 py-3 text-xs font-medium text-gray-500 uppercase'>
                            Slot Time
                          </th>
                          <th className='px-6 py-3 text-xs font-medium text-gray-500 uppercase'>
                            Status
                          </th>
                          <th className='px-6 py-3 text-xs font-medium text-gray-500 uppercase'>
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className='bg-white divide-y divide-gray-200'>
                        {bookings.map((b) => (
                          <tr key={b.id}>
                            <td className='px-6 py-4'>{b.user.name}</td>
                            <td className='px-6 py-4'>{b.station.name}</td>
                            <td className='px-6 py-4'>
                              {new Date(b.slotTime).toLocaleString()}
                            </td>
                            <td className='px-6 py-4'>{b.status}</td>
                            <td className='px-6 py-4 flex justify-center space-x-2'>
                              {b.status !== 'COMPLETED' && (
                                <button
                                  className='bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700'
                                  onClick={() =>
                                    updateStatus(b.id, 'COMPLETED')
                                  }
                                >
                                  Complete
                                </button>
                              )}
                              {b.status !== 'CANCELLED' && (
                                <button
                                  className='bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700'
                                  onClick={() =>
                                    updateStatus(b.id, 'CANCELLED')
                                  }
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
                </div>
              )}
            </div>
          )}

          {activeTab === 'stations' && (
            <div>
              <h1 className='text-xl font-bold mb-6 text-blue-600'>
                All Stations
              </h1>

              <div className='grid sm:grid-cols-2 lg:grid-cols-3 gap-6'>
                {stations.map((s) => (
                  <div
                    key={s.id}
                    className='p-4 border rounded-lg shadow-sm bg-white'
                  >
                    <h3 className='text-lg font-semibold'>{s.name}</h3>
                    <p className='text-gray-600'>{s.address}</p>
                    <p className='text-gray-600'>Capacity: {s.capacity}</p>
                    <Link
                      href={`/admin/stations/${s.id}`}
                      className='inline-block mt-3 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700'
                    >
                      Manage
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
