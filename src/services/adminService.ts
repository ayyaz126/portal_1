import api from "./api";

// ✅ Approve Job - using the exact backend endpoint that works in Postman
export const approveJob = async (jobId: number) => {
  try {
    // ✅ Using exact URL: http://localhost:4000/api/v1/admin/approve/:jobId
    const response = await api.patch(`/admin/approve/${jobId}`);
    return response.data;
  } catch (error) {
    console.error("Error approving job:", error);
    throw error;
  }
};

// ✅ Get Approved Jobs
export const getApprovedJobs = async () => {
  try {
    const response = await api.get("/admin/approved-jobs");
    return response.data;
  } catch (error) {
    console.error("Error fetching approved jobs:", error);
    throw error;
  }
};

// ✅ Get Unapproved Jobs (Pending Approval)
export const getUnapprovedJobs = async () => {
  try {
    const response = await api.get("/admin/unapproved-jobs");
    return response.data;
  } catch (error) {
    console.error("Error fetching unapproved jobs:", error);
    throw error;
  }
};

// ✅ Get All Users
export const getAllUsers = async () => {
  try {
    const response = await api.get("/admin/users");
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

// ✅ Delete User by ID
export const deleteUser = async (userId: number) => {
  try {
    const response = await api.delete(`/admin/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};

// ✅ Update User Role
export const updateUserRole = async (userId: number, newRole: string) => {
  try {
    const response = await api.patch(`/admin/users/${userId}/role`, {
      role: newRole,
    });
    return response.data;
  } catch (error) {
    console.error("Error updating user role:", error);
    throw error;
  }
};
