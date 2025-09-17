// Shop Settings Module
console.log('Shop Settings module loaded');

// Global variables
let settingsData = {};

// Initialize shop settings page
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing shop settings...');
    
    // Check authentication
    checkAuthentication();
    
    // Initialize sidebar
    initializeSidebar();
    
    // Load settings
    loadSettings();
    
    // Update user info
    updateUserInfo();
    
    // Initialize theme settings
    initializeThemeSettings();
});

// Check authentication
function checkAuthentication() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const currentUser = localStorage.getItem('currentUser');
    
    if (!isLoggedIn || !currentUser) {
        console.log('User not authenticated, redirecting to login...');
        window.location.href = 'login.html';
        return;
    }
    
    console.log('User authenticated:', currentUser);
}

// Update user info in header
function updateUserInfo() {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
        const userAvatar = document.querySelector('.user-avatar');
        const userName = document.querySelector('.user-name');
        
        if (userAvatar && userName) {
            const initials = currentUser.split('@')[0].substring(0, 2).toUpperCase();
            userAvatar.textContent = initials;
            userName.textContent = currentUser.split('@')[0];
        }
    }
}

// Initialize sidebar functionality
function initializeSidebar() {
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('mainContent');
    const toggleBtn = document.querySelector('.sidebar-toggle');
    
    const isCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
    if (isCollapsed) {
        sidebar.classList.add('collapsed');
        mainContent.classList.add('sidebar-collapsed');
    }
    
    if (toggleBtn) {
        toggleBtn.addEventListener('click', toggleSidebar);
    }
    
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            navItems.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

// Toggle sidebar
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('mainContent');
    
    sidebar.classList.toggle('collapsed');
    mainContent.classList.toggle('sidebar-collapsed');
    
    const isCollapsed = sidebar.classList.contains('collapsed');
    localStorage.setItem('sidebarCollapsed', isCollapsed.toString());
}

// Load settings from localStorage
function loadSettings() {
    try {
        const savedSettings = localStorage.getItem('shopSettings');
        if (savedSettings) {
            settingsData = JSON.parse(savedSettings);
        } else {
            settingsData = {
                general: {
                    shopName: 'My Shop',
                    shopAddress: 'Your Address',
                    shopPhone: '+234-000-000-0000',
                    shopEmail: 'info@myshop.com',
                    currency: 'NGN'
                }
            };
            localStorage.setItem('shopSettings', JSON.stringify(settingsData));
        }
        
        // Populate form fields
        populateSettingsForm();
        console.log('Settings loaded successfully');
        
    } catch (error) {
        console.error('Error loading settings:', error);
        settingsData = {
            general: {
                shopName: 'My Shop',
                shopAddress: 'Your Address',
                shopPhone: '+234-000-000-0000',
                shopEmail: 'info@myshop.com',
                currency: 'NGN'
            }
        };
        populateSettingsForm();
        showToast('Failed to load settings, using defaults', 'error');
    }
}


// Populate settings form
function populateSettingsForm() {
    // General settings only
    document.getElementById('shopName').value = settingsData.general.shopName;
    document.getElementById('shopAddress').value = settingsData.general.shopAddress;
    document.getElementById('shopPhone').value = settingsData.general.shopPhone;
    document.getElementById('shopEmail').value = settingsData.general.shopEmail;
    document.getElementById('currency').value = settingsData.general.currency;
}

// Save settings
function saveSettings() {
    try {
        // Collect form data
        const newSettings = {
            general: {
                shopName: document.getElementById('shopName').value,
                shopAddress: document.getElementById('shopAddress').value,
                shopPhone: document.getElementById('shopPhone').value,
                shopEmail: document.getElementById('shopEmail').value,
                currency: document.getElementById('currency').value
            }
        };
        
        // Validate settings
        if (!validateSettings(newSettings)) {
            return;
        }
        
        // Save to localStorage
        settingsData = newSettings;
        localStorage.setItem('shopSettings', JSON.stringify(settingsData));
        
        // Apply selected theme if one was selected
        if (window.selectedTheme) {
            applyThemeToAllPages(window.selectedTheme);
            localStorage.setItem('ownerTheme', window.selectedTheme);
            localStorage.setItem('globalTheme', window.selectedTheme);
        }
        
        // Update shop info in dropdown
        updateShopInfo();
        
        showToast('Settings saved successfully!', 'success');
        console.log('Settings saved:', settingsData);
        
    } catch (error) {
        console.error('Error saving settings:', error);
        showToast('Failed to save settings', 'error');
    }
}

// Validate settings
function validateSettings(settings) {
    // Validate required fields
    if (!settings.general.shopName.trim()) {
        showToast('Shop name is required', 'error');
        return false;
    }
    
    
    return true;
}

// Reset settings to default
function resetSettings() {
    if (confirm('Are you sure you want to reset settings to default?')) {
        // Reset to basic defaults
        settingsData = {
            general: {
                shopName: 'My Shop',
                shopAddress: 'Your Address',
                shopPhone: '+234-000-000-0000',
                shopEmail: 'info@myshop.com',
                currency: 'NGN'
            }
        };
        localStorage.setItem('shopSettings', JSON.stringify(settingsData));
        populateSettingsForm();
        showToast('Settings reset to default', 'success');
    }
}

