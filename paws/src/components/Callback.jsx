import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import config from '../config';
import { useAuth } from '../contexts/AuthProvider';
import DeclareType from './DeclareType';

export default function Callback() {
  const { jwtToken } = useAuth();
  const { profile, userType, setUserType } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserType = async () => {
      try {
        const fetchBreeder = fetch(
          `${config.breederUrl}/email/${profile.email}/`,
          {
            method: 'GET',
            mode: "cors",
            headers: {
              Authorization: `Bearer ${jwtToken}`, // Include your token here
              'Content-Type': 'application/json', // Add other headers if necessary
            },
          },
        );

        const fetchCustomer = fetch(
          `${config.customerUrl}/email/${profile.email}/`,
          {
            method: 'GET',
            mode: "cors",
            headers: {
              Authorization: `Bearer ${jwtToken}`, // Include your token here
              'Content-Type': 'application/json', // Add other headers if necessary
            },
          },
        );
        const [breederRes, customerRes] = await Promise.all([
          fetchBreeder,
          fetchCustomer,
        ]);

        if (breederRes.status === 200) {
          setUserType('breeder');
          navigate('/breeder');
        } else if (customerRes.status === 200) {
          setUserType('customer');
          navigate('/');
        } else {
          setUserType('unknown');
        }
      } catch (error) {
        setUserType('unknown');
        console.log(error);
      }
    };

    if (profile?.email) {
      fetchUserType();
    }
  }, [profile?.email, setUserType, navigate]);

  if (!userType || userType === 'unknown') {
    return <DeclareType />;
  }

  return <div>Redirecting...</div>;
}
