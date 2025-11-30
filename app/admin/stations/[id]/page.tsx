'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';

interface Booking {
  id: string;
  user: { name: string };
  slotTime: string;
  status: string;
}

interface Station {
  id: string;
  name: string;
  address: string;
  capacity: number;
}

export default function ManageStation() {
  const params = useParams();
  const stationId = params?.id; // safe optional chaining

  //console.log('API params:', params);
  //console.log(stationId);

  const [station, setStation] = useState<Station | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const resStation = await fetch(`/api/admin/stations/${stationId}`);
        const stationData = await resStation.json();

        if (!resStation.ok) throw new Error(stationData.error);

        setStation(stationData.station);
      } catch (err: any) {
        toast.error(err.message);
      } finally {
        setLoading(false); // ← VERY IMPORTANT
      }
    }

    if (stationId) fetchData();
  }, [stationId]);

  if (loading) return <p className='p-6'>Loading station info...</p>;
  if (!station) return <p className='p-6 text-red-600'>Station not found</p>;

  return (
    <div className='p-6'>
      <Toaster position='top-right' />

      <h1 className='text-2xl font-bold mb-4 text-blue-600'>
        Manage Station: {station.name}
      </h1>
      <p className='mb-2'>Address: {station.address}</p>
      <p className='mb-4'>Capacity: {station.capacity}</p>

      <h2 className='text-xl font-semibold mb-2'>Bookings</h2>
      {bookings.length === 0 ? (
        <p>No bookings yet for this station.</p>
      ) : (
        <div className='overflow-x-auto bg-white rounded shadow p-4'>
          <table className='min-w-full divide-y divide-gray-200 text-center'>
            <thead className='bg-gray-50'>
              <tr>
                <th className='px-4 py-2'>User</th>
                <th className='px-4 py-2'>Slot Time</th>
                <th className='px-4 py-2'>Status</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-200'>
              {bookings.map((b) => (
                <tr key={b.id}>
                  <td className='px-4 py-2'>{b.user.name}</td>
                  <td className='px-4 py-2'>
                    {new Date(b.slotTime).toLocaleString()}
                  </td>
                  <td className='px-4 py-2'>{b.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
