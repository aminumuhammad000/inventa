// Employee Data Management
// Handles sample data and employee-specific data operations

// Initialize sample data for employee dashboard
function initializeEmployeeData() {
    // Force reinitialize data to include new image and brand fields
    // Remove this check temporarily to update existing data
    // if (localStorage.getItem('employeeDataInitialized') === 'true') {
    //     return;
    // }

    // Sample products for inventory
    const sampleProducts = [
        {
            id: 1,
            name: 'Cement (50kg)',
            category: 'Construction Materials',
            brand: 'Dangote',
            quantity: 245,
            unit: 'bags',
            purchasePrice: 2500,
            sellingPrice: 3000,
            supplier: 'Dangote Cement',
            lowStockThreshold: 20,
            image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=300&h=200&fit=crop&auto=format'
        },
        {
            id: 2,
            name: 'Steel Rods (12mm)',
            category: 'Construction Materials',
            brand: 'Steel Works',
            quantity: 89,
            unit: 'pieces',
            purchasePrice: 450,
            sellingPrice: 550,
            supplier: 'Steel Works Ltd',
            lowStockThreshold: 15,
            image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop&auto=format'
        },
        {
            id: 3,
            name: 'Sand (Truck Load)',
            category: 'Construction Materials',
            brand: 'Premium Sand',
            quantity: 12,
            unit: 'loads',
            purchasePrice: 15000,
            sellingPrice: 18000,
            supplier: 'Sand Suppliers',
            lowStockThreshold: 3,
            image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop&auto=format'
        },
        {
            id: 4,
            name: 'Paint (White)',
            category: 'Finishing Materials',
            brand: 'Dulux',
            quantity: 5,
            unit: 'gallons',
            purchasePrice: 2500,
            sellingPrice: 3200,
            supplier: 'Paint Co',
            lowStockThreshold: 10,
            image: 'https://images.unsplash.com/photo-1581578731548-c6a0c3f15f30?w=300&h=200&fit=crop&auto=format'
        },
        {
            id: 5,
            name: 'Nails (2 inches)',
            category: 'Fasteners',
            brand: 'Hardware Pro',
            quantity: 15,
            unit: 'boxes',
            purchasePrice: 800,
            sellingPrice: 1200,
            supplier: 'Hardware Store',
            lowStockThreshold: 20,
            image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300&h=200&fit=crop&auto=format'
        },
        {
            id: 6,
            name: 'PVC Pipes (4 inches)',
            category: 'Plumbing',
            brand: 'AquaFlow',
            quantity: 8,
            unit: 'pieces',
            purchasePrice: 1200,
            sellingPrice: 1800,
            supplier: 'Plumbing Supplies',
            lowStockThreshold: 15,
            image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=300&h=200&fit=crop&auto=format'
        },
        {
            id: 7,
            name: 'Cement (50kg)',
            category: 'Construction Materials',
            brand: 'Lafarge',
            quantity: 180,
            unit: 'bags',
            purchasePrice: 2600,
            sellingPrice: 3100,
            supplier: 'Lafarge Cement',
            lowStockThreshold: 20,
            image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=300&h=200&fit=crop&auto=format'
        },
        {
            id: 8,
            name: 'Paint (Blue)',
            category: 'Finishing Materials',
            brand: 'Dulux',
            quantity: 8,
            unit: 'gallons',
            purchasePrice: 2700,
            sellingPrice: 3400,
            supplier: 'Paint Co',
            lowStockThreshold: 10,
            image: 'https://images.unsplash.com/photo-1581578731548-c6a0c3f15f30?w=300&h=200&fit=crop&auto=format'
        },
        {
            id: 9,
            name: 'Steel Rods (16mm)',
            category: 'Construction Materials',
            brand: 'Steel Works',
            quantity: 45,
            unit: 'pieces',
            purchasePrice: 650,
            sellingPrice: 750,
            supplier: 'Steel Works Ltd',
            lowStockThreshold: 15,
            image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop&auto=format'
        },
        {
            id: 10,
            name: 'Paint (Red)',
            category: 'Finishing Materials',
            brand: 'Berger',
            quantity: 6,
            unit: 'gallons',
            purchasePrice: 2800,
            sellingPrice: 3500,
            supplier: 'Paint Co',
            lowStockThreshold: 10,
            image: 'https://images.unsplash.com/photo-1581578731548-c6a0c3f15f30?w=300&h=200&fit=crop&auto=format'
        }
    ];

    // Sample sales data
    const sampleSales = [
        {
            id: 'S001',
            date: new Date().toISOString(),
            customerName: 'John Builder',
            items: [
                { productId: 1, name: 'Cement (50kg)', quantity: 10, price: 3000, total: 30000 },
                { productId: 2, name: 'Steel Rods (12mm)', quantity: 5, price: 550, total: 2750 }
            ],
            total: 32750,
            paymentMethod: 'cash',
            employeeId: 'employee_inventa_com',
            employeeName: 'Usman Umar'
        },
        {
            id: 'S002',
            date: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
            customerName: 'Mary Contractor',
            items: [
                { productId: 3, name: 'Sand (Truck Load)', quantity: 1, price: 18000, total: 18000 }
            ],
            total: 18000,
            paymentMethod: 'credit',
            employeeId: 'employee_inventa_com',
            employeeName: 'Usman Umar'
        },
        {
            id: 'S003',
            date: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
            customerName: 'Walk-in Customer',
            items: [
                { productId: 4, name: 'Paint (White)', quantity: 2, price: 3200, total: 6400 },
                { productId: 5, name: 'Nails (2 inches)', quantity: 3, price: 1200, total: 3600 }
            ],
            total: 10000,
            paymentMethod: 'cash',
            employeeId: 'employee_inventa_com',
            employeeName: 'Usman Umar'
        }
    ];

    // Sample customers
    const sampleCustomers = [
        {
            id: 1,
            name: 'John Builder',
            email: 'john@builder.com',
            phone: '+2348012345678',
            address: '123 Construction St, Lagos',
            creditLimit: 100000,
            outstandingBalance: 0
        },
        {
            id: 2,
            name: 'Mary Contractor',
            email: 'mary@contractor.com',
            phone: '+2348098765432',
            address: '456 Building Ave, Abuja',
            creditLimit: 50000,
            outstandingBalance: 18000
        },
        {
            id: 3,
            name: 'David Engineer',
            email: 'david@engineer.com',
            phone: '+2348055566677',
            address: '789 Project Rd, Port Harcourt',
            creditLimit: 75000,
            outstandingBalance: 0
        }
    ];

    // Store sample data
    localStorage.setItem('products', JSON.stringify(sampleProducts));
    localStorage.setItem('sales', JSON.stringify(sampleSales));
    localStorage.setItem('customers', JSON.stringify(sampleCustomers));
    localStorage.setItem('employeeDataInitialized', 'true');

    console.log('Employee sample data initialized');
}

