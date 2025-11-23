import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { userId, stationId, slotTime } = await req.json();

  if (!userId || !stationId || !slotTime) {
    return NextResponse.json({ error: 'Missing data' }, { status: 400 });
  }

  // Check if slot is already full
  const count = await prisma.booking.count({
    where: { stationId, slotTime: new Date(slotTime), status: 'PENDING' },
  });

  const station = await prisma.station.findUnique({ where: { id: stationId } });
  if (!station) return NextResponse.json({ error: 'Station not found' }, { status: 404 });

  if (count >= station.capacity) {
    return NextResponse.json({ error: 'Slot is full' }, { status: 400 });
  }

  const booking = await prisma.booking.create({
    data: { userId, stationId, slotTime: new Date(slotTime) },
  });

  return NextResponse.json(booking);
}
