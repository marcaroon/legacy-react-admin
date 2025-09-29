import { JSX, useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { getToken } from "./services/authService";

interface PrivateRouteProps {
  children: JSX.Element;
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const [hasToken, setHasToken] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const checkToken = () => {
      const token = getToken();
      console.log("PrivateRoute: Token check:", token); 
      setHasToken(!!token);
      setIsLoading(false);
    };

    checkToken();
    
    const handleStorageChange = () => {
      checkToken();
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!hasToken) {
    console.log("PrivateRoute: No token, redirecting to login"); 
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  console.log("PrivateRoute: Token found, rendering children"); 
  return children;
};

export default PrivateRoute;