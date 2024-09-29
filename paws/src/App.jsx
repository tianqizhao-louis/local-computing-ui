import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);
  const [breeders, setBreeders] = useState([]);

  useEffect(() => {
    fetch("http://18.191.212.225:8002/api/v1/breeders/")
      .then((response) => response.json())
      .then((data) => setBreeders(data));
  }, []);

  return (
    <>
      <div>
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
      </p>
      <Breeders breeders={breeders} />
    </>
  );
}

function Breeders({ breeders }) {
  return (
    <div>
      <h1>Breeders</h1>
      <ul>
        {breeders.map((breeder) => (
          <li key={breeder.id}>{breeder.id}: {breeder.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
