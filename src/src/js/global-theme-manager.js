// Global Theme Manager - Works across Dashboard and Storefront
// This script ensures theme consistency across all pages

class GlobalThemeManager {
    constructor() {
        this.themeColors = {
            green: { 
                primary: '#10b981', 
                secondary: '#059669',
                primaryLight: '#d1fae5',
                primaryDark: '#047857',
                accent: '#34d399',
                gradient: 'linear-gradient(135deg, #10b981, #059669)'
            },
            blue: { 
                primary: '#3b82f6', 
                secondary: '#1d4ed8',
                primaryLight: '#dbeafe',
                primaryDark: '#1e40af',
                accent: '#60a5fa',
                gradient: 'linear-gradient(135deg, #3b82f6, #1d4ed8)'
            },
            purple: { 
                primary: '#8b5cf6', 
                secondary: '#7c3aed',
                primaryLight: '#e9d5ff',
                primaryDark: '#6d28d9',
                accent: '#a78bfa',
                gradient: 'linear-gradient(135deg, #8b5cf6, #7c3aed)'
            },
            red: { 
                primary: '#ef4444', 
                secondary: '#dc2626',
                primaryLight: '#fee2e2',
                primaryDark: '#b91c1c',
                accent: '#f87171',
                gradient: 'linear-gradient(135deg, #ef4444, #dc2626)'
            },
            orange: { 
                primary: '#f97316', 
                secondary: '#ea580c',
                primaryLight: '#fed7aa',
                primaryDark: '#c2410c',
                accent: '#fb923c',
                gradient: 'linear-gradient(135deg, #f97316, #ea580c)'
            },
            teal: { 
                primary: '#14b8a6', 
                secondary: '#0d9488',
                primaryLight: '#ccfbf1',
                primaryDark: '#0f766e',
                accent: '#5eead4',
                gradient: 'linear-gradient(135deg, #14b8a6, #0d9488)'
            }
        };
        
        this.currentTheme = 'green';
        this.init();
    }

    init() {
        // Load saved theme from localStorage
        this.loadTheme();
        
        // Apply theme immediately
        this.applyTheme(this.currentTheme);
        
        // Listen for theme changes from other pages
        this.setupThemeListener();
        
        // Apply theme on page load
        document.addEventListener('DOMContentLoaded', () => {
            this.applyTheme(this.currentTheme);
        });
    }

    loadTheme() {
        // Try to get theme from various localStorage keys
        const savedTheme = localStorage.getItem('globalTheme') || 
                         localStorage.getItem('employeeTheme') || 
                         localStorage.getItem('ownerTheme') || 
                         'green';
        
        this.currentTheme = savedTheme;
        console.log('Global Theme Manager: Loaded theme:', savedTheme);
    }

    applyTheme(themeName) {
        if (!this.themeColors[themeName]) {
            console.warn('Invalid theme name:', themeName);
            return;
        }

        this.currentTheme = themeName;
        
        // Remove existing theme classes
        this.removeThemeClasses();
        
        // Add new theme class
        document.body.classList.add(`theme-${themeName}`);
        document.documentElement.classList.add(`theme-${themeName}`);
        
        // Update CSS variables
        this.updateCSSVariables(themeName);
        
        // Update specific elements
        this.updateThemeElements(themeName);
        
        console.log('Global Theme Manager: Applied theme:', themeName);
    }

    removeThemeClasses() {
        const existingThemes = ['green', 'blue', 'purple', 'red', 'orange', 'teal'];
        existingThemes.forEach(theme => {
            document.body.classList.remove(`theme-${theme}`);
            document.documentElement.classList.remove(`theme-${theme}`);
        });
    }

    updateCSSVariables(themeName) {
        const root = document.documentElement;
        const colors = this.themeColors[themeName];
        
        // Set CSS custom properties
        root.style.setProperty('--theme-primary', colors.primary);
        root.style.setProperty('--theme-secondary', colors.secondary);
        root.style.setProperty('--theme-primary-light', colors.primaryLight);
        root.style.setProperty('--theme-primary-dark', colors.primaryDark);
        root.style.setProperty('--theme-accent', colors.accent);
        root.style.setProperty('--theme-gradient', colors.gradient);
        
        // Additional storefront-specific variables
        root.style.setProperty('--storefront-primary', colors.primary);
        root.style.setProperty('--storefront-secondary', colors.secondary);
        root.style.setProperty('--storefront-accent', colors.accent);
        root.style.setProperty('--storefront-gradient', colors.gradient);
    }

    updateThemeElements(themeName) {
        const colors = this.themeColors[themeName];
        
        // Update logo colors
        this.updateLogoColors(colors);
        
        // Update button colors
        this.updateButtonColors(colors);
        
        // Update accent elements
        this.updateAccentElements(colors);
        
        // Update product details elements
        this.updateProductDetailsElements(colors);
    }

