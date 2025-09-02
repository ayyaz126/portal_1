// src/components/PendingJobsList.tsx
import { useEffect, useState } from "react";
import { getUnapprovedJobs } from "../services/adminService";
import { approveJob } from "../services/adminService";
import toast from "react-hot-toast";

interface PendingJob {
  id: number;
  title: string;
  description: string;
  company: string;
  location: string;
  created_at: string;
  user_id: number;
  is_approved: boolean;
  status: string;
}

const PendingJobsList = () => {
  const [pendingJobs, setPendingJobs] = useState<PendingJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPendingJobs();
  }, []);

  const fetchPendingJobs = async () => {
    try {
      setLoading(true);
      // ✅ Using the new backend endpoint for unapproved jobs
      const data = await getUnapprovedJobs();
      setPendingJobs(data.jobs || []);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch unapproved jobs:", err);
      setError("Failed to load unapproved jobs ❌");
      setPendingJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (jobId: number) => {
    try {
      await approveJob(jobId);
      toast.success("Job approved successfully! ✅");
      // Remove approved job from list
      setPendingJobs((prev) => prev.filter((job) => job.id !== jobId));
    } catch (err) {
      console.error("Failed to approve job:", err);
      toast.error("Failed to approve job ❌");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          Loading unapproved jobs...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <p className="text-red-500 text-lg mb-4">{error}</p>
        <button
          onClick={fetchPendingJobs}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">
        Unapproved Jobs (Pending Approval)
      </h2>

      {pendingJobs.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 text-lg">No unapproved jobs found.</p>
          <p className="text-gray-400">
            All jobs have been reviewed and approved.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {pendingJobs.map((job) => (
            <div
              key={job.id}
              className="bg-white p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {job.title}
                  </h3>
                  <p className="text-gray-600 mt-1">
                    {job.company} — {job.location}
                  </p>
                </div>
                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm rounded-full">
                  ⏳ Pending Approval
                </span>
              </div>

              <p className="text-gray-700 mb-4">{job.description}</p>

              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  Posted on: {new Date(job.created_at).toLocaleDateString()}
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => handleApprove(job.id)}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    ✅ Approve Job
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PendingJobsList;
