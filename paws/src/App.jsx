import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);
  const [breeders, setBreeders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const running_env = import.meta.env.MODE;

    if (running_env === "development") {
      fetch("http://localhost:8080/api/v1/breeders/")
        .then((response) => response.json())
        .then((data) => setBreeders(data));

      fetch("http://localhost:8080/api/v1/customers/")
        .then((response) => response.json())
        .then((data) => setCustomers(data));

      fetch("http://localhost:8080/api/v1/messages/")
        .then((response) => response.json())
        .then((data) => setMessages(data));
    } else if (running_env === "production") {
      fetch("http://34.72.253.184:8080/api/v1/breeders/", {
        method: "GET",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => setBreeders(data))
        .catch((error) => {
          console.error("There was a problem with the fetch operation:", error);
        });

      fetch("http://34.70.67.71:8080/api/v1/customers/", {
        method: "GET",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => setCustomers(data))
        .catch((error) => {
          console.error("There was a problem with the fetch operation:", error);
        });

      fetch("http://35.222.56.6:8080/api/v1/messages/", {
        method: "GET",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => setMessages(data))
        .catch((error) => {
          console.error("There was a problem with the fetch operation:", error);
        });
    }
  }, []);

  return (
    <>
      {/* <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p> */}
      <h1>Breeder:</h1>
      {breeders.length > 0 ? (
        <Breeders breeders={breeders} />
      ) : (
        <p>VM shuts down!</p>
      )}
      <h1>Customer:</h1>
      {customers.length > 0 ? (
        <Customers customers={customers} />
      ) : (
        <p>VM shuts down!</p>
      )}
      <h1>Message:</h1>
      {messages.length > 0 ? (
        <Messages messages={messages} />
      ) : (
        <p>VM shuts down!</p>
      )}
    </>
  );
}

function Breeders({ breeders }) {
  return (
    <div>
      <h1>hi</h1>
      <ul>
        {breeders.map((breeder) => (
          <li key={breeder.id}>
            {breeder.id}: {breeder.name}
          </li>
        ))}
      </ul>
    </div>
  );
}

function Customers({ customers }) {
  return (
    <div>
      <h1>hi</h1>
      <ul>
        {customers.map((customer) => (
          <li key={customer.id}>
            {customer.id}: {customer.name}
          </li>
        ))}
      </ul>
    </div>
  );
}

function Messages({ messages }) {
  return (
    <div>
      <h1>hi</h1>
      <ul>
        {messages.map((message) => (
          <li key={message.id}>
            {message.id}: Communication between Customer {message.customer_id},
            Breeder {message.breeder_id}, about {message.message_body}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
