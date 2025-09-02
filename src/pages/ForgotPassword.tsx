// src/pages/ForgotPassword.tsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { authService } from "../services/authService";
import toast from "react-hot-toast";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("Please enter your email address");
      return;
    }

    setLoading(true);
    try {
      await authService.forgotPassword(email);
      setSubmitted(true);
      toast.success("Password reset email sent! Check your inbox 📧");
    } catch (error) {
      console.error("Forgot password error:", error);
      toast.error("Failed to send reset email. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card className="p-8 text-center shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
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
                  d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Check Your Email
            </h1>
            <p className="text-gray-600 mb-6">
              We've sent a password reset link to <strong>{email}</strong>
            </p>
            <div className="space-y-4">
              <p className="text-sm text-gray-500">
                Didn't receive the email? Check your spam folder or try again.
              </p>
              <Button
                onClick={() => setSubmitted(false)}
                variant="outline"
                className="w-full border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Try Again
              </Button>
              <Link
                to="/login"
                className="block w-full text-center text-sm text-blue-600 hover:text-blue-700 hover:underline"
              >
                Back to Login
              </Link>
            </div>
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
          <h1 className="text-3xl font-bold text-gray-900">Forgot Password?</h1>
          <p className="text-gray-600 mt-2">
            No worries! We'll send you reset instructions
          </p>
        </div>

        {/* Reset Form */}
        <Card className="p-8 shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label
                htmlFor="email"
                className="text-sm font-medium text-gray-700"
              >
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-2 h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg transition-colors duration-200"
              />
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Sending Reset Link...
                </div>
              ) : (
                "Send Reset Link"
              )}
            </Button>
          </form>

          {/* Links */}
          <div className="mt-6 text-center space-y-3">
            <div className="text-sm text-gray-600">
              Remember your password?{" "}
              <Link
                to="/login"
                className="text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors duration-200"
              >
                Sign in here
              </Link>
            </div>

            <div className="text-sm text-gray-600">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors duration-200"
              >
                Sign up here
              </Link>
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

export default ForgotPassword;
