// E-commerce Storefront JavaScript

// Current view mode and filters
let currentViewMode = 'grid';
let currentFilters = {
    category: 'all',
    brand: 'all',
    price: 'all',
    sort: 'featured',
    search: ''
};

// Simple product browsing

// Initialize the storefront when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Storefront initializing...');
    console.log('Products available:', typeof products !== 'undefined' ? products.length : 'undefined');
    
    // Initialize statistics
    updateStorefrontStats();
    
    // Add click outside modal to close
    document.addEventListener('click', function(event) {
        const modal = document.getElementById('productModal');
        if (modal && event.target === modal) {
            closeProductModal();
        }
    });
    
    // Check if data is loaded, create fallback if not
    if (typeof products === 'undefined') {
        console.log('Creating fallback products...');
        // Create fallback products
        window.products = [
            {
                id: 1,
                name: 'Air Max 270',
                brand: 'Nike',
                category: 'sneakers',
                price: 150,
                originalPrice: 180,
                image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop&auto=format',
                images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop&auto=format'],
                description: 'Comfortable running shoes with Air Max technology for maximum cushioning.',
                specifications: {
                    'Material': 'Mesh upper with synthetic overlays',
                    'Sole': 'Rubber outsole with Air Max unit',
                    'Weight': '320g'
                },
                sizes: ['7', '8', '9', '10', '11', '12'],
                colors: ['Black', 'White', 'Red'],
                inStock: true,
                featured: true
            },
            {
                id: 2,
                name: 'Classic Chuck Taylor',
                brand: 'Converse',
                category: 'sneakers',
                price: 65,
                originalPrice: 75,
                image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=300&fit=crop&auto=format',
                images: ['https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=300&fit=crop&auto=format'],
                description: 'Iconic canvas sneakers that never go out of style.',
                specifications: {
                    'Material': 'Canvas upper with rubber toe cap',
                    'Sole': 'Rubber outsole',
                    'Weight': '280g'
                },
                sizes: ['6', '7', '8', '9', '10', '11'],
                colors: ['Black', 'White', 'Navy'],
                inStock: true,
                featured: false
            },
            {
                id: 3,
                name: 'Ultraboost 22',
                brand: 'Adidas',
                category: 'athletic',
                price: 180,
                originalPrice: 200,
                image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&h=300&fit=crop&auto=format',
                images: ['https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&h=300&fit=crop&auto=format'],
                description: 'High-performance running shoes with Boost technology.',
                specifications: {
                    'Material': 'Primeknit upper',
                    'Sole': 'Boost midsole with Continental rubber outsole',
                    'Weight': '300g'
                },
                sizes: ['7', '8', '9', '10', '11', '12'],
                colors: ['Black', 'White', 'Blue'],
                inStock: true,
                featured: true
            },
            {
                id: 4,
                name: 'Classic Boots',
                brand: 'Timberland',
                category: 'boots',
                price: 120,
                originalPrice: 150,
                image: 'https://images.unsplash.com/photo-1544966503-7cc4ac81b4d4?w=400&h=300&fit=crop&auto=format',
                images: ['https://images.unsplash.com/photo-1544966503-7cc4ac81b4d4?w=400&h=300&fit=crop&auto=format'],
                description: 'Durable leather boots perfect for outdoor adventures.',
                specifications: {
                    'Material': 'Premium leather upper',
                    'Sole': 'Rubber lug outsole',
                    'Weight': '450g'
                },
                sizes: ['7', '8', '9', '10', '11', '12'],
                colors: ['Brown', 'Black'],
                inStock: true,
                featured: false
            },
            {
                id: 5,
                name: 'Summer Sandals',
                brand: 'Birkenstock',
                category: 'sandals',
                price: 80,
                originalPrice: 100,
                image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&h=300&fit=crop&auto=format',
                images: ['https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&h=300&fit=crop&auto=format'],
                description: 'Comfortable cork footbed sandals for summer.',
                specifications: {
                    'Material': 'Cork footbed with leather straps',
                    'Sole': 'EVA outsole',
                    'Weight': '200g'
                },
                sizes: ['6', '7', '8', '9', '10', '11'],
                colors: ['Brown', 'Black'],
                inStock: true,
                featured: true
            },
            {
                id: 6,
                name: 'Oxford Dress Shoes',
                brand: 'Cole Haan',
                category: 'dress-shoes',
                price: 200,
                originalPrice: 250,
                image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=300&fit=crop&auto=format',
                images: ['https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=300&fit=crop&auto=format'],
                description: 'Elegant oxford shoes for formal occasions.',
                specifications: {
                    'Material': 'Premium leather upper',
                    'Sole': 'Leather sole with rubber heel',
                    'Weight': '350g'
                },
                sizes: ['7', '8', '9', '10', '11', '12'],
                colors: ['Black', 'Brown'],
                inStock: true,
                featured: false
            }
        ];
        
        // Create fallback categories
        window.categories = [
            { id: 'sneakers', name: 'Sneakers', count: 2 },
            { id: 'athletic', name: 'Athletic', count: 1 },
            { id: 'boots', name: 'Boots', count: 1 },
            { id: 'sandals', name: 'Sandals', count: 1 },
            { id: 'dress-shoes', name: 'Dress Shoes', count: 1 }
        ];
        
        // Create fallback brands
        window.brands = [
            { id: 'nike', name: 'Nike', count: 1 },
            { id: 'converse', name: 'Converse', count: 1 },
            { id: 'adidas', name: 'Adidas', count: 1 },
            { id: 'timberland', name: 'Timberland', count: 1 },
            { id: 'birkenstock', name: 'Birkenstock', count: 1 },
            { id: 'cole-haan', name: 'Cole Haan', count: 1 }
        ];
    }
    
    // Apply initial filters to show products
    console.log('Applying filters with products:', products.length);
    applyFilters();
});

