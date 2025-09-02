import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { useAuthStore } from "../store/authStore";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { AxiosError } from "axios";

export const Login = () => {
  const { login, loading, error, isAuthenticated, user } = useAuthStore();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  // ✅ Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated && user?.role) {
      if (user.role === "user") {
        navigate("/jobs"); // ✅ Normal users go to jobs list
      } else if (user.role === "admin") {
        navigate("/admin-dashboard"); // ✅ Admins go to admin dashboard
      } else if (user.role === "employer") {
        navigate("/employer-dashboard"); // ✅ Employers go to employer dashboard
      } else {
        navigate("/");
      }
    }
  }, [isAuthenticated, user, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login({
        email: formData.email,
        password: formData.password,
      });

      toast.success("User logged in successfully!");
      setFormData({ email: "", password: "" });

      // ✅ Role-based redirect will be handled by useEffect
    } catch (err: unknown) {
      let message = "Login failed!";
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
                d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome Back</h1>
          <p className="text-gray-600 mt-2">
            Sign in to your account to continue
          </p>
        </div>

        {/* Login Form */}
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
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
                className="mt-2 h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg transition-colors duration-200"
              />
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
                  Signing In...
                </div>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          {/* Links */}
          <div className="mt-6 text-center space-y-3">
            <Link
              to="/forgot-password"
              className="block text-sm text-blue-600 hover:text-blue-700 hover:underline transition-colors duration-200"
            >
              Forgot your password?
            </Link>

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
