// src/pages/MyApplications.tsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  applicationService,
  type Application,
} from "../services/applicationService";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

const MyApplications = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const data = await applicationService.getMyApplications();
      setApplications(data.applications || []);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch applications:", err);
      setError("Failed to load applications");
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async (applicationId: number) => {
    try {
      await applicationService.withdrawApplication(applicationId);
      toast.success("Application withdrawn successfully! ✅");
      setApplications((prev) => prev.filter((app) => app.id !== applicationId));
    } catch (err) {
      console.error("Failed to withdraw application:", err);
      toast.error("Failed to withdraw application ❌");
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: {
        color: "bg-yellow-100 text-yellow-800",
        icon: "⏳",
        label: "Pending",
      },
      reviewing: {
        color: "bg-blue-100 text-blue-800",
        icon: "👀",
        label: "Under Review",
      },
      shortlisted: {
        color: "bg-purple-100 text-purple-800",
        icon: "⭐",
        label: "Shortlisted",
      },
      interview: {
        color: "bg-green-100 text-green-800",
        icon: "📞",
        label: "Interview",
      },
      accepted: {
        color: "bg-green-100 text-green-800",
        icon: "🎉",
        label: "Accepted",
      },
      rejected: {
        color: "bg-red-100 text-red-800",
        icon: "❌",
        label: "Rejected",
      },
      withdrawn: {
        color: "bg-gray-100 text-gray-800",
        icon: "↩️",
        label: "Withdrawn",
      },
    };

    const config =
      statusConfig[status as keyof typeof statusConfig] ||
      statusConfig["pending"];
    return (
      <span
        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.color}`}
      >
        {config.icon} {config.label}
      </span>
    );
  };

  const getFilteredApplications = () => {
    if (filter === "all") return applications;
    return applications.filter((app) => app.status === filter);
  };

  const getStatusCount = (status: string) => {
    return applications.filter((app) => app.status === status).length;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading your applications...</p>
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
            onClick={fetchApplications}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            Try Again
          </Button>
        </Card>
      </div>
    );
  }

  const filteredApplications = getFilteredApplications();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              My Applications
            </h1>
            <p className="text-xl text-gray-600">
              Track your job applications and their progress
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 text-center shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {applications.length}
            </div>
            <div className="text-gray-600">Total Applications</div>
          </Card>
          <Card className="p-6 text-center shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <div className="text-3xl font-bold text-yellow-600 mb-2">
              {getStatusCount("pending")}
            </div>
            <div className="text-gray-600">Pending</div>
          </Card>
          <Card className="p-6 text-center shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {getStatusCount("interview")}
            </div>
            <div className="text-gray-600">Interviews</div>
          </Card>
          <Card className="p-6 text-center shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {getStatusCount("shortlisted")}
            </div>
            <div className="text-gray-600">Shortlisted</div>
          </Card>
        </div>

        {/* Filter Tabs */}
        <Card className="p-6 mb-8 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <div className="flex flex-wrap gap-2">
            {[
              "all",
              "pending",
              "reviewing",
              "shortlisted",
              "interview",
              "accepted",
              "rejected",
              "withdrawn",
            ].map((status) => (
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
                {status === "all"
                  ? applications.length
                  : getStatusCount(status)}
                )
              </button>
            ))}
          </div>
        </Card>

        {/* Applications List */}
        {filteredApplications.length === 0 ? (
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
                  d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">
              No applications found
            </h3>
            <p className="text-gray-600 mb-6">
              {filter === "all"
                ? "You haven't applied to any jobs yet. Start your job search today!"
                : `No applications with status "${filter}" found.`}
            </p>
            {filter === "all" && (
              <Link
                to="/jobs"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-lg transition-all duration-200"
              >
                Browse Jobs
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
            {filteredApplications.map((application) => (
              <Card
                key={application.id}
                className="p-6 shadow-lg border-0 bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-1">
                          Job #{application.job_id}
                        </h3>
                        <p className="text-gray-600 font-medium">
                          Application ID: {application.id}
                        </p>
                      </div>
                      <div className="text-right">
                        {getStatusBadge(application.status)}
                        <div className="text-sm text-gray-500 mt-1">
                          Applied{" "}
                          {new Date(
                            application.created_at
                          ).toLocaleDateString()}
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
                        <span className="text-gray-600">
                          Job #{application.job_id}
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
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        <span className="text-gray-600">
                          {new Date(
                            application.created_at
                          ).toLocaleDateString()}
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
                        <span className="text-gray-600">
                          ID: {application.id}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <Link
                      to={`/job/${application.job_id}`}
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

                    {application.status === "pending" && (
                      <Button
                        onClick={() => handleWithdraw(application.id)}
                        variant="outline"
                        className="border-red-300 text-red-700 hover:bg-red-50"
                      >
                        Withdraw
                      </Button>
                    )}
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

export default MyApplications;
