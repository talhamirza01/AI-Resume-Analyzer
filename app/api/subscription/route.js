import { NextResponse } from "next/server";
import { getOrCreateDbUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request) {
  try {
    const user = await getOrCreateDbUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { plan } = await request.json();

    if (!["FREE", "PRO"].includes(plan)) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    const subscription = await prisma.subscription.update({
      where: { userId: user.id },
      data: {
        plan,
        analysisLimit: plan === "PRO" ? 999999 : 5,
        analysesUsed: plan === "PRO" ? user.subscription?.analysesUsed || 0 : user.subscription?.analysesUsed || 0,
      },
    });

    return NextResponse.json({ success: true, subscription });
  } catch (error) {
    console.error("Subscription error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
