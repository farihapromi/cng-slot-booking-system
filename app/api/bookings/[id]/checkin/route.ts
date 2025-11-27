import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const user = await currentUser();
    if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    const bookingId = params.id;
    const body = await req.json();
    const { status } = body;

    if (!["PENDING", "COMPLETED", "CANCELLED"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    // Fetch booking
    const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
    if (!booking) return NextResponse.json({ error: "Booking not found" }, { status: 404 });

    // Fetch user from DB to get role and stationId
    const dbUser = await prisma.user.findUnique({ where: { clerkId: user.id } });
    if (!dbUser) return NextResponse.json({ error: "User not found" }, { status: 404 });

    // Authorization
    if (dbUser.role === "DRIVER") {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    // Admins can only update bookings for their station
    if (dbUser.role === "ADMIN" && dbUser.stationId !== booking.stationId) {
      return NextResponse.json({ error: "Not authorized for this station" }, { status: 403 });
    }

    // Update booking status
    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: { status },
    });

    return NextResponse.json({ success: true, booking: updatedBooking });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
