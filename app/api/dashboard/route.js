import { NextResponse } from "next/server";
import { getOrCreateDbUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const user = await getOrCreateDbUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [analyses, jobMatches, coverLetters] = await Promise.all([
      prisma.resumeAnalysis.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
        take: 20,
        include: { resume: { select: { title: true } } },
      }),
      prisma.jobMatch.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
        take: 10,
      }),
      prisma.coverLetter.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
        take: 10,
      }),
    ]);

    const totalResumes = await prisma.resume.count({ where: { userId: user.id } });
    const totalAnalyses = await prisma.resumeAnalysis.count({ where: { userId: user.id } });
    const totalMatches = await prisma.jobMatch.count({ where: { userId: user.id } });

    const avgResult = await prisma.resumeAnalysis.aggregate({
      where: { userId: user.id },
      _avg: { atsScore: true },
    });

    return NextResponse.json({
      stats: {
        totalResumes,
        totalAnalyses,
        totalMatches,
        avgScore: Math.round(avgResult._avg.atsScore || 0),
      },
      analyses,
      jobMatches,
      coverLetters,
      subscription: user.subscription,
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
