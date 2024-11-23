import { useAuth } from "../../contexts/AuthProvider";
import ProfileUserType from "./ProfileUserType";
import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import config from "../../config";

export const UserProfile = () => {
  const { profile, userType, setUserType } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyUserType = async () => {
      if (!profile?.email) return;
      
      try {
        const [breederRes, customerRes] = await Promise.all([
          fetch(`${config.breederUrl}/email/${profile.email}/`),
          fetch(`${config.customerUrl}/email/${profile.email}/`)
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
        setLoading(false);
      }
    };

    verifyUserType();
  }, [profile?.email, setUserType]);

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
          <p>Name: {profile.name}</p>
          <p>Email Address: {profile.email}</p>
          <ProfileUserType userType={userType} profile={profile} />
        </div>
      </div>
    </div>
  );
};
