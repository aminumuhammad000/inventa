import "../styles/global-style.css";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import SettingsIcon from '@mui/icons-material/Settings';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';


import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

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

  // Example user/shop info (replace with real data as needed)
  const user = { name: "John Doe", initials: "JD", role: "Shop Owner" };
  const shop = { name: "My Construction Shop", location: "Your Location" };

  const navigate = useNavigate();
  return (
    <header className="header">
      <div className="header-left">
        <h1 className="page-title" id="pageTitle">Sale History</h1>
        <p className="page-subtitle" id="pageSubtitle">
          View and manage all your sales history, track payments, and monitor customer transactions
        </p>
      </div>
      <div className="header-right">
        <div className="user-info">
          <div className="user-avatar">{user.initials}</div>
          <div className="user-details">
            <span className="user-name">{user.name}</span>
            <span className="user-role">{user.role}</span>
          </div>
          <div className="user-dropdown" ref={dropdownRef}>
            <button className="dropdown-toggle" onClick={() => setDropdownOpen((open) => !open)}>
              <KeyboardArrowDownIcon />
            </button>
            <div className={`dropdown-menu${dropdownOpen ? ' show' : ''}`} id="userDropdown">
              <div className="dropdown-header">
                <div className="shop-info">
                  <div className="shop-name">{shop.name}</div>
                  <div className="shop-location">{shop.location}</div>
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
              <a href="#" className="dropdown-item logout" onClick={() => {/* logout logic */}}>
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
