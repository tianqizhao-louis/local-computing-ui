import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [breeders, setBreeders] = useState([]); // Breeders list
  const [filteredBreeders, setFilteredBreeders] = useState([]); // Filtered breeders based on city/country
  const [city, setCity] = useState("Any City");
  const [country, setCountry] = useState("Any Country");
  const [currentPage, setCurrentPage] = useState("home"); // Track current page
  const [selectedBreeder, setSelectedBreeder] = useState(null); // Track selected breeder
  const [pets, setPets] = useState([]); // Pets list

  // Fetch data from the composite API
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
      .then((data) => {
        console.log(`${serviceName} data:`, data);
        // Set both breeders and pets
        setBreeders(data.breeders.data);
        setPets(data.pets.data);
      })
      .catch((error) => {
        console.error(`${serviceName} error:`, error);
      });
  };

  useEffect(() => {
    const running_env = import.meta.env.MODE;
    fetchData("http://34.29.2.129:8004/api/v1/composites", setBreeders, "Composites");

    // if (running_env === "development") {
    //   fetchData("http://localhost:8084/api/v1/composites", setBreeders, "Composites");
    // } else if (running_env === "production") {
    //   fetchData("http://35.193.234.242:8084/api/v1/composites", setBreeders, "Composites");
    // }
  }, []);

  useEffect(() => {
    setFilteredBreeders(breeders);
  }, [breeders]);

  const handleFilter = () => {
    let filtered = breeders;

    if (!Array.isArray(filtered)) {
      filtered = [];
    }

    if (city !== "Any City") {
      filtered = filtered.filter((breeder) => breeder.breeder_city === city);
    }

    if (country !== "Any Country") {
      filtered = filtered.filter((breeder) => breeder.breeder_country === country);
    }

    setFilteredBreeders(filtered);
  };

  const handleSort = (criteria) => {
    const sorted = [...filteredBreeders].sort((a, b) => {
      if (criteria === "name") {
        return a.name.localeCompare(b.name);
      } else if (criteria === "price") {
        return a.price_level.localeCompare(b.price_level);
      }
      return 0;
    });

    setFilteredBreeders(sorted);
  };

  const handleReset = () => {
    setCity("Any City");
    setCountry("Any Country");
    setFilteredBreeders(breeders);
  };

  const showDetails = (breeder) => {
    setSelectedBreeder(breeder); // Store the selected breeder
    setCurrentPage("details");   // Navigate to the detail page
  };

  const goBackToHome = () => {
    setCurrentPage("home");      // Navigate back to the home page
  };

  return (
    <div className="container">
      <header>
        <div className="header-title">
          <h1>Paws and Tails</h1>
        </div>
      </header>

      <main>
        {currentPage === "home" ? (
          <>
            <h2>Find Animals Near You</h2>
            <p>Bring Your New Best Friend Home.</p>

            <div className="filter-section">
              <h3>Search for Breeder Location</h3>
              <div className="filter-controls">
                <select value={city} onChange={(e) => setCity(e.target.value)}>
                  <option value="Any City">Any City</option>
                  {[...new Set(breeders.map((b) => b.breeder_city))].map((city, idx) => (
                    <option key={idx} value={city}>
                      {city}
                    </option>
                  ))}
                </select>

                <select value={country} onChange={(e) => setCountry(e.target.value)}>
                  <option value="Any Country">Any Country</option>
                  {[...new Set(breeders.map((b) => b.breeder_country))].map((country, idx) => (
                    <option key={idx} value={country}>
                      {country}
                    </option>
                  ))}
                </select>

                <button className="submit-btn" onClick={handleFilter}>
                  Submit
                </button>
                <button className="reset-btn" onClick={handleReset}>
                  Reset
                </button>
              </div>

              <div className="sort-controls">
                <button onClick={() => handleSort("name")}>Sort by Name</button>
                <button onClick={() => handleSort("price")}>Sort by Price</button>
              </div>
            </div>

            <BreederList breeders={filteredBreeders} showDetails={showDetails} />
          </>
        ) : (
          <BreederDetails breeder={selectedBreeder} pets={pets} goBack={goBackToHome} />
        )}
      </main>

      <footer>
        <p>Brought to you with ❤️ from Paws and Tails Team</p>
      </footer>
    </div>
  );
}

// Component to display breeder list
function BreederList({ breeders, showDetails }) {
  return (
    <div className="breeder-list">
      {breeders.length > 0 ? (
        <ul>
          {breeders.map((breeder) => (
            <li key={breeder.id}>
              <h3 onClick={() => showDetails(breeder)} style={{ cursor: "pointer" }}>
                {breeder.name}
              </h3>
              <p>
                {breeder.breeder_city}, {breeder.breeder_country}
              </p>
              <p>Price Level: {breeder.price_level}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No breeders found based on the selected filters.</p>
      )}
    </div>
  );
}

// Component to display breeder details with associated pets
function BreederDetails({ breeder, pets, goBack }) {
  if (!breeder) {
    return <p>No breeder selected.</p>;
  }

  // Filter pets by breeder_id
  const breederPets = pets.filter((pet) => pet.breeder_id === breeder.id);

  return (
    <div>
      <button onClick={goBack}>Back to List</button>
      <h2>{breeder.name}</h2>
      <p>City: {breeder.breeder_city}</p>
      <p>Country: {breeder.breeder_country}</p>
      <p>Price Level: {breeder.price_level}</p>
      <p>Address: {breeder.breeder_address}</p>

      <h3>Pets Available:</h3>
      {breederPets.length > 0 ? (
        <ul>
          {breederPets.map((pet) => (
            <li key={pet.id}>
              <p>
                {pet.name} - {pet.type} - ${pet.price}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No pets available for this breeder.</p>
      )}
    </div>
  );
}

export default App;
