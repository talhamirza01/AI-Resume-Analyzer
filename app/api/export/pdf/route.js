import { NextResponse } from "next/server";
import { getOrCreateDbUser } from "@/lib/auth";
import { generateResumePdf, resumeToHtml, analysisToHtml } from "@/lib/pdf";
import { prisma } from "@/lib/prisma";

export async function POST(request) {
  try {
    const user = await getOrCreateDbUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { resumeId, content } = await request.json();
    let resumeContent = content;

    if (resumeId && !resumeContent) {
      const resume = await prisma.resume.findFirst({
        where: { id: resumeId, userId: user.id },
      });
      if (!resume) {
        return NextResponse.json({ error: "Resume not found" }, { status: 404 });
      }
      resumeContent = resume.content;
    }

    if (!resumeContent) {
      return NextResponse.json({ error: "Resume content is required" }, { status: 400 });
    }

    const html = resumeToHtml(resumeContent);
    const pdfBuffer = await generateResumePdf(html);

    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="resume.pdf"',
      },
    });
  } catch (error) {
    console.error("Export PDF error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to export PDF" },
      { status: 500 }
    );
  }
}
