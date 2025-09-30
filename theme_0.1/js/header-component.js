// Shared Header Component JavaScript
class HeaderComponent {
    constructor() {
        this.header = null;
        this.userDropdown = null;
        this.pageTitle = null;
    }

    // Initialize header functionality
    init() {
        this.header = document.querySelector('.header');
        this.userDropdown = document.getElementById('userDropdown');
        this.pageTitle = document.getElementById('pageTitle');

        if (!this.header) {
            console.error('Header element not found');
            return;
        }

        this.setupEventListeners();
        this.setPageTitle();
    }

    // Setup event listeners
    setupEventListeners() {
        // User dropdown toggle
        const userInfo = document.querySelector('.user-info');
        if (userInfo) {
            userInfo.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleUserDropdown();
            });
        }

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.header.contains(e.target)) {
                this.closeUserDropdown();
            }
        });
    }

    // Toggle user dropdown
    toggleUserDropdown() {
        if (this.userDropdown) {
            this.userDropdown.classList.toggle('active');
        }
    }

    // Close user dropdown
    closeUserDropdown() {
        if (this.userDropdown) {
            this.userDropdown.classList.remove('active');
        }
    }

    // Set page title dynamically
    setPageTitle(title = null, subtitle = null) {
        if (this.pageTitle && title) {
            this.pageTitle.textContent = title;
        } else if (this.pageTitle) {
            // Auto-detect page title based on current page
            const currentPage = this.getCurrentPage();
            const pageTitles = {
                'index': 'Your Shop Overview',
                'inventory': 'Stock Items Management',
                'sales': 'Sell Items',
                'credit': 'Sell on Credit',
                'customers': 'Customer Management',
                'reports': 'Reports & Analytics',
                'profit': 'Profit Analysis',
                'shop-settings': 'Shop Settings'
            };
            this.pageTitle.textContent = pageTitles[currentPage] || 'Your Shop';
        }

        // Set page subtitle
        const pageSubtitle = document.getElementById('pageSubtitle');
        if (pageSubtitle && subtitle) {
            pageSubtitle.textContent = subtitle;
        } else if (pageSubtitle) {
            const currentPage = this.getCurrentPage();
            const pageSubtitles = {
                'index': 'Welcome back! Here\'s how your shop is doing today.',
                'inventory': 'Manage your stock items and inventory.',
                'sales': 'Process sales and manage transactions.',
                'credit': 'Handle credit sales and payments.',
                'customers': 'Manage your customer database.',
                'reports': 'View detailed reports and analytics.',
                'profit': 'Analyze your profit margins and trends.',
                'shop-settings': 'Configure your shop settings.'
            };
            pageSubtitle.textContent = pageSubtitles[currentPage] || 'Manage your shop efficiently.';
        }
    }

    // Get current page name
    getCurrentPage() {
        const path = window.location.pathname;
        const page = path.split('/').pop().replace('.html', '');
        return page || 'index';
    }

    // Load header HTML into container
    static async loadHeader(containerId, pageTitle = null, pageSubtitle = null) {
        try {
            const response = await fetch('components/header.html');
            const headerHTML = await response.text();
            const container = document.getElementById(containerId);
            if (container) {
                container.innerHTML = headerHTML;
                // Initialize header after loading
                const headerComponent = new HeaderComponent();
                headerComponent.init();
                if (pageTitle) {
                    headerComponent.setPageTitle(pageTitle, pageSubtitle);
                }
                return headerComponent;
            }
        } catch (error) {
            console.error('Error loading header:', error);
        }
    }
}

// Global functions for backward compatibility
function toggleUserDropdown() {
    if (window.headerComponent) {
        window.headerComponent.toggleUserDropdown();
    }
}

function logout() {
    // Add logout functionality here
    console.log('Logout clicked');
    // You can add actual logout logic here
}

function openShopSettings() {
    window.location.href = 'shop-settings.html';
}

function openProfileSettings() {
    // Add profile settings functionality here
    console.log('Profile settings clicked');
}

// Export for global access
window.HeaderComponent = HeaderComponent;
window.toggleUserDropdown = toggleUserDropdown;
window.logout = logout;
