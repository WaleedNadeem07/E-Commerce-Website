import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import axios from 'axios';
import UserContext from '../userContext';

function Login2() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const { setUsername } = useContext(UserContext);

  const handleForgotPassword = () => {
    // Redirect to the page where it asks for the email
    navigate('/forgot-password');
  };
  
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post('http://localhost:8000/v1/api/login', {
        email,
        password,
      });

      if (response.status === 200) {
        // Reset form fields
        setEmail('');
        setPassword('');
        setUsername(response.data.user.name);

        // Navigate to "/home" after successful login
        console.log(response.data.user.name);
        navigate('/home');
      } else {
        // Handle error response
        console.error('Login failed');
      }
    } catch (error) {
      // Handle network or other error
      alert("Error. Wrong email or Password");
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
      <div className="form-group">
        <Link to="/forgot-password">Forgot Password</Link>
      </div>
      <button type="submit" className="btn btn-primary">
        Submit
      </button>
      <Link to="/signup" className="btn btn-primary" style={{ marginLeft: '0.5rem' }}>
        Signup
      </Link>
      <Link to="/admin-login" className="btn btn-primary" style={{ marginLeft: '0', marginTop: '0.5rem' }}>
        Admin Login
      </Link>
    </form>
  );
}

function Login() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
    <Card style={{ width: '18rem' }}>
      <Card.Body>
        <Login2 />
      </Card.Body>
    </Card>
    </div>
  );
}

export default Login;
