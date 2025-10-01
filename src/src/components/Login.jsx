import React from 'react';
// import "../styles/Login.css"
import "../styles/global-style.css"

const Login = () => (
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
          <i className="material-icons-round">target</i>
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
            <i className="material-icons-round">storefront</i>
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
        <form id="loginForm" className="form">
          <div className="input-group">
            <input type="email" id="email" className="form-input" placeholder="Email ID" required />
          </div>
          <div className="input-group">
            <input type="password" id="password" className="form-input" placeholder="Password" required />
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
    {/* Notification Toast */}
    <div id="toast" className="toast">
      <div className="toast-content">
        <i className="material-icons-round toast-icon"></i>
        <span className="toast-message"></span>
      </div>
      <button className="toast-close" onClick={() => window.hideToast && window.hideToast()}>
        <i className="material-icons-round">close</i>
      </button>
    </div>
  </div>
);

export default Login;
