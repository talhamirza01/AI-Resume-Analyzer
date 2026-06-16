import { Navbar } from "@/components/dashboard/navbar";
import { ResumeUploader } from "@/components/resume/resume-uploader";

export default function UploadPage() {
  return (
    <div>
      <Navbar
        title="Upload Resume"
        description="Upload your PDF resume for AI-powered ATS analysis"
      />
      <div className="p-4 lg:p-8">
        <ResumeUploader showJobDescription />
      </div>
    </div>
  );
}
