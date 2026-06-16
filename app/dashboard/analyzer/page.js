import { Navbar } from "@/components/dashboard/navbar";
import { ResumeUploader } from "@/components/resume/resume-uploader";

export default function AnalyzerPage() {
  return (
    <div>
      <Navbar
        title="Resume Analyzer"
        description="Deep ATS analysis with strengths, weaknesses, and improvement tips"
      />
      <div className="p-4 lg:p-8">
        <ResumeUploader showJobDescription />
      </div>
    </div>
  );
}
