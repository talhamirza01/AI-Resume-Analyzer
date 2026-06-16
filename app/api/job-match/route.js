import { NextResponse } from "next/server";
import { getOrCreateDbUser, checkAnalysisLimit, incrementAnalysisUsage } from "@/lib/auth";
import { matchJob } from "@/lib/openai";
import { extractTextFromPdf } from "@/lib/pdf";
import { prisma } from "@/lib/prisma";

export async function POST(request) {
  try {
    const user = await getOrCreateDbUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const limitCheck = await checkAnalysisLimit(user);
    if (!limitCheck.allowed) {
      return NextResponse.json({ error: limitCheck.reason }, { status: 403 });
    }

    const formData = await request.formData();
    const jobDescription = formData.get("jobDescription")?.toString().trim();
    const resumeTextInput = formData.get("resumeText")?.toString().trim();
    const resumeId = formData.get("resumeId")?.toString();
    const file = formData.get("file");

    if (!jobDescription) {
      return NextResponse.json({ error: "Job description is required" }, { status: 400 });
    }

    let resumeText = resumeTextInput || "";

    if (resumeId && !resumeText) {
      const resume = await prisma.resume.findFirst({
        where: { id: resumeId, userId: user.id },
      });
      if (resume) {
        resumeText = resume.content?.text || JSON.stringify(resume.content);
      }
    }

    if (file && file.size > 0) {
      const buffer = Buffer.from(await file.arrayBuffer());
      resumeText = await extractTextFromPdf(buffer);
    }

    if (!resumeText) {
      return NextResponse.json({ error: "Resume text is required" }, { status: 400 });
    }

    const matchResult = await matchJob(resumeText, jobDescription);

    const jobMatch = await prisma.jobMatch.create({
      data: {
        userId: user.id,
        resumeId: resumeId || null,
        jobDescription,
        matchScore: matchResult.atsScore,
        matchingSkills: matchResult.matchingSkills,
        missingKeywords: matchResult.missingKeywords,
        improvements: matchResult.improvements,
      },
    });

    await incrementAnalysisUsage(user.id);

    return NextResponse.json({
      success: true,
      match: {
        matchScore: matchResult.atsScore,
        ...matchResult,
      },
      jobMatchId: jobMatch.id,
    });
  } catch (error) {
    console.error("Job match error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to match job" },
      { status: 500 }
    );
  }
}
