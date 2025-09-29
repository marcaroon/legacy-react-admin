// hooks/useAuth.ts - Update dengan proper state management
import { useState, useEffect, useCallback } from "react";
import { isAuthenticated, getUser } from "../components/services/authService";

export const useAuth = () => {
  const [isAuthenticatedState, setIsAuthenticatedState] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  const checkAuth = useCallback(() => {
    console.log("useAuth: Checking authentication..."); // DEBUG
    setIsLoading(true);
    
    try {
      const authenticated = isAuthenticated();
      const userData = getUser();
      
      console.log("useAuth: Auth result:", { authenticated, userData }); // DEBUG
      
      setIsAuthenticatedState(authenticated);
      setUser(userData);
    } catch (error) {
      console.error("useAuth: Auth check failed:", error);
      setIsAuthenticatedState(false);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Method untuk re-check auth setelah login
  const refreshAuth = useCallback(() => {
    checkAuth();
  }, [checkAuth]);

  return {
    isAuthenticated: isAuthenticatedState,
    isLoading,
    user,
    refreshAuth, // Expose method untuk refresh
    setIsAuthenticated: setIsAuthenticatedState,
    setUser
  };
};