# Employee Dashboard - Inventa

## Overview
The Employee Dashboard is a specialized interface designed for employees and cashiers to manage daily operations without access to sensitive owner-level features.

## Features

### 🏠 Dashboard Overview
- **Personal Sales Tracking**: View today's sales, revenue generated, and performance metrics
- **Stock Overview**: See total items in stock and low stock alerts
- **Quick Actions**: Easy access to common tasks like making sales and checking inventory
- **Performance Metrics**: Track weekly/monthly sales and average sale values

### 💰 Sales Management
- **Make Sales**: Process cash and credit sales
- **View Recent Sales**: See recent transactions with customer details
- **Sales History**: Track personal sales performance over time

### 📦 Inventory Access
- **View Stock**: Check current inventory levels
- **Low Stock Alerts**: Get notified when items are running low
- **Product Search**: Find items quickly for sales

### 👥 Customer Management
- **Customer List**: View and manage customer accounts
- **Credit Sales**: Process credit transactions
- **Payment Tracking**: Record customer payments

## User Roles

### Employee Login Credentials
- **Email**: `employee@inventa.com`
- **Password**: `employee123`
- **Role**: Employee/Cashier

### Cashier Login Credentials
- **Email**: `cashier@inventa.com`
- **Password**: `cashier123`
- **Role**: Employee/Cashier

## Navigation

### Sidebar Menu
- **Dashboard**: Main overview page
- **View Stock**: Inventory management
- **Make Sales**: Sales processing
- **Credit Sales**: Credit transactions
- **Customers**: Customer management
- **My Sales Today**: Personal sales tracking
- **My Performance**: Performance metrics

### Quick Actions
- **New Sale**: Start a new cash sale
- **Credit Sale**: Process credit transaction
- **Check Stock**: View inventory levels
- **View Customers**: Access customer list

## Key Features

### Real-time Updates
- Dashboard updates every 30 seconds
- Live stock level monitoring
- Instant sales tracking

### Performance Tracking
- Daily sales count and revenue
- Weekly and monthly performance
- Average sale calculation
- Best day identification

### Notifications
- Low stock alerts
- System notifications
- Performance updates

## Technical Details

### Files Structure
```
theme_0.1/
├── employee-dashboard.html      # Main dashboard page
├── js/
│   ├── employee-dashboard.js    # Dashboard functionality
│   └── employee-data.js         # Data management
└── css/
    └── style.css               # Styling (includes employee styles)
```

### Data Storage
- Uses localStorage for data persistence
- Employee-specific data filtering
- Role-based access control

### Responsive Design
- Mobile-friendly interface
- Adaptive layout for different screen sizes
- Touch-friendly controls

## Getting Started

1. **Login**: Use employee credentials to access the dashboard
2. **Explore**: Navigate through different sections using the sidebar
3. **Make Sales**: Use the quick actions to start processing sales
4. **Track Performance**: Monitor your sales and performance metrics

## Security Features

- Role-based authentication
- Employee-specific data access
- No access to owner-level settings
- Secure logout functionality

## Support

For technical support or questions about the employee dashboard, contact your system administrator or refer to the main application documentation.
