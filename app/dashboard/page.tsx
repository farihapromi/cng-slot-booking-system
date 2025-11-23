import prisma from '@/lib/prisma';
import Navbar from '../../components/Navbar';
import DashboardTable from '@/components/DashboardTable';

export default async function Dashboard() {
  const bookings = await prisma.booking.findMany({
    where: {},
    include: { user: true, station: true },
    orderBy: { slotTime: 'asc' },
    take: 100,
  });

  return (
    <div>
      <Navbar />
      <main className='container py-8'>
        <h1 className='text-2xl font-bold mb-6'>Admin Dashboard</h1>
        <DashboardTable data={bookings} />
      </main>
    </div>
  );
}
