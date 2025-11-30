// app/api/admin/bookings/route.ts
import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const clerkUser = await currentUser();
    if (!clerkUser) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: clerkUser.id },
      include: { stations: true }, // ❗ FETCH stations admin manages
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // ❗ Get all stations this admin manages
    const stationIds = user.stations.map((s) => s.id);

    console.log("Admin manages stations:", stationIds);

    // ❗ Fetch bookings for only those stations
    const bookings = await prisma.booking.findMany({
      where: {
        stationId: { in: stationIds },
      },
      include: {
        user: true,
        station: true,
      },
      orderBy: { slotTime: "asc" },
    });

    return NextResponse.json({ bookings });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
