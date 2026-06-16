import OpenAI from "openai";

function getOpenAI() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not configured");
  }

  const baseURL =
    process.env.OPENAI_BASE_URL ||
    (apiKey.startsWith("sk-or-v1")
      ? "https://openrouter.ai/api/v1"
      : undefined);

  return new OpenAI({
    apiKey,
    ...(baseURL ? { baseURL } : {}),
  });
}

export const AI_RESPONSE_SCHEMA = {
  atsScore: "number 0-100",
  strengths: "string[]",
  weaknesses: "string[]",
  missingKeywords: "string[]",
  matchingSkills: "string[]",
  improvements: "string[]",
  careerSuggestions: "string[]",
  interviewQuestions: "string[]",
};

const SYSTEM_PROMPT = `You are an expert ATS resume analyzer and career coach.
Always respond with valid JSON only, no markdown or extra text.
Use this exact structure:
{
  "atsScore": 85,
  "strengths": [],
  "weaknesses": [],
  "missingKeywords": [],
  "matchingSkills": [],
  "improvements": [],
  "careerSuggestions": [],
  "interviewQuestions": []
}`;

export async function analyzeResume(resumeText, jobDescription = null) {
  const userPrompt = jobDescription
    ? `Analyze this resume against the job description.

RESUME:
${resumeText}

JOB DESCRIPTION:
${jobDescription}

Provide ATS score, strengths, weaknesses, missing keywords, matching skills, improvements, career suggestions, and interview questions.`
    : `Analyze this resume for ATS compatibility and career readiness.

RESUME:
${resumeText}

Provide ATS score, strengths, weaknesses, missing keywords, matching skills, improvements, career suggestions, and interview questions.`;

  return callOpenAI(userPrompt);
}

export async function matchJob(resumeText, jobDescription) {
  const userPrompt = `Compare this resume with the job description and calculate match percentage.

RESUME:
${resumeText}

JOB DESCRIPTION:
${jobDescription}

Focus on matching skills, missing keywords, and improvements. Set atsScore as the job match percentage (0-100).`;

  return callOpenAI(userPrompt);
}

export async function generateResumeContent(section, context) {
  const openai = getOpenAI();
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "You are a professional resume writer. Generate concise, ATS-friendly resume content. Return plain text only, no markdown.",
      },
      {
        role: "user",
        content: `Generate ${section} content for a resume.\n\nContext:\n${JSON.stringify(context, null, 2)}`,
      },
    ],
    temperature: 0.7,
    max_tokens: 800,
  });

  return response.choices[0]?.message?.content?.trim() || "";
}

export async function generateFullResume(resumeData) {
  const openai = getOpenAI();
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "You are a professional resume writer. Rewrite and enhance the resume data into polished, ATS-optimized content. Return valid JSON with keys: summary, experience (array of {title, company, dates, bullets[]}), education (array), skills (string[]), projects (array of {name, description, technologies[]}).",
      },
      {
        role: "user",
        content: JSON.stringify(resumeData, null, 2),
      },
    ],
    response_format: { type: "json_object" },
    temperature: 0.7,
  });

  const content = response.choices[0]?.message?.content;
  return JSON.parse(content);
}

export async function generateCoverLetter({
  resumeText,
  jobDescription,
  jobTitle,
  companyName,
  tone = "professional",
}) {
  const openai = getOpenAI();
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `You are an expert cover letter writer. Write a compelling, ${tone} cover letter. Return plain text only.`,
      },
      {
        role: "user",
        content: `Write a cover letter for:
Job Title: ${jobTitle || "the position"}
Company: ${companyName || "the company"}

Resume:
${resumeText}

Job Description:
${jobDescription}`,
      },
    ],
    temperature: 0.7,
    max_tokens: 1200,
  });

  return response.choices[0]?.message?.content?.trim() || "";
}

async function callOpenAI(userPrompt) {
  const openai = getOpenAI();
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: userPrompt },
    ],
    response_format: { type: "json_object" },
    temperature: 0.5,
  });

  const content = response.choices[0]?.message?.content;
  const parsed = JSON.parse(content);

  return {
    atsScore: Math.min(100, Math.max(0, Number(parsed.atsScore) || 0)),
    strengths: parsed.strengths || [],
    weaknesses: parsed.weaknesses || [],
    missingKeywords: parsed.missingKeywords || [],
    matchingSkills: parsed.matchingSkills || [],
    improvements: parsed.improvements || [],
    careerSuggestions: parsed.careerSuggestions || [],
    interviewQuestions: parsed.interviewQuestions || [],
  };
}

export { getOpenAI };
