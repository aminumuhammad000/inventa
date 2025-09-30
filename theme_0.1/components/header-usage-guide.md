# Header Component Usage Guide

## How to Use the Header Component on Any Page

The header component provides a consistent header with page title, subtitle, and user dropdown across all pages.

### Basic Usage

```html
<!-- In your HTML -->
<div id="header-container"></div>

<script>
// Load header component
document.addEventListener('DOMContentLoaded', async function() {
    window.headerComponent = await HeaderComponent.loadHeader('header-container');
});
</script>
```

### Custom Title and Subtitle

```html
<script>
// Load header with custom title and subtitle
window.headerComponent = await HeaderComponent.loadHeader(
    'header-container', 
    'Your Custom Title', 
    'Your custom subtitle here'
);
</script>
```

### Page-Specific Examples

#### Sales Page
```javascript
window.headerComponent = await HeaderComponent.loadHeader(
    'header-container', 
    'Sell Items', 
    'Process sales and manage transactions'
);
```

#### Inventory Page
```javascript
window.headerComponent = await HeaderComponent.loadHeader(
    'header-container', 
    'Stock Items Management', 
    'Manage your stock items and inventory'
);
```

#### Customers Page
```javascript
window.headerComponent = await HeaderComponent.loadHeader(
    'header-container', 
    'Customer Management', 
    'Manage your customer database'
);
```

#### Reports Page
```javascript
window.headerComponent = await HeaderComponent.loadHeader(
    'header-container', 
    'Reports & Analytics', 
    'View detailed reports and analytics'
);
```

### Auto-Detection

If you don't specify a title, the component will automatically detect the page and set appropriate titles:

- `index.html` → "Your Shop Overview"
- `sales.html` → "Sell Items"
- `inventory.html` → "Stock Items Management"
- `customers.html` → "Customer Management"
- `reports.html` → "Reports & Analytics"

### Complete Page Template

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Page - Inventa</title>
    <link rel="stylesheet" href="css/style.css">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons+Round" rel="stylesheet">
</head>
<body>
    <div class="app-container">
        <!-- Sidebar Container -->
        <div id="sidebar-container"></div>

        <!-- Main Content -->
        <main class="main-content" id="mainContent">
            <!-- Header Container -->
            <div id="header-container"></div>

            <!-- Your Page Content -->
            <div class="content">
                <h2>Your Page Content</h2>
                <p>Your content goes here...</p>
            </div>
        </main>
    </div>

    <!-- Scripts -->
    <script src="js/theme-manager.js"></script>
    <script src="js/sidebar-component.js"></script>
    <script src="js/header-component.js"></script>
    <script>
        // Load components when page loads
        document.addEventListener('DOMContentLoaded', async function() {
            // Load sidebar component
            window.sidebarComponent = await SidebarComponent.loadSidebar('sidebar-container');
            
            // Load header component
            window.headerComponent = await HeaderComponent.loadHeader('header-container');
        });
    </script>
</body>
</html>
```

### Features

- **Consistent Design** - Same header across all pages
- **Auto-Detection** - Automatically sets titles based on page
- **Custom Titles** - Override with custom titles and subtitles
- **User Dropdown** - Complete user menu functionality
- **Responsive** - Works on all screen sizes
- **Easy Integration** - Just add the container div and load the component
