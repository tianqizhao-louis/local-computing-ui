import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import { useGoogleLogin, googleLogout } from "@react-oauth/google";
import config from "../config";

// Create context
const AuthContext = createContext(null);

// Create provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [userType, setUserType] = useState(null);
  const [customerId, setCustomerId] = useState(null);
  const [jwtToken, setJwtToken] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = useGoogleLogin({
    onSuccess: async (codeResponse) => {
      setUser(codeResponse);
      try {
        // Exchange Google token for backend JWT
        const response = await axios.post(`${config.authUrl}/login/`, {
          tokenId: codeResponse.access_token,
        });
        const { access_token } = response.data;
        setJwtToken(access_token);
        localStorage.setItem("jwtToken", access_token);
      } catch (error) {
        console.error("Error retrieving JWT token:", error);
      }
    },
    onError: (error) => console.error("Login Failed:", error),
  });

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("user");
      const savedProfile = localStorage.getItem("profile");
      const savedUserType = localStorage.getItem("userType");
      const savedCustomerId = localStorage.getItem("customerId");
      const savedJwtToken = localStorage.getItem("jwtToken");

      if (savedUser) setUser(JSON.parse(savedUser));
      if (savedProfile) setProfile(JSON.parse(savedProfile));
      if (savedUserType) setUserType(savedUserType);
      if (savedCustomerId) setCustomerId(savedCustomerId);
      if (savedJwtToken) setJwtToken(savedJwtToken);

      setLoading(false);
    } catch (error) {
      console.error("Error initializing authentication state:", error);
      setLoading(false); // Ensure loading is turned off even on error
    }
  }, []);

  useEffect(() => {
    if (user?.access_token) {
      localStorage.setItem("user", JSON.stringify(user));
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
        .catch((err) => console.error("Error fetching user profile:", err));
    }
  }, [user]);

  const logOut = () => {
    googleLogout();
    setUser(null);
    setProfile(null);
    setUserType(null);
    setCustomerId(null);
    setJwtToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("profile");
    localStorage.removeItem("userType");
    localStorage.removeItem("customerId");
    localStorage.removeItem("jwtToken");
  };

  const value = {
    user,
    profile,
    loading,
    login,
    logOut,
    isAuthenticated: !!jwtToken,
    userType,
    setUserType: (type) => {
      setUserType(type);
      localStorage.setItem("userType", type);
    },
    customerId,
    setCustomerId: (id) => {
      setCustomerId(id);
      localStorage.setItem("customerId", id);
    },
    jwtToken,
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
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
