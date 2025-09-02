// src/pages/JobsList.tsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { jobService } from "../services/jobService";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  description: string;
  created_at: string;
  is_approved: boolean;
}

const JobsList = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [company, setCompany] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const data = await jobService.getJobs({
          page,
          limit,
          search,
          location,
          company,
          is_approved: true,
        });
        setJobs(data.jobs || []);
        setTotal(data.total || 0);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch jobs:", err);
        setError("Failed to load jobs");
        setJobs([]);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, [page, search, location, company]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    setCurrentPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    setCurrentPage(newPage);
  };

  const totalPages = Math.ceil(total / limit);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">
            Loading amazing job opportunities...
          </p>
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
          <p className="text-gray-600 mb-4">{error}</p>
          <Button
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            Try Again
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Find Your Dream Job
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover amazing opportunities from top companies around the world
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Filters */}
        <Card className="p-6 mb-8 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <form
            onSubmit={handleSearch}
            className="grid grid-cols-1 md:grid-cols-4 gap-4"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Job Title
              </label>
              <Input
                type="text"
                placeholder="e.g., Software Engineer"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <Input
                type="text"
                placeholder="e.g., New York, NY"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company
              </label>
              <Input
                type="text"
                placeholder="e.g., Google"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-end">
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                🔍 Search Jobs
              </Button>
            </div>
          </form>
        </Card>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing{" "}
            <span className="font-semibold text-blue-600">{jobs.length}</span>{" "}
            of <span className="font-semibold text-blue-600">{total}</span> jobs
          </p>
        </div>

        {/* Jobs Grid */}
        {jobs.length === 0 ? (
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
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">
              No jobs found
            </h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your search criteria or check back later for new
              opportunities.
            </p>
            <Button
              onClick={() => {
                setSearch("");
                setLocation("");
                setCompany("");
                setPage(1);
              }}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              Clear Filters
            </Button>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {jobs.map((job) => (
              <Card
                key={job.id}
                className="group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border-0 bg-white/80 backdrop-blur-sm"
              >
                <div className="p-6">
                  {/* Job Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200 mb-2">
                        {job.title}
                      </h3>
                      <p className="text-gray-600 font-medium">{job.company}</p>
                    </div>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      ✅ Approved
                    </span>
                  </div>

                  {/* Job Details */}
                  <div className="mb-4">
                    <div className="flex items-center text-gray-500 mb-2">
                      <svg
                        className="w-4 h-4 mr-2"
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
                      {job.location}
                    </div>
                    <p className="text-gray-600 text-sm line-clamp-3">
                      {job.description}
                    </p>
                  </div>

                  {/* Job Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="text-sm text-gray-500">
                      Posted {new Date(job.created_at).toLocaleDateString()}
                    </div>
                    <Link
                      to={`/job/${job.id}`}
                      className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors duration-200"
                    >
                      View Details
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
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </Link>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-12 flex justify-center">
            <nav className="flex items-center space-x-2">
              <Button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </Button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (pageNum) => (
                  <Button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`px-3 py-2 text-sm font-medium rounded-md ${
                      currentPage === pageNum
                        ? "bg-blue-600 text-white"
                        : "text-gray-500 bg-white border border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {pageNum}
                  </Button>
                )
              )}

              <Button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </Button>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobsList;
