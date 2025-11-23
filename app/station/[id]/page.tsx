import prisma from '@/lib/prisma';
import BookingForm from '@/components/BookingForm';
import Navbar from '../../../components/Navbar';

export default async function StationPage({
  params,
}: {
  params: { id: string };
}) {
  const station = await prisma.station.findUnique({ where: { id: params.id } });
  if (!station)
    return (
      <div>
        <Navbar />
        <div className='container py-8'>Station not found</div>
      </div>
    );

  return (
    <div>
      <Navbar />
      <main className='container py-8'>
        <div className='bg-white p-6 rounded shadow'>
          <h1 className='text-2xl font-bold mb-2'>{station.name}</h1>
          <p className='text-gray-600 mb-4'>{station.address}</p>

          <div className='mt-6'>
            <BookingForm stationId={station.id} />
          </div>
        </div>
      </main>
    </div>
  );
}
