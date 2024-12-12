import { Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthProvider";
import PropTypes from "prop-types";

export const SecureRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>loading</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

SecureRoute.propTypes = {
  children: PropTypes.node.isRequired,
};
