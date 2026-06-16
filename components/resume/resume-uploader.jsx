"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import { Upload, FileText, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { AnalysisResults } from "@/components/analysis/analysis-results";
import { LoadingOverlay } from "@/components/ui/loading";
import { cn } from "@/lib/utils";

export function ResumeUploader({ onAnalysisComplete, showJobDescription = false }) {
  const [file, setFile] = useState(null);
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [analysisId, setAnalysisId] = useState(null);

  const onDrop = useCallback((acceptedFiles) => {
    const pdf = acceptedFiles[0];
    if (pdf) {
      if (pdf.type !== "application/pdf") {
        toast.error("Please upload a PDF file");
        return;
      }
      setFile(pdf);
      setAnalysis(null);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    maxFiles: 1,
  });

  async function handleAnalyze() {
    if (!file && !resumeText.trim()) {
      toast.error("Please upload a PDF or paste resume text");
      return;
    }

    setLoading(true);
    setAnalysis(null);

    try {
      const formData = new FormData();
      if (file) formData.append("file", file);
      if (resumeText.trim()) formData.append("resumeText", resumeText.trim());
      if (jobDescription.trim()) formData.append("jobDescription", jobDescription.trim());

      const res = await fetch("/api/analyze", { method: "POST", body: formData });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      setAnalysis(data.analysis);
      setAnalysisId(data.analysisId);
      onAnalysisComplete?.(data);
      toast.success("Analysis complete!");
    } catch (err) {
      toast.error(err.message || "Analysis failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleExportReport() {
    if (!analysis) return;
    try {
      const res = await fetch("/api/export/analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ analysis, analysisId }),
      });
      if (!res.ok) throw new Error("Export failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "resume-analysis-report.pdf";
      a.click();
      URL.revokeObjectURL(url);
      toast.success("Report downloaded!");
    } catch {
      toast.error("Failed to export report");
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Upload Resume</CardTitle>
            <CardDescription>Upload a PDF or paste your resume text</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div
              {...getRootProps()}
              className={cn(
                "flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 transition-colors",
                isDragActive
                  ? "border-blue-500 bg-blue-500/10"
                  : "border-white/20 bg-white/5 hover:border-blue-500/50"
              )}
            >
              <input {...getInputProps()} />
              <Upload className="h-10 w-10 text-blue-500 mb-3" />
              <p className="text-sm font-medium">
                {isDragActive ? "Drop your PDF here" : "Drag & drop your resume PDF"}
              </p>
              <p className="text-xs text-slate-500 mt-1">or click to browse</p>
            </div>

            {file && (
              <div className="flex items-center justify-between rounded-xl bg-white/5 border border-white/10 p-3">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-500" />
                  <span className="text-sm truncate max-w-[200px]">{file.name}</span>
                </div>
                <Button type="button" size="sm" variant="ghost" onClick={() => setFile(null)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}

            <div>
              <Label>Or paste resume text</Label>
              <Textarea
                className="mt-1"
                rows={6}
                placeholder="Paste your resume content here..."
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
              />
            </div>

            {showJobDescription && (
              <div>
                <Label>Job Description (optional)</Label>
                <Textarea
                  className="mt-1"
                  rows={4}
                  placeholder="Paste job description for targeted analysis..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                />
              </div>
            )}

            <Button onClick={handleAnalyze} disabled={loading} className="w-full">
              {loading ? "Analyzing..." : "Analyze Resume"}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Analysis Results</CardTitle>
            <CardDescription>AI-powered ATS scoring and suggestions</CardDescription>
          </CardHeader>
          <CardContent>
            {loading && <LoadingOverlay />}
            {!loading && !analysis && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <FileText className="h-12 w-12 text-slate-300 mb-4" />
                <p className="text-sm text-slate-500">
                  Upload a resume to see your ATS score and improvement suggestions
                </p>
              </div>
            )}
            {!loading && analysis && (
              <div className="space-y-4">
                <AnalysisResults analysis={analysis} />
                <Button variant="secondary" onClick={handleExportReport} className="w-full">
                  Download Analysis Report (PDF)
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
