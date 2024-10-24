import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [breeders, setBreeders] = useState([]);
  const [filteredBreeders, setFilteredBreeders] = useState([]);
  const [city, setCity] = useState("Any City");
  const [country, setCountry] = useState("Any Country");

  // Generalized function to fetch data
  const fetchData = (url, setState, serviceName) => {
    fetch(url, {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`${serviceName} fetch failed: ${response.statusText}`);
        }
        return response.json();
      })
      .then((data) => setState(data))
      .catch((error) => {
        console.error(`${serviceName} error:`, error);
      });
  };

  useEffect(() => {
    const running_env = import.meta.env.MODE;

    if (running_env === "development") {
      // Development API URLs
      fetchData("http://localhost:8080/api/v1/breeders/", setBreeders, "Breeders");
    } else if (running_env === "production") {
      // Production API URLs
      fetchData("http://34.72.253.184:8080/api/v1/breeders/", setBreeders, "Breeders");
    }
  }, []);

  // Update filtered breeders whenever the breeder data changes or when filters are applied
  useEffect(() => {
    setFilteredBreeders(breeders);
  }, [breeders]);

  // Function to handle filtering based on city and country
  const handleFilter = () => {
    let filtered = breeders;

    if (city !== "Any City") {
      filtered = filtered.filter((breeder) => breeder.city === city);
    }

    if (country !== "Any Country") {
      filtered = filtered.filter((breeder) => breeder.country === country);
    }

    setFilteredBreeders(filtered);
  };

  // Function to handle sorting based on criteria
  const handleSort = (criteria) => {
    const sorted = [...filteredBreeders].sort((a, b) => {
      if (criteria === "name") {
        return a.name.localeCompare(b.name);
      } else if (criteria === "price") {
        return a.price - b.price;
      }
      // Add other sorting criteria if needed
      return 0;
    });

    setFilteredBreeders(sorted);
  };

  // Function to reset filters and sorting
  const handleReset = () => {
    setCity("Any City");
    setCountry("Any Country");
    setFilteredBreeders(breeders); // Reset to the original breeder list
  };

  return (
    <div className="container">
      <header>
        <div className="header-title">
          <h1>Paws and Tails</h1>
          <nav>
            <a href="#">Find by Animals</a>
            <a href="#">Find by Breeders</a>
          </nav>
        </div>
      </header>

      <main>
        <h2>Find Animals Near You</h2>
        <p>Bring Your New Best Friend Home.</p>

        <div className="filter-section">
          <h3>Search for Breeder Location</h3>
          <div className="filter-controls">
            <select value={city} onChange={(e) => setCity(e.target.value)}>
              <option value="Any City">Any City</option>
              <option value="New York">New York</option>
              <option value="Los Angeles">Los Angeles</option>
            </select>

            <select value={country} onChange={(e) => setCountry(e.target.value)}>
              <option value="Any Country">Any Country</option>
              <option value="USA">USA</option>
              <option value="Canada">Canada</option>
            </select>

            <button className="submit-btn" onClick={handleFilter}>Submit</button>
            <button className="reset-btn" onClick={handleReset}>Reset</button>
          </div>

          <div className="sort-controls">
            <button onClick={() => handleSort("name")}>Sort by Name</button>
            <button onClick={() => handleSort("price")}>Sort by Price</button>
          </div>
        </div>

        <BreederList breeders={filteredBreeders} />
      </main>

      <footer>
        <p>Brought to you with ❤️ from Paws and Tails Team</p>
      </footer>
    </div>
  );
}

// Component to display breeder list
function BreederList({ breeders }) {
  return (
    <div className="breeder-list">
      {breeders.length > 0 ? (
        <ul>
          {breeders.map((breeder) => (
            <li key={breeder.id}>
              <h3>{breeder.name}</h3>
              <p>{breeder.city}, {breeder.country}</p>
              <p>Price: {breeder.price}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No breeders found based on the selected filters.</p>
      )}
    </div>
  );
}

export default App;
