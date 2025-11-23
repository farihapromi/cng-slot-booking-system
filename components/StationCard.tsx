import Link from 'next/link';

export default function StationCard({ station }: { station: any }) {
  return (
    <div className='p-4 border rounded-lg shadow-sm bg-white'>
      <h3 className='text-lg font-semibold'>{station.name}</h3>
      <p className='text-sm text-gray-600'>{station.address}</p>
      <div className='mt-3'>
        <Link
          href={`/station/${station.id}`}
          className='inline-block px-4 py-2 bg-blue-600 text-white rounded-md'
        >
          View & Book
        </Link>
      </div>
    </div>
  );
}
