// src/pages/AdminDashboard.tsx
import { useState } from "react";
import { useAuthStore } from "../store/authStore";
import PendingJobsList from "../components/PendingJobsList";
import ApprovedJobsList from "../components/ApprovedJobsList";
import UsersManagement from "../components/UsersManagement";
import { Card } from "@/components/ui/card";

const AdminDashboard = () => {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<
    | "jobs"
    | "myjobs"
    | "postjob"
    | "jobdetails"
    | "pending"
    | "approved"
    | "users"
  >("pending");

  // ✅ Redirect if not admin
  if (!user || user.role !== "admin") {
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
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Access Denied
          </h1>
          <p className="text-gray-600">
            You need admin privileges to access this page.
          </p>
        </Card>
      </div>
    );
  }

  const getTabIcon = (tab: string) => {
    switch (tab) {
      case "pending":
        return "⏳";
      case "approved":
        return "✅";
      case "users":
        return "👥";
      case "jobs":
        return "💼";
      case "myjobs":
        return "📋";
      case "postjob":
        return "➕";
      case "jobdetails":
        return "🔍";
      default:
        return "📊";
    }
  };

  const getTabLabel = (tab: string) => {
    switch (tab) {
      case "pending":
        return "Pending Approval";
      case "approved":
        return "Approved Jobs";
      case "users":
        return "Users Management";
      case "jobs":
        return "All Jobs";
      case "myjobs":
        return "My Jobs";
      case "postjob":
        return "Post Job";
      case "jobdetails":
        return "Job Details";
      default:
        return "Dashboard";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Admin Dashboard
              </h1>
              <p className="text-gray-600 mt-1">
                Manage jobs, users, and platform settings
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white text-lg font-semibold">
                  {user?.username?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900">
                  {user?.username}
                </div>
                <div className="text-xs text-gray-500">Administrator</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-64">
            <Card className="p-6 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Navigation
              </h2>
              <nav className="space-y-2">
                {(
                  [
                    "pending",
                    "approved",
                    "users",
                    "jobs",
                    "myjobs",
                    "postjob",
                    "jobdetails",
                  ] as const
                ).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                      activeTab === tab
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg transform scale-105"
                        : "text-gray-700 hover:bg-gray-100 hover:text-blue-600"
                    }`}
                  >
                    <span className="text-lg">{getTabIcon(tab)}</span>
                    <span className="font-medium">{getTabLabel(tab)}</span>
                  </button>
                ))}
              </nav>
            </Card>

            {/* Quick Stats */}
            <Card className="mt-6 p-6 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Quick Stats
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Users</span>
                  <span className="font-semibold text-blue-600">1,234</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Active Jobs</span>
                  <span className="font-semibold text-green-600">567</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Pending Approval</span>
                  <span className="font-semibold text-yellow-600">23</span>
                </div>
              </div>
            </Card>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <div className="p-6">
                {/* Tab Content */}
                {activeTab === "pending" && <PendingJobsList />}
                {activeTab === "approved" && <ApprovedJobsList />}
                {activeTab === "users" && <UsersManagement />}
                {activeTab === "jobs" && (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg
                        className="w-8 h-8 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      All Jobs
                    </h3>
                    <p className="text-gray-600">
                      View and manage all jobs on the platform
                    </p>
                  </div>
                )}
                {activeTab === "myjobs" && (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg
                        className="w-8 h-8 text-green-600"
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
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      My Jobs
                    </h3>
                    <p className="text-gray-600">Manage jobs you've posted</p>
                  </div>
                )}
                {activeTab === "postjob" && (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg
                        className="w-8 h-8 text-purple-600"
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
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Post New Job
                    </h3>
                    <p className="text-gray-600">Create a new job posting</p>
                  </div>
                )}
                {activeTab === "jobdetails" && (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg
                        className="w-8 h-8 text-yellow-600"
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
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Job Details
                    </h3>
                    <p className="text-gray-600">
                      View detailed information about a specific job
                    </p>
                  </div>
                )}
              </div>
            </Card>
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
