import { create } from "zustand";
import { authService } from "../services/authService";
import { AxiosError } from "axios";

interface User {
  id?: string;
  username?: string;
  email?: string;
  role?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;

  register: (userData: {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
  }) => Promise<void>;
  login: (userData: { email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  fetchUser: () => Promise<void>;
  initializeAuth: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: localStorage.getItem("accessToken"),
  loading: true,
  error: null,
  isAuthenticated: !!localStorage.getItem("accessToken"),

  initializeAuth: () => {
    const token = localStorage.getItem("accessToken");

    if (token) {
      set({ token, isAuthenticated: true });
      get().fetchUser();
    } else {
      set({ loading: false, isAuthenticated: false });
    }
  },

  register: async (userData) => {
    try {
      set({ loading: true, error: null });
      const data = await authService.register(userData);

      localStorage.setItem("accessToken", data.accessToken);

      set({
        user: { ...data.user, role: data.user?.role?.toLowerCase() },
        token: data.accessToken,
        isAuthenticated: true,
        loading: false,
      });
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      set({
        error: error.response?.data?.message || "Something went wrong",
        loading: false,
        isAuthenticated: false,
      });
    }
  },

  login: async (userData) => {
    try {
      set({ loading: true, error: null });
      const data = await authService.login(userData);

      localStorage.setItem("accessToken", data.accessToken);

      set({
        user: { ...data.user, role: data.user?.role?.toLowerCase() },
        token: data.accessToken,
        isAuthenticated: true,
        loading: false,
      });
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      set({
        error: error.response?.data?.message || "Invalid email or password",
        loading: false,
        isAuthenticated: false,
      });
    }
  },

  logout: async () => {
    try {
      await authService.logout();
    } catch (err) {
      console.error("Logout error:", err);
    }
    localStorage.removeItem("accessToken");
    set({ user: null, token: null, isAuthenticated: false, loading: false });
  },

  fetchUser: async () => {
    try {
      set({ loading: true });
      const data = await authService.getCurrentUser();

      set({
        user: { ...data, role: data.role?.toLowerCase() },
        isAuthenticated: true,
        loading: false,
      });
    } catch (err) {
      console.error("Fetch user failed:", err);
      localStorage.removeItem("accessToken");
      set({ user: null, token: null, isAuthenticated: false, loading: false });
    }
  },
}));
