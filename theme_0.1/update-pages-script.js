// Script to update all pages to use sidebar component
// This is a reference script - the actual updates are done manually

const pagesToUpdate = [
    'customers.html',
    'reports.html', 
    'shop-settings.html',
    'credit.html',
    'profit.html'
];

// For each page, we need to:
// 1. Replace the entire sidebar section with: <div id="sidebar-container"></div>
// 2. Add sidebar-component.js script
// 3. Add initialization script

const sidebarReplacement = `        <!-- Sidebar Container -->
        <div id="sidebar-container"></div>`;

const scriptAddition = `    <script src="js/sidebar-component.js"></script>
    <script>
        // Load sidebar component when page loads
        document.addEventListener('DOMContentLoaded', async function() {
            window.sidebarComponent = await SidebarComponent.loadSidebar('sidebar-container');
        });
    </script>`;

console.log('Pages to update:', pagesToUpdate);
console.log('Sidebar replacement:', sidebarReplacement);
console.log('Script addition:', scriptAddition);
