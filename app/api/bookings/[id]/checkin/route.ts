import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const bookingId = params.id;
    const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
    if (!booking) return NextResponse.json({ error: "Not found" }, { status: 404 });

    if (booking.status !== "PENDING") {
      return NextResponse.json({ error: "Already processed" }, { status: 400 });
    }

    const now = new Date();
    const slotStart = new Date(booking.slotTime);
    const expiry = new Date(slotStart.getTime() + 10 * 60 * 1000);

    if (now > expiry) {
      await prisma.booking.update({ where: { id: bookingId }, data: { status: "EXPIRED" } });
      return NextResponse.json({ error: "Booking expired" }, { status: 400 });
    }

    const updated = await prisma.booking.update({
      where: { id: bookingId },
      data: { status: "COMPLETED" }
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
