import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CORRECT_ID = 'admin@example.com';
const CORRECT_PASS = 'password123';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email === CORRECT_ID && password === CORRECT_PASS) {
      navigate('/dashboard');
    } else {
      alert('Incorrect email or password');
    }
  };

  return (
    <div className="container d-flex align-items-center justify-content-center min-vh-100 bg-light">
      <div className="card shadow p-4" style={{ maxWidth: 400, width: '100%' }}>
        <h2 className="mb-4 text-center">Sign In</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email address</label>
            <input
              type="email"
              className="form-control"
              id="email"
              placeholder={CORRECT_ID}
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              id="password"
              placeholder={CORRECT_PASS}
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">Login</button>
        </form>
        <div className="mt-3 text-center">
          <a href="#" className="text-decoration-none">Credential Hint: Placeholder</a>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;