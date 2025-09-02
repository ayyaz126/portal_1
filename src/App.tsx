// src/App.tsx
import { useEffect, useCallback } from "react";
import { AppRouter } from "./router/AppRouter";
import { useAuthStore } from "./store/authStore";

function App() {
  const { initializeAuth } = useAuthStore();

  // ✅ Use useCallback to prevent unnecessary re-renders
  const initAuth = useCallback(() => {
    initializeAuth();
  }, [initializeAuth]);

  useEffect(() => {
    // ✅ Initialize auth state only once on app start
    initAuth();
  }, [initAuth]); // Now the dependency is properly handled

  return <AppRouter />;
}

export default App;
