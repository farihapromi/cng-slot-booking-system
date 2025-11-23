import { auth, currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export async function POST() {
  const user = await currentUser();

  if (!user) return Response.json({ error: "Not authenticated" }, { status: 401 });

  // Check if exists
  const exists = await prisma.user.findUnique({
    where: { clerkId: user.id },
  });

  if (!exists) {
    await prisma.user.create({
      data: {
        clerkId: user.id,
        name: user.fullName,
        email: user.emailAddresses[0].emailAddress,
      },
    });
  }

  return Response.json({ success: true });
}
