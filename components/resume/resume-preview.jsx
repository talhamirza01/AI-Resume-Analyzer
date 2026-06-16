"use client";

import { cn } from "@/lib/utils";

export function ResumePreview({ data }) {
  const personal = data?.personal || {};
  const experience = data?.experience || [];
  const education = data?.education || [];
  const skills = data?.skills || [];
  const projects = data?.projects || [];

  return (
    <div className="rounded-2xl bg-white p-8 shadow-xl text-slate-800 min-h-[600px] text-sm leading-relaxed">
      <div className="border-b-2 border-blue-600 pb-4 mb-4">
        <h1 className="text-2xl font-bold text-blue-700">
          {personal.fullName || "Your Name"}
        </h1>
        <p className="text-slate-500 mt-1 text-xs">
          {[personal.email, personal.phone, personal.location, personal.linkedin]
            .filter(Boolean)
            .join(" • ")}
        </p>
      </div>

      {data?.summary && (
        <section className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-2">
            Summary
          </h2>
          <p className="text-slate-600">{data.summary}</p>
        </section>
      )}

      {experience.length > 0 && (
        <section className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-2">
            Experience
          </h2>
          {experience.map((exp, i) => (
            <div key={i} className="mb-3">
              <div className="flex justify-between font-semibold">
                <span>{exp.title}</span>
                <span className="text-slate-400 text-xs">{exp.dates}</span>
              </div>
              <p className="text-slate-500 text-xs">
                {exp.company}
                {exp.location ? ` • ${exp.location}` : ""}
              </p>
              {exp.description && <p className="mt-1 text-slate-600">{exp.description}</p>}
              {exp.bullets?.length > 0 && (
                <ul className="mt-1 list-disc pl-4 text-slate-600">
                  {exp.bullets.filter(Boolean).map((b, j) => (
                    <li key={j}>{b}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </section>
      )}

      {education.length > 0 && (
        <section className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-2">
            Education
          </h2>
          {education.map((edu, i) => (
            <div key={i} className="mb-2">
              <div className="flex justify-between font-semibold">
                <span>{edu.degree}</span>
                <span className="text-slate-400 text-xs">{edu.dates}</span>
              </div>
              <p className="text-slate-500 text-xs">{edu.school}</p>
            </div>
          ))}
        </section>
      )}

      {skills.length > 0 && (
        <section className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-2">
            Skills
          </h2>
          <div className="flex flex-wrap gap-1.5">
            {skills.filter(Boolean).map((skill, i) => (
              <span
                key={i}
                className={cn(
                  "rounded-md bg-blue-50 px-2 py-0.5 text-xs text-blue-700"
                )}
              >
                {skill}
              </span>
            ))}
          </div>
        </section>
      )}

      {projects.length > 0 && (
        <section>
          <h2 className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-2">
            Projects
          </h2>
          {projects.map((project, i) => (
            <div key={i} className="mb-3">
              <p className="font-semibold">{project.name}</p>
              <p className="text-slate-600">{project.description}</p>
              {project.technologies?.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1">
                  {project.technologies.filter(Boolean).map((t, j) => (
                    <span key={j} className="text-xs text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded">
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </section>
      )}
    </div>
  );
}
