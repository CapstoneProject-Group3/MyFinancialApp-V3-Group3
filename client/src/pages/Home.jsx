import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasToken, setHasToken] = useState(false);
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');

      if (token) {
        setIsAuthenticated(true);
        setHasToken(true);
      } else {
        setHasToken(false);
      }
    };

    checkAuth();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setHasToken(false);
  };

  const startServey = () => {

  };

  if (!hasToken) {
    return <div>You are not logged in.</div>;
  }

  return (
    <div>
      <h1>Welcome to the Home Page</h1>
      <p>You are authenticated and can view this content.</p>
      {/* Logout */}
      <button onClick={handleLogout}>Logout</button>
      <br />
      <p>Access our survey.</p>
      <button><Link to="/questionaire">Start Servey</Link></button>
    </div>
  );
};

export default Home;
