import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = ({ onLogin }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleLogin = (e) => {
    e.preventDefault();
    
    // Get values from environment variables
    const validUsername = 'admin';
    const validPassword = 'Password123';

    if (formData.username === validUsername && formData.password === validPassword) {
      onLogin(); // Call the onLogin function from props
      navigate('/professionals'); // Navigate to professionals page
      setError('');
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
        
        {error && (
          <div className="mb-4 p-2 text-sm text-red-600 bg-red-100 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Username
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-[#4B2E2E]"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-[#4B2E2E]"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#4B2E2E] text-white py-2 px-4 rounded hover:bg-[#6A4C4C] transition-colors"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Dashboard;