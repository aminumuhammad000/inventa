// ==============================
// Global variables
// ==============================
let settingsData = {};


// ==============================
// Initialize shop settings page
// ==============================
document.addEventListener('DOMContentLoaded', () => {
  loadSettings();
  initializeThemeSettings();
});

// ==============================
// Load settings
// ==============================
async function loadSettings() {
  try {
    const shopFromDB = await window.api.invoke('get-shop');
    if (shopFromDB) {
      settingsData = {
        general: {
          shopName: shopFromDB.shop_name,
          shopAddress: shopFromDB.address,
          shopPhone: shopFromDB.phone,
          shopEmail: shopFromDB.email,
          currency: shopFromDB.currency || 'NGN'
        },
        id: shopFromDB.id
      };
    } else {
      settingsData = {
        general: {
          shopName: '',
          shopAddress: '',
          shopPhone: '',
          shopEmail: '',
          currency: 'NGN'
        }
      };
    }

    localStorage.setItem('shopSettings', JSON.stringify(settingsData));
    populateSettingsForm();
  } catch (err) {
    console.error('Error loading settings:', err);
    showToast('Failed to load settings', 'error');
  }
}

// ==============================
// Populate settings form
// ==============================
function populateSettingsForm() {
  const g = settingsData.general;
  document.getElementById('shopName').value = g.shopName;
  document.getElementById('shopAddress').value = g.shopAddress;
  document.getElementById('shopPhone').value = g.shopPhone;
  document.getElementById('shopEmail').value = g.shopEmail;
  document.getElementById('currency').value = g.currency;
}

// ==============================
// Save settings
// ==============================
async function saveSettings() {
  try {
    const newSettings = {
      general: {
        shopName: document.getElementById('shopName').value,
        shopAddress: document.getElementById('shopAddress').value,
        shopPhone: document.getElementById('shopPhone').value,
        shopEmail: document.getElementById('shopEmail').value,
        currency: document.getElementById('currency').value
      }
    };

    const shop = {
      id: settingsData.id || null,
      shop_name: newSettings.general.shopName,
      logo_url: '', // TODO: handle logo upload
      address: newSettings.general.shopAddress,
      theme_color: window.selectedTheme || localStorage.getItem('ownerTheme') || 'green',
      email: newSettings.general.shopEmail,
      phone: newSettings.general.shopPhone,
      currency: newSettings.general.currency
    };

    let result;
    if (shop.id) {
      result = await window.api.invoke('update-shop', shop);
      showToast('✅ Shop updated', 'success');
    } else {
      result = await window.api.invoke('add-shop', shop);
      shop.id = result?.id;
      showToast('✅ Shop created', 'success');
    }

    settingsData = { general: newSettings.general, id: shop.id };
    localStorage.setItem('shopSettings', JSON.stringify(settingsData));

    if (window.selectedTheme) {
      applyThemeToAllPages(window.selectedTheme);
      localStorage.setItem('ownerTheme', window.selectedTheme);
    }

  } catch (err) {
    console.error('Save failed:', err);
    showToast('Failed to save', 'error');
  }
}

// ==============================
// Update shop info in dropdown
// ==============================
function updateShopInfo() {
  const shopNameElements = document.querySelectorAll('.shop-name');
  const shopLocationElements = document.querySelectorAll('.shop-location');

  shopNameElements.forEach(el => el.textContent = settingsData.general.shopName);

  const addressParts = settingsData.general.shopAddress.split(',');
  const location = addressParts.length > 1
    ? addressParts[addressParts.length - 1].trim()
    : 'Nigeria';

  shopLocationElements.forEach(el => el.textContent = location);
}

// ==============================
// User dropdown functions
// ==============================
function toggleUserDropdown() {
  const dropdown = document.getElementById('userDropdown');
  const toggle = document.querySelector('.dropdown-toggle');

  if (!dropdown || !toggle) return;

  dropdown.classList.toggle('show');
  toggle.classList.toggle('active');

  if (dropdown.classList.contains('show')) {
    document.addEventListener('click', closeDropdownOnClickOutside);
  } else {
    document.removeEventListener('click', closeDropdownOnClickOutside);
  }
}

