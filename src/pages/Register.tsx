import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { useAuthStore } from "../store/authStore";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { AxiosError } from "axios";

export const Register = () => {
  const { register, loading, error, isAuthenticated, user } = useAuthStore();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [passwordError, setPasswordError] = useState("");
  const navigate = useNavigate();

  // ✅ Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated && user?.role) {
      if (user.role === "user") {
        navigate("/jobs");
      } else if (user.role === "admin") {
        navigate("/admin-dashboard");
      } else if (user.role === "employer") {
        navigate("/employer-dashboard");
      } else {
        navigate("/");
      }
    }
  }, [isAuthenticated, user, navigate]);

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

    if (!validateForm()) {
      return;
    }

    try {
      await register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      });

      toast.success("Registration successful! Welcome aboard! 🎉");
      setFormData({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
      setPasswordError("");

      // ✅ Role-based redirect will be handled by useEffect
    } catch (err: unknown) {
      let message = "Registration failed!";
      if (err instanceof AxiosError) {
        message = err.response?.data?.message || message;
      }
      toast.error(message);
    }
  };

  // ✅ Don't render if already authenticated
  if (isAuthenticated) {
    return null;
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
                d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">
            Join Our Community
          </h1>
          <p className="text-gray-600 mt-2">
            Create your account and start your journey
          </p>
        </div>

        {/* Register Form */}
        <Card className="p-8 shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
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
                placeholder="Choose a username"
                value={formData.username}
                onChange={handleChange}
                required
                className="mt-2 h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg transition-colors duration-200"
              />
            </div>

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
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
                className="mt-2 h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg transition-colors duration-200"
              />
            </div>

            <div>
              <Label
                htmlFor="password"
                className="text-sm font-medium text-gray-700"
              >
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Create a password"
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
                Confirm Password
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="mt-2 h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg transition-colors duration-200"
              />
              {passwordError && (
                <p className="mt-1 text-sm text-red-600">{passwordError}</p>
              )}
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Creating Account...
                </div>
              ) : (
                "Create Account"
              )}
            </Button>
          </form>

          {/* Links */}
          <div className="mt-6 text-center">
            <div className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors duration-200"
              >
                Sign in here
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
