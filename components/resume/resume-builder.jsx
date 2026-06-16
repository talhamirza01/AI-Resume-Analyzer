"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { toast } from "sonner";
import { Sparkles, Plus, Trash2, Save, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResumePreview } from "./resume-preview";
import { LoadingOverlay } from "@/components/ui/loading";

const defaultValues = {
  title: "My Resume",
  personal: {
    fullName: "",
    email: "",
    phone: "",
    location: "",
    linkedin: "",
  },
  summary: "",
  experience: [{ title: "", company: "", location: "", dates: "", description: "", bullets: [""] }],
  education: [{ degree: "", school: "", dates: "" }],
  skills: [""],
  projects: [{ name: "", description: "", technologies: [""] }],
};

export function ResumeBuilder() {
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("personal");

  const { register, control, handleSubmit, watch, setValue, getValues } = useForm({
    defaultValues,
  });

  const {
    fields: expFields,
    append: appendExp,
    remove: removeExp,
  } = useFieldArray({ control, name: "experience" });

  const {
    fields: eduFields,
    append: appendEdu,
    remove: removeEdu,
  } = useFieldArray({ control, name: "education" });

  const {
    fields: projectFields,
    append: appendProject,
    remove: removeProject,
  } = useFieldArray({ control, name: "projects" });

  const formData = watch();

  async function generateWithAI(section) {
    setAiLoading(true);
    try {
      const res = await fetch("/api/generate-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section, context: getValues() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      if (section === "summary") {
        setValue("summary", data.content);
      } else if (section === "experience") {
        const current = getValues("experience");
        const idx = current.length - 1;
        setValue(`experience.${idx}.description`, data.content);
      }
      toast.success("AI content generated!");
    } catch (err) {
      toast.error(err.message || "Failed to generate content");
    } finally {
      setAiLoading(false);
    }
  }

  async function onSave(data) {
    setLoading(true);
    try {
      const res = await fetch("/api/resumes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: data.title,
          content: data,
          isBuilder: true,
        }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error);
      toast.success("Resume saved successfully!");
      return result.resume;
    } catch (err) {
      toast.error(err.message || "Failed to save resume");
    } finally {
      setLoading(false);
    }
  }

  async function onExport(data) {
    setLoading(true);
    try {
      const saved = await onSave(data);
      const res = await fetch("/api/export/pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeId: saved?.id, content: data }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error);
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${data.personal.fullName || "resume"}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("PDF downloaded!");
    } catch (err) {
      toast.error(err.message || "Failed to export PDF");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Build Your Resume</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div>
              <Label htmlFor="title">Resume Title</Label>
              <Input id="title" {...register("title")} className="mt-1" />
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="w-full flex-wrap h-auto gap-1">
                <TabsTrigger value="personal">Personal</TabsTrigger>
                <TabsTrigger value="summary">Summary</TabsTrigger>
                <TabsTrigger value="experience">Experience</TabsTrigger>
                <TabsTrigger value="education">Education</TabsTrigger>
                <TabsTrigger value="skills">Skills</TabsTrigger>
                <TabsTrigger value="projects">Projects</TabsTrigger>
              </TabsList>

              <TabsContent value="personal" className="space-y-3 mt-4">
                {["fullName", "email", "phone", "location", "linkedin"].map((field) => (
                  <div key={field}>
                    <Label htmlFor={field}>{field.replace(/([A-Z])/g, " $1").trim()}</Label>
                    <Input
                      id={field}
                      {...register(`personal.${field}`)}
                      className="mt-1"
                      type={field === "email" ? "email" : "text"}
                    />
                  </div>
                ))}
              </TabsContent>

              <TabsContent value="summary" className="space-y-3 mt-4">
                <div className="flex justify-between items-center">
                  <Label>Professional Summary</Label>
                  <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    onClick={() => generateWithAI("summary")}
                    disabled={aiLoading}
                  >
                    <Sparkles className="h-4 w-4" />
                    AI Generate
                  </Button>
                </div>
                <Textarea {...register("summary")} rows={5} />
              </TabsContent>

              <TabsContent value="experience" className="space-y-4 mt-4">
                {expFields.map((field, index) => (
                  <div key={field.id} className="rounded-xl border border-white/10 p-4 space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Experience {index + 1}</span>
                      {expFields.length > 1 && (
                        <Button type="button" size="sm" variant="ghost" onClick={() => removeExp(index)}>
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      )}
                    </div>
                    {["title", "company", "location", "dates"].map((f) => (
                      <Input key={f} placeholder={f} {...register(`experience.${index}.${f}`)} />
                    ))}
                    <Textarea placeholder="Description" {...register(`experience.${index}.description`)} rows={3} />
                    <Button
                      type="button"
                      size="sm"
                      variant="secondary"
                      onClick={() => generateWithAI("experience")}
                      disabled={aiLoading}
                    >
                      <Sparkles className="h-4 w-4" /> AI Write Bullets
                    </Button>
                  </div>
                ))}
                <Button type="button" variant="outline" onClick={() => appendExp(defaultValues.experience[0])}>
                  <Plus className="h-4 w-4" /> Add Experience
                </Button>
              </TabsContent>

              <TabsContent value="education" className="space-y-4 mt-4">
                {eduFields.map((field, index) => (
                  <div key={field.id} className="rounded-xl border border-white/10 p-4 space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Education {index + 1}</span>
                      {eduFields.length > 1 && (
                        <Button type="button" size="sm" variant="ghost" onClick={() => removeEdu(index)}>
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      )}
                    </div>
                    <Input placeholder="Degree" {...register(`education.${index}.degree`)} />
                    <Input placeholder="School" {...register(`education.${index}.school`)} />
                    <Input placeholder="Dates" {...register(`education.${index}.dates`)} />
                  </div>
                ))}
                <Button type="button" variant="outline" onClick={() => appendEdu(defaultValues.education[0])}>
                  <Plus className="h-4 w-4" /> Add Education
                </Button>
              </TabsContent>

              <TabsContent value="skills" className="space-y-3 mt-4">
                <Label>Skills (one per line in preview)</Label>
                {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
                  <Input key={i} placeholder={`Skill ${i + 1}`} {...register(`skills.${i}`)} />
                ))}
              </TabsContent>

              <TabsContent value="projects" className="space-y-4 mt-4">
                {projectFields.map((field, index) => (
                  <div key={field.id} className="rounded-xl border border-white/10 p-4 space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Project {index + 1}</span>
                      {projectFields.length > 1 && (
                        <Button type="button" size="sm" variant="ghost" onClick={() => removeProject(index)}>
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      )}
                    </div>
                    <Input placeholder="Project name" {...register(`projects.${index}.name`)} />
                    <Textarea placeholder="Description" {...register(`projects.${index}.description`)} rows={2} />
                    <Input placeholder="Technologies (comma separated)" {...register(`projects.${index}.technologies.0`)} />
                  </div>
                ))}
                <Button type="button" variant="outline" onClick={() => appendProject(defaultValues.projects[0])}>
                  <Plus className="h-4 w-4" /> Add Project
                </Button>
              </TabsContent>
            </Tabs>

            <div className="flex gap-3 pt-4">
              <Button type="button" onClick={handleSubmit(onSave)} disabled={loading}>
                <Save className="h-4 w-4" /> Save
              </Button>
              <Button type="button" variant="secondary" onClick={handleSubmit(onExport)} disabled={loading}>
                <Download className="h-4 w-4" /> Export PDF
              </Button>
            </div>
          </form>
          {aiLoading && <LoadingOverlay message="Generating with AI..." />}
        </CardContent>
      </Card>

      <div className="lg:sticky lg:top-6 lg:self-start">
        <p className="text-sm font-medium text-slate-500 mb-3">Live Preview</p>
        <ResumePreview data={formData} />
      </div>
    </div>
  );
}