// Apply filters and display products
function applyFilters() {
    // Products are now hardcoded in HTML, so we just handle search filtering
    const productsContainer = document.getElementById('productsContainer');
    if (!productsContainer) return;
    
    const productCards = productsContainer.querySelectorAll('.product-card');
    const searchTerm = currentFilters.search.toLowerCase();
    
    productCards.forEach(card => {
        const productName = card.querySelector('.product-name').textContent.toLowerCase();
        const brand = card.querySelector('.stat-value').textContent.toLowerCase();
        
        // Show/hide based on search term
        if (searchTerm === '' || productName.includes(searchTerm) || brand.includes(searchTerm)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// Products are now hardcoded in HTML - no need for displayProducts function

// Filter by category
function filterByCategory(categoryId) {
    // Reset other filters
    currentFilters.brand = 'all';
    
    // Update active states for category buttons
    document.querySelectorAll('.category-btn').forEach(btn => btn.classList.remove('active'));
    
    // Set new filter
    currentFilters.category = categoryId;
    
    // Update active category
    const categoryBtn = document.querySelector(`[onclick="filterByCategory('${categoryId}')"]`);
    if (categoryBtn) {
        categoryBtn.classList.add('active');
    }
    
    // Filter products based on category
    const productsContainer = document.getElementById('productsContainer');
    const productCards = productsContainer.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
        const categoryValue = card.querySelectorAll('.stat-value')[1].textContent.toLowerCase();
        const categoryMap = {
            'all': 'all',
            'sneakers': 'sneakers',
            'athletic': 'athletic',
            'boots': 'boots',
            'sandals': 'sandals',
            'dress-shoes': 'dress shoes'
        };
        
        const targetCategory = categoryMap[categoryId] || 'all';
        
        if (categoryId === 'all' || categoryValue.includes(targetCategory)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// Filter by brand
function filterByBrand(brandId) {
    // Reset other filters
    currentFilters.category = 'all';
    
    // Update active states
    document.querySelectorAll('.category-btn').forEach(btn => btn.classList.remove('active'));
    
    // Set new filter
    currentFilters.brand = brandId;
    
    // Update active brand
    const brandBtn = document.querySelector(`[onclick="filterByBrand('${brandId}')"]`);
    if (brandBtn) {
        brandBtn.classList.add('active');
    }
    
    applyFilters();
}

// Product data for modal
const productDetails = {
    1: {
        name: 'Air Max 270',
        brand: 'Nike',
        price: '₦225,000',
        originalPrice: '₦270,000',
        description: 'Comfortable running shoes with Air Max technology for maximum cushioning. Perfect for daily wear and athletic activities.',
        sku: 'NIKE-AM270-001',
        weight: '320g',
        material: 'Mesh upper with synthetic overlays',
        origin: 'Nigeria',
        warranty: '2 Years',
        shipping: 'Free Delivery',
        specifications: {
            'Upper Material': 'Mesh with synthetic overlays',
            'Sole': 'Rubber outsole with Air Max unit',
            'Cushioning': 'Air Max technology',
            'Closure': 'Lace-up',
            'Heel Height': '3.5cm'
        },
        sizes: ['7', '8', '9', '10', '11', '12'],
        colors: ['Black', 'White', 'Red'],
        images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop&auto=format']
    },
    2: {
        name: 'Classic Chuck Taylor',
        brand: 'Converse',
        price: '₦97,500',
        originalPrice: '₦120,000',
        description: 'Iconic canvas sneakers that never go out of style. Perfect for casual wear and everyday activities.',
        sku: 'CONV-CT-002',
        weight: '280g',
        material: 'Canvas upper with rubber toe cap',
        origin: 'Nigeria',
        warranty: '1 Year',
        shipping: 'Free Delivery',
        specifications: {
            'Upper Material': 'Canvas',
            'Sole': 'Rubber outsole',
            'Toe Cap': 'Rubber reinforcement',
            'Closure': 'Lace-up',
            'Style': 'Low-top'
        },
        sizes: ['6', '7', '8', '9', '10', '11'],
        colors: ['Black', 'White', 'Navy'],
        images: ['https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=300&fit=crop&auto=format']
    },
    3: {
        name: 'Ultraboost 22',
        brand: 'Adidas',
        price: '₦270,000',
        originalPrice: '₦300,000',
        description: 'High-performance running shoes with Boost technology. Designed for serious runners and athletes.',
        sku: 'ADIDAS-UB22-003',
        weight: '300g',
        material: 'Primeknit upper',
        origin: 'Nigeria',
        warranty: '2 Years',
        shipping: 'Free Delivery',
        specifications: {
            'Upper Material': 'Primeknit',
            'Sole': 'Boost midsole with Continental rubber',
            'Technology': 'Boost cushioning',
            'Closure': 'Lace-up',
            'Type': 'Running shoe'
        },
        sizes: ['7', '8', '9', '10', '11', '12'],
        colors: ['Black', 'White', 'Blue'],
        images: ['https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&h=300&fit=crop&auto=format']
    },
    4: {
        name: 'Classic Boots',
        brand: 'Timberland',
        price: '₦180,000',
        originalPrice: '₦225,000',
        description: 'Durable leather boots perfect for outdoor adventures. Built to last with premium materials.',
        sku: 'TIMB-CB-004',
        weight: '450g',
        material: 'Premium leather upper',
        origin: 'Nigeria',
        warranty: '3 Years',
        shipping: 'Free Delivery',
        specifications: {
            'Upper Material': 'Premium leather',
            'Sole': 'Rubber lug outsole',
            'Waterproof': 'Yes',
            'Closure': 'Lace-up',
            'Height': 'Ankle boot'
        },
        sizes: ['7', '8', '9', '10', '11', '12'],
        colors: ['Brown', 'Black'],
        images: ['https://images.unsplash.com/photo-1544966503-7cc4ac81b4d4?w=400&h=300&fit=crop&auto=format']
    },
    5: {
        name: 'Summer Sandals',
        brand: 'Birkenstock',
        price: '₦120,000',
        originalPrice: '₦150,000',
        description: 'Comfortable cork footbed sandals perfect for summer. Natural materials for ultimate comfort.',
        sku: 'BIRK-SS-005',
        weight: '200g',
        material: 'Cork footbed with leather straps',
        origin: 'Nigeria',
        warranty: '2 Years',
        shipping: 'Free Delivery',
        specifications: {
            'Footbed': 'Cork',
            'Straps': 'Leather',
            'Sole': 'EVA outsole',
            'Arch Support': 'Yes',
            'Style': 'Slide sandal'
        },
        sizes: ['6', '7', '8', '9', '10', '11'],
        colors: ['Brown', 'Black'],
        images: ['https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&h=300&fit=crop&auto=format']
    },
    6: {
        name: 'Oxford Dress Shoes',
        brand: 'Cole Haan',
        price: '₦300,000',
        originalPrice: '₦375,000',
        description: 'Elegant oxford shoes for formal occasions. Handcrafted with attention to detail.',
        sku: 'COLE-OX-006',
        weight: '350g',
        material: 'Premium leather upper',
        origin: 'Nigeria',
        warranty: '2 Years',
        shipping: 'Free Delivery',
        specifications: {
            'Upper Material': 'Premium leather',
            'Sole': 'Leather sole with rubber heel',
            'Construction': 'Goodyear welted',
            'Closure': 'Lace-up',
            'Style': 'Oxford'
        },
        sizes: ['7', '8', '9', '10', '11', '12'],
        colors: ['Black', 'Brown'],
        images: ['https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=300&fit=crop&auto=format']
    },
    7: {
        name: 'Running Shoes',
        brand: 'New Balance',
        price: '₦142,500',
        originalPrice: '₦180,000',
        description: 'Comfortable running shoes with excellent cushioning. Perfect for daily runs and workouts.',
        sku: 'NB-RS-007',
        weight: '290g',
        material: 'Mesh upper with synthetic overlays',
        origin: 'Nigeria',
        warranty: '1 Year',
        shipping: 'Free Delivery',
        specifications: {
            'Upper Material': 'Mesh with synthetic',
            'Sole': 'Rubber outsole',
            'Cushioning': 'Fresh Foam',
            'Closure': 'Lace-up',
            'Type': 'Running shoe'
        },
        sizes: ['7', '8', '9', '10', '11', '12'],
        colors: ['Black', 'White', 'Blue'],
        images: ['https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400&h=300&fit=crop&auto=format']
    },
    8: {
        name: 'Canvas Sneakers',
        brand: 'Vans',
        price: '₦112,500',
        originalPrice: '₦135,000',
        description: 'Classic skate shoes with canvas upper. Perfect for casual wear and skateboarding.',
        sku: 'VANS-CS-008',
        weight: '260g',
        material: 'Canvas upper with rubber sole',
        origin: 'Nigeria',
        warranty: '1 Year',
        shipping: 'Free Delivery',
        specifications: {
            'Upper Material': 'Canvas',
            'Sole': 'Rubber waffle outsole',
            'Style': 'Low-top',
            'Closure': 'Lace-up',
            'Type': 'Skate shoe'
        },
        sizes: ['6', '7', '8', '9', '10', '11'],
        colors: ['Black', 'White', 'Navy'],
        images: ['https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=400&h=300&fit=crop&auto=format']
    },
    9: {
        name: 'Hiking Boots',
        brand: 'Merrell',
        price: '₦210,000',
        originalPrice: '₦262,500',
        description: 'Durable hiking boots for outdoor adventures. Waterproof and comfortable for long treks.',
        sku: 'MER-HB-009',
        weight: '480g',
        material: 'Leather and synthetic upper',
        origin: 'Nigeria',
        warranty: '2 Years',
        shipping: 'Free Delivery',
        specifications: {
            'Upper Material': 'Leather/synthetic',
            'Sole': 'Vibram rubber outsole',
            'Waterproof': 'Yes',
            'Closure': 'Lace-up',
            'Height': 'Mid-height'
        },
        sizes: ['7', '8', '9', '10', '11', '12'],
        colors: ['Brown', 'Black'],
        images: ['https://images.unsplash.com/photo-1544966503-7cc4ac81b4d4?w=400&h=300&fit=crop&auto=format']
    },
    10: {
        name: 'Flip Flops',
        brand: 'Havaianas',
        price: '₦37,500',
        originalPrice: '₦45,000',
        description: 'Comfortable rubber flip flops perfect for beach and casual wear. Lightweight and durable.',
        sku: 'HAV-FF-010',
        weight: '120g',
        material: 'Rubber',
        origin: 'Nigeria',
        warranty: '6 Months',
        shipping: 'Free Delivery',
        specifications: {
            'Material': 'Rubber',
            'Sole': 'Rubber outsole',
            'Style': 'Flip flop',
            'Comfort': 'Soft footbed',
            'Type': 'Casual sandal'
        },
        sizes: ['6', '7', '8', '9', '10', '11'],
        colors: ['Black', 'White', 'Blue'],
        images: ['https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&h=300&fit=crop&auto=format']
    }
};

// Open product modal
function openProductModal(productId) {
    console.log('Opening product modal for ID:', productId);
    const product = productDetails[productId];
    if (!product) {
        console.log('Product not found for ID:', productId);
        return;
    }
    
    const modal = document.getElementById('productModal');
    if (!modal) {
        console.log('Modal element not found');
        return;
    }
    
    console.log('Product found:', product.name);
    
    // Populate modal content
    document.getElementById('modalProductName').textContent = product.name;
    document.getElementById('modalProductBrand').textContent = product.brand;
    document.getElementById('modalProductTitle').textContent = product.name;
    document.getElementById('modalProductDescription').textContent = product.description;
    document.getElementById('modalProductImage').src = product.images[0];
    
    // Update price information
    const currentPriceEl = document.getElementById('modalProductPrice');
    const originalPriceEl = document.getElementById('modalOriginalPrice');
    const discountEl = document.getElementById('modalDiscount');
    
    currentPriceEl.textContent = product.price;
    
    if (product.originalPrice && product.originalPrice !== product.price) {
        originalPriceEl.textContent = product.originalPrice;
        originalPriceEl.style.display = 'inline';
        
        const currentPriceNum = parseInt(product.price.replace(/[₦,]/g, ''));
        const originalPriceNum = parseInt(product.originalPrice.replace(/[₦,]/g, ''));
        const discountPercent = Math.round((1 - currentPriceNum / originalPriceNum) * 100);
        discountEl.textContent = `${discountPercent}% OFF`;
        discountEl.style.display = 'inline';
    } else {
        originalPriceEl.style.display = 'none';
        discountEl.style.display = 'none';
    }
    
    // Update enhanced details
    document.getElementById('modalSKU').textContent = product.sku;
    document.getElementById('modalWeight').textContent = product.weight;
    document.getElementById('modalMaterial').textContent = product.material;
    document.getElementById('modalOrigin').textContent = product.origin;
    document.getElementById('modalWarranty').textContent = product.warranty;
    document.getElementById('modalShipping').textContent = product.shipping;
    
    // Load specifications
    const specsList = document.getElementById('modalProductSpecs');
    if (specsList) {
        specsList.innerHTML = Object.entries(product.specifications).map(([key, value]) => `
            <div class="spec-item">
                <span class="spec-label">${key}:</span>
                <span class="spec-value">${value}</span>
            </div>
        `).join('');
    }
    
    // Load sizes
    const sizesContainer = document.getElementById('modalSizes');
    if (sizesContainer) {
        sizesContainer.innerHTML = product.sizes.map(size => `
            <span class="size-option" onclick="selectSize(this)">${size}</span>
        `).join('');
    }
    
    // Load colors
    const colorsContainer = document.getElementById('modalColors');
    if (colorsContainer) {
        colorsContainer.innerHTML = product.colors.map(color => `
            <span class="color-option" style="background-color: ${color.toLowerCase()};" 
                  title="${color}" onclick="selectColor(this)"></span>
        `).join('');
    }
    
    // Load image thumbnails
    const imageThumbnails = document.getElementById('imageThumbnails');
    if (imageThumbnails) {
        imageThumbnails.innerHTML = product.images.map((img, index) => `
            <img src="${img}" alt="Product view ${index + 1}" class="thumbnail ${index === 0 ? 'active' : ''}" 
                 onclick="changeMainImage('${img}', this)">
        `).join('');
    }
    
    // Store current product ID
    modal.dataset.productId = productId;
    
    // Show modal
    modal.style.display = 'block';
    modal.classList.add('show');
    console.log('Modal should now be visible');
}

// Select size option
function selectSize(element) {
    // Remove active class from all size options
    document.querySelectorAll('.size-option').forEach(option => {
        option.classList.remove('selected');
    });
    
    // Add active class to selected option
    element.classList.add('selected');
}

// Select color option
function selectColor(element) {
    // Remove active class from all color options
    document.querySelectorAll('.color-option').forEach(option => {
        option.classList.remove('selected');
    });
    
    // Add active class to selected option
    element.classList.add('selected');
}

// Close product modal
function closeProductModal() {
    const modal = document.getElementById('productModal');
    if (modal) {
        modal.style.display = 'none';
        modal.classList.remove('show');
    }
}

// Change main image in modal
function changeMainImage(imageSrc, thumbnailElement) {
    document.getElementById('modalProductImage').src = imageSrc;
    
    // Update active thumbnail
    document.querySelectorAll('.thumbnail').forEach(thumb => thumb.classList.remove('active'));
    thumbnailElement.classList.add('active');
}

// Share product function
function shareProduct() {
    const modal = document.getElementById('productModal');
    const productId = modal.dataset.productId;
    const product = productDetails[productId];
    
    if (product && navigator.share) {
        navigator.share({
            title: product.name,
            text: `Check out this ${product.name} from ${product.brand} - ${product.price}`,
            url: window.location.href
        });
    } else {
        // Fallback - copy to clipboard
        const shareText = `Check out this ${product.name} from ${product.brand} - ${product.price}`;
        navigator.clipboard.writeText(shareText).then(() => {
            alert('Product link copied to clipboard!');
        });
    }
}

// Simple product browsing - no cart/wishlist functionality

// Update storefront statistics
function updateStorefrontStats() {
    try {
        // Get products data from localStorage or use fallback
        let productsData = [];
        
        // Try to get from localStorage first
        const storedInventory = localStorage.getItem('inventoryData');
        if (storedInventory) {
            productsData = JSON.parse(storedInventory);
        } else if (typeof products !== 'undefined') {
            productsData = products;
        } else {
            // Use fallback data
            productsData = [
                { id: 1, name: 'Air Max 270', brand: 'Nike', category: 'sneakers', price: 150, inStock: true, current_stock: 25, min_stock_level: 5 },
                { id: 2, name: 'Classic Chuck Taylor', brand: 'Converse', category: 'sneakers', price: 97.5, inStock: true, current_stock: 18, min_stock_level: 3 },
                { id: 3, name: 'Ultraboost 22', brand: 'Adidas', category: 'athletic', price: 270, inStock: true, current_stock: 12, min_stock_level: 4 },
                { id: 4, name: 'Classic Boots', brand: 'Timberland', category: 'boots', price: 180, inStock: true, current_stock: 8, min_stock_level: 2 },
                { id: 5, name: 'Summer Sandals', brand: 'Birkenstock', category: 'sandals', price: 120, inStock: true, current_stock: 15, min_stock_level: 3 },
                { id: 6, name: 'Oxford Dress Shoes', brand: 'Cole Haan', category: 'dress-shoes', price: 300, inStock: true, current_stock: 6, min_stock_level: 2 },
                { id: 7, name: 'Running Shoes', brand: 'New Balance', category: 'athletic', price: 142.5, inStock: true, current_stock: 20, min_stock_level: 5 },
                { id: 8, name: 'Canvas Sneakers', brand: 'Vans', category: 'sneakers', price: 112.5, inStock: true, current_stock: 22, min_stock_level: 4 },
                { id: 9, name: 'Hiking Boots', brand: 'Merrell', category: 'boots', price: 210, inStock: true, current_stock: 9, min_stock_level: 2 },
                { id: 10, name: 'Flip Flops', brand: 'Havaianas', category: 'sandals', price: 37.5, inStock: true, current_stock: 30, min_stock_level: 5 }
            ];
        }
        
        // Calculate statistics
        const totalProducts = productsData.length;
        
        // Get unique categories
        const categories = [...new Set(productsData.map(product => product.category))];
        const totalCategories = categories.length;
        
        // Get unique brands
        const brands = [...new Set(productsData.map(product => product.brand))];
        const totalBrands = brands.length;
        
        // Count in-stock products
        const inStockProducts = productsData.filter(product => 
            product.inStock !== false && 
            (product.current_stock || 0) > 0
        ).length;
        
        // Count low stock products (stock <= min_stock_level)
        const lowStockProducts = productsData.filter(product => 
            (product.current_stock || 0) <= (product.min_stock_level || 0)
        ).length;
        
        // Calculate average price
        const totalPrice = productsData.reduce((sum, product) => sum + (product.price || 0), 0);
        const avgPrice = totalProducts > 0 ? totalPrice / totalProducts : 0;
        
        // Update DOM elements with mock data for demonstration
        updateStatElement('totalProducts', totalProducts || 127);
        updateStatElement('totalCategories', totalCategories || 8);
        updateStatElement('totalBrands', totalBrands || 15);
        updateStatElement('inStockProducts', inStockProducts || 98);
        updateStatElement('lowStockProducts', lowStockProducts || 12);
        updateStatElement('avgPrice', `₦${(avgPrice || 185000).toFixed(0)}`);
        
        console.log('Storefront statistics updated:', {
            totalProducts,
            totalCategories,
            totalBrands,
            inStockProducts,
            lowStockProducts,
            avgPrice: avgPrice.toFixed(2)
        });
        
    } catch (error) {
        console.error('Error updating storefront statistics:', error);
        // Set mock data on error for demonstration
        updateStatElement('totalProducts', 127);
        updateStatElement('totalCategories', 8);
        updateStatElement('totalBrands', 15);
        updateStatElement('inStockProducts', 98);
        updateStatElement('lowStockProducts', 12);
        updateStatElement('avgPrice', '₦185,000');
    }
}

// Helper function to update stat elements with animation
function updateStatElement(elementId, value) {
    const element = document.getElementById(elementId);
    if (element) {
        // Add animation class
        element.style.opacity = '0.5';
        element.style.transform = 'scale(0.95)';
        
        setTimeout(() => {
            element.textContent = value;
            element.style.opacity = '1';
            element.style.transform = 'scale(1)';
        }, 150);
    }
}

// Make functions globally available
window.updateStorefrontStats = updateStorefrontStats;