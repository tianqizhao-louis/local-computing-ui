import { useEffect } from "react";
import config from "../config";
import { useAuth } from "../contexts/AuthProvider";
import DeclareType from "./DeclareType";
import { Navigate } from "react-router-dom";

export default function Callback() {
  const { profile, userType, setUserType } = useAuth();

  useEffect(() => {
    const fetchBreeder = fetch(`${config.breederUrl}/email/${profile.email}/`);
    const fetchCustomer = fetch(
      `${config.customerUrl}/email/${profile.email}/`
    );

    Promise.all([fetchBreeder, fetchCustomer])
      .then((responses) => {
        if (responses[0].status === 200) {
          // User is Breeder
          setUserType("breeder");
        } else if (responses[1].status === 200) {
          // User is Customer
          setUserType("customer");
        } else {
          // User hasn't declared
          setUserType("unknown");
        }
      })
      .catch((error) => {
        setUserType("unknown");
        console.log(error);
      });
  }, [setUserType, profile.email]);

  if (userType && userType !== "unknown") {
    return <Navigate to="/" replace />;
  }

  return (
    <div>
      {userType === "breeder" ? (
        <div>Welcome Breeder</div>
      ) : userType === "customer" ? (
        <div>Welcome Customer</div>
      ) : userType === "unknown" ? (
        <DeclareType />
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
}
