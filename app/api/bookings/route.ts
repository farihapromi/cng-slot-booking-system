import prisma from '@/lib/prisma';
import { currentUser } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  const clerkUser = await currentUser();
  if (!clerkUser) return new Response(JSON.stringify({ error: "Not authenticated" }), { status: 401 });

  // Ensure user exists in PostgreSQL
  let user = await prisma.user.findUnique({ where: { clerkId: clerkUser.id } });
  if (!user) {
    user = await prisma.user.create({
      data: {
        clerkId: clerkUser.id,
        name: clerkUser.fullName,
        email: clerkUser.emailAddresses[0].emailAddress,
      },
    });
  }

  const { stationId, slotTime } = await req.json();

  if (!stationId || !slotTime) {
    return new Response(JSON.stringify({ error: "Missing data" }), { status: 400 });
  }

  // Check slot availability
  const count = await prisma.booking.count({
    where: { stationId, slotTime: new Date(slotTime), status: 'PENDING' },
  });

  const station = await prisma.station.findUnique({ where: { id: stationId } });
  if (!station) return new Response(JSON.stringify({ error: "Station not found" }), { status: 404 });

  if (count >= station.capacity) return new Response(JSON.stringify({ error: "Slot full" }), { status: 400 });

  // Create booking
  const booking = await prisma.booking.create({
    data: { userId: user.id, stationId, slotTime: new Date(slotTime) },
  });

  return new Response(JSON.stringify(booking), { status: 200 });
}
