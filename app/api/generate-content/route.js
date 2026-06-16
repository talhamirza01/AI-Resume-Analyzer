import { NextResponse } from "next/server";
import { getOrCreateDbUser } from "@/lib/auth";
import { generateResumeContent } from "@/lib/openai";

export async function POST(request) {
  try {
    const user = await getOrCreateDbUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { section, context } = await request.json();

    if (!section) {
      return NextResponse.json({ error: "Section is required" }, { status: 400 });
    }

    const content = await generateResumeContent(section, context || {});

    return NextResponse.json({ success: true, content });
  } catch (error) {
    console.error("Generate content error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate content" },
      { status: 500 }
    );
  }
}
