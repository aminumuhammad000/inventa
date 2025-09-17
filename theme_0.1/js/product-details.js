// Product Details Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the product details page
    initializeProductDetails();
    
    // Set up event listeners
    setupEventListeners();
    
    // Load sample product data
    loadProductData();
});

// Sample product data
const sampleProduct = {
    id: 1,
    brand: "Premium Brand",
    title: "High-Quality Wireless Headphones",
    price: 25000,
    description: "Experience crystal-clear audio with these premium wireless headphones. Featuring advanced noise cancellation, 30-hour battery life, and comfortable over-ear design. Perfect for music lovers, gamers, and professionals who demand the best sound quality.",
    sku: "WH-001-PRO",
    weight: "320g",
    material: "Premium Materials",
    origin: "Nigeria",
    warranty: "1 Year",
    shipping: "Free Delivery",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=600&fit=crop",
    specifications: [
        { label: "Driver Size", value: "40mm" },
        { label: "Frequency Response", value: "20Hz - 20kHz" },
        { label: "Impedance", value: "32 Ohms" },
        { label: "Battery Life", value: "30 Hours" },
        { label: "Charging Time", value: "2 Hours" },
        { label: "Connectivity", value: "Bluetooth 5.0" },
        { label: "Range", value: "10 Meters" },
        { label: "Weight", value: "320g" }
    ],
    relatedProducts: [
        {
            id: 2,
            name: "Bluetooth Speaker Pro",
            price: 15000,
            image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=300&fit=crop"
        },
        {
            id: 3,
            name: "Smart Watch Series 5",
            price: 45000,
            image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop"
        },
        {
            id: 4,
            name: "Wireless Charging Pad",
            price: 8000,
            image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&h=300&fit=crop"
        },
        {
            id: 5,
            name: "USB-C Cable Set",
            price: 3000,
            image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&h=300&fit=crop"
        }
    ]
};

function initializeProductDetails() {
    // Add loading animation
    showLoadingAnimation();
    
    // Simulate loading delay
    setTimeout(() => {
        hideLoadingAnimation();
        populateProductData();
        setupImageGallery();
        setupQuantityControls();
        setupSpecifications();
        setupRelatedProducts();
    }, 1000);
}

function showLoadingAnimation() {
    const mainImage = document.getElementById('productMainImage');
    const productTitle = document.getElementById('productTitle');
    const productPrice = document.getElementById('productPrice');
    
    if (mainImage) {
        mainImage.style.opacity = '0.3';
        mainImage.style.filter = 'blur(2px)';
    }
    
    if (productTitle) {
        productTitle.textContent = 'Loading...';
        productTitle.style.color = '#9ca3af';
    }
    
    if (productPrice) {
        productPrice.textContent = '₦---';
        productPrice.style.color = '#9ca3af';
    }
}

function hideLoadingAnimation() {
    const mainImage = document.getElementById('productMainImage');
    
    if (mainImage) {
        mainImage.style.opacity = '1';
        mainImage.style.filter = 'none';
    }
}

function populateProductData() {
    // Update breadcrumb
    updateBreadcrumb();
    
    // Update product info
    updateProductInfo();
    
    // Update product images
    updateProductImages();
}

function updateBreadcrumb() {
    const categoryElement = document.getElementById('breadcrumbCategory');
    const productElement = document.getElementById('breadcrumbProduct');
    
    if (categoryElement) {
        categoryElement.textContent = 'Electronics';
    }
    
    if (productElement) {
        productElement.textContent = sampleProduct.title;
    }
}

function updateProductInfo() {
    // Update basic product info
    document.getElementById('productBrand').textContent = sampleProduct.brand;
    document.getElementById('productTitle').textContent = sampleProduct.title;
    document.getElementById('productPrice').textContent = `₦${sampleProduct.price.toLocaleString()}`;
    document.getElementById('productDescription').textContent = sampleProduct.description;
    
    // Update product details
    document.getElementById('productSKU').textContent = sampleProduct.sku;
    document.getElementById('productWeight').textContent = sampleProduct.weight;
    document.getElementById('productMaterial').textContent = sampleProduct.material;
    document.getElementById('productOrigin').textContent = sampleProduct.origin;
    document.getElementById('productWarranty').textContent = sampleProduct.warranty;
    document.getElementById('productShipping').textContent = sampleProduct.shipping;
}

