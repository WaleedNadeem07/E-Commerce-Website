import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import axios from 'axios';
import UserContext from '../userContext';

function AdminLogin2() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const { setUsername } = useContext(UserContext);
  
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post('http://localhost:8000/v1/api/admin-login', {
        email,
        password,
      });

      if (response.status === 200) {
        // Reset form fields
        setEmail('');
        setPassword('');
        setUsername(response.data.user.name);

        // Navigate to "/admin-home" after successful admin login
        console.log(response.data.user.name);
        navigate('/admin-home');
      } else {
        // Handle error response
        console.error('Admin login failed');
      }
    } catch (error) {
      // Handle network or other error
      alert(error);
      console.error('Error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="exampleInputEmail1">Email address</label>
        <input
          type="email"
          className="form-control"
          id="exampleInputEmail1"
          aria-describedby="emailHelp"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <small id="emailHelp" className="form-text text-muted">
          We'll never share your email with anyone else.
        </small>
      </div>
      <div className="form-group">
        <label htmlFor="exampleInputPassword1">Password</label>
        <input
          type="password"
          className="form-control"
          id="exampleInputPassword1"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <p></p>
      <button type="submit" className="btn btn-primary">
        Submit
      </button>
      <Link to="/signup" className="btn btn-primary" style={{ marginLeft: '0.5rem' }}>
        Signup
      </Link>
    </form>
  );
}

function AdminLogin() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
    <Card style={{ width: '18rem' }}>
      <Card.Body>
        <AdminLogin2 />
      </Card.Body>
    </Card>
    </div>
  );
}

export default AdminLogin;
