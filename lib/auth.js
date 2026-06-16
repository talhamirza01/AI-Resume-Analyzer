import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "./prisma";

export async function getAuthUser() {
  const { userId } = await auth();
  if (!userId) return null;
  return userId;
}

export async function requireAuth() {
  const userId = await getAuthUser();
  if (!userId) {
    throw new Error("Unauthorized");
  }
  return userId;
}

export async function getOrCreateDbUser() {
  const clerkUser = await currentUser();
  if (!clerkUser) return null;

  const email = clerkUser.emailAddresses[0]?.emailAddress;
  if (!email) return null;

  let user = await prisma.user.findUnique({
    where: { clerkId: clerkUser.id },
    include: { subscription: true },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        clerkId: clerkUser.id,
        email,
        name: clerkUser.fullName || clerkUser.firstName || "User",
        imageUrl: clerkUser.imageUrl,
        subscription: {
          create: {
            plan: "FREE",
            analysesUsed: 0,
            analysisLimit: 5,
          },
        },
      },
      include: { subscription: true },
    });
  }

  return user;
}

export async function checkAnalysisLimit(user) {
  if (!user?.subscription) return { allowed: false, reason: "No subscription" };

  const { plan, analysesUsed, analysisLimit } = user.subscription;

  if (plan === "PRO") {
    return { allowed: true };
  }

  if (analysesUsed >= analysisLimit) {
    return {
      allowed: false,
      reason: `Free plan limit reached (${analysisLimit} analyses). Upgrade to Pro for unlimited access.`,
    };
  }

  return { allowed: true };
}

export async function incrementAnalysisUsage(userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { subscription: true },
  });

  if (user?.subscription?.plan === "FREE") {
    await prisma.subscription.update({
      where: { userId },
      data: { analysesUsed: { increment: 1 } },
    });
  }
}
