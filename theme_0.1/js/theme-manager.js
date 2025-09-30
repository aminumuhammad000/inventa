
// Initialize theme on page load
document.addEventListener('DOMContentLoaded', function() {
    initializeGlobalTheme();
});

function initializeGlobalTheme() {
    const savedTheme = localStorage.getItem('globalTheme') || localStorage.getItem('ownerTheme') || localStorage.getItem('employeeTheme') || 'green';
    applyGlobalTheme(savedTheme);
}

function applyGlobalTheme(themeName) {
    // Remove existing theme classes from both body and html
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
    
    // Update CSS custom properties for dynamic theming
    updateCSSVariables(themeName);
}

function updateCSSVariables(themeName) {
    const root = document.documentElement;
    const themeColors = {
        green: { 
            primary: '#10b981', 
            secondary: '#059669',
            primaryLight: '#d1fae5',
            primaryDark: '#047857'
        },
        blue: { 
            primary: '#3b82f6', 
            secondary: '#1d4ed8',
            primaryLight: '#dbeafe',
            primaryDark: '#1e40af'
        },
        purple: { 
            primary: '#8b5cf6', 
            secondary: '#7c3aed',
            primaryLight: '#e9d5ff',
            primaryDark: '#6d28d9'
        },
        red: { 
            primary: '#ef4444', 
            secondary: '#dc2626',
            primaryLight: '#fee2e2',
            primaryDark: '#b91c1c'
        },
        orange: { 
            primary: '#f97316', 
            secondary: '#ea580c',
            primaryLight: '#fed7aa',
            primaryDark: '#c2410c'
        },
        teal: { 
            primary: '#14b8a6', 
            secondary: '#0d9488',
            primaryLight: '#ccfbf1',
            primaryDark: '#0f766e'
        }
    };
    
    const colors = themeColors[themeName] || themeColors.green;
    
    // Set CSS custom properties
    root.style.setProperty('--theme-primary', colors.primary);
    root.style.setProperty('--theme-secondary', colors.secondary);
    root.style.setProperty('--theme-primary-light', colors.primaryLight);
    root.style.setProperty('--theme-primary-dark', colors.primaryDark);
}

function saveGlobalTheme(themeName) {
    try {
        localStorage.setItem('globalTheme', themeName);
        localStorage.setItem('ownerTheme', themeName);
        localStorage.setItem('employeeTheme', themeName);
        
        // Apply theme immediately
        applyGlobalTheme(themeName);
        
        console.log(`Global theme saved: ${themeName}`);
        return true;
    } catch (error) {
        console.error('Error saving global theme:', error);
        return false;
    }
}

function getCurrentGlobalTheme() {
    return localStorage.getItem('globalTheme') || 'green';
}

// Make functions globally available
window.applyGlobalTheme = applyGlobalTheme;
window.initializeGlobalTheme = initializeGlobalTheme;
window.saveGlobalTheme = saveGlobalTheme;
window.getCurrentGlobalTheme = getCurrentGlobalTheme;
window.updateCSSVariables = updateCSSVariables;
