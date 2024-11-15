import { useEffect, useState } from "react";
import config from "../config";

export default function Index() {
  const [status, setStatus] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${config.breederUrl}/`); // Replace with your URL
        if (response.status === 200) {
          setStatus("ok");
        } else {
          setStatus("wrong");
        }
      } catch (error) {
        setStatus("wrong");
        console.log(error);
      }
    };

    fetchData();
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