// Get employee sales for today
function getEmployeeSalesToday(employeeId) {
    const sales = JSON.parse(localStorage.getItem('sales') || '[]');
    const today = new Date().toDateString();
    
    return sales.filter(sale => {
        const saleDate = new Date(sale.date).toDateString();
        return saleDate === today && sale.employeeId === employeeId;
    });
}

// Get employee sales for this week
function getEmployeeSalesThisWeek(employeeId) {
    const sales = JSON.parse(localStorage.getItem('sales') || '[]');
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    
    return sales.filter(sale => {
        const saleDate = new Date(sale.date);
        return saleDate >= weekAgo && sale.employeeId === employeeId;
    });
}

// Get employee sales for this month
function getEmployeeSalesThisMonth(employeeId) {
    const sales = JSON.parse(localStorage.getItem('sales') || '[]');
    const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    
    return sales.filter(sale => {
        const saleDate = new Date(sale.date);
        return saleDate >= monthAgo && sale.employeeId === employeeId;
    });
}

// Calculate employee performance metrics
function calculateEmployeePerformance(employeeId) {
    const todaySales = getEmployeeSalesToday(employeeId);
    const weekSales = getEmployeeSalesThisWeek(employeeId);
    const monthSales = getEmployeeSalesThisMonth(employeeId);
    
    const todayRevenue = todaySales.reduce((sum, sale) => sum + (sale.total || 0), 0);
    const weekRevenue = weekSales.reduce((sum, sale) => sum + (sale.total || 0), 0);
    const monthRevenue = monthSales.reduce((sum, sale) => sum + (sale.total || 0), 0);
    
    const averageSale = weekSales.length > 0 ? weekRevenue / weekSales.length : 0;
    
    // Find best day
    const dailySales = {};
    weekSales.forEach(sale => {
        const day = new Date(sale.date).toDateString();
        dailySales[day] = (dailySales[day] || 0) + 1;
    });
    
    const bestDay = Object.keys(dailySales).reduce((a, b) => 
        dailySales[a] > dailySales[b] ? a : b, null
    );
    
    return {
        today: {
            sales: todaySales.length,
            revenue: todayRevenue
        },
        week: {
            sales: weekSales.length,
            revenue: weekRevenue
        },
        month: {
            sales: monthSales.length,
            revenue: monthRevenue
        },
        averageSale: averageSale,
        bestDay: bestDay ? new Date(bestDay).toLocaleDateString() : 'No data'
    };
}

// Get low stock items
function getLowStockItems() {
    const products = JSON.parse(localStorage.getItem('products') || '[]');
    return products.filter(product => 
        (product.quantity || 0) <= (product.lowStockThreshold || 10)
    );
}

// Add new sale (employee function)
function addEmployeeSale(saleData) {
    const sales = JSON.parse(localStorage.getItem('sales') || '[]');
    const newSale = {
        ...saleData,
        id: 'S' + String(sales.length + 1).padStart(3, '0'),
        date: new Date().toISOString(),
        employeeId: localStorage.getItem('userId'),
        employeeName: localStorage.getItem('userName')
    };
    
    sales.push(newSale);
    localStorage.setItem('sales', JSON.stringify(sales));
    
    // Update product quantities
    if (saleData.items) {
        const products = JSON.parse(localStorage.getItem('products') || '[]');
        saleData.items.forEach(item => {
            const product = products.find(p => p.id === item.productId);
            if (product) {
                product.quantity = Math.max(0, product.quantity - item.quantity);
            }
        });
        localStorage.setItem('products', JSON.stringify(products));
    }
    
    return newSale;
}

// Initialize data when script loads
document.addEventListener('DOMContentLoaded', function() {
    initializeEmployeeData();
});
