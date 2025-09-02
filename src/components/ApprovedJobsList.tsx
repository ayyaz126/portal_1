// src/components/ApprovedJobsList.tsx
import { useEffect, useState } from "react";
import { getApprovedJobs } from "../services/adminService";

interface ApprovedJob {
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

const ApprovedJobsList = () => {
  const [approvedJobs, setApprovedJobs] = useState<ApprovedJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchApprovedJobs();
  }, []);

  const fetchApprovedJobs = async () => {
    try {
      setLoading(true);
      const data = await getApprovedJobs();
      setApprovedJobs(data.jobs || []);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch approved jobs:", err);
      setError("Failed to load approved jobs ❌");
      setApprovedJobs([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          Loading approved jobs...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <p className="text-red-500 text-lg mb-4">{error}</p>
        <button
          onClick={fetchApprovedJobs}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Approved Jobs</h2>

      {approvedJobs.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 text-lg">No approved jobs found.</p>
          <p className="text-gray-400">Jobs will appear here after approval.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {approvedJobs.map((job) => (
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
                <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                  ✅ Approved
                </span>
              </div>

              <p className="text-gray-700 mb-4">{job.description}</p>

              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  Posted on: {new Date(job.created_at).toLocaleDateString()}
                </div>

                <div className="text-sm text-gray-500">Job ID: {job.id}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ApprovedJobsList;

