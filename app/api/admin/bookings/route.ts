// app/api/admin/bookings/route.ts
import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const clerkUser = await currentUser();
    if (!clerkUser) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    const user = await prisma.user.findUnique({
      where: { clerkId: clerkUser.id },
      include: { stations: true } // include all stations admin manages
    });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    // Get bookings for all stations the admin manages
    const bookings = await prisma.booking.findMany({
      where: { stationId: { in: user.stations.map(s => s.id) } },
      include: { user: true, station: true },
      orderBy: { slotTime: "asc" }
    });

    return NextResponse.json({ bookings });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
