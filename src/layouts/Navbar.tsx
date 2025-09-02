// src/components/Navbar.tsx
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import LogoutButton from "../layouts/LogoutButton";

const Navbar = () => {
  const { isAuthenticated, user } = useAuthStore();

  const getRoleBadge = (role: string) => {
    switch (role?.toLowerCase()) {
      case "admin":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            👑 Admin
          </span>
        );
      case "employer":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
            💼 Employer
          </span>
        );
      case "user":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            👤 User
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <nav className="bg-white shadow-lg border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white"
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
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                JobPortal
              </span>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/jobs"
              className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
            >
              Browse Jobs
            </Link>

            {isAuthenticated && user?.role === "admin" && (
              <Link
                to="/admin-dashboard"
                className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                Admin Panel
              </Link>
            )}

            {isAuthenticated && user?.role === "employer" && (
              <Link
                to="/employer-dashboard"
                className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                Employer Panel
              </Link>
            )}
          </div>

          {/* User Section */}
          <div className="flex items-center space-x-4">
            {!isAuthenticated ? (
              <>
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-blue-600 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
                >
                  Get Started
                </Link>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                {/* User Info */}
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-semibold">
                      {user?.username?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="hidden sm:block text-right">
                    <div className="text-sm font-medium text-gray-900">
                      {user?.username}
                    </div>
                    {getRoleBadge(user?.role)}
                  </div>
                </div>

                {/* Profile & Logout */}
                <div className="flex items-center space-x-2">
                  <Link
                    to="/profile"
                    className="text-gray-700 hover:text-blue-600 p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                    title="Profile"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </Link>

                  <LogoutButton />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
