import { useAuth } from "../../contexts/AuthProvider";
import ProfileUserType from "./ProfileUserType";
import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import config from "../../config";

export const UserProfile = () => {
  const { profile, userType, setUserType } = useAuth();
  const [loading, setLoading] = useState(true);
  const { jwtToken } = useAuth();

  useEffect(() => {
    const verifyUserType = async () => {
      if (!profile?.email || userType) {
        // Ensure loading is set to false even if the guard skips
        setLoading(false);
        return;
      }

      try {
        const fetchBreeder = fetch(
          `${config.breederUrl}/email/${profile.email}/`,
          {
            method: "GET",
            mode: "cors",
            headers: {
              Authorization: `Bearer ${jwtToken}`, // Include your token here
              "Content-Type": "application/json", // Add other headers if necessary
            },
          }
        );

        const fetchCustomer = fetch(
          `${config.customerUrl}/email/${profile.email}/`,
          {
            method: "GET",
            mode: "cors",
            headers: {
              Authorization: `Bearer ${jwtToken}`, // Include your token here
              "Content-Type": "application/json", // Add other headers if necessary
            },
          }
        );
        const [breederRes, customerRes] = await Promise.all([
          fetchBreeder,
          fetchCustomer,
        ]);

        if (breederRes.status === 200) {
          setUserType("breeder");
        } else if (customerRes.status === 200) {
          setUserType("customer");
        } else {
          setUserType("unknown");
        }
      } catch (error) {
        console.error("Error verifying user type:", error);
        setUserType("unknown");
      } finally {
        setLoading(false); // Ensure loading ends
      }
    };

    verifyUserType();
  }, [profile?.email, userType, setUserType]);

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  if (!userType || userType === "unknown") {
    return <Navigate to="/callback" replace />;
  }

  return (
    <div className="container">
      <h1 className="title">Your Profile</h1>
      <div className="profile-content">
        <img src={profile.picture} alt="user image" className="profile-image" />
        <div className="profile-details">
          <h3>User Information</h3>
          <p>GoogleName: {profile.name}</p>
          <p>Email Address: {profile.email}</p>
          <ProfileUserType userType={userType} profile={profile} />
        </div>
      </div>
    </div>
  );
};
