import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthProvider';
import config from '../../config';

export const BreederPage = () => {
  const { profile } = useAuth();
  const [breederData, setBreederData] = useState(null);
  const [pets, setPets] = useState([]);
  const [waitlist, setWaitlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { jwtToken } = useAuth();

  // New state for the pet form
  const [petForm, setPetForm] = useState({
    name: '',
    type: '',
    price: '',
    imageUrl: '',
  });
  const [addPetError, setAddPetError] = useState(null);

  useEffect(() => {
    const fetchBreederData = async () => {
      try {
        // Fetch breeder data by email
        const breederResponse = await fetch(
          `${config.breederUrl}/email/${profile.email}/`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${jwtToken}`, // Include your token here
              'Content-Type': 'application/json', // Add other headers if necessary
            },
          },
        );
        if (!breederResponse.ok) {
          throw new Error('Failed to fetch breeder data');
        }
        const breederData = await breederResponse.json();
        setBreederData(breederData);

        // Fetch pets data using the breeder ID directly from the API
        const petsResponse = await fetch(
          `${config.petUrl}/breeder/${breederData.id}/`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${jwtToken}`, // Include your token here
              'Content-Type': 'application/json', // Add other headers if necessary
            },
          },
        );
        if (!petsResponse.ok) {
          throw new Error('Failed to fetch pets data');
        }
        const petsData = await petsResponse.json();
        setPets(petsData);

        // Fetch waitlisted customers for the breeder
        const waitlistResponse = await fetch(
          `${config.customerUrl}/breeder/${breederData.id}/waitlist`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${jwtToken}`, // Include your token here
              'Content-Type': 'application/json', // Add other headers if necessary
            },
          },
        );

        if (!waitlistResponse.ok) {
          throw new Error('Failed to fetch waitlist data');
        }
        const waitlistData = await waitlistResponse.json();
        setWaitlist(waitlistData);
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPetForm((prev) => ({ ...prev, [name]: value }));
  };

  const addPet = async (e) => {
    e.preventDefault();
    if (!breederData) {
      setAddPetError('Breeder data is not loaded');
      return;
    }

    try {
      setAddPetError(null);

      // Prepare the payload, including only non-empty fields
      const payload = {
        name: petForm.name,
        type: petForm.type,
        price: parseFloat(petForm.price), // Ensure price is a float
        breeder_id: breederData.id,
      };

      if (petForm.imageUrl.trim()) {
        payload.image_url = petForm.imageUrl.trim(); // Include only if not empty
      }
      const response = await fetch(
        `${config.breederUrl}/${breederData.id}/pets`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${jwtToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        },
      );

      if (!response.ok) {
        throw new Error('Failed to add pet');
      }

      const newPet = await response.json();
      setPets((prevPets) => [...prevPets, newPet]); // Update the pets list
      setPetForm({ name: '', type: '', price: '', imageUrl: '' }); // Clear the form
    } catch (err) {
      setAddPetError(err.message);
    }
  };

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
                {/* Match waitlist customers to this pet */}
                <div className="waitlist">
                  <h4>Waitlisted Customers</h4>
                  {waitlist.filter((entry) => entry.pet_id === pet.id).length >
                  0 ? (
                    <ul>
                      {waitlist
                        .filter((entry) => entry.pet_id === pet.id)
                        .map((customer) => (
                          <li key={customer.id}>
                            <p>Name: {customer.name}</p>
                            <p>Email: {customer.email}</p>
                          </li>
                        ))}
                    </ul>
                  ) : (
                    <p>No customers waitlisted for this pet.</p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No pets listed yet.</p>
        )}
      </div>
      <div className="pets-list">
        <div className="add-pet">
          <h2>Add a Pet</h2>
          <form
            onSubmit={addPet}
            style={{ display: 'flex', gap: '10px', alignItems: 'center' }}
          >
            <input
              type="text"
              name="name"
              value={petForm.name}
              placeholder="Pet Name"
              onChange={handleInputChange}
              required
              style={{
                padding: '10px',
                borderRadius: '5px',
                border: '1px solid #ccc',
                flex: 1,
              }}
            />
            <input
              type="text"
              name="type"
              value={petForm.type}
              placeholder="Pet Type"
              onChange={handleInputChange}
              required
              style={{
                padding: '10px',
                borderRadius: '5px',
                border: '1px solid #ccc',
                flex: 1,
              }}
            />
            <input
              type="text"
              name="price"
              value={petForm.price}
              placeholder="Price"
              onChange={handleInputChange}
              required
              style={{
                padding: '10px',
                borderRadius: '5px',
                border: '1px solid #ccc',
                flex: 1,
              }}
            />
            <input
              type="text"
              name="imageUrl"
              value={petForm.imageUrl}
              placeholder="Image URL (optional)"
              onChange={handleInputChange}
              style={{
                padding: '10px',
                borderRadius: '5px',
                border: '1px solid #ccc',
                flex: 1,
              }}
            />
            <button
              type="submit"
              style={{
                padding: '10px 20px',
                backgroundColor: '#007BFF',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontWeight: 'bold',
                transition: 'background-color 0.3s',
              }}
              onMouseOver={(e) => (e.target.style.backgroundColor = '#0056b3')}
              onMouseOut={(e) => (e.target.style.backgroundColor = '#007BFF')}
            >
              Add Pet
            </button>
          </form>
          {addPetError && (
            <p style={{ color: 'red', marginTop: '10px' }}>
              Error: {addPetError}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
