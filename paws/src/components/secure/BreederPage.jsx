import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthProvider";
import config from "../../config";

export const BreederPage = () => {
  const { profile } = useAuth();
  const [breederData, setBreederData] = useState(null);
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBreederData = async () => {
      try {
        // Fetch breeder data by email
        const breederResponse = await fetch(
          `${config.breederUrl}/email/${profile.email}/`
        );
        if (!breederResponse.ok) {
          throw new Error("Failed to fetch breeder data");
        }
        const breederData = await breederResponse.json();
        setBreederData(breederData);

        // Fetch pets data from composite API
        const petsResponse = await fetch("http://localhost:8004/api/v1/composites");
        if (!petsResponse.ok) {
          throw new Error("Failed to fetch pets data");
        }
        const petsData = await petsResponse.json();
        // Filter pets for this breeder
        const breederPets = petsData.pets.data.filter(
          (pet) => pet.breeder_id === breederData.id
        );
        setPets(breederPets);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (profile?.email) {
      fetchBreederData();
    }
  }, [profile?.email]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container">
      <h1 className="title">Breeder Dashboard</h1>
      
      <div className="breeder-info">
        <h2>Your Information</h2>
        <p>Name: {breederData?.name}</p>
        <p>City: {breederData?.breeder_city}</p>
        <p>Country: {breederData?.breeder_country}</p>
        <p>Address: {breederData?.breeder_address}</p>
        <p>Price Level: {breederData?.price_level}</p>
      </div>

      <div className="pets-list">
        <h2>Your Pets</h2>
        {pets.length > 0 ? (
          <ul>
            {pets.map((pet) => (
              <li key={pet.id}>
                <h3>{pet.name}</h3>
                <p>Type: {pet.type}</p>
                <p>Price: ${pet.price}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No pets listed yet.</p>
        )}
      </div>
    </div>
  );
}; 