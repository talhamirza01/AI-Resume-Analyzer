import { NextResponse } from "next/server";
import { getOrCreateDbUser, checkAnalysisLimit, incrementAnalysisUsage } from "@/lib/auth";
import { analyzeResume } from "@/lib/openai";
import { extractTextFromPdf } from "@/lib/pdf";
import { uploadResume } from "@/lib/cloudinary";
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
    const file = formData.get("file");
    const pastedText = formData.get("resumeText");
    const jobDescription = formData.get("jobDescription");

    let resumeText = pastedText?.toString().trim() || "";
    let pdfUrl = null;
    let cloudinaryId = null;

    if (file && file.size > 0) {
      const buffer = Buffer.from(await file.arrayBuffer());

      if (buffer.length > 10 * 1024 * 1024) {
        return NextResponse.json({ error: "File too large (max 10MB)" }, { status: 400 });
      }

      const extracted = await extractTextFromPdf(buffer);
      if (extracted) resumeText = extracted;

      if (process.env.CLOUDINARY_CLOUD_NAME) {
        try {
          const upload = await uploadResume(buffer, file.name, user.id);
          pdfUrl = upload.secure_url;
          cloudinaryId = upload.public_id;
        } catch (err) {
          console.error("Cloudinary upload failed:", err.message);
        }
      }
    }

    if (!resumeText) {
      return NextResponse.json(
        { error: "Could not extract text from resume. Paste text manually or upload a readable PDF." },
        { status: 400 }
      );
    }

    const analysis = await analyzeResume(
      resumeText,
      jobDescription?.toString() || null
    );

    const resume = await prisma.resume.create({
      data: {
        userId: user.id,
        title: file?.name?.replace(/\.pdf$/i, "") || "Uploaded Resume",
        content: { text: resumeText },
        pdfUrl,
        cloudinaryId,
        isBuilder: false,
      },
    });

    const savedAnalysis = await prisma.resumeAnalysis.create({
      data: {
        userId: user.id,
        resumeId: resume.id,
        resumeText,
        jobDescription: jobDescription?.toString() || null,
        atsScore: analysis.atsScore,
        strengths: analysis.strengths,
        weaknesses: analysis.weaknesses,
        missingKeywords: analysis.missingKeywords,
        matchingSkills: analysis.matchingSkills,
        improvements: analysis.improvements,
        careerSuggestions: analysis.careerSuggestions,
        interviewQuestions: analysis.interviewQuestions,
      },
    });

    await incrementAnalysisUsage(user.id);

    return NextResponse.json({
      success: true,
      analysis,
      analysisId: savedAnalysis.id,
      resumeId: resume.id,
    });
  } catch (error) {
    console.error("Analyze error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to analyze resume" },
      { status: 500 }
    );
  }
}
