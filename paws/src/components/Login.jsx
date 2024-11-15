import { useAuth } from "../contexts/AuthProvider";

export default function Login() {
  const { profile, login, logOut } = useAuth();

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
          <button onClick={logOut} className="button is-danger">Log out</button>
        </div>
      ) : (
        <button onClick={login} className="button is-info">
          Sign in with Google 🚀
        </button>
      )}
    </div>
  );
}
