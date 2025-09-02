// src/components/LogoutButton.tsx
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button"; // ShadCN Button
import toast from "react-hot-toast";
import { useAuthStore } from "../store/authStore"; // zustand store

const LogoutButton = () => {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout); // zustand logout

  const handleLogout = async () => {
    try {
      await logout(); // ✅ store ka logout call

      toast.success("User logged out successfully!");

      // redirect
      navigate("/login", { replace: true });
    } catch (error: unknown) {
      let message = "Logout failed!";
      if (error instanceof Error) {
        message = error.message;
      }
      toast.error(message);
      console.error("Logout failed", error);
    }
  };

  return (
    <Button variant="destructive" onClick={handleLogout}>
      Logout
    </Button>
  );
};

export default LogoutButton;