function updateProductImages() {
    const mainImage = document.getElementById('productMainImage');
    
    if (mainImage && sampleProduct.image) {
        mainImage.src = sampleProduct.image;
        mainImage.alt = sampleProduct.title;
        
        // Add loading animation
        mainImage.style.opacity = '0.3';
        mainImage.style.filter = 'blur(2px)';
        
        // Simulate loading
        setTimeout(() => {
            mainImage.style.opacity = '1';
            mainImage.style.filter = 'none';
        }, 500);
    }
}

function setupImageGallery() {
    const mainImage = document.getElementById('productMainImage');
    
    if (mainImage) {
        // Add zoom functionality
        mainImage.addEventListener('click', function() {
            openImageZoom(this.src);
        });
        
        // Add hover effects
        mainImage.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
        });
        
        mainImage.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    }
}

function openImageZoom(imageSrc) {
    // Create zoom modal
    const zoomModal = document.createElement('div');
    zoomModal.className = 'image-zoom-modal';
    zoomModal.innerHTML = `
        <div class="zoom-modal-content">
            <button class="close-zoom" onclick="this.parentElement.parentElement.remove()">
                <i class="material-icons-round">close</i>
            </button>
            <img src="${imageSrc}" alt="Zoomed Product Image" class="zoomed-image">
            <div class="zoom-controls">
                <button class="zoom-btn" onclick="zoomImage(-0.1)">
                    <i class="material-icons-round">zoom_out</i>
                </button>
                <button class="zoom-btn" onclick="zoomImage(0.1)">
                    <i class="material-icons-round">zoom_in</i>
                </button>
            </div>
        </div>
    `;
    
    // Add styles
    zoomModal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        cursor: pointer;
    `;
    
    const zoomContent = zoomModal.querySelector('.zoom-modal-content');
    zoomContent.style.cssText = `
        position: relative;
        max-width: 90%;
        max-height: 90%;
        cursor: default;
    `;
    
    const zoomedImage = zoomModal.querySelector('.zoomed-image');
    zoomedImage.style.cssText = `
        width: 100%;
        height: auto;
        border-radius: 8px;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
    `;
    
    document.body.appendChild(zoomModal);
    
    // Close on background click
    zoomModal.addEventListener('click', function(e) {
        if (e.target === zoomModal) {
            zoomModal.remove();
        }
    });
}

function zoomImage(factor) {
    const zoomedImage = document.querySelector('.zoomed-image');
    if (zoomedImage) {
        const currentScale = parseFloat(zoomedImage.style.transform?.match(/scale\(([^)]+)\)/)?.[1] || 1);
        const newScale = Math.max(0.5, Math.min(3, currentScale + factor));
        zoomedImage.style.transform = `scale(${newScale})`;
    }
}


function setupQuantityControls() {
    const quantityInput = document.getElementById('productQuantity');
    const decreaseBtn = document.querySelector('.quantity-btn[onclick="decreaseQuantity()"]');
    const increaseBtn = document.querySelector('.quantity-btn[onclick="increaseQuantity()"]');
    
    if (quantityInput) {
        quantityInput.addEventListener('change', function() {
            let value = parseInt(this.value);
            if (isNaN(value) || value < 1) {
                this.value = 1;
            } else if (value > 10) {
                this.value = 10;
            }
        });
    }
}

function increaseQuantity() {
    const quantityInput = document.getElementById('productQuantity');
    if (quantityInput) {
        let currentValue = parseInt(quantityInput.value);
        if (currentValue < 10) {
            quantityInput.value = currentValue + 1;
            animateQuantityChange();
        }
    }
}

function decreaseQuantity() {
    const quantityInput = document.getElementById('productQuantity');
    if (quantityInput) {
        let currentValue = parseInt(quantityInput.value);
        if (currentValue > 1) {
            quantityInput.value = currentValue - 1;
            animateQuantityChange();
        }
    }
}

function animateQuantityChange() {
    const quantityInput = document.getElementById('productQuantity');
    if (quantityInput) {
        quantityInput.style.transform = 'scale(1.1)';
        quantityInput.style.backgroundColor = '#f0f4ff';
        
        setTimeout(() => {
            quantityInput.style.transform = 'scale(1)';
            quantityInput.style.backgroundColor = 'white';
        }, 200);
    }
}

function setupSpecifications() {
    const specsContainer = document.getElementById('productSpecifications');
    
    if (specsContainer) {
        specsContainer.innerHTML = '';
        sampleProduct.specifications.forEach(spec => {
            const specItem = document.createElement('div');
            specItem.className = 'spec-item';
            specItem.innerHTML = `
                <span class="spec-label">${spec.label}</span>
                <span class="spec-value">${spec.value}</span>
            `;
            specsContainer.appendChild(specItem);
        });
    }
}

function setupRelatedProducts() {
    const relatedContainer = document.getElementById('relatedProducts');
    
    if (relatedContainer) {
        relatedContainer.innerHTML = '';
        sampleProduct.relatedProducts.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'related-product-card';
            productCard.innerHTML = `
                <img src="${product.image}" alt="${product.name}" class="related-product-image">
                <div class="related-product-name">${product.name}</div>
                <div class="related-product-price">₦${product.price.toLocaleString()}</div>
            `;
            
            productCard.addEventListener('click', () => {
                // Simulate navigation to product details
                showToast(`Viewing ${product.name}`);
            });
            
            relatedContainer.appendChild(productCard);
        });
    }
}

function setupEventListeners() {
    // Search functionality
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const query = this.value.toLowerCase();
            if (query.length > 2) {
                // Simulate search
                console.log('Searching for:', query);
            }
        });
    }
    
    // Add to cart functionality (placeholder)
    document.addEventListener('click', function(e) {
        if (e.target.closest('.btn-primary')) {
            e.preventDefault();
            addToCart();
        }
    });
}

function addToCart() {
    const quantity = document.getElementById('productQuantity').value;
    const productName = document.getElementById('productTitle').textContent;
    
    showToast(`Added ${quantity} x ${productName} to cart!`);
    
    // Add cart animation
    const cartIcon = document.querySelector('.quantity-selection::after');
    if (cartIcon) {
        cartIcon.style.animation = 'bounce 0.6s ease-in-out';
    }
}

function addToWishlist() {
    const productName = document.getElementById('productTitle').textContent;
    
    showToast(`Added ${productName} to wishlist!`);
    
    // Add heart animation
    const wishlistBtn = document.querySelector('.btn-secondary');
    if (wishlistBtn) {
        wishlistBtn.style.animation = 'pulse 0.6s ease-in-out';
        setTimeout(() => {
            wishlistBtn.style.animation = '';
        }, 600);
    }
}

function showToast(message) {
    // Remove existing toast
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
        existingToast.remove();
    }
    
    // Create new toast
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
        <i class="material-icons-round toast-icon">check_circle</i>
        <span class="toast-message">${message}</span>
    `;
    
    document.body.appendChild(toast);
    
    // Show toast
    setTimeout(() => {
        toast.classList.add('show');
    }, 100);
    
    // Hide toast after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            if (toast.parentNode) {
                toast.remove();
            }
        }, 300);
    }, 3000);
}

// Smooth scrolling for anchor links
document.addEventListener('click', function(e) {
    if (e.target.matches('a[href^="#"]')) {
        e.preventDefault();
        const target = document.querySelector(e.target.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }
});

// Add loading states and error handling
function handleImageError(img) {
    img.src = 'https://via.placeholder.com/800x600/f3f4f6/9ca3af?text=Image+Not+Available';
    img.alt = 'Image not available';
}

// Add image error handlers
document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('error', function() {
            handleImageError(this);
        });
    });
});

// Add keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // ESC to close modals
    if (e.key === 'Escape') {
        const zoomModal = document.querySelector('.image-zoom-modal');
        if (zoomModal) {
            zoomModal.remove();
        }
    }
    
    // Space to toggle quantity (when focused on quantity input)
    if (e.key === ' ' && e.target.id === 'productQuantity') {
        e.preventDefault();
        increaseQuantity();
    }
});

// Add intersection observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', function() {
    const animatedElements = document.querySelectorAll('.spec-item, .related-product-card');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

console.log('Product Details Page Loaded Successfully!');
