import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const clerkUser = await currentUser();
    if (!clerkUser) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    const admin = await prisma.user.findUnique({
      where: { clerkId: clerkUser.id },
      include: { stations: true },
    });

    if (!admin) return NextResponse.json({ error: "Admin not found" }, { status: 404 });

    const stationIds = admin.stations.map((s) => s.id);
    console.log("Admin stations:", stationIds);


    const whereClause =
      admin.role === "SUPER_ADMIN" ? {} : { stationId: { in: stationIds } };

    const bookings = await prisma.booking.findMany({
      where: whereClause,
      include: { user: true, station: true },
      orderBy: { slotTime: "asc" },
    });

    return NextResponse.json({ bookings });
  } catch (err) {
    console.error("Error fetching bookings:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
