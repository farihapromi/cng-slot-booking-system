import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { currentUser } from '@clerk/nextjs/server';

export async function GET({ params }: { params: { id: string } }) {
  try {
    const user = await currentUser();
    if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

    const dbUser = await prisma.user.findUnique({ where: { clerkId: user.id } });
    if (!dbUser) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    // Only admin can access
    if (dbUser.role !== 'ADMIN' && dbUser.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
    }

    const stationId = params.id;
    if (!stationId) {
      return NextResponse.json({ error: 'Station ID is required' }, { status: 400 });
    }

    const station = await prisma.station.findUnique({
      where: { id: stationId },
      include: { bookings: true },
    });

    if (!station) {
      return NextResponse.json({ error: 'Station not found' }, { status: 404 });
    }

    return NextResponse.json({ station });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
