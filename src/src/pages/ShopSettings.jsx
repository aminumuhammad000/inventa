import React, { useState, useEffect, useRef } from "react";
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
import Alert from "../components/Alert";


const themeColors = {
  green: { primary: '#10b981', secondary: '#059669' },
  blue: { primary: '#3b82f6', secondary: '#2563eb' },
  purple: { primary: '#8b5cf6', secondary: '#7c3aed' },
  red: { primary: '#ef4444', secondary: '#b91c1c' },
  orange: { primary: '#f97316', secondary: '#ea580c' },
  teal: { primary: '#14b8a6', secondary: '#0d9488' }
};

const defaultShop = {
  name: '',
  address: '',
  phone: '',
  email: '',
  logo: '', // base64 or url
};

const ShopSettings = () => {
  // State for shop info
  const [shop, setShop] = useState(defaultShop);
  const [theme, setTheme] = useState('green');
  const [customColor, setCustomColor] = useState('#10b981');
  const [logoPreview, setLogoPreview] = useState('');
  const customColorRef = useRef(null);
   const [toast, setToast] = useState({ show: false, message: "", icon: null });



    const showToast = (message, icon) => {
    setToast({ show: true, message, icon });
    setTimeout(() => setToast({ show: false, message: "", icon: null }), 3000);
  };

  // Load settings from localStorage (or replace with API/db as needed)
  useEffect(() => {
    const savedShop = JSON.parse(localStorage.getItem('shopSettings')) || defaultShop;
    setShop(savedShop);
    if (savedShop.logo) setLogoPreview(savedShop.logo);
    const savedTheme = localStorage.getItem('globalTheme') || 'green';
    setTheme(savedTheme);
    if (savedTheme === 'custom') {
      const custom = localStorage.getItem('customThemeColor') || '#10b981';
      setCustomColor(custom);
    }
  }, []);

  // Apply theme to body/html and preview
  useEffect(() => {
    const themes = ['green', 'blue', 'purple', 'red', 'orange', 'teal', 'custom'];
    const body = document.body;
    const html = document.documentElement;
    themes.forEach(t => {
      body.classList.remove(`theme-${t}`);
      html.classList.remove(`theme-${t}`);
    });
    body.classList.add(`theme-${theme}`);
    html.classList.add(`theme-${theme}`);
    localStorage.setItem('globalTheme', theme);
    // For custom theme, set CSS vars
    if (theme === 'custom') {
      body.style.setProperty('--theme-primary', customColor);
      html.style.setProperty('--theme-primary', customColor);
      localStorage.setItem('customThemeColor', customColor);
    } else {
      const colors = themeColors[theme] || themeColors.green;
      body.style.setProperty('--theme-primary', colors.primary);
      html.style.setProperty('--theme-primary', colors.primary);
    }
  }, [theme, customColor]);

  // Handlers
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setShop(prev => ({ ...prev, [id]: value }));
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setShop(prev => ({ ...prev, logo: ev.target.result }));
        setLogoPreview(ev.target.result);
      };
      reader.readAsDataURL(file);
    }
  };


  const selectTheme = async (themeName) => {
    if (themeName === 'custom') {
      setTheme('custom');
      if (customColorRef.current) {
        setCustomColor(customColorRef.current.value);
      }
      // For custom, update CSS immediately
      if (window.updateCSSVariables) {
        window.updateCSSVariables('custom');
      }
    } else {
      setTheme(themeName);
      // Apply and save theme globally (DB and all pages)
      if (window.saveGlobalTheme) {
        await window.saveGlobalTheme(themeName);
      }
      if (window.applyGlobalTheme) {
        window.applyGlobalTheme(themeName);
      }
    }
  };

  const handleCustomColor = (e) => {
    setCustomColor(e.target.value);
    setTheme('custom');
    // For custom, update CSS immediately
    if (window.updateCSSVariables) {
      window.updateCSSVariables('custom');
    }
  };

 const saveSettings = async () => {
  try {
    // Save in DB
    const saved = await window.api.addShop({
      shop_name: shop.name,
      logo_url: shop.logo,
      address: shop.address,
      theme_color: theme === "custom" ? customColor : themeColors[theme]?.primary,
      email: shop.email,
      phone: shop.phone,
    });

    localStorage.setItem("shopSettings", JSON.stringify(shop));
    localStorage.setItem("globalTheme", theme);

    if (theme === "custom") {
      localStorage.setItem("customThemeColor", customColor);
    }
     showToast(`Shop settings saved successfully!`, 'check_circle');
  } catch (err) {    
    showToast(`Failed to save shop settings.'}`, 'error');
  }
};


  return (
    <div className="app-container">
      {/* Sidebar */}
     
      {/* Main Content */}
      <main className="main-content" id="mainContent">
       
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
                  <input type="text" id="name" placeholder="Enter shop name" value={shop.name} onChange={handleInputChange} />
                </div>
                <div className="setting-item">
                  <label htmlFor="logo">Upload Logo</label>
                  <input type="file" id="logo" accept="image/*" onChange={handleLogoChange} />
                  {logoPreview && (
                    <img src={logoPreview} alt="Logo Preview" style={{ maxWidth: 80, marginTop: 8 }} />
                  )}
                </div>
                <div className="setting-item">
                  <label htmlFor="shopAddress">Shop Address</label>
                  <textarea id="address" placeholder="Enter shop address" value={shop.address} onChange={handleInputChange}></textarea>
                </div>
                <div className="setting-item">
                  <label htmlFor="shopPhone">Phone Number</label>
                  <input type="tel" id="phone" placeholder="Enter phone number" value={shop.phone} onChange={handleInputChange} />
                </div>
                <div className="setting-item">
                  <label htmlFor="shopEmail">Email Address</label>
                  <input type="email" id="email" placeholder="Enter email address" value={shop.email} onChange={handleInputChange} />
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
                  <div className="theme-colors">
                    <h4>Choose Theme Color</h4>
                    <div className="color-options">
                      <div className={`color-option${theme === 'green' ? ' selected' : ''}`} data-theme="green" onClick={() => selectTheme('green')}>
                        <div className="color-preview" style={{ background: '#10b981' }}></div>
                        <span>Green</span>
                      </div>
                      <div className={`color-option${theme === 'blue' ? ' selected' : ''}`} data-theme="blue" onClick={() => selectTheme('blue')}>
                        <div className="color-preview" style={{ background: '#3b82f6' }}></div>
                        <span>Blue</span>
                      </div>
                      <div className={`color-option${theme === 'purple' ? ' selected' : ''}`} data-theme="purple" onClick={() => selectTheme('purple')}>
                        <div className="color-preview" style={{ background: '#8b5cf6' }}></div>
                        <span>Purple</span>
                      </div>
                      <div className={`color-option${theme === 'orange' ? ' selected' : ''}`} data-theme="orange" onClick={() => selectTheme('orange')}>
                        <div className="color-preview" style={{ background: '#f97316' }}></div>
                        <span>Orange</span>
                      </div>
                      <div className={`color-option${theme === 'teal' ? ' selected' : ''}`} data-theme="teal" onClick={() => selectTheme('teal')}>
                        <div className="color-preview" style={{ background: '#14b8a6' }}></div>
                        <span>Teal</span>
                      </div>
                      <div className={`color-option${theme === 'custom' ? ' selected' : ''}`} data-theme="custom" onClick={() => selectTheme('custom')}>
                        <div className="color-preview">
                          <input
                            type="color"
                            id="custom"
                            ref={customColorRef}
                            value={customColor}
                            onChange={handleCustomColor}
                            style={{ borderRadius: '50%', border: 'none', width: '50px', height: '50px', marginLeft: '-10px', marginTop: '-10px', cursor: 'pointer' }}
                          />
                        </div>
                        <span>Custom</span>
                      </div>
                    </div>
                                    <button className="btn-primary" onClick={saveSettings}>
              <SaveIcon />
              Save Settings
            </button>
                  </div>
                  
                </div>
                
              </div>

            </div>
          </div>
        </div>
      </main>
     {/* Notification Toast */}
      <Alert show={toast.show} message={toast.message} icon={toast.icon} onClose={() => setToast({ show: false, message: "", icon: null })} />
    
    </div>
  );
};

export default ShopSettings;
