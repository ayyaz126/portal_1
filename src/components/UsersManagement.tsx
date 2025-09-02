// src/components/UsersManagement.tsx
import { useEffect, useState } from "react";
import {
  getAllUsers,
  deleteUser,
  updateUserRole,
} from "../services/adminService";
import toast from "react-hot-toast";

interface User {
  id: number;
  email: string;
  role: string;
}

const UsersManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingUserId, setDeletingUserId] = useState<number | null>(null);
  const [updatingUserId, setUpdatingUserId] = useState<number | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await getAllUsers();
      setUsers(data.users || []);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch users:", err);
      setError("Failed to load users ❌");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId: number, userEmail: string) => {
    // ✅ Confirm deletion
    if (
      !window.confirm(
        `Are you sure you want to delete user: ${userEmail}?\n\nThis action cannot be undone.`
      )
    ) {
      return;
    }

    try {
      setDeletingUserId(userId);
      await deleteUser(userId);

      // ✅ Remove user from list
      setUsers((prev) => prev.filter((user) => user.id !== userId));

      toast.success("User deleted successfully! ✅");
    } catch (err) {
      console.error("Failed to delete user:", err);
      toast.error("Failed to delete user ❌");
    } finally {
      setDeletingUserId(null);
    }
  };

  const handleUpdateRole = async (
    userId: number,
    newRole: string,
    currentRole: string
  ) => {
    if (newRole === currentRole) {
      return; // No change needed
    }

    try {
      setUpdatingUserId(userId);
      await updateUserRole(userId, newRole);

      // ✅ Update user in list
      setUsers((prev) =>
        prev.map((user) =>
          user.id === userId ? { ...user, role: newRole } : user
        )
      );

      toast.success(`User role updated to ${newRole}! ✅`);
    } catch (err) {
      console.error("Failed to update user role:", err);
      toast.error("Failed to update user role ❌");
    } finally {
      setUpdatingUserId(null);
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role.toLowerCase()) {
      case "admin":
        return "bg-red-100 text-red-800";
      case "employer":
        return "bg-purple-100 text-purple-800";
      case "user":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role.toLowerCase()) {
      case "admin":
        return "👑";
      case "employer":
        return "💼";
      case "user":
        return "👤";
      default:
        return "❓";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          Loading users...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <p className="text-red-500 text-lg mb-4">{error}</p>
        <button
          onClick={fetchUsers}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Users Management</h2>
        <div className="text-sm text-gray-500">Total Users: {users.length}</div>
      </div>

      {users.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 text-lg">No users found.</p>
          <p className="text-gray-400">
            Users will appear here once they register.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{user.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeColor(
                          user.role
                        )}`}
                      >
                        {getRoleIcon(user.role)} {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-900">
                          View Details
                        </button>

                        {/* ✅ Role Update Dropdown */}
                        <select
                          value={user.role}
                          onChange={(e) =>
                            handleUpdateRole(user.id, e.target.value, user.role)
                          }
                          disabled={updatingUserId === user.id}
                          className={`text-sm border rounded px-2 py-1 ${
                            updatingUserId === user.id
                              ? "opacity-50 cursor-not-allowed"
                              : "cursor-pointer"
                          }`}
                        >
                          <option value="user">👤 User</option>
                          <option value="employer">💼 Employer</option>
                          <option value="admin">👑 Admin</option>
                        </select>

                        <button
                          onClick={() => handleDeleteUser(user.id, user.email)}
                          disabled={deletingUserId === user.id}
                          className={`text-red-600 hover:text-red-900 disabled:opacity-50 disabled:cursor-not-allowed ${
                            deletingUserId === user.id
                              ? "cursor-not-allowed"
                              : ""
                          }`}
                        >
                          {deletingUserId === user.id
                            ? "Deleting..."
                            : "Delete"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersManagement;
