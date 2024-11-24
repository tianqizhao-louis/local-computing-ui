import { useAuth } from "../contexts/AuthProvider";
import { Navigate } from "react-router-dom";

export default function Login() {
  const { profile, login, logOut, setCustomerId } = useAuth(); // Add setCustomerId from AuthProvider

  const fetchCustomerId = async (email) => {
    try {
      const response = await fetch(`http://localhost:8001/api/v1/customers/email/${email}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch customer ID: ${response.statusText}`);
      }

      const data = await response.json();
      setCustomerId(data.id); // Store customer_id in context
      console.log("Customer ID set:", data.id);
    } catch (error) {
      console.error("Error fetching customer ID:", error);
    }
  };

  // Trigger fetchCustomerId when profile is loaded
  if (profile) {
    fetchCustomerId(profile.email); // Fetch customer_id using the user's email
    return <Navigate to="/" replace />;
  }

  return (
    <div>
      <h2>Google Login</h2>
      <br />
      <br />
      {profile ? (
        <div>
          <img src={profile.picture} alt="user image" />
          <h3>User Logged in</h3>
          <p>Name: {profile.name}</p>
          <p>Email Address: {profile.email}</p>
          <br />
          <br />
          <button onClick={logOut} className="button is-danger">
            Log out
          </button>
        </div>
      ) : (
        <button onClick={login} className="button is-info">
          Sign in with Google 🚀
        </button>
      )}
    </div>
  );
}

