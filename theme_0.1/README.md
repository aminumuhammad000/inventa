# Inventa - Smart Inventory Management System

A modern, desktop-based inventory management system designed specifically for construction materials businesses. Built with Electron and SQLite for offline functionality and data security.

## 🏗️ Features

### Core Functionality
- **Dashboard**: Real-time overview of stock levels, sales, and alerts
- **Inventory Management**: Add purchases, track stock levels, manage items
- **Sales Management**: Record sales, handle returns, track transactions
- **Credit Sales**: Manage credit customers, track payments, monitor outstanding balances
- **Reports**: Generate daily, weekly, and monthly reports with export capabilities
- **Profit Analysis**: Track gross and net profit margins

### Technical Features
- **Offline-First**: Works without internet connection
- **SQLite Database**: Secure, local data storage
- **Modern UI**: Beautiful, responsive interface with blue gradient theme
- **Real-time Updates**: Live stock level monitoring
- **Data Export**: CSV/Excel export functionality
- **Cross-Platform**: Windows, macOS, and Linux support

## 📁 Project Structure

```
inventa-inventory-app/
│
├── main.js                 # Electron main process (app entry)
├── preload.js              # Bridge JS (frontend <-> SQLite)
├── package.json            # Electron app settings
│
├── database/
│   ├── schema.sql          # SQL file to create tables
│   └── inventory.db        # SQLite database file
│
├── frontend/               # App UI (HTML, CSS, JS)
│   ├── index.html          # Dashboard
│   ├── inventory.html      # Inventory management
│   ├── sales.html          # Sales page
│   ├── credit.html         # Credit sales
│   ├── reports.html        # Reports
│   ├── profit.html         # Profit
│   │
│   ├── css/
│   │   ├── style.css       # Main styles
│   │   └── login-styles.css # Login/signup styles
│   │
│   └── js/
│       ├── dashboard.js    # Dashboard logic
│       ├── inventory.js    # Inventory CRUD operations
│       ├── sales.js        # Sales & returns logic
│       ├── credit.js       # Credit sales + repayments
│       ├── reports.js      # Generate reports
│       ├── profit.js       # Profit calculations
│       ├── login.js        # Authentication
│       └── signup.js       # User registration
│
└── README.md               # This documentation
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd inventa-inventory-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the application**
   ```bash
   npm start
   ```

4. **For development**
   ```bash
   npm run dev
   ```

### Building for Production

```bash
# Build for current platform
npm run build

# Build for all platforms
npm run dist
```

## 🎯 Usage

### First Time Setup
1. Launch the application
2. Create an account using the signup form
3. Add your business information and upload a shop logo
4. Start adding inventory items and suppliers

### Default Login Credentials
- **Email**: `demo@inventa.com`
- **Password**: `demo123`

### Key Workflows

#### Adding Inventory
1. Go to **Inventory** page
2. Click **Add Purchase**
3. Select supplier and add items with quantities
4. Save to update stock levels automatically

#### Recording Sales
1. Go to **Sales** page
2. Click **Record Sale**
3. Add items and quantities
4. Choose payment method (cash/credit)
5. Complete transaction

#### Managing Credit Sales
1. Go to **Credit Sales** page
2. Create new credit sales for customers
3. Track payment schedules
4. Record repayments as they come in

#### Generating Reports
1. Go to **Reports** page
2. Select report type (Daily/Weekly/Monthly)
3. Choose date range
4. Export to CSV or Excel

## 🗄️ Database Schema

The application uses SQLite with the following main tables:

- **users**: User accounts and business information
- **items**: Inventory items with stock levels
- **categories**: Item categorization
- **suppliers**: Supplier information
- **purchases**: Purchase transactions
- **sales**: Sales transactions
- **credit_sales**: Credit sales and payments
- **customers**: Customer information
- **stock_movements**: Stock level tracking

## 🎨 Design System

### Color Scheme
- **Primary**: Blue gradient (`#667eea` to `#764ba2`)
- **Success**: Green (`#38a169`)
- **Warning**: Orange (`#ed8936`)
- **Error**: Red (`#e53e3e`)
- **Text**: Dark gray (`#2d3748`)

### Typography
- **Font Family**: Inter (Google Fonts)
- **Weights**: 300, 400, 500, 600, 700

### Components
- **Cards**: Glassmorphism with backdrop blur
- **Buttons**: Gradient backgrounds with hover effects
- **Tables**: Clean, modern data presentation
- **Modals**: Smooth animations and blur effects

## 🔧 Development

### Adding New Features

1. **Create HTML page** in `frontend/` directory
2. **Add JavaScript module** in `frontend/js/` directory
3. **Update navigation** in sidebar
4. **Add database schema** if needed
5. **Test functionality** thoroughly

### Database Operations

Use the Electron API for database operations:

```javascript
// Execute SQL
await window.electronAPI.db.exec(sql, params);

// Get single row
const row = await window.electronAPI.db.get(sql, params);

// Get multiple rows
const rows = await window.electronAPI.db.all(sql, params);
```

### Styling Guidelines

- Use the established color scheme
- Follow the glassmorphism design pattern
- Maintain consistent spacing and typography
- Add smooth transitions and hover effects
- Ensure responsive design

## 📱 Platform Support

- **Windows**: Full support with native installer
- **macOS**: Full support with DMG package
- **Linux**: Full support with AppImage

## 🔒 Security Features

- **Local Data Storage**: All data stored locally in SQLite
- **No Cloud Dependencies**: Works completely offline
- **Secure Authentication**: Password-based login system
- **Data Validation**: Input validation and sanitization

## 🐛 Troubleshooting

### Common Issues

1. **App won't start**
   - Check Node.js version (v16+ required)
   - Run `npm install` to ensure dependencies are installed

2. **Database errors**
   - Check if `database/inventory.db` exists
   - Verify `database/schema.sql` is present

3. **UI not loading**
   - Check browser console for JavaScript errors
   - Ensure all CSS/JS files are in correct locations

### Debug Mode

Run with development flag to open DevTools:
```bash
npm run dev
```

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

For support and questions:
- Create an issue in the repository
- Check the troubleshooting section
- Review the documentation

---

**Inventa** - Smart Inventory Management for Construction Materials
Built with ❤️ using Electron, SQLite, and modern web technologies.
