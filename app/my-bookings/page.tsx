// app/my-bookings/page.tsx (Next.js 13 app router)
import { currentUser } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';
import Navbar from '@/components/Navbar';

export default async function MyBookings() {
  const clerkUser = await currentUser();
  if (!clerkUser)
    return <p className='p-8'>Please login to view your bookings.</p>;

  // Find the corresponding User in your database
  const dbUser = await prisma.user.findUnique({
    where: { clerkId: clerkUser.id },
  });

  if (!dbUser) return <p className='p-8'>User not found in the database.</p>;

  // Fetch bookings using the correct database user ID
  const bookings = await prisma.booking.findMany({
    where: { userId: dbUser.id },
    include: { station: true },
    orderBy: { slotTime: 'desc' },
  });

  // Split into upcoming and past bookings
  const now = new Date();
  const upcoming = bookings.filter((b) => b.slotTime > now);
  const past = bookings.filter((b) => b.slotTime <= now);

  return (
    <div className='min-h-screen bg-gray-100'>
      <Navbar />
      <main className='container mx-auto py-8'>
        <h1 className='text-3xl font-bold mb-6'>My Bookings</h1>

        {/* Upcoming Bookings */}
        <section className='mb-8'>
          <h2 className='text-2xl font-semibold mb-4'>Upcoming Bookings</h2>
          {upcoming.length === 0 ? (
            <p>No upcoming bookings.</p>
          ) : (
            <div className='grid md:grid-cols-2 gap-4'>
              {upcoming.map((b) => (
                <div key={b.id} className='p-4 bg-white rounded shadow'>
                  <p>
                    <strong>Station:</strong> {b.station?.name}
                  </p>
                  <p>
                    <strong>Slot:</strong>{' '}
                    {new Date(b.slotTime).toLocaleString()}
                  </p>
                  <p>
                    <strong>Status:</strong>{' '}
                    <span
                      className={`px-2 py-1 rounded text-white ${
                        b.status === 'PENDING'
                          ? 'bg-yellow-500'
                          : b.status === 'COMPLETED'
                          ? 'bg-green-500'
                          : 'bg-red-500'
                      }`}
                    >
                      {b.status}
                    </span>
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Past Bookings */}
        <section>
          <h2 className='text-2xl font-semibold mb-4'>Past Bookings</h2>
          {past.length === 0 ? (
            <p>No past bookings.</p>
          ) : (
            <div className='overflow-x-auto'>
              <table className='w-full bg-white rounded shadow'>
                <thead className='bg-gray-200'>
                  <tr>
                    <th className='p-2 text-left'>Station</th>
                    <th className='p-2 text-left'>Slot</th>
                    <th className='p-2 text-left'>Status</th>
                    <th className='p-2 text-left'>Booked At</th>
                  </tr>
                </thead>
                <tbody>
                  {past.map((b) => (
                    <tr key={b.id} className='border-b'>
                      <td className='p-2'>{b.station?.name}</td>
                      <td className='p-2'>
                        {new Date(b.slotTime).toLocaleString()}
                      </td>
                      <td className='p-2'>
                        <span
                          className={`px-2 py-1 rounded text-white ${
                            b.status === 'PENDING'
                              ? 'bg-yellow-500'
                              : b.status === 'COMPLETED'
                              ? 'bg-green-500'
                              : 'bg-red-500'
                          }`}
                        >
                          {b.status}
                        </span>
                      </td>
                      <td className='p-2'>
                        {new Date(b.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
