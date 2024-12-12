import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import config from '../../config';
import { useAuth } from '../../contexts/AuthProvider';

export default function ProfileUserType({ userType, profile }) {
  const [data, setData] = useState({});
  const [waitlist, setWaitlist] = useState([]); // State for waitlist data
  const [loading, setLoading] = useState(true); // State for loading indicator
  const [error, setError] = useState(null); // State for error messages
  const { jwtToken } = useAuth();

  // Fetch data based on userType
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        if (userType === 'breeder') {
          const response = await fetch(
            `${config.breederUrl}/email/${profile.email}/`,
            {
              method: 'GET',
              mode: "cors",
              headers: {
                Authorization: `Bearer ${jwtToken}`, // Add Authorization header
                'Content-Type': 'application/json', // Add Content-Type header
              },
            },
          );
          if (!response.ok) {
            throw new Error(
              `Error fetching breeder data: ${response.statusText}`,
            );
          }
          const breederData = await response.json();
          setData(breederData);
        }

        if (userType === 'customer') {
          const response = await fetch(
            `${config.customerUrl}/email/${profile.email}/`,
            {
              method: 'GET',
              mode: "cors",
              headers: {
                Authorization: `Bearer ${jwtToken}`, // Add Authorization header
                'Content-Type': 'application/json', // Add Content-Type header
              },
            },
          );
          if (!response.ok) {
            throw new Error(
              `Error fetching customer data: ${response.statusText}`,
            );
          }
          const customerData = await response.json();
          setData(customerData);

          // Fetch waitlist entries for the customer
          if (customerData.id) {
            const waitlistResponse = await fetch(
              `${config.customerUrl}/${customerData.id}/waitlist`,
              {
                method: 'GET',
                mode: "cors",
                headers: {
                  Authorization: `Bearer ${jwtToken}`, // Add Authorization header
                  'Content-Type': 'application/json', // Add Content-Type header
                },
              },
            );
            if (!waitlistResponse.ok)
              throw new Error(
                `Error fetching waitlist: ${waitlistResponse.statusText}`,
              );
            const waitlistData = await waitlistResponse.json();

            // Enrich waitlist with pet and breeder details
            const enrichedWaitlist = await Promise.all(
              waitlistData.map(async (entry) => {
                try {
                  // Fetch pet details
                  const petResponse = await fetch(
                    `${config.petUrl}/${entry.pet_id}/`,
                    {
                      method: 'GET',
                      mode: "cors",
                      headers: {
                        Authorization: `Bearer ${jwtToken}`, // Add Authorization header
                        'Content-Type': 'application/json', // Add Content-Type header
                      },
                    },
                  );
                  if (!petResponse.ok)
                    throw new Error(
                      `Error fetching pet data: ${petResponse.statusText}`,
                    );
                  const petData = await petResponse.json();

                  // Fetch breeder details using breeder_id
                  const breederResponse = await fetch(
                    `${config.breederUrl}/${entry.breeder_id}/`,
                    {
                      method: 'GET',
                      mode: "cors",
                      headers: {
                        Authorization: `Bearer ${jwtToken}`, // Add Authorization header
                        'Content-Type': 'application/json', // Add Content-Type header
                      },
                    },
                  );
                  if (!breederResponse.ok)
                    throw new Error(
                      `Error fetching breeder data: ${breederResponse.statusText}`,
                    );
                  const breederData = await breederResponse.json();

                  return {
                    ...entry,
                    pet_name: petData.name || 'Unknown Pet',
                    pet_image: petData.image_url || '',
                    breeder_name: breederData.name || 'Unknown Breeder',
                  };
                } catch (err) {
                  console.error(err);
                  return {
                    ...entry,
                    pet_name: 'Error',
                    pet_image: '',
                    breeder_name: 'Error',
                  };
                }
              }),
            );

            setWaitlist(enrichedWaitlist);
          }
        }
      } catch (err) {
        console.error(err);
        setError(err.message); // Set error message
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userType, profile.email]);

  // Render loading state
  if (loading) {
    return <div>Loading...</div>;
  }

  // Render error state
  if (error) {
    return <div>Error: {error}</div>;
  }

  // Render content based on userType
  return (
    <div>
      {userType === 'breeder' ? (
        <div>
          <p>You are a breeder.</p>
          <h3>Breeder Information</h3>
          <p>WebName: {data.name}</p>
          <p>City: {data.breeder_city}</p>
          <p>Country: {data.breeder_country}</p>
          <p>Price Level: {data.price_level}</p>
          <p>Address: {data.breeder_address}</p>
          <Link to="/breeder" className="button is-primary is-outlined mt-4">
            Go to Breeder Dashboard
          </Link>
        </div>
      ) : userType === 'customer' ? (
        <div>
          <p>You are a customer.</p>
          <h3>Customer Information</h3>
          <p>WebName: {data.name}</p>

          {/* Waitlist Section */}
          <h3>Waitlist</h3>
          {waitlist.length > 0 ? (
            <ul>
              {waitlist.map((entry) => (
                <li key={entry.id} className="waitlist-entry">
                  <p>
                    <strong>Pet:</strong> {entry.pet_name}
                  </p>
                  {entry.pet_image && (
                    <img
                      src={entry.pet_image}
                      alt={entry.pet_name}
                      style={{ width: '100px' }}
                    />
                  )}
                  <p>
                    <strong>Breeder:</strong> {entry.breeder_name}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p>You have not joined any waitlist yet.</p>
          )}
        </div>
      ) : userType === 'unknown' ? (
        <div>No type</div>
      ) : (
        <div>Invalid user type</div>
      )}
    </div>
  );
}
