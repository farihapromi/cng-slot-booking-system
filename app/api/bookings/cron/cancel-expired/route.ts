import prisma from "@/lib/prisma";

export async function GET() {
  const now = new Date();
  const expireBefore = new Date(now.getTime() - 10 * 60 * 1000);

  const result = await prisma.booking.updateMany({
    where: {
      status: "PENDING",
      slotTime: { lt: expireBefore }
    },
    data: { status: "EXPIRED" }
  });

  return new Response(JSON.stringify({ updated: result.count }), { status: 200 });
}
