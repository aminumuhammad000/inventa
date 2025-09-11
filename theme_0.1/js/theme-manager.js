// Global Theme Manager
// This script handles theme application across all pages

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
}

// Make function globally available
window.applyGlobalTheme = applyGlobalTheme;
window.initializeGlobalTheme = initializeGlobalTheme;
