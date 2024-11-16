import { useEffect, useState } from "react";
import config from "../../config";

export default function ProfileUserType({ userType, profile }) {
  //   const fetchBreeder = fetch(`${config.breederUrl}/email/${profile.email}/`);
  //   const fetchCustomer = fetch(`${config.customerUrl}/email/${profile.email}/`);
  //   const data = {};

  const [data, setData] = useState({});

  useEffect(() => {
    if (userType === "breeder") {
      fetch(`${config.breederUrl}/email/${profile.email}/`)
        .then((response) => {
          return response.json();
        })
        .then((response_json) => {
          setData(response_json);
        })
        .catch((error) => {
          console.log(error);
        });
    } else if (userType === "customer") {
      fetch(`${config.customerUrl}/email/${profile.email}/`)
        .then((response) => {
          return response.json();
        })
        .then((response_json) => {
          setData(response_json);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [userType, profile.email]);

  return (
    <div>
      {userType === "breeder" ? (
        <div>
          <p>You are a breeder.</p>
          <h3>Breeder Information</h3>
          <p>Name: {data.name}</p>
          <p>City: {data.breeder_city}</p>
          <p>Country: {data.breeder_country}</p>
          <p>Price Level: {data.price_level}</p>
          <p>Address: {data.breeder_address}</p>
        </div>
      ) : userType === "customer" ? (
        <div>
          <p>You are a customer.</p>
          <h3>Customer Information</h3>
          <p>Name: {data.name}</p>
        </div>
      ) : userType === "unknown" ? (
        <div>no type</div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
}
