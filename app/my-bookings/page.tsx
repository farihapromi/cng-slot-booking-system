import prisma from '@/lib/prisma';
import Navbar from '../../components/Navbar';

export default async function MyBookings() {
  // NOTE: replace this with actual user lookup from auth when available
  const demoUserId = 'demo-user-id';
  const bookings = await prisma.booking.findMany({
    where: { userId: demoUserId },
    include: { station: true },
    orderBy: { slotTime: 'desc' },
  });

  return (
    <div>
      <Navbar />
      <main className='container py-8'>
        <h1 className='text-2xl font-bold mb-4'>My Bookings</h1>
        <div className='space-y-4'>
          {bookings.length === 0 && <p>No bookings yet.</p>}
          {bookings.map((b) => (
            <div key={b.id} className='p-4 bg-white rounded shadow'>
              <p>
                <strong>Station:</strong> {b.station?.name}
              </p>
              <p>
                <strong>Slot:</strong> {new Date(b.slotTime).toLocaleString()}
              </p>
              <p>
                <strong>Status:</strong> {b.status}
              </p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
