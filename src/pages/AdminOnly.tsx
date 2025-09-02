import { useEffect, useState } from "react";
import { AxiosError } from "axios";
import { authService, type User } from "../services/authService";
import { useAuthStore } from "../store/authStore";

const AdminOnly = () => {
  const { user: currentUser } = useAuthStore();
  const [adminData, setAdminData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        setLoading(true);
        // ✅ Using the new authService
        const userData = await authService.getCurrentUser();
        setAdminData(userData);
        setError(null);
      } catch (err: unknown) {
        if (err instanceof AxiosError) {
          setError(err.response?.data?.message || "Error fetching admin data");
        } else {
          setError("Error fetching admin data");
        }
      } finally {
        setLoading(false);
      }
    };

    if (currentUser?.role === "admin") {
      fetchAdminData();
    } else {
      setError("You do not have access to this page.");
      setLoading(false);
    }
  }, [currentUser]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!adminData) return <p>No admin data found</p>;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Page</h1>
      <div className="bg-white shadow rounded-lg p-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              ID
            </label>
            <p className="mt-1 text-lg text-gray-900">{adminData.id}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <p className="mt-1 text-lg text-gray-900">{adminData.email}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Role
            </label>
            <p className="mt-1 text-lg text-gray-900 capitalize">
              {adminData.role}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOnly;
