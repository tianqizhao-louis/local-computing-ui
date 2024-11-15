import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import { useGoogleLogin, googleLogout } from "@react-oauth/google";
import { redirect } from "react-router-dom";

// Create context
const AuthContext = createContext(null);

// Create provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = useGoogleLogin({
    onSuccess: (codeResponse) => setUser(codeResponse),
    onError: (error) => console.log("Login Failed:", error),
  });

  useEffect(() => {
    // Check if there's a user token in localStorage on mount
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
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
    localStorage.removeItem("user");
    localStorage.removeItem("profile");
    redirect("/login");
  };

  // Create value object
  const value = {
    user,
    profile,
    loading,
    login,
    logOut,
    isAuthenticated: !!user,
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
