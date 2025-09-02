import api from "./api";

// ✅ Types
export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  role: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
}

// ✅ Auth Service Class
class AuthService {
  // ✅ User Registration
  async register(userData: RegisterData): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>("/auth/register", userData);
    return response.data;
  }

  // ✅ User Login
  async login(credentials: LoginData): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>("/auth/login", credentials);
    return response.data;
  }

  // ✅ User Logout
  async logout(): Promise<void> {
    await api.post("/auth/logout");
  }

  // ✅ Get Current User
  async getCurrentUser(): Promise<User> {
    const response = await api.get<{ user: User }>("/auth/me");
    return response.data.user;
  }

  // ✅ Refresh Token
  async refreshToken(): Promise<{ accessToken: string }> {
    const response = await api.post<{ accessToken: string }>("/auth/refresh");
    return response.data;
  }

  // ✅ Forgot Password
  async forgotPassword(email: string): Promise<{ message: string }> {
    const response = await api.post<{ message: string }>(
      "/auth/forgot-password",
      { email }
    );
    return response.data;
  }

  // ✅ Reset Password
  async resetPassword(
    token: string,
    newPassword: string
  ): Promise<{ message: string }> {
    const response = await api.post<{ message: string }>(
      "/auth/reset-password",
      { token, newPassword }
    );
    return response.data;
  }
}

export const authService = new AuthService();
