import { NextResponse } from "next/server";
import { getOrCreateDbUser, checkAnalysisLimit, incrementAnalysisUsage } from "@/lib/auth";
import { generateCoverLetter } from "@/lib/openai";
import { prisma } from "@/lib/prisma";

export async function POST(request) {
  try {
    const user = await getOrCreateDbUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const subscription = user.subscription;
    if (subscription?.plan === "FREE") {
      return NextResponse.json(
        { error: "Cover letter generation is available on Pro plan. Upgrade in Settings." },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { resumeText, jobDescription, jobTitle, companyName, resumeId, tone } = body;

    if (!resumeText || !jobDescription) {
      return NextResponse.json(
        { error: "Resume text and job description are required" },
        { status: 400 }
      );
    }

    const content = await generateCoverLetter({
      resumeText,
      jobDescription,
      jobTitle,
      companyName,
      tone,
    });

    const coverLetter = await prisma.coverLetter.create({
      data: {
        userId: user.id,
        resumeId: resumeId || null,
        jobTitle,
        companyName,
        jobDescription,
        content,
      },
    });

    return NextResponse.json({
      success: true,
      coverLetter,
      content,
    });
  } catch (error) {
    console.error("Cover letter error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate cover letter" },
      { status: 500 }
    );
  }
}
