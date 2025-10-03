import "../styles/global-style.css";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import SettingsIcon from '@mui/icons-material/Settings';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';


import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from 'react-router-dom';

// Helper to get session info from localStorage
function getUserSession() {
  const sessionStr = localStorage.getItem('userSession');
  if (!sessionStr) return null;
  try {
    const session = JSON.parse(sessionStr);
    if (session.expiresAt && Date.now() < session.expiresAt) {
      return session;
    }
  } catch {}
  return null;
}

const Header = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [user, setUser] = useState(null);
  // const [shop, setShop] = useState(null);
  const [shop, setShop] = useState({ name: "", location: "" });

  const dropdownRef = useRef(null);

  // Fetch user info on mount
useEffect(() => {
  const session = getUserSession();
  if (!session) {
    setUser(null);
    return;
  }

  // Prefer preload API if available
  if (window.api?.getUser) {
    window.api.getUser(session.userId || session.userName)
      .then((userObj) => {
        if (userObj) {
          setUser(userObj);
        } 
        else {
          // fallback: just use session info
          setUser({
            name: session.userName,
            initials: (session.userName || '?').slice(0, 2).toUpperCase(),
            role: ''
          });
        }
      })
      .catch(() => {
        // fallback in case of error
        setUser({
          name: session.userName,
          initials: (session.userName || '?').slice(0, 2).toUpperCase(),
          role: ''
        });
      });
  } else {
    // Browser mode fallback
    setUser({
      name: session.userName,
      initials: (session.userName || '?').slice(0, 2).toUpperCase(),
      role: ''
    });
  }
}, []);


  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownOpen]);

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem('userSession');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser');
    window.location.replace('/login');
  };

useEffect(() => {
  if (window.api?.getShopById) {
    window.api.getShopById(1)
      .then((shopObj) => shopObj && setShop(shopObj))
      .catch(() => setShop({ name: "My Construction Shop", location: "Your Location" }));
  } else {
    const savedShop = JSON.parse(localStorage.getItem('shopSettings'));
    setShop(savedShop || { name: "My Construction Shop", location: "Your Location" });
  }
}, []);



  const navigate = useNavigate();
  return (
    <header className="header">
      <div className="header-left">
        <h1 className="page-title" id="pageTitle">Welcome!</h1>
        <p className="page-subtitle" id="pageSubtitle">
          View and manage all your sales, track payments, and monitor customer transactions
        </p>
      </div>
      <div className="header-right">
        <div className="user-info">
          <div className="user-avatar">{user ? (user.initials || (user.name || '?').slice(0,2).toUpperCase()) : '?'}</div>
          <div className="user-details">
            <span className="user-name">{user ? user.name : 'Guest'}</span>
            <span className="user-role">{user ? user.role : ''}</span>
          </div>
          <div className="user-dropdown" ref={dropdownRef}>
            <button className="dropdown-toggle" onClick={() => setDropdownOpen((open) => !open)}>
              <KeyboardArrowDownIcon />
            </button>
            <div className={`dropdown-menu${dropdownOpen ? ' show' : ''}`} id="userDropdown">
              <div className="dropdown-header">
                <div className="shop-info">
                  <div className="shop-name">{shop?.shop_name || "My Construction Shop"}</div>
                  <div className="shop-location">{shop?.address || "Your Location"}</div>
                </div>
              </div>
              <div className="dropdown-divider"></div>
              <a href="#" className="dropdown-item" onClick={() => { setDropdownOpen(false); navigate('/shop-settings'); }}>
                <SettingsIcon />
                <span>Change Shop Info</span>
              </a>
              <a href="#" className="dropdown-item" onClick={() => { setDropdownOpen(false); navigate('/profile-settings'); }}>
                <PersonIcon />
                <span>Change My Info</span>
              </a>
              <a href="#" className="dropdown-item logout" onClick={handleLogout}>
                <LogoutIcon />
                <span>Logout</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
