import { NextResponse } from "next/server";
import { getOrCreateDbUser } from "@/lib/auth";
import { generateResumePdf, analysisToHtml } from "@/lib/pdf";
import { prisma } from "@/lib/prisma";

export async function POST(request) {
  try {
    const user = await getOrCreateDbUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { analysis, analysisId } = await request.json();
    let analysisData = analysis;

    if (analysisId && !analysisData) {
      const saved = await prisma.resumeAnalysis.findFirst({
        where: { id: analysisId, userId: user.id },
        include: { resume: { select: { title: true } } },
      });
      if (!saved) {
        return NextResponse.json({ error: "Analysis not found" }, { status: 404 });
      }
      analysisData = {
        atsScore: saved.atsScore,
        strengths: saved.strengths,
        weaknesses: saved.weaknesses,
        missingKeywords: saved.missingKeywords,
        matchingSkills: saved.matchingSkills,
        improvements: saved.improvements,
        careerSuggestions: saved.careerSuggestions,
        interviewQuestions: saved.interviewQuestions,
      };
    }

    if (!analysisData) {
      return NextResponse.json({ error: "Analysis data is required" }, { status: 400 });
    }

    const html = analysisToHtml(analysisData);
    const pdfBuffer = await generateResumePdf(html);

    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="analysis-report.pdf"',
      },
    });
  } catch (error) {
    console.error("Export analysis error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to export analysis" },
      { status: 500 }
    );
  }
}
