// Shop Configuration File
// This file can be easily modified to change the shop type and settings

const SHOP_CONFIG = {
    // Shop Type - Change this to switch between different shop types
    type: 'shoe_shop', // Options: 'shoe_shop', 'electronics', 'clothing', 'books', 'general'
    
    // Basic Shop Information
    name: 'SoleStyle Shoe Shop',
    location: 'Lagos, Nigeria',
    currency: '₦',
    currencyName: 'Nigerian Naira',
    defaultUnit: 'pairs',
    
    // Shop Categories - Modify these based on your shop type
    categories: [
        { id: 1, name: 'Sneakers', description: 'Athletic and casual sneakers' },
        { id: 2, name: 'Dress Shoes', description: 'Formal and business shoes' },
        { id: 3, name: 'Boots', description: 'Ankle boots, work boots, etc.' },
        { id: 4, name: 'Sandals', description: 'Open-toe and summer footwear' },
        { id: 5, name: 'Athletic Shoes', description: 'Running and sports shoes' },
        { id: 6, name: 'Casual Shoes', description: 'Everyday casual footwear' },
        { id: 7, name: 'Heels', description: 'High heels and dress shoes' },
        { id: 8, name: 'Loafers', description: 'Slip-on dress shoes' }
    ],
    
    // Suppliers - Add your suppliers here
    suppliers: [
        { id: 1, name: 'Nike Nigeria', contact_person: 'Michael Johnson', phone: '+234-800-000-0000' },
        { id: 2, name: 'Adidas West Africa', contact_person: 'Sarah Williams', phone: '+234-800-000-0001' },
        { id: 3, name: 'Puma Distribution', contact_person: 'David Brown', phone: '+234-800-000-0002' },
        { id: 4, name: 'Converse Nigeria', contact_person: 'Lisa Davis', phone: '+234-800-000-0003' },
        { id: 5, name: 'Vans West Africa', contact_person: 'James Wilson', phone: '+234-800-000-0004' },
        { id: 6, name: 'Jordan Brand Nigeria', contact_person: 'Robert Taylor', phone: '+234-800-000-0005' },
        { id: 7, name: 'Timberland Nigeria', contact_person: 'Maria Garcia', phone: '+234-800-000-0006' },
        { id: 8, name: 'Birkenstock West Africa', contact_person: 'John Smith', phone: '+234-800-000-0007' },
        { id: 9, name: 'Gucci Nigeria', contact_person: 'Anna Johnson', phone: '+234-800-000-0008' },
        { id: 10, name: 'Generic Footwear Co.', contact_person: 'Peter Wilson', phone: '+234-800-000-0009' }
    ],
    
    // Configuration for different shop types
    shopTypes: {
        shoe_shop: {
            name: 'SoleStyle Shoe Shop',
            unit: 'pairs',
            categories: [
                { id: 1, name: 'Sneakers', description: 'Athletic and casual sneakers' },
                { id: 2, name: 'Dress Shoes', description: 'Formal and business shoes' },
                { id: 3, name: 'Boots', description: 'Ankle boots, work boots, etc.' },
                { id: 4, name: 'Sandals', description: 'Open-toe and summer footwear' },
                { id: 5, name: 'Athletic Shoes', description: 'Running and sports shoes' },
                { id: 6, name: 'Casual Shoes', description: 'Everyday casual footwear' },
                { id: 7, name: 'Heels', description: 'High heels and dress shoes' },
                { id: 8, name: 'Loafers', description: 'Slip-on dress shoes' }
            ]
        },
        electronics: {
            name: 'TechHub Electronics',
            unit: 'units',
            categories: [
                { id: 1, name: 'Smartphones', description: 'Mobile phones and accessories' },
                { id: 2, name: 'Laptops', description: 'Laptop computers and accessories' },
                { id: 3, name: 'Audio', description: 'Headphones, speakers, etc.' },
                { id: 4, name: 'Gaming', description: 'Gaming consoles and accessories' },
                { id: 5, name: 'Home Appliances', description: 'Kitchen and home electronics' },
                { id: 6, name: 'Accessories', description: 'Cables, chargers, cases' }
            ]
        },
        clothing: {
            name: 'Fashion Forward',
            unit: 'pieces',
            categories: [
                { id: 1, name: 'Tops', description: 'Shirts, blouses, t-shirts' },
                { id: 2, name: 'Bottoms', description: 'Pants, jeans, skirts' },
                { id: 3, name: 'Dresses', description: 'Casual and formal dresses' },
                { id: 4, name: 'Outerwear', description: 'Jackets, coats, sweaters' },
                { id: 5, name: 'Accessories', description: 'Bags, jewelry, belts' },
                { id: 6, name: 'Shoes', description: 'All types of footwear' }
            ]
        },
        books: {
            name: 'BookWorm Store',
            unit: 'copies',
            categories: [
                { id: 1, name: 'Fiction', description: 'Novels and story books' },
                { id: 2, name: 'Non-Fiction', description: 'Biographies, history, etc.' },
                { id: 3, name: 'Educational', description: 'Textbooks and study materials' },
                { id: 4, name: 'Children', description: 'Kids books and comics' },
                { id: 5, name: 'Reference', description: 'Dictionaries, encyclopedias' },
                { id: 6, name: 'Magazines', description: 'Periodicals and journals' }
            ]
        },
        general: {
            name: 'General Store',
            unit: 'items',
            categories: [
                { id: 1, name: 'Food & Beverages', description: 'Groceries and drinks' },
                { id: 2, name: 'Health & Beauty', description: 'Personal care products' },
                { id: 3, name: 'Home & Garden', description: 'Household items' },
                { id: 4, name: 'Sports & Outdoors', description: 'Sports equipment' },
                { id: 5, name: 'Toys & Games', description: 'Children toys and games' },
                { id: 6, name: 'Office Supplies', description: 'Stationery and office items' }
            ]
        }
    }
};

// Function to get current shop configuration
function getCurrentShopConfig() {
    const shopType = SHOP_CONFIG.shopTypes[SHOP_CONFIG.type];
    return {
        ...SHOP_CONFIG,
        ...shopType,
        categories: shopType.categories,
        suppliers: SHOP_CONFIG.suppliers
    };
}

// Function to change shop type
function changeShopType(newType) {
    if (SHOP_CONFIG.shopTypes[newType]) {
        SHOP_CONFIG.type = newType;
        const newConfig = getCurrentShopConfig();
        
        // Update the configuration
        Object.assign(SHOP_CONFIG, newConfig);
        
        // Clear localStorage to force refresh
        localStorage.removeItem('inventoryData');
        localStorage.removeItem('suppliersData');
        localStorage.removeItem('categoriesData');
        
        // Reload the page to apply changes
        window.location.reload();
    }
}

