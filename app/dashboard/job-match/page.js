"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Target } from "lucide-react";
import { Navbar } from "@/components/dashboard/navbar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { AnalysisResults } from "@/components/analysis/analysis-results";
import { AtsScoreCircle } from "@/components/analysis/ats-score-circle";
import { LoadingOverlay } from "@/components/ui/loading";

export default function JobMatchPage() {
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [match, setMatch] = useState(null);
  const [resumes, setResumes] = useState([]);
  const [selectedResumeId, setSelectedResumeId] = useState("");

  useEffect(() => {
    fetch("/api/resumes")
      .then((res) => res.json())
      .then((data) => setResumes(data.resumes || []));
  }, []);

  async function handleMatch() {
    if (!jobDescription.trim()) {
      toast.error("Please paste a job description");
      return;
    }
    if (!resumeText.trim() && !selectedResumeId) {
      toast.error("Please provide resume text or select a saved resume");
      return;
    }

    setLoading(true);
    setMatch(null);

    try {
      const formData = new FormData();
      formData.append("jobDescription", jobDescription);
      if (resumeText.trim()) formData.append("resumeText", resumeText);
      if (selectedResumeId) formData.append("resumeId", selectedResumeId);

      const res = await fetch("/api/job-match", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setMatch(data.match);
      toast.success(`Match score: ${data.match.matchScore}%`);
    } catch (err) {
      toast.error(err.message || "Job match failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <Navbar
        title="Job Match"
        description="Compare your resume against a job description"
      />
      <div className="p-4 lg:p-8">
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-purple-500" />
                Compare Resume & Job
              </CardTitle>
              <CardDescription>Paste your resume and target job description</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {resumes.length > 0 && (
                <div>
                  <Label>Or select saved resume</Label>
                  <select
                    className="mt-1 flex h-10 w-full rounded-xl border border-white/10 bg-white/5 px-3 text-sm"
                    value={selectedResumeId}
                    onChange={(e) => setSelectedResumeId(e.target.value)}
                  >
                    <option value="">Select a resume...</option>
                    {resumes.map((r) => (
                      <option key={r.id} value={r.id}>{r.title}</option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <Label>Resume Text</Label>
                <Textarea
                  className="mt-1"
                  rows={8}
                  placeholder="Paste your resume content..."
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                />
              </div>

              <div>
                <Label>Job Description</Label>
                <Textarea
                  className="mt-1"
                  rows={8}
                  placeholder="Paste the full job description..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                />
              </div>

              <Button onClick={handleMatch} disabled={loading} className="w-full">
                {loading ? "Matching..." : "Calculate Match Score"}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Match Results</CardTitle>
              <CardDescription>How well your resume fits this role</CardDescription>
            </CardHeader>
            <CardContent>
              {loading && <LoadingOverlay message="Comparing resume with job..." />}
              {!loading && !match && (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <Target className="h-12 w-12 text-slate-300 mb-4" />
                  <p className="text-sm text-slate-500">
                    Enter resume and job description to see match percentage
                  </p>
                </div>
              )}
              {!loading && match && (
                <div className="space-y-6">
                  <div className="flex justify-center">
                    <AtsScoreCircle score={match.matchScore || match.atsScore} label="Match Score" />
                  </div>
                  <AnalysisResults analysis={match} showInterviewQuestions={false} />
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
