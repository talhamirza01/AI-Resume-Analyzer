"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Copy, Download, Mail } from "lucide-react";
import { Navbar } from "@/components/dashboard/navbar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { LoadingOverlay } from "@/components/ui/loading";
import { Badge } from "@/components/ui/badge";

export default function CoverLetterPage() {
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [loading, setLoading] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");
  const [plan, setPlan] = useState("FREE");

  useEffect(() => {
    fetch("/api/dashboard")
      .then((res) => res.json())
      .then((data) => setPlan(data?.subscription?.plan || "FREE"));
  }, []);

  async function handleGenerate() {
    if (!resumeText.trim() || !jobDescription.trim()) {
      toast.error("Resume text and job description are required");
      return;
    }

    setLoading(true);
    setCoverLetter("");

    try {
      const res = await fetch("/api/cover-letter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText, jobDescription, jobTitle, companyName }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setCoverLetter(data.content);
      toast.success("Cover letter generated!");
    } catch (err) {
      toast.error(err.message || "Generation failed");
    } finally {
      setLoading(false);
    }
  }

  function copyToClipboard() {
    navigator.clipboard.writeText(coverLetter);
    toast.success("Copied to clipboard!");
  }

  function downloadText() {
    const blob = new Blob([coverLetter], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "cover-letter.txt";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div>
      <Navbar
        title="Cover Letter Generator"
        description="AI-generated professional cover letters tailored to your target role"
      />
      <div className="p-4 lg:p-8">
        {plan === "FREE" && (
          <Card className="mb-6 border-amber-500/20 bg-amber-500/5">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <Badge variant="warning">Pro Feature</Badge>
                <p className="text-sm mt-1 text-slate-500">
                  Cover letter generation requires a Pro plan. Upgrade in Settings to unlock.
                </p>
              </div>
              <Button size="sm" asChild>
                <a href="/dashboard/settings">Upgrade</a>
              </Button>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-blue-500" />
                Generate Cover Letter
              </CardTitle>
              <CardDescription>Provide your resume and job details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label>Job Title</Label>
                  <Input className="mt-1" placeholder="Software Engineer" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} />
                </div>
                <div>
                  <Label>Company Name</Label>
                  <Input className="mt-1" placeholder="Acme Corp" value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
                </div>
              </div>
              <div>
                <Label>Resume Text</Label>
                <Textarea className="mt-1" rows={6} placeholder="Paste your resume..." value={resumeText} onChange={(e) => setResumeText(e.target.value)} />
              </div>
              <div>
                <Label>Job Description</Label>
                <Textarea className="mt-1" rows={6} placeholder="Paste job description..." value={jobDescription} onChange={(e) => setJobDescription(e.target.value)} />
              </div>
              <Button onClick={handleGenerate} disabled={loading || plan === "FREE"} className="w-full">
                {loading ? "Generating..." : "Generate Cover Letter"}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Your Cover Letter</CardTitle>
                <CardDescription>Review, copy, or download</CardDescription>
              </div>
              {coverLetter && (
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={copyToClipboard}>
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={downloadText}>
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </CardHeader>
            <CardContent>
              {loading && <LoadingOverlay message="Writing your cover letter..." />}
              {!loading && !coverLetter && (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <Mail className="h-12 w-12 text-slate-300 mb-4" />
                  <p className="text-sm text-slate-500">
                    Fill in the details and generate your personalized cover letter
                  </p>
                </div>
              )}
              {!loading && coverLetter && (
                <div className="rounded-xl bg-white p-6 text-slate-800 text-sm leading-relaxed whitespace-pre-wrap shadow-inner min-h-[400px]">
                  {coverLetter}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
