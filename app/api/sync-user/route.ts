import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export async function POST() {
  const clerkUser = await currentUser();
  if (!clerkUser)
    return new Response(JSON.stringify({ error: "Not authenticated" }), { status: 401 });

  let user = await prisma.user.findUnique({
    where: { clerkId: clerkUser.id },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        clerkId: clerkUser.id,
        name: clerkUser.fullName,
        email: clerkUser.emailAddresses[0].emailAddress,
        role: "DRIVER", // default role for new users
      },
    });
  }

  return new Response(JSON.stringify({ success: true, user }));
}
