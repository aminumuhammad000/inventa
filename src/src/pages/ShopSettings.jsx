import React from "react";
import "../styles/global-style.css";
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import PeopleIcon from '@mui/icons-material/People';
import AssessmentIcon from '@mui/icons-material/Assessment';
import SettingsIcon from '@mui/icons-material/Settings';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import SaveIcon from '@mui/icons-material/Save';

const ShopSettings = () => {
  // Placeholder handlers for demo; replace with real logic as needed
  const toggleSidebar = () => {};
  const toggleUserDropdown = () => {};
  const openShopSettings = () => {};
  const openProfileSettings = () => {};
  const logout = () => {};
  const selectTheme = () => {};
  const saveSettings = () => {};

  return (
    <div className="app-container">
      {/* Sidebar */}
      <aside className="sidebar" id="sidebar">
        {/* Sidebar Header */}
        <div className="sidebar-header">
          <div className="logo">
            <div className="logo-icon">🏗️</div>
            <div className="logo-text">Inventa</div>
          </div>
          <button className="sidebar-toggle" onClick={toggleSidebar}>
            <MenuIcon />
          </button>
        </div>
        {/* Navigation */}
        <nav className="sidebar-nav">
          <div className="nav-section">
            <div className="nav-section-title">Home</div>
            <a href="index.html" className="nav-item">
              <HomeIcon />
              <span>Home</span>
            </a>
          </div>
          <div className="nav-section">
            <div className="nav-section-title">Your Shop</div>
            <a href="inventory.html" className="nav-item">
              <Inventory2Icon />
              <span>Stock Items</span>
            </a>
            <a href="sales.html" className="nav-item">
              <PointOfSaleIcon />
              <span>Sell Items</span>
            </a>
            <a href="credit.html" className="nav-item">
              <CreditCardIcon />
              <span>Sell on Credit</span>
            </a>
            <a href="customers.html" className="nav-item">
              <PeopleIcon />
              <span>Customer List</span>
            </a>
          </div>
          <div className="nav-section">
            <div className="nav-section-title">Reports</div>
            <a href="reports.html" className="nav-item">
              <AssessmentIcon />
              <span>View Reports</span>
            </a>
          </div>
          <div className="nav-section">
            <div className="nav-section-title">Settings</div>
            <a href="shop-settings.html" className="nav-item active">
              <SettingsIcon />
              <span>Shop Settings</span>
            </a>
          </div>
        </nav>
        {/* Footer */}
        <div className="sidebar-footer">
          <div className="powered-by">
            <span>Powered By</span>
            <span className="company-name">PioneerICT</span>
          </div>
        </div>
      </aside>
      {/* Main Content */}
      <main className="main-content" id="mainContent">
        {/* Header */}
        <header className="header">
          <div className="header-left">
            <h1 className="page-title">Shop Settings</h1>
            <p className="page-subtitle">Configure your shop preferences and settings</p>
          </div>
          <div className="header-right">
            <div className="user-info">
              <div className="user-avatar">JD</div>
              <div className="user-details">
                <span className="user-name">John Doe</span>
                <span className="user-role">Shop Manager</span>
              </div>
              <div className="user-dropdown">
                <button className="dropdown-toggle" onClick={toggleUserDropdown}>
                  <KeyboardArrowDownIcon />
                </button>
                <div className="dropdown-menu" id="userDropdown">
                  <div className="dropdown-header">
                    <div className="shop-info">
                      <div className="shop-name">My Construction Shop</div>
                      <div className="shop-location">Your Location</div>
                    </div>
                  </div>
                  <div className="dropdown-divider"></div>
                  <a href="#" className="dropdown-item" onClick={openShopSettings}>
                    <SettingsIcon />
                    <span>Change Shop Info</span>
                  </a>
                  <a href="#" className="dropdown-item" onClick={openProfileSettings}>
                    <PersonIcon />
                    <span>Change My Info</span>
                  </a>
                  <a href="#" className="dropdown-item logout" onClick={logout}>
                    <LogoutIcon />
                    <span>Logout</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </header>
        {/* Content */}
        <div className="content">
          {/* Settings Sections */}
          <div className="settings-sections">
            {/* General Settings */}
            <div className="settings-card">
              <div className="settings-header">
                <h3>General Settings</h3>
                <p>Basic shop information and preferences</p>
              </div>
              <div className="settings-content">
                <div className="setting-item">
                  <label htmlFor="shopName">Shop Name</label>
                  <input type="text" id="shopName" placeholder="Enter shop name" />
                </div>
                <div className="setting-item">
                  <label htmlFor="logo">Upload Logo</label>
                  <input type="file" id="logo" />
                </div>
                <div className="setting-item">
                  <label htmlFor="shopAddress">Shop Address</label>
                  <textarea id="shopAddress" placeholder="Enter shop address"></textarea>
                </div>
                <div className="setting-item">
                  <label htmlFor="shopPhone">Phone Number</label>
                  <input type="tel" id="shopPhone" placeholder="Enter phone number" />
                </div>
                <div className="setting-item">
                  <label htmlFor="shopEmail">Email Address</label>
                  <input type="email" id="shopEmail" placeholder="Enter email address" />
                </div>
              </div>
            </div>
            {/* Theme Settings */}
            <div className="settings-card">
              <div className="settings-header">
                <h3>Theme Settings</h3>
                <p>Choose a color theme for the entire software</p>
              </div>
              <div className="settings-content">
                <div className="theme-settings">
                  <div className="theme-preview">
                    <h4>Live Preview</h4>
                    <div className="preview-card" id="themePreview">
                      <div className="preview-header">
                        <div className="preview-avatar">JD</div>
                        <div className="preview-text">
                          <div className="preview-title">John Doe</div>
                          <div className="preview-subtitle">Shop Owner</div>
                        </div>
                      </div>
                      <div className="preview-content">
                        <div className="preview-button">Sample Button</div>
                      </div>
                    </div>
                  </div>
                  <div className="theme-colors">
                    <h4>Choose Theme Color</h4>
                    <div className="color-options">
                      <div className="color-option selected" data-theme="green" onClick={() => selectTheme('green')}>
                        <div className="color-preview" style={{ background: '#10b981' }}></div>
                        <span>Green</span>
                      </div>
                      <div className="color-option" data-theme="blue" onClick={() => selectTheme('blue')}>
                        <div className="color-preview" style={{ background: '#3b82f6' }}></div>
                        <span>Blue</span>
                      </div>
                      <div className="color-option" data-theme="purple" onClick={() => selectTheme('purple')}>
                        <div className="color-preview" style={{ background: '#8b5cf6' }}></div>
                        <span>Purple</span>
                      </div>
                      <div className="color-option" data-theme="orange" onClick={() => selectTheme('orange')}>
                        <div className="color-preview" style={{ background: '#f97316' }}></div>
                        <span>Orange</span>
                      </div>
                      <div className="color-option" data-theme="teal" onClick={() => selectTheme('teal')}>
                        <div className="color-preview" style={{ background: '#14b8a6' }}></div>
                        <span>Teal</span>
                      </div>
                      <div className="color-option" data-theme="custom" onClick={() => selectTheme(document.getElementById('custom').value)}>
                        <div className="color-preview">
                          <input type="color" id="custom" style={{ borderRadius: '50%', border: 'none', width: '50px', height: '50px', marginLeft: '-10px', marginTop: '-10px' }} />
                        </div>
                        <span>Custom</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Action Buttons */}
          <div className="settings-actions">
            <button className="btn-primary" onClick={saveSettings}>
              <SaveIcon />
              Save Settings
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ShopSettings;
