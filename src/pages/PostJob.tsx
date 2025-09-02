import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { jobService } from "../services/jobService";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import toast from "react-hot-toast";

const PostJob = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    description: "",
    requirements: "",
    salary: "",
    type: "full-time",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await jobService.createJob(formData);
      toast.success("Job posted successfully! 🎉");
      navigate("/my-jobs");
    } catch (error) {
      console.error("Failed to post job:", error);
      toast.error("Failed to post job. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Post a New Job
            </h1>
            <p className="text-xl text-gray-600">
              Share your opportunity with talented professionals
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="p-8 shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mr-3">
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                Basic Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label
                    htmlFor="title"
                    className="text-sm font-medium text-gray-700"
                  >
                    Job Title *
                  </Label>
                  <Input
                    id="title"
                    type="text"
                    placeholder="e.g., Senior Software Engineer"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    className="mt-2 h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <Label
                    htmlFor="company"
                    className="text-sm font-medium text-gray-700"
                  >
                    Company Name *
                  </Label>
                  <Input
                    id="company"
                    type="text"
                    placeholder="e.g., Tech Corp"
                    value={formData.company}
                    onChange={handleChange}
                    required
                    className="mt-2 h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <Label
                    htmlFor="location"
                    className="text-sm font-medium text-gray-700"
                  >
                    Location *
                  </Label>
                  <Input
                    id="location"
                    type="text"
                    placeholder="e.g., New York, NY or Remote"
                    value={formData.location}
                    onChange={handleChange}
                    required
                    className="mt-2 h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <Label
                    htmlFor="type"
                    className="text-sm font-medium text-gray-700"
                  >
                    Job Type *
                  </Label>
                  <select
                    id="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="mt-2 h-12 w-full border-gray-300 rounded-md focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="full-time">Full Time</option>
                    <option value="part-time">Part Time</option>
                    <option value="contract">Contract</option>
                    <option value="internship">Internship</option>
                    <option value="freelance">Freelance</option>
                  </select>
                </div>

                <div>
                  <Label
                    htmlFor="salary"
                    className="text-sm font-medium text-gray-700"
                  >
                    Salary Range
                  </Label>
                  <Input
                    id="salary"
                    type="text"
                    placeholder="e.g., $80,000 - $120,000"
                    value={formData.salary}
                    onChange={handleChange}
                    className="mt-2 h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Job Description */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center mr-3">
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                Job Description
              </h3>

              <div>
                <Label
                  htmlFor="description"
                  className="text-sm font-medium text-gray-700"
                >
                  Job Description *
                </Label>
                <textarea
                  id="description"
                  rows={6}
                  placeholder="Describe the role, responsibilities, and what makes this position exciting..."
                  value={formData.description}
                  onChange={handleChange}
                  required
                  className="mt-2 w-full border-gray-300 rounded-md focus:border-blue-500 focus:ring-blue-500 resize-none"
                />
              </div>
            </div>

            {/* Requirements */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center mr-3">
                  <svg
                    className="w-4 h-4 text-white"
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
                Requirements & Skills
              </h3>

              <div>
                <Label
                  htmlFor="requirements"
                  className="text-sm font-medium text-gray-700"
                >
                  Requirements & Skills
                </Label>
                <textarea
                  id="requirements"
                  rows={4}
                  placeholder="List the key requirements, skills, and qualifications needed for this role..."
                  value={formData.requirements}
                  onChange={handleChange}
                  className="mt-2 w-full border-gray-300 rounded-md focus:border-blue-500 focus:ring-blue-500 resize-none"
                />
              </div>
            </div>

            {/* Tips Section */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-blue-900 mb-3 flex items-center">
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
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Tips for a Great Job Post
              </h4>
              <ul className="text-blue-800 space-y-2 text-sm">
                <li>• Be specific about the role and responsibilities</li>
                <li>• Highlight what makes your company unique</li>
                <li>• Include salary information when possible</li>
                <li>• Use clear, professional language</li>
                <li>• Mention growth opportunities and benefits</li>
              </ul>
            </div>

            {/* Submit Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <Button
                type="button"
                onClick={() => navigate("/my-jobs")}
                variant="outline"
                className="flex-1 h-12 border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="flex-1 h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Posting Job...
                  </div>
                ) : (
                  "Post Job"
                )}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default PostJob;
