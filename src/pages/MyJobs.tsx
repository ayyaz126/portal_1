// src/pages/MyJobs.tsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { jobService } from "../services/jobService";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  description: string;
  created_at: string;
  is_approved: boolean;
  status: string;
  applications_count?: number;
}

const MyJobs = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const data = await jobService.getMyJobs();
      setJobs(data.jobs || []);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch jobs:", err);
      setError("Failed to load your jobs");
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteJob = async (jobId: number) => {
    if (!confirm("Are you sure you want to delete this job?")) {
      return;
    }

    try {
      await jobService.deleteJob(String(jobId));
      toast.success("Job deleted successfully! ✅");
      setJobs((prev) => prev.filter((job) => job.id !== jobId));
    } catch (err) {
      console.error("Failed to delete job:", err);
      toast.error("Failed to delete job ❌");
    }
  };

  const getStatusBadge = (status: string, isApproved: boolean) => {
    if (!isApproved) {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
          ⏳ Pending Approval
        </span>
      );
    }

    const statusConfig = {
      open: { color: "bg-green-100 text-green-800", icon: "✅", label: "Open" },
      closed: { color: "bg-red-100 text-red-800", icon: "❌", label: "Closed" },
      draft: { color: "bg-gray-100 text-gray-800", icon: "📝", label: "Draft" },
    };

    const config =
      statusConfig[status as keyof typeof statusConfig] || statusConfig["open"];
    return (
      <span
        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.color}`}
      >
        {config.icon} {config.label}
      </span>
    );
  };

  const getFilteredJobs = () => {
    if (filter === "all") return jobs;
    if (filter === "pending") return jobs.filter((job) => !job.is_approved);
    if (filter === "approved") return jobs.filter((job) => job.is_approved);
    return jobs.filter((job) => job.status === filter);
  };

  const getStatusCount = (status: string) => {
    if (status === "pending")
      return jobs.filter((job) => !job.is_approved).length;
    if (status === "approved")
      return jobs.filter((job) => job.is_approved).length;
    return jobs.filter((job) => job.status === status).length;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading your jobs...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center">
        <Card className="p-8 text-center shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
          <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Oops! Something went wrong
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button
            onClick={fetchJobs}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            Try Again
          </Button>
        </Card>
      </div>
    );
  }

  const filteredJobs = getFilteredJobs();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="text-center sm:text-left mb-4 sm:mb-0">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">My Jobs</h1>
              <p className="text-xl text-gray-600">
                Manage your posted job opportunities
              </p>
            </div>
            <Link
              to="/post-job"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              Post New Job
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 text-center shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {jobs.length}
            </div>
            <div className="text-gray-600">Total Jobs</div>
          </Card>
          <Card className="p-6 text-center shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <div className="text-3xl font-bold text-yellow-600 mb-2">
              {getStatusCount("pending")}
            </div>
            <div className="text-gray-600">Pending Approval</div>
          </Card>
          <Card className="p-6 text-center shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {getStatusCount("approved")}
            </div>
            <div className="text-gray-600">Approved</div>
          </Card>
          <Card className="p-6 text-center shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {jobs.reduce(
                (total, job) => total + (job.applications_count || 0),
                0
              )}
            </div>
            <div className="text-gray-600">Total Applications</div>
          </Card>
        </div>

        {/* Filter Tabs */}
        <Card className="p-6 mb-8 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <div className="flex flex-wrap gap-2">
            {["all", "pending", "approved", "open", "closed", "draft"].map(
              (status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    filter === status
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)} (
                  {getStatusCount(status)})
                </button>
              )
            )}
          </div>
        </Card>

        {/* Jobs List */}
        {filteredJobs.length === 0 ? (
          <Card className="p-12 text-center shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-12 h-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">
              No jobs found
            </h3>
            <p className="text-gray-600 mb-6">
              {filter === "all"
                ? "You haven't posted any jobs yet. Start by creating your first job posting!"
                : `No jobs with status "${filter}" found.`}
            </p>
            {filter === "all" && (
              <Link
                to="/post-job"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-lg transition-all duration-200"
              >
                Post Your First Job
                <svg
                  className="ml-2 w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </Link>
            )}
          </Card>
        ) : (
          <div className="space-y-6">
            {filteredJobs.map((job) => (
              <Card
                key={job.id}
                className="p-6 shadow-lg border-0 bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-1">
                          {job.title}
                        </h3>
                        <p className="text-gray-600 font-medium">
                          {job.company}
                        </p>
                      </div>
                      <div className="text-right">
                        {getStatusBadge(job.status, job.is_approved)}
                        <div className="text-sm text-gray-500 mt-1">
                          Posted {new Date(job.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <svg
                          className="w-4 h-4 text-gray-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        <span className="text-gray-600">{job.location}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <svg
                          className="w-4 h-4 text-gray-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                          />
                        </svg>
                        <span className="text-gray-600">
                          {job.applications_count || 0} applications
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <svg
                          className="w-4 h-4 text-gray-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span className="text-gray-600">ID: {job.id}</span>
                      </div>
                    </div>

                    <p className="text-gray-600 text-sm mt-3 line-clamp-2">
                      {job.description}
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <Link
                      to={`/job/${job.id}`}
                      className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors duration-200"
                    >
                      View Job
                      <svg
                        className="ml-2 w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    </Link>

                    <Link
                      to={`/edit-job/${job.id}`}
                      className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-green-600 bg-green-50 rounded-lg hover:bg-green-100 transition-colors duration-200"
                    >
                      Edit
                      <svg
                        className="ml-2 w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </Link>

                    <Button
                      onClick={() => handleDeleteJob(job.id)}
                      variant="outline"
                      className="border-red-300 text-red-700 hover:bg-red-50"
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyJobs;