function closeDropdownOnClickOutside(event) {
  const dropdown = document.getElementById('userDropdown');
  const userInfo = document.querySelector('.user-info');
  if (dropdown && userInfo && !userInfo.contains(event.target)) {
    dropdown.classList.remove('show');
    document.querySelector('.dropdown-toggle')?.classList.remove('active');
    document.removeEventListener('click', closeDropdownOnClickOutside);
  }
}

// ==============================
// Toast notifications
// ==============================
function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <div class="toast-content">
      <i class="material-icons-round toast-icon">
        ${type === 'success' ? 'check_circle' : type === 'error' ? 'error' : 'info'}
      </i>
      <span class="toast-message">${message}</span>
    </div>
  `;

  toast.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${type === 'success' ? '#38a169' : type === 'error' ? '#e53e3e' : '#3182ce'};
    color: white;
    padding: 16px 20px;
    border-radius: 12px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
    z-index: 1000;
    transform: translateX(100%);
    transition: transform 0.3s ease;
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    font-weight: 500;
  `;

  document.body.appendChild(toast);

  setTimeout(() => toast.style.transform = 'translateX(0)', 100);
  setTimeout(() => {
    toast.style.transform = 'translateX(100%)';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// ==============================
// Theme Settings
// ==============================
function initializeThemeSettings() {
  const savedTheme = localStorage.getItem('ownerTheme') || 'green';
  selectTheme(savedTheme, false);
}

function selectTheme(themeName, applyNow = false) {
  document.querySelectorAll('.color-option').forEach(option => {
    option.classList.remove('selected');
    if (option.dataset.theme === themeName) {
      option.classList.add('selected');
    }
  });

  updateThemePreview(themeName);

  // Store temporarily (will save only on Save Settings)
  window.selectedTheme = themeName;

  if (applyNow) {
    applyThemeToAllPages(themeName);
    localStorage.setItem('ownerTheme', themeName);
    localStorage.setItem('globalTheme', themeName);
    showToast(`Theme changed to ${themeName}`, 'success');
  }
}

function updateThemePreview(themeName) {
  const preview = document.getElementById('themePreview');
  if (!preview) return;

  const themeColors = {
    green: { primary: '#10b981', secondary: '#059669' },
    blue: { primary: '#3b82f6', secondary: '#1d4ed8' },
    purple: { primary: '#8b5cf6', secondary: '#7c3aed' },
    red: { primary: '#ef4444', secondary: '#dc2626' },
    orange: { primary: '#f97316', secondary: '#ea580c' },
    teal: { primary: '#14b8a6', secondary: '#0d9488' }
  };

  const colors = themeColors[themeName] || themeColors.green;
  preview.style.setProperty('--theme-primary', colors.primary);
  preview.style.setProperty('--theme-secondary', colors.secondary);
}

function applyThemeToAllPages(themeName) {
  const body = document.body;
  const html = document.documentElement;
  const themes = ['green', 'blue', 'purple', 'red', 'orange', 'teal'];

  themes.forEach(theme => {
    body.classList.remove(`theme-${theme}`);
    html.classList.remove(`theme-${theme}`);
  });

  body.classList.add(`theme-${themeName}`);
  html.classList.add(`theme-${themeName}`);

  localStorage.setItem('globalTheme', themeName);
}

// ==============================
// Export functions for global access
// ==============================
window.toggleSidebar = toggleSidebar;
window.toggleUserDropdown = toggleUserDropdown;
window.openShopSettings = openShopSettings;
window.openProfileSettings = openProfileSettings;

window.selectTheme = selectTheme;

// ==============================
// Export for HTML buttons
// ==============================
window.saveSettings = saveSettings;
