// src/routes/AppRouter.tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import { Login } from "../pages/Login"; // ✅ Fixed import path
import { Register } from "../pages/Register";
import Home from "../pages/Home";
import JobsList from "../pages/JobsList";
import JobDetails from "../pages/JobDetails";
import CandidateDashboard from "../pages/CandidateDashboard";
import AdminDashboard from "../pages/AdminDashboard";
import NotFound from "../pages/NotFound";
import Navbar from "@/layouts/Navbar";

import ForgotPassword from "../pages/ForgotPassword";
import ResetPassword from "../pages/ResetPassword";
import Profile from "../pages/Profile";
import AdminOnly from "../pages/AdminOnly";
import PostJob from "../pages/PostJob";
import MyJobs from "../pages/MyJobs";
import EditJob from "../pages/EditJob";
import ApplyJob from "@/pages/ApplyJob";
import MyApplications from "../pages/MyApplications";

import ProtectedRoute from "../components/ProtectedRoute";

// ✅ Main AppRouter
export const AppRouter = () => {
  return (
    <>
      <Toaster position="top-right" />
      <Router>
        <Navbar />
        <Routes>
          {/* 🌍 Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/jobs" element={<JobsList />} />
          <Route path="/jobs/:id" element={<JobDetails />} />

          {/* 🔒 Protected Routes */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* ✅ Only Admin */}
          <Route
            path="/admin-only"
            element={
              <ProtectedRoute role="admin">
                <AdminOnly />
              </ProtectedRoute>
            }
          />

          <Route
            path="/adminDashbord"
            element={
              <ProtectedRoute role="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/jobs/:id/apply"
            element={
              <ProtectedRoute role="user">
                <ApplyJob />
              </ProtectedRoute>
            }
          />
          <Route
            path="/applications/me"
            element={
              <ProtectedRoute role="user">
                <MyApplications />
              </ProtectedRoute>
            }
          />

          {/* ✅ Admin Job Management */}
          <Route
            path="/admin/post-job"
            element={
              <ProtectedRoute role="admin">
                <PostJob />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/my-jobs"
            element={
              <ProtectedRoute role="admin">
                <MyJobs />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/jobs/:id/edit"
            element={
              <ProtectedRoute role="admin">
                <EditJob />
              </ProtectedRoute>
            }
          />

          {/* ✅ User Dashboard (for normal users) */}
          <Route
            path="/user-dashboard"
            element={
              <ProtectedRoute role="user">
                <CandidateDashboard />
              </ProtectedRoute>
            }
          />

          {/* ✅ Admin Dashboard */}
          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute role="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* 🚨 404 Fallback */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
};
