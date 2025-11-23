import prisma from '@/lib/prisma';
import Navbar from '../../components/Navbar';
import StationCard from '@/components/StationCard';

export default async function StationList() {
  const stations = await prisma.station.findMany({ take: 50 });

  return (
    <div>
      <Navbar />
      <main className='container py-12'>
        <h1 className='text-2xl font-bold mb-6'>Nearby Stations</h1>

        <div className='grid sm:grid-cols-2 lg:grid-cols-3 gap-6'>
          {stations.map((s) => (
            <StationCard key={s.id} station={s} />
          ))}
        </div>
      </main>
    </div>
  );
}
