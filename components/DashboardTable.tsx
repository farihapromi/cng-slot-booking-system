'use client';
import React from 'react';

export default function DashboardTable({ data }: { data: any[] }) {
  return (
    <div className='overflow-x-auto bg-white rounded-lg shadow'>
      <table className='min-w-full divide-y'>
        <thead className='bg-gray-50'>
          <tr>
            <th className='px-4 py-2 text-left text-sm font-medium'>
              Slot Time
            </th>
            <th className='px-4 py-2 text-left text-sm font-medium'>User</th>
            <th className='px-4 py-2 text-left text-sm font-medium'>Station</th>
            <th className='px-4 py-2 text-left text-sm font-medium'>Status</th>
            <th className='px-4 py-2 text-left text-sm font-medium'>Action</th>
          </tr>
        </thead>
        <tbody className='divide-y'>
          {data.map((b) => (
            <tr key={b.id}>
              <td className='px-4 py-2 text-sm'>
                {new Date(b.slotTime).toLocaleString()}
              </td>
              <td className='px-4 py-2 text-sm'>
                {b.user?.phone || b.user?.name || b.userId}
              </td>
              <td className='px-4 py-2 text-sm'>{b.station?.name}</td>
              <td className='px-4 py-2 text-sm'>{b.status}</td>
              <td className='px-4 py-2 text-sm'>
                <form action={`/api/bookings/${b.id}/checkin`} method='post'>
                  <button
                    type='submit'
                    className='px-3 py-1 bg-green-600 text-white rounded'
                  >
                    Check-in
                  </button>
                </form>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
