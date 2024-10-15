import React, { useState } from 'react';
import axios from 'axios';

function Register() {
  const [formData, setFormData] = useState({
    user_name: '',
    password: '',
    age: '',
    email: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async () => {
    try {
      const response = await axios.post('http://localhost:5003/api/register', formData);
      console.log("data is",formData)
      alert(response.data);  // Notify registration status
    } catch (error) {
      console.error("Error during registration:", error);
      alert('Registration failed!');
    }
  };

  return (
    <div style={{ backgroundColor: 'rgb(209, 103, 156)', padding: '2%', margin: '5% auto', width: '30%', borderRadius: '1cm' }}>
      <div>
        <label style={{ color: 'white', fontWeight: 'bolder' }}>user_name</label>
        <input
          type="text"
          name="user_name"
          value={formData.user_name}
          onChange={handleChange}
          placeholder="Enter Username"
        />
      </div>
      <div>
        <label style={{ color: 'white', fontWeight: 'bolder' }}>Password</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Password"
        />
      </div>
      <div>
        <label style={{ color: 'white', fontWeight: 'bolder' }}>Age</label>
        <input
          type="number"
          name="age"
          value={formData.age}
          onChange={handleChange}
          placeholder="Enter Age"
          min="18"
        />
      </div>
      <div>
        <label style={{ color: 'white', fontWeight: 'bolder' }}>Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter Email"
        />
      </div>
      <button
        onClick={handleRegister}
        style={{ backgroundColor: 'rgb(64, 57, 64)', color: 'white', padding: '10px', marginTop: '10px', borderRadius: '5px' }}>
        Register
      </button>
    </div>
  );
}

export default Register;
