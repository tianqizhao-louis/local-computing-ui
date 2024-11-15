import { useAuth } from "../../contexts/AuthProvider";

export const UserProfile = () => {
  const { profile } = useAuth();
  return (
    <div>
      <h1>Your Profile</h1>
      <img src={profile.picture} alt="user image" />
      <h3>User Logged in</h3>
      <p>Name: {profile.name}</p>
      <p>Email Address: {profile.email}</p>
    </div>
  );
};
