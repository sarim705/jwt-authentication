import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Customers() {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const token = localStorage.getItem('token');  // Retrieve token from localStorage
        const config = {
          headers: {
            'Authorization':  token,  // Add token to Authorization header
          },
        };

        const response = await axios.get('http://localhost:5003/api/customers', config);  // Send request with token in headers
        setCustomers(response.data);  // Set customers data from response
      } catch (error) {
        console.error('Error fetching customers:', error);
        alert('Unauthorized! Please login first.');
      }
    };

    fetchCustomers();
  }, []);

  return (
    <div>
      <h2>Customers List</h2>
      <ul>
        {customers.map((customer) => (
          <li key={customer._id}>
            {customer.user_name} - {customer.email}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Customers;
