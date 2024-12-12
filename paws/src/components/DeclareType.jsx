import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import config from '../config';
import { useAuth } from '../contexts/AuthProvider';
import { Navigate } from 'react-router-dom';

export default function DeclareType() {
  const { jwtToken } = useAuth();
  const [type, setType] = useState('customer');
  const { profile, setUserType } = useAuth();

  // Validation schemas
  const breederSchema = yup.object().shape({
    name: yup
      .string()
      .required('Name is required')
      .max(50, 'Max 50 characters'),
    breeder_city: yup
      .string()
      .required('Breeder city is required')
      .max(100, 'Max 100 characters'),
    breeder_country: yup
      .string()
      .required('Breeder country is required')
      .max(100, 'Max 100 characters'),
    price_level: yup
      .string()
      .required('Price level is required')
      .max(50, 'Max 50 characters'),
    breeder_address: yup
      .string()
      .required('Breeder address is required')
      .max(255, 'Max 255 characters'),
  });

  const customerSchema = yup.object().shape({
    name: yup
      .string()
      .required('Name is required')
      .max(50, 'Max 50 characters'),
  });

  const validationSchema = type === 'breeder' ? breederSchema : customerSchema;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const { setCustomerId } = useAuth();

  const onSubmit = async (data) => {
    try {
      const payload = { ...data, email: profile.email };
      const url =
        type === 'breeder' ? `${config.breederUrl}/` : `${config.customerUrl}/`;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${jwtToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Failed to submit: ${response.statusText}`);
      }

      setUserType(type);

      if (type === 'customer') {
        // Fetch and set customerId after successfully setting the user type
        const customerResponse = await fetch(
          `${config.customerUrl}/email/${profile.email}`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${jwtToken}`,
              'Content-Type': 'application/json',
            },
          },
        );

        if (!customerResponse.ok) {
          throw new Error(
            `Failed to fetch customer ID: ${customerResponse.statusText}`,
          );
        }

        const customerData = await customerResponse.json();
        setCustomerId(customerData.id); // Update the customerId in context
        console.log('Customer ID set:', customerData.id);
      }

      <Navigate to="/" replace />;
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('There was an error submitting the form. Please try again.');
    }
  };

  return (
    <div className="container">
      <h1 className="title">Set Basic Info</h1>

      {/* Dropdown for selecting Customer or Breeder */}
      <div className="field">
        <label className="label">Select Type</label>
        <div className="control">
          <div className="select">
            <select value={type} onChange={(e) => setType(e.target.value)}>
              <option value="customer">Customer</option>
              <option value="breeder">Breeder</option>
            </select>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Name Field */}
        <div className="field">
          <label className="label">Name</label>
          <div className="control">
            <input
              className={`input ${errors.name ? 'is-danger' : ''}`}
              type="text"
              placeholder="Enter name"
              {...register('name')}
            />
          </div>
          {errors.name && (
            <p className="help is-danger">{errors.name.message}</p>
          )}
        </div>

        {/* Breeder-specific Fields */}
        {type === 'breeder' && (
          <>
            <div className="field">
              <label className="label">Breeder City</label>
              <div className="control">
                <input
                  className={`input ${errors.breeder_city ? 'is-danger' : ''}`}
                  type="text"
                  placeholder="Enter breeder city"
                  {...register('breeder_city')}
                />
              </div>
              {errors.breeder_city && (
                <p className="help is-danger">{errors.breeder_city.message}</p>
              )}
            </div>

            <div className="field">
              <label className="label">Breeder Country</label>
              <div className="control">
                <input
                  className={`input ${
                    errors.breeder_country ? 'is-danger' : ''
                  }`}
                  type="text"
                  placeholder="Enter breeder country"
                  {...register('breeder_country')}
                />
              </div>
              {errors.breeder_country && (
                <p className="help is-danger">
                  {errors.breeder_country.message}
                </p>
              )}
            </div>

            <div className="field">
              <label className="label">Price Level</label>
              <div className="control">
                <div className="select">
                  <select
                    className={`${errors.price_level ? 'is-danger' : ''}`}
                    {...register('price_level')}
                  >
                    <option value="">Select price level</option>
                    <option value="$">$</option>
                    <option value="$$">$$</option>
                    <option value="$$$">$$$</option>
                  </select>
                </div>
              </div>
              {errors.price_level && (
                <p className="help is-danger">{errors.price_level.message}</p>
              )}
            </div>

            <div className="field">
              <label className="label">Breeder Address</label>
              <div className="control">
                <input
                  className={`input ${
                    errors.breeder_address ? 'is-danger' : ''
                  }`}
                  type="text"
                  placeholder="Enter breeder address"
                  {...register('breeder_address')}
                />
              </div>
              {errors.breeder_address && (
                <p className="help is-danger">
                  {errors.breeder_address.message}
                </p>
              )}
            </div>
          </>
        )}
        {/* Submit Button */}
        <div className="field">
          <div className="control">
            <button className="button is-primary" type="submit">
              Submit
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
