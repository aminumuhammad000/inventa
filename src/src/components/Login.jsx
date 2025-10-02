import React, { useState } from 'react';
import "../styles/Login.css"
import TargetIcon from '@mui/icons-material/CenterFocusStrong';
import StorefrontIcon from '@mui/icons-material/Storefront';
import Alert from './Alert';

const isElectron = Boolean(window && window.electron && window.electron.ipcRenderer);

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [toast, setToast] = useState({ show: false, message: "", icon: null });

  const showToast = (message, icon) => {
    setToast({ show: true, message, icon });
    setTimeout(() => setToast({ show: false, message: "", icon: null }), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isElectron) {
        const result = await window.electron.ipcRenderer.invoke('login', { email, password });
        if (result.success) {
          showToast(`Welcome ${result.user.name}`, 'check_circle');
          localStorage.setItem('isLoggedIn', 'true');
          localStorage.setItem('currentUser', result.user.name);
          setTimeout(() => {
            window.electron.ipcRenderer.send('load-dashboard');
          }, 1000);
        } else {
          showToast(result.message, 'error');
        }
      } else {
        // Fallback for browser: just show success
        showToast(`Welcome ${email}`, 'check_circle');
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('currentUser', email);
      }
    } catch (err) {
      showToast(err.message || String(err), 'error');
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
          <form id="loginForm" className="form" onSubmit={handleSubmit}>
            <div className="input-group">
              <input type="email" id="email" className="form-input" placeholder="Email ID" required value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            <div className="input-group">
              <input type="password" id="password" className="form-input" placeholder="Password" required value={password} onChange={e => setPassword(e.target.value)} />
            </div>
            <div className="form-options">
              <label className="checkbox-wrapper">
                <input type="checkbox" id="rememberMe" />
                <span className="checkmark"></span>
                <span className="checkbox-label">Keep me signed in</span>
              </label>
            </div>
            <button type="submit" className="login-btn">
              LOGIN
            </button>
          </form>
        </div>
      </div>
      {/* Notification Toast */}
      <Alert show={toast.show} message={toast.message} icon={toast.icon} onClose={() => setToast({ show: false, message: "", icon: null })} />
    </div>
  );
};

export default Login;