    updateLogoColors(colors) {
        const logoIcons = document.querySelectorAll('.logo-icon');
        logoIcons.forEach(icon => {
            icon.style.background = colors.gradient;
        });
    }

    updateButtonColors(colors) {
        const primaryButtons = document.querySelectorAll('.btn-primary, .login-btn');
        primaryButtons.forEach(btn => {
            btn.style.background = colors.gradient;
            btn.style.borderColor = colors.primary;
        });
        
        const secondaryButtons = document.querySelectorAll('.btn-secondary');
        secondaryButtons.forEach(btn => {
            btn.style.borderColor = colors.primary;
        });
    }

    updateAccentElements(colors) {
        // Update breadcrumb links
        const breadcrumbLinks = document.querySelectorAll('.breadcrumb-link');
        breadcrumbLinks.forEach(link => {
            link.style.color = colors.primary;
        });
        
        // Update category buttons
        const categoryButtons = document.querySelectorAll('.category-btn.active');
        categoryButtons.forEach(btn => {
            btn.style.background = colors.primary;
            btn.style.borderColor = colors.primary;
        });
        
        // Update product cards
        const productCards = document.querySelectorAll('.product-card:hover');
        productCards.forEach(card => {
            card.style.borderColor = colors.primary;
        });
    }

    updateProductDetailsElements(colors) {
        // Update product brand
        const productBrands = document.querySelectorAll('.product-brand');
        productBrands.forEach(brand => {
            brand.style.background = `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`;
            brand.style.webkitBackgroundClip = 'text';
            brand.style.webkitTextFillColor = 'transparent';
        });
        
        // Update price sections
        const priceSections = document.querySelectorAll('.product-price-section');
        priceSections.forEach(section => {
            section.style.borderColor = colors.primary;
        });
        
        // Update quantity selection
        const quantitySections = document.querySelectorAll('.quantity-selection');
        quantitySections.forEach(section => {
            section.style.borderColor = colors.primary;
        });
        
        // Update quantity buttons
        const quantityButtons = document.querySelectorAll('.quantity-btn');
        quantityButtons.forEach(btn => {
            btn.style.borderColor = colors.primary;
            btn.style.color = colors.primary;
        });
        
        // Update quantity input
        const quantityInputs = document.querySelectorAll('#productQuantity');
        quantityInputs.forEach(input => {
            input.style.borderColor = colors.primary;
            input.style.color = colors.primary;
        });
        
        // Update action buttons
        const actionButtons = document.querySelectorAll('.btn-primary');
        actionButtons.forEach(btn => {
            btn.style.background = colors.gradient;
        });
        
        // Update specifications
        const specItems = document.querySelectorAll('.spec-item:hover');
        specItems.forEach(item => {
            item.style.borderColor = colors.primary;
        });
        
        // Update related products
        const relatedCards = document.querySelectorAll('.related-product-card:hover');
        relatedCards.forEach(card => {
            card.style.borderColor = colors.primary;
        });
    }

    setupThemeListener() {
        // Listen for storage changes (when theme is changed in another tab/page)
        window.addEventListener('storage', (e) => {
            if (e.key === 'globalTheme' || e.key === 'employeeTheme' || e.key === 'ownerTheme') {
                this.loadTheme();
                this.applyTheme(this.currentTheme);
            }
        });
        
        // Listen for custom theme change events
        window.addEventListener('themeChanged', (e) => {
            this.applyTheme(e.detail.theme);
        });
    }

    saveTheme(themeName) {
        // Save to localStorage
        localStorage.setItem('globalTheme', themeName);
        localStorage.setItem('employeeTheme', themeName);
        localStorage.setItem('ownerTheme', themeName);
        
        // Apply theme
        this.applyTheme(themeName);
        
        // Dispatch custom event
        window.dispatchEvent(new CustomEvent('themeChanged', {
            detail: { theme: themeName }
        }));
        
        console.log('Global Theme Manager: Saved theme:', themeName);
    }

    getCurrentTheme() {
        return this.currentTheme;
    }

    getThemeColors(themeName = null) {
        const theme = themeName || this.currentTheme;
        return this.themeColors[theme];
    }
}

// Initialize global theme manager
window.GlobalThemeManager = new GlobalThemeManager();

// Export for use in other scripts
window.applyGlobalTheme = (themeName) => {
    window.GlobalThemeManager.saveTheme(themeName);
};

window.getCurrentTheme = () => {
    return window.GlobalThemeManager.getCurrentTheme();
};

window.getThemeColors = (themeName) => {
    return window.GlobalThemeManager.getThemeColors(themeName);
};

// Auto-apply theme on page load
document.addEventListener('DOMContentLoaded', () => {
    window.GlobalThemeManager.applyTheme(window.GlobalThemeManager.getCurrentTheme());
});

console.log('Global Theme Manager initialized');
