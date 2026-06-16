import { NextResponse } from "next/server";
import { getOrCreateDbUser } from "@/lib/auth";
import { generateFullResume } from "@/lib/openai";
import { prisma } from "@/lib/prisma";

export async function POST(request) {
  try {
    const user = await getOrCreateDbUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { resumeData, title = "AI Generated Resume" } = body;

    if (!resumeData) {
      return NextResponse.json({ error: "Resume data is required" }, { status: 400 });
    }

    const generated = await generateFullResume(resumeData);

    const resume = await prisma.resume.create({
      data: {
        userId: user.id,
        title,
        content: { ...resumeData, ...generated },
        isBuilder: true,
      },
    });

    return NextResponse.json({
      success: true,
      resume,
      generated,
    });
  } catch (error) {
    console.error("Generate resume error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate resume" },
      { status: 500 }
    );
  }
}
