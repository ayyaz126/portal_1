// src/pages/ResetPassword.tsx
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { authService } from "../services/authService";
import toast from "react-hot-toast";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  const token = searchParams.get("token");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });

    // Clear password error when user types
    if (e.target.id === "confirmPassword" || e.target.id === "password") {
      setPasswordError("");
    }
  };

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      setPasswordError("Passwords do not match");
      return false;
    }
    if (formData.password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      toast.error("Invalid reset token. Please request a new password reset.");
      return;
    }

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      await authService.resetPassword(token, formData.password);
      toast.success("Password reset successfully! 🎉");
      navigate("/login");
    } catch (error) {
      console.error("Reset password error:", error);
      toast.error("Failed to reset password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
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
              Invalid Reset Link
            </h1>
            <p className="text-gray-600 mb-6">
              This password reset link is invalid or has expired. Please request
              a new one.
            </p>
            <Button
              onClick={() => navigate("/forgot-password")}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              Request New Reset
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
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
                d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7 7m0 0a6 6 0 01-7-7m7 7v3m-3-3v3m3-3h3m-3 0H9"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">
            Reset Your Password
          </h1>
          <p className="text-gray-600 mt-2">Enter your new password below</p>
        </div>

        {/* Reset Form */}
        <Card className="p-8 shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label
                htmlFor="password"
                className="text-sm font-medium text-gray-700"
              >
                New Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your new password"
                value={formData.password}
                onChange={handleChange}
                required
                className="mt-2 h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg transition-colors duration-200"
              />
            </div>

            <div>
              <Label
                htmlFor="confirmPassword"
                className="text-sm font-medium text-gray-700"
              >
                Confirm New Password
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your new password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="mt-2 h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg transition-colors duration-200"
              />
              {passwordError && (
                <p className="mt-1 text-sm text-red-600">{passwordError}</p>
              )}
            </div>

            {/* Password Requirements */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="text-sm font-medium text-blue-900 mb-2">
                Password Requirements:
              </h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• At least 6 characters long</li>
                <li>• Use a mix of letters, numbers, and symbols</li>
                <li>• Avoid common passwords</li>
              </ul>
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Resetting Password...
                </div>
              ) : (
                "Reset Password"
              )}
            </Button>
          </form>

          {/* Links */}
          <div className="mt-6 text-center">
            <div className="text-sm text-gray-600">
              Remember your password?{" "}
              <button
                onClick={() => navigate("/login")}
                className="text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors duration-200"
              >
                Sign in here
              </button>
            </div>
          </div>
        </Card>

        {/* Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
