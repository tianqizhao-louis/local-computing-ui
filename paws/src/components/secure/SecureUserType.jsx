import { Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthProvider";

export const SecureUserType = ({ children }) => {
  const { isAuthenticated, loading, userType } = useAuth();

  if (loading) {
    return <div>loading</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!userType || userType === "unknown") {
    return <Navigate to="/callback" replace />;
  }

  return children;
};
