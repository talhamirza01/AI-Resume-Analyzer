export async function extractTextFromPdf(buffer) {
  const { PDFParse } = await import("pdf-parse");
  const parser = new PDFParse({ data: buffer });

  try {
    const data = await parser.getText();
    return data.text?.trim() || "";
  } finally {
    await parser.destroy();
  }
}

export async function generateResumePdf(html) {
  const puppeteer = (await import("puppeteer")).default;
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });
    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "40px", bottom: "40px", left: "40px", right: "40px" },
    });
    return pdfBuffer;
  } finally {
    await browser.close();
  }
}

export function resumeToHtml(resume) {
  const content = resume.content || resume;
  const personal = content.personal || {};
  const experience = content.experience || [];
  const education = content.education || [];
  const skills = content.skills || [];
  const projects = content.projects || [];
  const summary = content.summary || "";

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', Arial, sans-serif; color: #1a1a2e; line-height: 1.5; font-size: 11pt; }
    .container { max-width: 700px; margin: 0 auto; }
    h1 { font-size: 24pt; color: #2563eb; margin-bottom: 4px; }
    .contact { color: #64748b; font-size: 10pt; margin-bottom: 16px; }
    h2 { font-size: 12pt; color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 4px; margin: 16px 0 8px; text-transform: uppercase; letter-spacing: 1px; }
    .item { margin-bottom: 12px; }
    .item-header { display: flex; justify-content: space-between; font-weight: 600; }
    .item-sub { color: #64748b; font-size: 10pt; }
    ul { padding-left: 18px; margin-top: 4px; }
    li { margin-bottom: 2px; }
    .skills { display: flex; flex-wrap: wrap; gap: 6px; }
    .skill { background: #eff6ff; color: #2563eb; padding: 2px 8px; border-radius: 4px; font-size: 10pt; }
    .summary { margin-bottom: 8px; color: #334155; }
  </style>
</head>
<body>
  <div class="container">
    <h1>${personal.fullName || "Your Name"}</h1>
    <div class="contact">
      ${[personal.email, personal.phone, personal.location, personal.linkedin].filter(Boolean).join(" • ")}
    </div>
    ${summary ? `<h2>Summary</h2><p class="summary">${summary}</p>` : ""}
    ${
      experience.length
        ? `<h2>Experience</h2>${experience
            .map(
              (exp) => `
      <div class="item">
        <div class="item-header"><span>${exp.title || ""}</span><span>${exp.dates || ""}</span></div>
        <div class="item-sub">${exp.company || ""}${exp.location ? ` • ${exp.location}` : ""}</div>
        ${exp.description ? `<p>${exp.description}</p>` : ""}
        ${exp.bullets?.length ? `<ul>${exp.bullets.map((b) => `<li>${b}</li>`).join("")}</ul>` : ""}
      </div>`,
            )
            .join("")}`
        : ""
    }
    ${
      education.length
        ? `<h2>Education</h2>${education
            .map(
              (edu) => `
      <div class="item">
        <div class="item-header"><span>${edu.degree || ""}</span><span>${edu.dates || ""}</span></div>
        <div class="item-sub">${edu.school || ""}</div>
      </div>`,
            )
            .join("")}`
        : ""
    }
    ${skills.length ? `<h2>Skills</h2><div class="skills">${skills.map((s) => `<span class="skill">${s}</span>`).join("")}</div>` : ""}
    ${
      projects.length
        ? `<h2>Projects</h2>${projects
            .map(
              (p) => `
      <div class="item">
        <div class="item-header"><span>${p.name || ""}</span></div>
        <p>${p.description || ""}</p>
        ${p.technologies?.length ? `<div class="skills">${p.technologies.map((t) => `<span class="skill">${t}</span>`).join("")}</div>` : ""}
      </div>`,
            )
            .join("")}`
        : ""
    }
  </div>
</body>
</html>`;
}

export function analysisToHtml(analysis, resumeTitle = "Resume Analysis") {
  const sections = [
    { title: "Strengths", items: analysis.strengths },
    { title: "Weaknesses", items: analysis.weaknesses },
    { title: "Missing Keywords", items: analysis.missingKeywords },
    { title: "Matching Skills", items: analysis.matchingSkills },
    { title: "Improvements", items: analysis.improvements },
    { title: "Career Suggestions", items: analysis.careerSuggestions },
    { title: "Interview Questions", items: analysis.interviewQuestions },
  ];

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; color: #1a1a2e; padding: 40px; line-height: 1.6; }
    h1 { color: #2563eb; }
    .score { font-size: 48px; font-weight: bold; color: #2563eb; margin: 20px 0; }
    h2 { color: #334155; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px; margin-top: 24px; }
    ul { padding-left: 20px; }
    li { margin-bottom: 6px; }
  </style>
</head>
<body>
  <h1>${resumeTitle} - AI Analysis Report</h1>
  <div class="score">ATS Score: ${analysis.atsScore}/100</div>
  ${sections.map((s) => (s.items?.length ? `<h2>${s.title}</h2><ul>${s.items.map((i) => `<li>${i}</li>`).join("")}</ul>` : "")).join("")}
</body>
</html>`;
}
