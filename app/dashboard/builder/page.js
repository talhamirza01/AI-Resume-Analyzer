import { Navbar } from "@/components/dashboard/navbar";
import { ResumeBuilder } from "@/components/resume/resume-builder";

export default function BuilderPage() {
  return (
    <div>
      <Navbar
        title="Resume Builder"
        description="Create a professional resume step-by-step with AI assistance"
      />
      <div className="p-4 lg:p-8">
        <ResumeBuilder />
      </div>
    </div>
  );
}
