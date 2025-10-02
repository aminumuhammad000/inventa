// ==============================
// Initialize theme on page load
// ==============================
document.addEventListener('DOMContentLoaded', async function() {
  await initializeGlobalTheme();
});

// ==============================
// Initialize theme (fetch from DB)
// ==============================
async function initializeGlobalTheme() {
  try {
    // Fetch saved theme directly from DB via IPC
    const dbTheme = await window.api.invoke('get-theme-color');
    const themeName = dbTheme || 'green';
    applyGlobalTheme(themeName);
    console.log(`Theme loaded from DB: ${themeName}`);
  } catch (error) {
    console.error('Error loading theme from DB, falling back to default:', error);
    applyGlobalTheme('green');
  }
}

// ==============================
// Apply theme
// ==============================
function applyGlobalTheme(themeName) {
  const body = document.body;
  const html = document.documentElement;
  const existingThemes = ['green', 'blue', 'purple', 'red', 'orange', 'teal'];

  // Remove old theme classes
  existingThemes.forEach(theme => {
    body.classList.remove(`theme-${theme}`);
    html.classList.remove(`theme-${theme}`);
  });

  // Add new theme
  body.classList.add(`theme-${themeName}`);
  html.classList.add(`theme-${themeName}`);

  // Update CSS variables
  updateCSSVariables(themeName);
}

// ==============================
// Update CSS custom properties
// ==============================
function updateCSSVariables(themeName) {
  const root = document.documentElement;
  const themeColors = {
    green: { primary: '#10b981', secondary: '#059669', primaryLight: '#d1fae5', primaryDark: '#047857' },
    blue: { primary: '#3b82f6', secondary: '#1d4ed8', primaryLight: '#dbeafe', primaryDark: '#1e40af' },
    purple: { primary: '#8b5cf6', secondary: '#7c3aed', primaryLight: '#e9d5ff', primaryDark: '#6d28d9' },
    red: { primary: '#ef4444', secondary: '#dc2626', primaryLight: '#fee2e2', primaryDark: '#b91c1c' },
    orange: { primary: '#f97316', secondary: '#ea580c', primaryLight: '#fed7aa', primaryDark: '#c2410c' },
    teal: { primary: '#14b8a6', secondary: '#0d9488', primaryLight: '#ccfbf1', primaryDark: '#0f766e' }
  };

  const colors = themeColors[themeName] || themeColors.green;

  root.style.setProperty('--theme-primary', colors.primary);
  root.style.setProperty('--theme-secondary', colors.secondary);
  root.style.setProperty('--theme-primary-light', colors.primaryLight);
  root.style.setProperty('--theme-primary-dark', colors.primaryDark);
}

// ==============================
// Save theme (update DB)
// ==============================
async function saveGlobalTheme(themeName) {
  try {
    // Get current shop from DB first
    const shop = await window.api.invoke('get-shop');
    if (!shop) throw new Error('No shop found to update theme');

    // Update shop with new theme
    const updatedShop = { ...shop, theme_color: themeName };
    await window.api.invoke('update-shop', updatedShop);

    // Apply theme immediately
    applyGlobalTheme(themeName);

    console.log(`Theme saved to DB: ${themeName}`);
    return true;
  } catch (error) {
    console.error('Error saving global theme to DB:', error);
    return false;
  }
}

// ==============================
// Get current theme (from DB)
// ==============================
async function getCurrentGlobalTheme() {
  try {
    const dbTheme = await window.api.invoke('get-theme-color');
    return dbTheme || 'green';
  } catch (error) {
    console.error('Error getting theme from DB:', error);
    return 'green';
  }
}

// ==============================
// Expose globally
// ==============================
window.applyGlobalTheme = applyGlobalTheme;
window.initializeGlobalTheme = initializeGlobalTheme;
window.saveGlobalTheme = saveGlobalTheme;
window.getCurrentGlobalTheme = getCurrentGlobalTheme;
window.updateCSSVariables = updateCSSVariables;
