import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Home from './Frontend/Home';
import Login from './Frontend/Login';
import Register from './Frontend/Register';
import Customers from './Frontend/Customers';

function App() {
  return (
    <div>
      <nav>
        <div>
          <Link to="/" className="Nav-item">Home</Link>
          <Link to="/login" className="nav-item">Login</Link>
          <Link to="/register" className="nav-item">Register</Link>
        </div>
      </nav>
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/customers" element={<Customers />} />  {/* New route for customers */}
      </Routes>
    </div>
  );
}

export default App;