// Update shop info in dropdown
function updateShopInfo() {
    const shopNameElements = document.querySelectorAll('.shop-name');
    const shopLocationElements = document.querySelectorAll('.shop-location');
    
    shopNameElements.forEach(element => {
        element.textContent = settingsData.general.shopName;
    });
    
    // Extract city from address
    const addressParts = settingsData.general.shopAddress.split(',');
    const location = addressParts.length > 1 ? addressParts[addressParts.length - 1].trim() : 'Nigeria';
    
    shopLocationElements.forEach(element => {
        element.textContent = location;
    });
}

// User dropdown functions
function toggleUserDropdown() {
    const dropdown = document.getElementById('userDropdown');
    const toggle = document.querySelector('.dropdown-toggle');
    
    if (dropdown && toggle) {
        dropdown.classList.toggle('show');
        toggle.classList.toggle('active');
        
        // Close dropdown when clicking outside
        if (dropdown.classList.contains('show')) {
            document.addEventListener('click', closeDropdownOnClickOutside);
        } else {
            document.removeEventListener('click', closeDropdownOnClickOutside);
        }
    }
}

function closeDropdownOnClickOutside(event) {
    const dropdown = document.getElementById('userDropdown');
    const userInfo = document.querySelector('.user-info');
    
    if (dropdown && userInfo && !userInfo.contains(event.target)) {
        dropdown.classList.remove('show');
        document.querySelector('.dropdown-toggle').classList.remove('active');
        document.removeEventListener('click', closeDropdownOnClickOutside);
    }
}

function openShopSettings() {
    // Already on shop settings page
    closeUserDropdown();
}

function openProfileSettings() {
    window.location.href = 'profile-settings.html';
}

function openNotifications() {
    window.location.href = 'notifications.html';
}

function openBackup() {
    window.location.href = 'backup-restore.html';
}

function openHelp() {
    window.location.href = 'help-support.html';
}

function logout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser');
    showToast('Logged out successfully', 'success');
    setTimeout(() => {
        window.location.href = 'login.html';
    }, 1500);
}

function closeUserDropdown() {
    const dropdown = document.getElementById('userDropdown');
    const toggle = document.querySelector('.dropdown-toggle');
    
    if (dropdown && toggle) {
        dropdown.classList.remove('show');
        toggle.classList.remove('active');
        document.removeEventListener('click', closeDropdownOnClickOutside);
    }
}

// Show toast notification
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <div class="toast-content">
            <i class="material-icons-round toast-icon">${type === 'success' ? 'check_circle' : type === 'error' ? 'error' : 'info'}</i>
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
    
    setTimeout(() => {
        toast.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
}

// Export functions for global access
window.toggleSidebar = toggleSidebar;
window.saveSettings = saveSettings;
window.resetSettings = resetSettings;
window.toggleUserDropdown = toggleUserDropdown;
window.openShopSettings = openShopSettings;
window.openProfileSettings = openProfileSettings;
window.openNotifications = openNotifications;
window.openBackup = openBackup;
window.openHelp = openHelp;
window.logout = logout;

// Theme Settings Functions
function initializeThemeSettings() {
    const savedTheme = localStorage.getItem('ownerTheme') || 'green';
    selectTheme(savedTheme, false);
}

function selectTheme(themeName, save = true) {
    // Update color options UI
    document.querySelectorAll('.color-option').forEach(option => {
        option.classList.remove('selected');
        if (option.dataset.theme === themeName) {
            option.classList.add('selected');
        }
    });
    
    // Update preview
    updateThemePreview(themeName);
    
    // Store selected theme temporarily (don't apply yet)
    window.selectedTheme = themeName;
    
    // Only apply and save if save is true (when Save Settings is clicked)
    if (save) {
        applyThemeToAllPages(themeName);
        localStorage.setItem('ownerTheme', themeName);
        showToast(`Theme changed to ${themeName.charAt(0).toUpperCase() + themeName.slice(1)}`, 'success');
    }
}

function updateThemePreview(themeName) {
    const preview = document.getElementById('themePreview');
    const themeColors = {
        green: { primary: '#10b981', secondary: '#059669' },
        blue: { primary: '#3b82f6', secondary: '#1d4ed8' },
        purple: { primary: '#8b5cf6', secondary: '#7c3aed' },
        red: { primary: '#ef4444', secondary: '#dc2626' },
        orange: { primary: '#f97316', secondary: '#ea580c' },
        teal: { primary: '#14b8a6', secondary: '#0d9488' }
    };
    
    const colors = themeColors[themeName] || themeColors.green;
    
    // Update preview card styles
    preview.style.setProperty('--theme-primary', colors.primary);
    preview.style.setProperty('--theme-secondary', colors.secondary);
}

function applyThemeToAllPages(themeName) {
    // Apply theme to current page
    const body = document.body;
    const html = document.documentElement;
    const existingThemes = ['green', 'blue', 'purple', 'red', 'orange', 'teal'];
    
    existingThemes.forEach(theme => {
        body.classList.remove(`theme-${theme}`);
        html.classList.remove(`theme-${theme}`);
    });
    
    // Add new theme class to both body and html for better coverage
    body.classList.add(`theme-${themeName}`);
    html.classList.add(`theme-${themeName}`);
    
    // Also save to a global theme variable for other pages
    localStorage.setItem('globalTheme', themeName);
}

// Make functions globally available
window.selectTheme = selectTheme;
