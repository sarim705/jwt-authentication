import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login() {
  const [formData, setFormData] = useState({
    user_name: '',
    password: ''
  });
  const navigate = useNavigate();  
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:5003/api/login', formData);
      const { message, token } = response.data;  //assume server send data and token as response but we want Instead of alerting
                                                // the entire response object, we should access the specific part of the response that
                                           // contains the message (for example, response.data.message). if we dont use this means if only use
                                           // alert(data) then alert gives message [object object].means
                                          //rying to display an entire JavaScript object (like a response object) directly in an alert, 
                                          //which automatically converts it to a string representation: [object Object]


      alert(message);  // Notify login status
      
      if (token) {
        localStorage.setItem('token', token);  // Save the token to localStorage if login is successful
        navigate('/customers');  // Redirect to customers page after successful login
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        alert("Invalid username or password.");  // Show alert on wrong credentials
      } else {
        console.error("Error during login:", error);
      }
    }           /*nOte: imply logging error.message (or only error) does not always give you the detailed response from the server (especially in Axios). Axios attaches the
                   response from the server (like status code and error messages) inside error.response, not directly in error.message.
                   So, to handle specific error cases (like wrong password or unauthorized access), we need to explicitly check error.response and its status code,
                    rather than just error.message.*/
  }; 

  return (
    <div style={{ backgroundColor: 'rgb(209, 103, 156)', padding: '2%', margin: '5% auto', width: '30%', borderRadius: '1cm' }}>
      <div>
        <label style={{ color: 'white', fontWeight: 'bolder' }}>Username</label>
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
      <button
        onClick={handleLogin}
        style={{ backgroundColor: 'rgb(64, 57, 64)', color: 'white', padding: '10px', marginTop: '10px', borderRadius: '5px' }}>
        Login
      </button>
      <div style={{ marginTop: '10px' }}>
        <Link to="/register" style={{ color: 'white' }}>Not registered yet? Click here to Register</Link>
      </div>
    </div>
  );
}

export default Login;
