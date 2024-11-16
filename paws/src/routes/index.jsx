import { useEffect, useState } from "react";
import config from "../config";

export default function Index() {
  const [status, setStatus] = useState(null);

  useEffect(() => {
    const fetchBreeder = fetch(`${config.breederUrl}/`);
    const fetchCustomer = fetch(`${config.customerUrl}/`);

    Promise.all([fetchBreeder, fetchCustomer])
      .then((responses) => {
        if (responses[0].status === 200 && responses[1].status === 200) {
          setStatus("ok");
        } else {
          setStatus("wrong");
        }
      })
      .catch((error) => {
        setStatus("wrong");
        console.log(error);
      });
  }, []);

  return (
    <div>
      {status === "ok" ? (
        <div>Data fetched successfully</div>
      ) : status === "wrong" ? (
        <div>Your Microservices are down.</div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
}
