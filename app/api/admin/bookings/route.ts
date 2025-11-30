import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const clerkUser = await currentUser();
    if (!clerkUser)
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    const user = await prisma.user.findUnique({
      where: { clerkId: clerkUser.id },
      include: { stations: true },
    });

    if (!user)
      return NextResponse.json({ error: "User not found" }, { status: 404 });

    // SUPER ADMIN → return all bookings
    if (user.role === "SUPER_ADMIN") {
      const allBookings = await prisma.booking.findMany({
        include: { user: true, station: true },
        orderBy: { slotTime: "asc" },
      });

      return NextResponse.json({ bookings: allBookings });
    }

    // Normal admin must manage stations
    if (user.stations.length === 0) {
      return NextResponse.json({ bookings: [] });
    }

    const { searchParams } = new URL(req.url);
    const stationId = searchParams.get("stationId");

    let whereCondition: any = {};

    if (stationId) {
      // Only allow if admin owns that station
      if (!user.stations.some((s) => s.id === stationId)) {
        return NextResponse.json(
          { error: "Unauthorized for this station" },
          { status: 403 }
        );
      }

      whereCondition.stationId = stationId;
    } else {
      // get bookings for all stations admin manages
      whereCondition.stationId = { in: user.stations.map((s) => s.id) };
    }

    const bookings = await prisma.booking.findMany({
      where: whereCondition,
      include: { user: true, station: true },
      orderBy: { slotTime: "asc" },
    });

    return NextResponse.json({ bookings });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
