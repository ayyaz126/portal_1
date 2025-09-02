// src/pages/JobDetails.tsx
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { jobService } from "../services/jobService";
import { useAuthStore } from "../store/authStore";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  description: string;
  requirements?: string;
  salary?: string;
  type?: string;
  created_at: string;
  is_approved: boolean;
  status: string;
  user_id: number;
}

const JobDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const data = await jobService.getJobById(parseInt(id));
        setJob(data.job || data);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch job:", err);
        setError("Failed to load job details");
        setJob(null);
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  const handleApply = async () => {
    if (!isAuthenticated) {
      toast.error("Please login to apply for this job");
      navigate("/login");
      return;
    }

    if (!job) return;

    setApplying(true);
    try {
      // TODO: Implement application logic
      toast.success("Application submitted successfully! 🎉");
      navigate("/my-applications");
    } catch {
      toast.error("Failed to submit application");
    } finally {
      setApplying(false);
    }
  };

  const getJobTypeBadge = (type: string) => {
    const typeConfig = {
      "full-time": { color: "bg-blue-100 text-blue-800", label: "Full Time" },
      "part-time": { color: "bg-green-100 text-green-800", label: "Part Time" },
      contract: { color: "bg-purple-100 text-purple-800", label: "Contract" },
      internship: {
        color: "bg-yellow-100 text-yellow-800",
        label: "Internship",
      },
      freelance: { color: "bg-pink-100 text-pink-800", label: "Freelance" },
    };

    const config =
      typeConfig[type as keyof typeof typeConfig] || typeConfig["full-time"];
    return (
      <span
        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.color}`}
      >
        {config.label}
      </span>
    );
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      open: { color: "bg-green-100 text-green-800", label: "Open", icon: "✅" },
      closed: { color: "bg-red-100 text-red-800", label: "Closed", icon: "❌" },
      pending: {
        color: "bg-yellow-100 text-yellow-800",
        label: "Pending",
        icon: "⏳",
      },
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading job details...</p>
        </div>
      </div>
    );
  }

  if (error || !job) {
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
            Job Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            {error || "The job you're looking for doesn't exist."}
          </p>
          <div className="space-x-4">
            <Button
              onClick={() => navigate("/jobs")}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              Browse Jobs
            </Button>
            <Button
              onClick={() => navigate("/")}
              variant="outline"
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Go Home
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
                <Link to="/" className="hover:text-blue-600">
                  Home
                </Link>
                <span>/</span>
                <Link to="/jobs" className="hover:text-blue-600">
                  Jobs
                </Link>
                <span>/</span>
                <span className="text-gray-900">{job.title}</span>
              </nav>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                {job.title}
              </h1>
              <p className="text-xl text-gray-600">{job.company}</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500 mb-2">Posted</div>
              <div className="text-lg font-semibold text-gray-900">
                {new Date(job.created_at).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Job Overview */}
            <Card className="p-6 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Job Overview
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-blue-600"
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
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Location</div>
                    <div className="font-medium text-gray-900">
                      {job.location}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-green-600"
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
                  <div>
                    <div className="text-sm text-gray-500">Job Type</div>
                    <div className="font-medium text-gray-900">
                      {job.type ? getJobTypeBadge(job.type) : "Full Time"}
                    </div>
                  </div>
                </div>

                {job.salary && (
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-purple-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                        />
                      </svg>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Salary</div>
                      <div className="font-medium text-gray-900">
                        {job.salary}
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-yellow-600"
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
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Status</div>
                    <div className="font-medium text-gray-900">
                      {getStatusBadge(job.status)}
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Job Description */}
            <Card className="p-6 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Job Description
              </h2>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {job.description}
                </p>
              </div>
            </Card>

            {/* Requirements */}
            {job.requirements && (
              <Card className="p-6 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  Requirements & Skills
                </h2>
                <div className="prose prose-gray max-w-none">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {job.requirements}
                  </p>
                </div>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Apply Card */}
            <Card className="p-6 shadow-lg border-0 bg-white/80 backdrop-blur-sm sticky top-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Apply for this Position
              </h3>

              {!isAuthenticated ? (
                <div className="space-y-4">
                  <p className="text-gray-600 text-sm">
                    Please login to apply for this job position.
                  </p>
                  <Button
                    onClick={() => navigate("/login")}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    Login to Apply
                  </Button>
                  <Button
                    onClick={() => navigate("/register")}
                    variant="outline"
                    className="w-full border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    Create Account
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-gray-600 text-sm">
                    Ready to take the next step in your career?
                  </p>
                  <Button
                    onClick={handleApply}
                    disabled={applying || job.status !== "open"}
                    className="w-full h-12 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {applying ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Applying...
                      </div>
                    ) : (
                      "Apply Now"
                    )}
                  </Button>

                  {job.status !== "open" && (
                    <p className="text-sm text-red-600 text-center">
                      This position is currently {job.status}
                    </p>
                  )}
                </div>
              )}
            </Card>

            {/* Company Info */}
            <Card className="p-6 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                About {job.company}
              </h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      />
                    </svg>
                  </div>
                  <span className="text-gray-700">Company</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-green-600"
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
                  </div>
                  <span className="text-gray-700">{job.location}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-purple-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <span className="text-gray-700">
                    Posted {new Date(job.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </Card>

            {/* Quick Actions */}
            <Card className="p-6 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Quick Actions
              </h3>
              <div className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  💾 Save Job
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  📤 Share Job
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  🏢 View Company
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;
