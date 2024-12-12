import * as React from "react";
import * as ReactDOM from "react-dom/client";
import {
  createRoutesFromElements,
  createBrowserRouter,
  Route,
  RouterProvider,
} from "react-router-dom";
import Root from "./routes/root";
import ErrorPage from "./error-page";
import App from "./App"; // Import the homepage component
import Login from "./components/Login";
import { SecureRoute } from "./components/secure/SecureRoute";
import { UserProfile } from "./components/secure/Profile";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthProvider } from "./contexts/AuthProvider";
import "./index.css";
import "bulma/css/bulma.css";
import Callback from "./components/Callback";
import { SecureUserType } from "./components/secure/SecureUserType";
import { BreederPage } from "./components/secure/BreederPage";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Root />} errorElement={<ErrorPage />}>
      <Route index element={<App />} /> {/* Set App as the default component */}
      <Route path="login" element={<Login />} />
      <Route
        path="breeder"
        element={
          <SecureRoute>
            <BreederPage />
          </SecureRoute>
        }
      />
      <Route
        path="profile"
        element={
          <SecureRoute>
            <UserProfile />
          </SecureRoute>
        }
      />
      <Route path="callback" element={<Callback />} />
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <GoogleOAuthProvider clientId="661348528801-v2onm89382alvsgm2h27k2h2uofo74pr.apps.googleusercontent.com">
    <AuthProvider>
      <React.StrictMode>
        <RouterProvider router={router} />
      </React.StrictMode>
    </AuthProvider>
  </GoogleOAuthProvider>
);
