import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import axios from 'axios';

function ForgotPassword() {
  const [email, setEmail] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      // Send the email to your backend to handle the password reset functionality
      const response = await axios.post('http://localhost:8000/v1/api/forgot-password', {
        email,
      });

      // Assuming your backend returns a success message upon successful email submission
      if (response.data.success) {
        // Show a success message to the user
        alert('An email with a password reset link has been sent to your email address.');
      } else {
        // Handle any error response from the backend
        alert('Failed to send password reset email. Please try again later.');
      }
    } catch (error) {
      // Handle network or other error
      console.error('Error:', error);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
      <Card style={{ width: '18rem' }}>
        <Card.Body>
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
                required
              />
            </div>
            <div style={{marginTop: '1rem'}}></div>
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
            <Link to="/" className="btn btn-secondary" style={{ marginLeft: '0.5rem' }}>
              Back to Login
            </Link>
          </form>
        </Card.Body>
      </Card>
    </div>
  );
}

export default ForgotPassword;
