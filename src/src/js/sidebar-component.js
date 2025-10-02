// Shared Sidebar Component JavaScript
class SidebarComponent {
    constructor() {
        this.sidebar = null;
        this.mainContent = null;
        this.toggleBtn = null;
        this.currentPage = this.getCurrentPage();
    }

    // Initialize sidebar functionality
    init() {
        this.sidebar = document.getElementById('sidebar');
        this.mainContent = document.getElementById('mainContent');
        this.toggleBtn = document.getElementById('sidebarToggle');

        if (!this.sidebar || !this.mainContent || !this.toggleBtn) {
            console.error('Sidebar elements not found');
            return;
        }

        this.loadSidebarState();
        this.setupEventListeners();
        this.setActiveNavItem();
    }

    // Load sidebar state from localStorage
    loadSidebarState() {
        const isCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
        if (isCollapsed) {
            this.sidebar.classList.add('collapsed');
            this.mainContent.classList.add('sidebar-collapsed');
            
            // Update toggle button icon for collapsed state
            const icon = this.toggleBtn.querySelector('i');
            icon.textContent = 'menu_open';
            this.toggleBtn.title = 'Expand Sidebar';
        }
    }

    // Setup event listeners
    setupEventListeners() {
        // Toggle button
        this.toggleBtn.addEventListener('click', () => this.toggle());

        // Navigation items
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                // Remove active class from all items
                navItems.forEach(nav => nav.classList.remove('active'));
                // Add active class to clicked item
                item.classList.add('active');
            });
        });
    }

    // Toggle sidebar
    toggle() {
        console.log('toggleSidebar called');
        
        this.sidebar.classList.toggle('collapsed');
        this.mainContent.classList.toggle('sidebar-collapsed');
        
        const isCollapsed = this.sidebar.classList.contains('collapsed');
        localStorage.setItem('sidebarCollapsed', isCollapsed.toString());
        
        // Update toggle button icon
        const icon = this.toggleBtn.querySelector('i');
        if (isCollapsed) {
            icon.textContent = 'menu_open';
            this.toggleBtn.title = 'Expand Sidebar';
            console.log('Sidebar collapsed');
        } else {
            icon.textContent = 'menu';
            this.toggleBtn.title = 'Collapse Sidebar';
            console.log('Sidebar expanded');
        }
    }

    // Get current page name
    getCurrentPage() {
        const path = window.location.pathname;
        const page = path.split('/').pop().replace('.html', '');
        return page || 'home';
    }

    // Set active navigation item based on current page
    setActiveNavItem() {
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.classList.remove('active');
            const page = item.getAttribute('data-page');
            if (page === this.currentPage) {
                item.classList.add('active');
            }
        });
    }

    // Load sidebar HTML into container
    static async loadSidebar(containerId) {
        try {
            const response = await fetch('components/sidebar.html');
            const sidebarHTML = await response.text();
            const container = document.getElementById(containerId);
            if (container) {
                container.innerHTML = sidebarHTML;
                // Initialize sidebar after loading
                const sidebarComponent = new SidebarComponent();
                sidebarComponent.init();
                return sidebarComponent;
            }
        } catch (error) {
            console.error('Error loading sidebar:', error);
        }
    }
}

// Global toggle function for backward compatibility
function toggleSidebar() {
    if (window.sidebarComponent) {
        window.sidebarComponent.toggle();
    }
}

// Export for global access
window.SidebarComponent = SidebarComponent;
window.toggleSidebar = toggleSidebar;
