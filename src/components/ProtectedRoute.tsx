// src/components/ProtectedRoute.tsx
import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

interface ProtectedRouteProps {
  children: JSX.Element;
  role?: "admin" | "user"; // ✅ Updated to use "user" instead of "candidate"
}

const ProtectedRoute = ({ children, role }: ProtectedRouteProps) => {
  const { isAuthenticated, user, loading } = useAuthStore();

  // ⏳ Still checking auth state
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center p-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          Loading...
        </div>
      </div>
    );
  }

  // ❌ Not logged in
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // 🔒 Role-based protection
  if (role && user?.role) {
    const userRole = user.role.toLowerCase();
    const requiredRole = role.toLowerCase();

    if (userRole !== requiredRole) {
      // ✅ Redirect to appropriate dashboard instead of home
      if (userRole === "user") {
        return <Navigate to="/user-dashboard" replace />;
      } else if (userRole === "admin") {
        return <Navigate to="/admin-dashboard" replace />;
      } else {
        return <Navigate to="/" replace />;
      }
    }
  }

  // ✅ Access granted
  return children;
};

export default ProtectedRoute;
