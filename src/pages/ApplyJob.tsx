// src/pages/ApplyJob.tsx
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { applicationService } from "../services/applicationService";
import toast from "react-hot-toast";

const ApplyJob = () => {
  const { id } = useParams<{ id: string }>();
  const jobId = Number(id);
  const navigate = useNavigate();

  const [resume, setResume] = useState<File | null>(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!resume) {
      toast.error("Please upload your resume 📄");
      return;
    }

    setLoading(true);
    try {
      await applicationService.applyJob(jobId, resume, coverLetter);
      toast.success("Applied successfully ✅");
      navigate(`/jobs/${jobId}`);
    } catch (err: unknown) {
      // ✅ Type-safe error handling
      const errorMessage =
        err instanceof Error ? err.message : "Failed to apply ❌";
      console.error(err);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4">Apply for Job</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Resume */}
        <div>
          <label className="block font-medium">Upload Resume</label>
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={(e) => setResume(e.target.files?.[0] || null)}
            className="mt-2 border p-2 rounded w-full"
          />
        </div>

        {/* Cover Letter */}
        <div>
          <label className="block font-medium">Cover Letter</label>
          <textarea
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
            className="mt-2 border p-2 rounded w-full"
            rows={5}
            placeholder="Write your cover letter..."
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {loading ? "Submitting..." : "Apply Now"}
        </button>
      </form>
    </div>
  );
};

export default ApplyJob;
