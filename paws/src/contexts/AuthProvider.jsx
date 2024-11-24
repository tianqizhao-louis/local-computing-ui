import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import { useGoogleLogin, googleLogout } from "@react-oauth/google";

// Create context
const AuthContext = createContext(null);

// Create provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [userType, setUserType] = useState(null);
  const [customerId, setCustomerId] = useState(null); // Added customerId state
  const [loading, setLoading] = useState(true);

  const login = useGoogleLogin({
    onSuccess: (codeResponse) => setUser(codeResponse),
    onError: (error) => console.log("Login Failed:", error),
  });

  useEffect(() => {
    // Check if there's a user token, profile, userType, and customerId in localStorage on mount
    const savedUser = localStorage.getItem("user");
    const savedProfile = localStorage.getItem("profile");
    const savedUserType = localStorage.getItem("userType");
    const savedCustomerId = localStorage.getItem("customerId"); // Check for customerId
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
    }
    if (savedUserType) {
      setUserType(savedUserType);
    }
    if (savedCustomerId) {
      setCustomerId(savedCustomerId); // Restore customerId from localStorage
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (user?.access_token) {
      // Save user token to localStorage
      localStorage.setItem("user", JSON.stringify(user));

      // Fetch user profile
      axios
        .get(
          `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`,
          {
            headers: {
              Authorization: `Bearer ${user.access_token}`,
              Accept: "application/json",
            },
          }
        )
        .then((res) => {
          setProfile(res.data);
          localStorage.setItem("profile", JSON.stringify(res.data));
        })
        .catch((err) => console.log(err));
    }
  }, [user]);

  const logOut = () => {
    googleLogout();
    setUser(null);
    setProfile(null);
    setUserType(null);
    setCustomerId(null); // Clear customerId on logout
    localStorage.removeItem("user");
    localStorage.removeItem("profile");
    localStorage.removeItem("userType");
    localStorage.removeItem("customerId"); // Remove customerId from localStorage
  };

  // Create value object
  const value = {
    user,
    profile,
    loading,
    login,
    logOut,
    isAuthenticated: !!user,
    userType,
    setUserType: (type) => {
      setUserType(type);
      localStorage.setItem("userType", type);
    },
    customerId, // Add customerId to the context value
    setCustomerId, // Add setCustomerId to allow updates
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

// Custom hook for using the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

