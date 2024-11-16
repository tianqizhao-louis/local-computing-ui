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
// import Contact, {
//   loader as contactLoader,
//   action as contactAction,
// } from "./routes/contact";
// import EditContact, { action as editAction } from "./routes/edit";
// import { action as destroyAction } from "./routes/destroy";
import Index from "./routes/index";
import Login from "./components/Login";
// import { SecurePage } from "./components/secure/SecurePage";
import { SecureRoute } from "./components/secure/SecureRoute";
import { UserProfile } from "./components/secure/Profile";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthProvider } from "./contexts/AuthProvider";
import "./index.css";
import "bulma/css/bulma.css";
import Callback from "./components/Callback";
import { SecureUserType } from "./components/secure/SecureUserType";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Root />} errorElement={<ErrorPage />}>
      <Route errorElement={<ErrorPage />}>
        <Route index element={<Index />} />
        {/* <Route
          path="contacts/:contactId"
          element={<Contact />}
          loader={contactLoader}
          action={contactAction}
        />
        <Route
          path="contacts/:contactId/edit"
          element={<EditContact />}
          loader={contactLoader}
          action={editAction}
        />
        <Route path="contacts/:contactId/destroy" action={destroyAction} /> */}

        <Route path="login" element={<Login />} />
        <Route
          path="profile"
          element={
            <SecureRoute>
              <SecureUserType>
                <UserProfile />
              </SecureUserType>
            </SecureRoute>
          }
        />
        {/* <Route
          path="/secure"
          element={
            <SecureRoute>
              <SecurePage />
            </SecureRoute>
          }
        /> */}
        <Route path="callback" element={<Callback />} />
      </Route>
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
