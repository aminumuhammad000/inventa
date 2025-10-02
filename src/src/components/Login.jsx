import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../styles/Login.css"
import "../styles/global-style.css"
import TargetIcon from '@mui/icons-material/CenterFocusStrong';
import StorefrontIcon from "@mui/icons-material/Storefront"


const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Replace with your actual login logic
      const result = await window.api?.login?.(email, password);
      if (result && result.success) {
        alert(`✅ Login successful! Welcome ${result.user.email}`);
        navigate('/dashboard');
      } else {
        alert(`❌ Login failed: ${result?.message || 'Unknown error'}`);
      }
    } catch (err) {
      console.error("Login error:", err);
      alert("⚠️ Something went wrong. Please try again.");
    }
  };

  return (
    <div className="login-container">
    {/* Left Column - Welcome Section */}
    <div className="welcome-section">
      {/* Background Pattern */}
      <div className="background-pattern">
        <div className="grid-lines"></div>
        <div className="wave-shapes">
          <div className="wave wave-1"></div>
          <div className="wave wave-2"></div>
          <div className="wave wave-3"></div>
        </div>
        <div className="circles">
          <div className="circle circle-1"></div>
          <div className="circle circle-2"></div>
          <div className="circle circle-3"></div>
          <div className="circle circle-4"></div>
        </div>
        <div className="network-dots">
          <div className="dot dot-1"></div>
          <div className="dot dot-2"></div>
          <div className="dot dot-3"></div>
          <div className="dot dot-4"></div>
          <div className="dot dot-5"></div>
        </div>
      </div>
      {/* Company Logo */}
      <div className="company-logo">
        <div className="logo-icon">
          <TargetIcon style={{ fontSize: 40 }} />
        </div>
        <span className="company-name">INVENTA</span>
      </div>
      {/* Welcome Content */}
      <div className="welcome-content">
        <h1 className="welcome-title">Welcome back to your shop</h1>
        <h2 className="welcome-subtitle">INVENTA DESKTOP</h2>
        <div className="separator"></div>
        {/* Store Access Button */}
        <div className="store-access">
          <button className="store-btn" onClick={() => window.location.href='storefront.html'}>
            <StorefrontIcon style={{ fontSize: 24, marginRight: 8 }} />
            <span>Visit Our Store</span>
            <small>Browse products before logging in</small>
          </button>
        </div>
        <p className="welcome-description">
          Track inventory, process sales, manage customer accounts, and generate reports - all offline on your desktop computer.
        </p>
      </div>
    </div>
    {/* Right Column - Login Form */}
    <div className="login-section">
      <div className="login-form-container">
        <div className="form-header">
          <h2>Shop Login</h2>
          <p>offline on your computer.</p>
        </div>

        <form id="loginForm" className="form" onSubmit={handleLogin}>
          <div className="input-group">
            <input
              type="email"
              id="email"
              className="form-input"
              placeholder="Email ID"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>
          <div className="input-group">
            <input
              type="password"
              id="password"
              className="form-input"
              placeholder="Password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>
          <div className="form-options">
            <label className="checkbox-wrapper">
              <input type="checkbox" id="rememberMe" />
              <span className="checkmark"></span>
              <span className="checkbox-label">Keep me signed in</span>
            </label>
            {/* <a href="signup.html" className="member-link">Need to setup shop?</a> */}
          </div>
          <button type="submit" className="login-btn">
            LOGIN
          </button>
        </form>
      </div>
    </div>
    </div>
  );
};

export default Login;
