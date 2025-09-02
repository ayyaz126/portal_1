// src/pages/Profile.tsx
import { useState, useEffect } from "react";
import { useAuthStore } from "../store/authStore";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import toast from "react-hot-toast";

const Profile = () => {
  const { user, loading } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: user?.username || "",
    email: user?.email || "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [stats] = useState({
    jobsApplied: 12,
    interviews: 3,
    savedJobs: 8,
    profileViews: 45,
  });

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || "",
        email: user.email || "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("New passwords don't match!");
      return;
    }

    try {
      // TODO: Implement updateProfile functionality
      toast.success("Profile updated successfully! 🎉");
      setIsEditing(false);
      setFormData({
        ...formData,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch {
      toast.error("Failed to update profile");
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role?.toLowerCase()) {
      case "admin":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
            👑 Administrator
          </span>
        );
      case "employer":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
            💼 Employer
          </span>
        );
      case "user":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
            👤 Job Seeker
          </span>
        );
      default:
        return null;
    }
  };

  if (!user) {
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
            Please Login
          </h2>
          <p className="text-gray-600">
            You need to be logged in to view your profile.
          </p>
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
              Your Profile
            </h1>
            <p className="text-xl text-gray-600">
              Manage your account and preferences
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-2">
            <Card className="p-8 shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
              <div className="flex items-center space-x-6 mb-8">
                <div className="w-24 h-24 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-3xl font-bold">
                    {user.username
                      ? user.username.charAt(0).toUpperCase()
                      : "U"}
                  </span>
                </div>
                <div className="flex-1">
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    {user.username || "User"}
                  </h2>
                  <p className="text-gray-600 mb-3">
                    {user.email || "No email"}
                  </p>
                  {getRoleBadge(user.role || "user")}
                </div>
                <Button
                  onClick={() => setIsEditing(!isEditing)}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  {isEditing ? "Cancel" : "Edit Profile"}
                </Button>
              </div>

              {/* Profile Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label
                      htmlFor="username"
                      className="text-sm font-medium text-gray-700"
                    >
                      Username
                    </Label>
                    <Input
                      id="username"
                      type="text"
                      value={formData.username}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="mt-2 border-gray-300 focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-50"
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="email"
                      className="text-sm font-medium text-gray-700"
                    >
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="mt-2 border-gray-300 focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-50"
                    />
                  </div>
                </div>

                {isEditing && (
                  <>
                    <div className="border-t border-gray-200 pt-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Change Password
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                          <Label
                            htmlFor="currentPassword"
                            className="text-sm font-medium text-gray-700"
                          >
                            Current Password
                          </Label>
                          <Input
                            id="currentPassword"
                            type="password"
                            value={formData.currentPassword}
                            onChange={handleChange}
                            className="mt-2 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <Label
                            htmlFor="newPassword"
                            className="text-sm font-medium text-gray-700"
                          >
                            New Password
                          </Label>
                          <Input
                            id="newPassword"
                            type="password"
                            value={formData.newPassword}
                            onChange={handleChange}
                            className="mt-2 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <Label
                            htmlFor="confirmPassword"
                            className="text-sm font-medium text-gray-700"
                          >
                            Confirm Password
                          </Label>
                          <Input
                            id="confirmPassword"
                            type="password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className="mt-2 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end space-x-4">
                      <Button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        variant="outline"
                        className="border-gray-300 text-gray-700 hover:bg-gray-50"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={loading}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                      >
                        {loading ? "Saving..." : "Save Changes"}
                      </Button>
                    </div>
                  </>
                )}
              </form>
            </Card>
          </div>

          {/* Stats & Quick Actions */}
          <div className="space-y-6">
            {/* Stats Card */}
            <Card className="p-6 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Your Activity
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
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
                          d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                        />
                      </svg>
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      Jobs Applied
                    </span>
                  </div>
                  <span className="text-2xl font-bold text-blue-600">
                    {stats.jobsApplied}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
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
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      Interviews
                    </span>
                  </div>
                  <span className="text-2xl font-bold text-green-600">
                    {stats.interviews}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
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
                          d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                        />
                      </svg>
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      Saved Jobs
                    </span>
                  </div>
                  <span className="text-2xl font-bold text-purple-600">
                    {stats.savedJobs}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-yellow-600 rounded-full flex items-center justify-center">
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
                    <span className="text-sm font-medium text-gray-700">
                      Profile Views
                    </span>
                  </div>
                  <span className="text-2xl font-bold text-yellow-600">
                    {stats.profileViews}
                  </span>
                </div>
              </div>
            </Card>

            {/* Quick Actions */}
            <Card className="p-6 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Quick Actions
              </h3>
              <div className="space-y-3">
                <Button className="w-full justify-start bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  📝 Update Resume
                </Button>
                <Button className="w-full justify-start bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700">
                  🔍 Browse Jobs
                </Button>
                <Button className="w-full justify-start bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                  📊 View Analytics
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
