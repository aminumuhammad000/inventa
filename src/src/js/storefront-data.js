// Storefront Data for Inventa E-commerce

// Categories for shoes
const categories = [
    {
        id: 'sneakers',
        name: 'Sneakers',
        icon: 'sports',
        count: 45,
        description: 'Casual and athletic sneakers for everyday wear'
    },
    {
        id: 'dress-shoes',
        name: 'Dress Shoes',
        icon: 'business',
        count: 32,
        description: 'Formal shoes for business and special occasions'
    },
    {
        id: 'boots',
        name: 'Boots',
        icon: 'hiking',
        count: 28,
        description: 'Durable boots for outdoor activities and winter'
    },
    {
        id: 'sandals',
        name: 'Sandals',
        icon: 'beach_access',
        count: 24,
        description: 'Comfortable sandals for summer and casual wear'
    },
    {
        id: 'loafers',
        name: 'Loafers',
        icon: 'style',
        count: 18,
        description: 'Slip-on shoes for comfort and style'
    },
    {
        id: 'athletic',
        name: 'Athletic',
        icon: 'fitness_center',
        count: 35,
        description: 'Performance shoes for sports and fitness'
    }
];

// Brands
const brands = [
    {
        id: 'nike',
        name: 'Nike',
        logo: 'sports',
        count: 25,
        description: 'Just Do It - Innovation in athletic footwear'
    },
    {
        id: 'adidas',
        name: 'Adidas',
        logo: 'sports',
        count: 22,
        description: 'Impossible is Nothing - Three stripes of excellence'
    },
    {
        id: 'jordan',
        name: 'Jordan',
        logo: 'sports',
        count: 18,
        description: 'Air Jordan - Legendary basketball heritage'
    },
    {
        id: 'converse',
        name: 'Converse',
        logo: 'style',
        count: 15,
        description: 'All Star - Classic canvas sneakers'
    },
    {
        id: 'vans',
        name: 'Vans',
        logo: 'style',
        count: 12,
        description: 'Off The Wall - Skateboarding culture'
    },
    {
        id: 'puma',
        name: 'Puma',
        logo: 'sports',
        count: 20,
        description: 'Forever Faster - Speed and style'
    },
    {
        id: 'new-balance',
        name: 'New Balance',
        logo: 'sports',
        count: 16,
        description: 'Fearlessly Independent - Quality craftsmanship'
    },
    {
        id: 'reebok',
        name: 'Reebok',
        logo: 'sports',
        count: 16,
        description: 'Be More Human - Fitness and lifestyle'
    },
    {
        id: 'clarks',
        name: 'Clarks',
        logo: 'business',
        count: 8,
        description: 'Craftsmanship and comfort - British heritage'
    },
    {
        id: 'sperry',
        name: 'Sperry',
        logo: 'style',
        count: 6,
        description: 'Authentic boat shoes - Nautical heritage'
    },
    {
        id: 'timberland',
        name: 'Timberland',
        logo: 'hiking',
        count: 4,
        description: 'Yellow Boot - Outdoor adventure'
    },
    {
        id: 'birkenstock',
        name: 'Birkenstock',
        logo: 'beach_access',
        count: 3,
        description: 'Footbed technology - German craftsmanship'
    },
    {
        id: 'merrell',
        name: 'Merrell',
        logo: 'hiking',
        count: 2,
        description: 'Quality outdoor gear - Adventure ready'
    },
    {
        id: 'havaianas',
        name: 'Havaianas',
        logo: 'beach_access',
        count: 1,
        description: 'Brazilian flip flops - Beach lifestyle'
    },
    {
        id: 'bass',
        name: 'Bass',
        logo: 'style',
        count: 1,
        description: 'American heritage - Classic style'
    }
];

// Sample products (shoes)
const products = [
    {
        id: 1,
        name: 'Air Max 270',
        brand: 'Nike',
        category: 'sneakers',
        price: 150,
        originalPrice: 180,
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop&auto=format',
        images: [
            'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop&auto=format',
            'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400&h=300&fit=crop&auto=format',
            'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&h=300&fit=crop&auto=format'
        ],
        description: 'The Nike Air Max 270 delivers visible cushioning under every step. The design draws inspiration from Air Max icons, showcasing Nike\'s greatest innovation with its large window and fresh array of colors.',
        specifications: {
            'Material': 'Mesh upper with synthetic overlays',
            'Sole': 'Rubber outsole with Air Max unit',
            'Closure': 'Lace-up',
            'Weight': '320g',
            'Origin': 'Vietnam'
        },
        sizes: ['7', '8', '9', '10', '11', '12'],
        colors: ['Black/White', 'White/Blue', 'Red/Black'],
        inStock: true,
        featured: true
    },
    {
        id: 2,
        name: 'Ultraboost 22',
        brand: 'Adidas',
        category: 'athletic',
        price: 180,
        originalPrice: 200,
        image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400&h=300&fit=crop&auto=format',
        images: [
            'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400&h=300&fit=crop&auto=format',
            'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop&auto=format',
            'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&h=300&fit=crop&auto=format'
        ],
        description: 'The Ultraboost 22 features our most responsive Boost midsole yet, delivering energy return with every step. Engineered for runners who demand the best.',
        specifications: {
            'Material': 'Primeknit+ upper',
            'Sole': 'Boost midsole with Continental rubber',
            'Closure': 'Lace-up',
            'Weight': '310g',
            'Origin': 'Indonesia'
        },
        sizes: ['7', '8', '9', '10', '11', '12'],
        colors: ['Core Black', 'Cloud White', 'Solar Red'],
        inStock: true,
        featured: true
    },
    {
        id: 3,
        name: 'Air Jordan 1 Retro High',
        brand: 'Jordan',
        category: 'sneakers',
        price: 170,
        originalPrice: 190,
        image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&h=300&fit=crop&auto=format',
        images: [
            'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&h=300&fit=crop&auto=format',
            'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop&auto=format',
            'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400&h=300&fit=crop&auto=format'
        ],
        description: 'The Air Jordan 1 Retro High OG brings back the classic silhouette that started it all. Premium leather construction with iconic colorways.',
        specifications: {
            'Material': 'Premium leather upper',
            'Sole': 'Rubber outsole with Air-Sole unit',
            'Closure': 'Lace-up',
            'Weight': '400g',
            'Origin': 'China'
        },
        sizes: ['7', '8', '9', '10', '11', '12'],
        colors: ['Bred', 'Royal Blue', 'Shadow'],
        inStock: true,
        featured: true
    },
    {
        id: 4,
        name: 'Chuck Taylor All Star',
        brand: 'Converse',
        category: 'sneakers',
        price: 65,
        originalPrice: 75,
        image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=300&fit=crop&auto=format',
        images: [
            'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=300&fit=crop&auto=format',
            'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&h=300&fit=crop&auto=format',
            'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400&h=300&fit=crop&auto=format'
        ],
        description: 'The classic Chuck Taylor All Star. Canvas upper with rubber toe cap and vulcanized rubber sole. Timeless style that never goes out of fashion.',
        specifications: {
            'Material': 'Canvas upper with rubber toe cap',
            'Sole': 'Vulcanized rubber',
            'Closure': 'Lace-up',
            'Weight': '280g',
            'Origin': 'Vietnam'
        },
        sizes: ['7', '8', '9', '10', '11', '12'],
        colors: ['Black', 'White', 'Red', 'Navy'],
        inStock: true,
        featured: false
    },
    {
        id: 5,
        name: 'Old Skool Classic',
        brand: 'Vans',
        category: 'sneakers',
        price: 60,
        originalPrice: 70,
        image: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=400&h=300&fit=crop&auto=format',
        images: [
            'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=400&h=300&fit=crop&auto=format',
            'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=300&fit=crop&auto=format',
            'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&h=300&fit=crop&auto=format'
        ],
        description: 'The Vans Old Skool Classic features the iconic side stripe and durable canvas construction. Perfect for skateboarding and street style.',
        specifications: {
            'Material': 'Canvas and suede upper',
            'Sole': 'Waffle outsole',
            'Closure': 'Lace-up',
            'Weight': '290g',
            'Origin': 'Vietnam'
        },
        sizes: ['7', '8', '9', '10', '11', '12'],
        colors: ['Black/White', 'Navy/White', 'Red/White'],
        inStock: true,
        featured: false
    },
    {
        id: 6,
        name: 'Oxford Leather Dress Shoe',
        brand: 'Cole Haan',
        category: 'dress-shoes',
        price: 220,
        originalPrice: 280,
        image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&h=300&fit=crop&auto=format',
        images: [
            'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&h=300&fit=crop&auto=format',
            'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=400&h=300&fit=crop&auto=format',
            'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=300&fit=crop&auto=format'
        ],
        description: 'Handcrafted Oxford dress shoe in premium leather. Classic brogue detailing with modern comfort technology for all-day wear.',
        specifications: {
            'Material': 'Premium leather upper',
            'Sole': 'Leather sole with rubber heel',
            'Closure': 'Lace-up',
            'Weight': '450g',
            'Origin': 'Italy'
        },
        sizes: ['7', '8', '9', '10', '11', '12'],
        colors: ['Black', 'Brown', 'Tan'],
        inStock: true,
        featured: true
    },
    {
        id: 7,
        name: 'Timberland 6-Inch Boot',
        brand: 'Timberland',
        category: 'boots',
        price: 190,
        originalPrice: 220,
        image: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=300&fit=crop&auto=format',
        images: [
            'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=300&fit=crop&auto=format',
            'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&h=300&fit=crop&auto=format',
            'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=400&h=300&fit=crop&auto=format'
        ],
        description: 'The iconic Timberland 6-Inch Boot. Premium leather construction with waterproof protection and anti-fatigue technology.',
        specifications: {
            'Material': 'Premium nubuck leather',
            'Sole': 'Rubber lug outsole',
            'Closure': 'Lace-up',
            'Weight': '800g',
            'Origin': 'Dominican Republic'
        },
        sizes: ['7', '8', '9', '10', '11', '12'],
        colors: ['Wheat', 'Black', 'Brown'],
        inStock: true,
        featured: false
    },
    {
        id: 8,
        name: 'Birkenstock Arizona Sandal',
        brand: 'Birkenstock',
        category: 'sandals',
        price: 100,
        originalPrice: 120,
        image: 'https://images.unsplash.com/photo-1582897085656-c636d006a246?w=400&h=300&fit=crop&auto=format',
        images: [
            'https://images.unsplash.com/photo-1582897085656-c636d006a246?w=400&h=300&fit=crop&auto=format',
            'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=300&fit=crop&auto=format',
            'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&h=300&fit=crop&auto=format'
        ],
        description: 'The classic Arizona sandal with contoured cork footbed. Adjustable straps for perfect fit and all-day comfort.',
        specifications: {
            'Material': 'Suede upper with cork footbed',
            'Sole': 'EVA outsole',
            'Closure': 'Adjustable straps',
            'Weight': '200g',
            'Origin': 'Germany'
        },
        sizes: ['7', '8', '9', '10', '11', '12'],
        colors: ['Tobacco Brown', 'Black', 'Mocha'],
        inStock: true,
        featured: false
    },
    {
        id: 9,
        name: '990v5 Running Shoe',
        brand: 'New Balance',
        category: 'athletic',
        price: 175,
        originalPrice: 195,
        image: 'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=400&h=300&fit=crop&auto=format',
        images: [
            'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=400&h=300&fit=crop&auto=format',
            'https://images.unsplash.com/photo-1582897085656-c636d006a246?w=400&h=300&fit=crop&auto=format',
            'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=300&fit=crop&auto=format'
        ],
        description: 'The New Balance 990v5 delivers premium comfort and performance. Made in USA with premium materials and advanced cushioning.',
        specifications: {
            'Material': 'Suede and mesh upper',
            'Sole': 'ENCAP midsole with rubber outsole',
            'Closure': 'Lace-up',
            'Weight': '350g',
            'Origin': 'USA'
        },
        sizes: ['7', '8', '9', '10', '11', '12'],
        colors: ['Grey', 'Navy', 'Black'],
        inStock: true,
        featured: true
    },
    {
        id: 10,
        name: 'Classic Leather Loafer',
        brand: 'Sperry',
        category: 'loafers',
        price: 95,
        originalPrice: 115,
        image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop&auto=format',
        images: [
            'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop&auto=format',
            'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=400&h=300&fit=crop&auto=format',
            'https://images.unsplash.com/photo-1582897085656-c636d006a246?w=400&h=300&fit=crop&auto=format'
        ],
        description: 'Classic leather loafer with handsewn moccasin construction. Perfect for casual and business casual occasions.',
        specifications: {
            'Material': 'Premium leather upper',
            'Sole': 'Rubber outsole',
            'Closure': 'Slip-on',
            'Weight': '250g',
            'Origin': 'China'
        },
        sizes: ['7', '8', '9', '10', '11', '12'],
        colors: ['Brown', 'Black', 'Tan'],
        inStock: true,
        featured: false
    },
    {
        id: 11,
        name: 'Air Force 1 Low',
        brand: 'Nike',
        category: 'sneakers',
        price: 90,
        originalPrice: 110,
        image: 'https://images.unsplash.com/photo-1552346154-21d32810cdfd?w=400&h=300&fit=crop&auto=format',
        images: [
            'https://images.unsplash.com/photo-1552346154-21d32810cdfd?w=400&h=300&fit=crop&auto=format',
            'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop&auto=format',
            'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=400&h=300&fit=crop&auto=format'
        ],
        description: 'The radiance lives on in the Nike Air Force 1 \'07, the basketball original that puts a fresh spin on what you know best.',
        specifications: {
            'Material': 'Leather upper',
            'Sole': 'Rubber outsole with Air-Sole unit',
            'Closure': 'Lace-up',
            'Weight': '380g',
            'Origin': 'Vietnam'
        },
        sizes: ['7', '8', '9', '10', '11', '12'],
        colors: ['White', 'Black', 'Triple White'],
        inStock: true,
        featured: true
    },
    {
        id: 12,
        name: 'Stan Smith Original',
        brand: 'Adidas',
        category: 'sneakers',
        price: 80,
        originalPrice: 95,
        image: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=400&h=300&fit=crop&auto=format',
        images: [
            'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=400&h=300&fit=crop&auto=format',
            'https://images.unsplash.com/photo-1552346154-21d32810cdfd?w=400&h=300&fit=crop&auto=format',
            'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop&auto=format'
        ],
        description: 'The Stan Smith is a tennis-inspired lifestyle shoe that\'s been a style staple for decades. Clean, simple, and timeless.',
        specifications: {
            'Material': 'Leather upper',
            'Sole': 'Rubber outsole',
            'Closure': 'Lace-up',
            'Weight': '320g',
            'Origin': 'Indonesia'
        },
        sizes: ['7', '8', '9', '10', '11', '12'],
        colors: ['White/Green', 'White/Blue', 'White/Red'],
        inStock: true,
        featured: false
    },
    {
        id: 13,
        name: 'Chelsea Boot',
        brand: 'Dr. Martens',
        category: 'boots',
        price: 150,
        originalPrice: 180,
        image: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=300&fit=crop&auto=format',
        images: [
            'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=300&fit=crop&auto=format',
            'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=400&h=300&fit=crop&auto=format',
            'https://images.unsplash.com/photo-1552346154-21d32810cdfd?w=400&h=300&fit=crop&auto=format'
        ],
        description: 'Classic Chelsea boot with elastic side panels for easy on/off. Premium leather construction with Goodyear welted sole.',
        specifications: {
            'Material': 'Premium leather upper',
            'Sole': 'Goodyear welted sole',
            'Closure': 'Elastic side panels',
            'Weight': '600g',
            'Origin': 'England'
        },
        sizes: ['7', '8', '9', '10', '11', '12'],
        colors: ['Black', 'Brown', 'Tan'],
        inStock: true,
        featured: true
    },
    {
        id: 14,
        name: 'Classic Slip-On',
        brand: 'Vans',
        category: 'sneakers',
        price: 55,
        originalPrice: 65,
        image: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=400&h=300&fit=crop&auto=format',
        images: [
            'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=400&h=300&fit=crop&auto=format',
            'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=300&fit=crop&auto=format',
            'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=400&h=300&fit=crop&auto=format'
        ],
        description: 'The Classic Slip-On features canvas upper with elastic side accents and signature waffle outsole for superior grip.',
        specifications: {
            'Material': 'Canvas upper',
            'Sole': 'Waffle outsole',
            'Closure': 'Slip-on',
            'Weight': '270g',
            'Origin': 'Vietnam'
        },
        sizes: ['7', '8', '9', '10', '11', '12'],
        colors: ['Black/White', 'Navy/White', 'Red/White'],
        inStock: true,
        featured: false
    },
    {
        id: 15,
        name: 'RS-X Reinvention',
        brand: 'Puma',
        category: 'sneakers',
        price: 120,
        originalPrice: 140,
        image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400&h=300&fit=crop&auto=format',
        images: [
            'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400&h=300&fit=crop&auto=format',
            'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=400&h=300&fit=crop&auto=format',
            'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=300&fit=crop&auto=format'
        ],
        description: 'The RS-X Reinvention combines retro styling with modern technology. Chunky silhouette with bold color combinations.',
        specifications: {
            'Material': 'Mesh and synthetic upper',
            'Sole': 'RS foam midsole',
            'Closure': 'Lace-up',
            'Weight': '340g',
            'Origin': 'Vietnam'
        },
        sizes: ['7', '8', '9', '10', '11', '12'],
        colors: ['White/Black', 'Black/White', 'Grey/Orange'],
        inStock: true,
        featured: true
    },
    {
        id: 16,
        name: 'Classic Court Sneaker',
        brand: 'Reebok',
        category: 'sneakers',
        price: 75,
        originalPrice: 90,
        image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&h=300&fit=crop&auto=format',
        images: [
            'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&h=300&fit=crop&auto=format',
            'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400&h=300&fit=crop&auto=format',
            'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=400&h=300&fit=crop&auto=format'
        ],
        description: 'Clean, minimalist design with premium leather upper. Perfect for everyday wear with timeless style.',
        specifications: {
            'Material': 'Leather upper',
            'Sole': 'Rubber outsole',
            'Closure': 'Lace-up',
            'Weight': '300g',
            'Origin': 'Vietnam'
        },
        sizes: ['7', '8', '9', '10', '11', '12'],
        colors: ['White', 'Black', 'Navy'],
        inStock: true,
        featured: false
    },
    {
        id: 17,
        name: 'Wingtip Oxford',
        brand: 'Allen Edmonds',
        category: 'dress-shoes',
        price: 350,
        originalPrice: 425,
        image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&h=300&fit=crop&auto=format',
        images: [
            'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&h=300&fit=crop&auto=format',
            'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&h=300&fit=crop&auto=format',
            'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400&h=300&fit=crop&auto=format'
        ],
        description: 'Handcrafted wingtip Oxford with premium calfskin leather. Goodyear welted construction for durability and comfort.',
        specifications: {
            'Material': 'Premium calfskin leather',
            'Sole': 'Leather sole with rubber heel',
            'Closure': 'Lace-up',
            'Weight': '500g',
            'Origin': 'USA'
        },
        sizes: ['7', '8', '9', '10', '11', '12'],
        colors: ['Black', 'Brown', 'Cognac'],
        inStock: true,
        featured: true
    },
    {
        id: 18,
        name: 'Hiking Boot Pro',
        brand: 'Merrell',
        category: 'boots',
        price: 140,
        originalPrice: 160,
        image: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=300&fit=crop&auto=format',
        images: [
            'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=300&fit=crop&auto=format',
            'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&h=300&fit=crop&auto=format',
            'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&h=300&fit=crop&auto=format'
        ],
        description: 'Professional hiking boot with waterproof membrane and aggressive tread pattern. Perfect for outdoor adventures.',
        specifications: {
            'Material': 'Suede and mesh upper',
            'Sole': 'Vibram rubber outsole',
            'Closure': 'Lace-up',
            'Weight': '750g',
            'Origin': 'Vietnam'
        },
        sizes: ['7', '8', '9', '10', '11', '12'],
        colors: ['Brown', 'Black', 'Olive'],
        inStock: true,
        featured: false
    },
    {
        id: 19,
        name: 'Flip Flop Classic',
        brand: 'Havaianas',
        category: 'sandals',
        price: 25,
        originalPrice: 30,
        image: 'https://images.unsplash.com/photo-1582897085656-c636d006a246?w=400&h=300&fit=crop&auto=format',
        images: [
            'https://images.unsplash.com/photo-1582897085656-c636d006a246?w=400&h=300&fit=crop&auto=format',
            'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=300&fit=crop&auto=format',
            'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&h=300&fit=crop&auto=format'
        ],
        description: 'Classic Brazilian flip flop made from 100% rubber. Comfortable, durable, and perfect for beach and casual wear.',
        specifications: {
            'Material': '100% rubber',
            'Sole': 'Rubber sole',
            'Closure': 'Flip flop',
            'Weight': '150g',
            'Origin': 'Brazil'
        },
        sizes: ['7', '8', '9', '10', '11', '12'],
        colors: ['Black', 'White', 'Blue', 'Red'],
        inStock: true,
        featured: false
    },
    {
        id: 20,
        name: 'Penny Loafer',
        brand: 'Bass',
        category: 'loafers',
        price: 110,
        originalPrice: 130,
        image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop&auto=format',
        images: [
            'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop&auto=format',
            'https://images.unsplash.com/photo-1582897085656-c636d006a246?w=400&h=300&fit=crop&auto=format',
            'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=300&fit=crop&auto=format'
        ],
        description: 'Classic penny loafer with handsewn moccasin construction. Timeless style that works for both casual and dressy occasions.',
        specifications: {
            'Material': 'Premium leather upper',
            'Sole': 'Leather sole',
            'Closure': 'Slip-on',
            'Weight': '280g',
            'Origin': 'USA'
        },
        sizes: ['7', '8', '9', '10', '11', '12'],
        colors: ['Brown', 'Black', 'Tan'],
        inStock: true,
        featured: true
    },
    {
        id: 21,
        name: 'Dunk Low Retro',
        brand: 'Nike',
        category: 'sneakers',
        price: 100,
        originalPrice: 120,
        image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=300&fit=crop&auto=format',
        images: [
            'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=300&fit=crop&auto=format',
            'https://images.unsplash.com/photo-1552346154-21d32810cdfd?w=400&h=300&fit=crop&auto=format',
            'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400&h=300&fit=crop&auto=format'
        ],
        description: 'The Nike Dunk Low Retro brings back the classic basketball silhouette with modern comfort technology and premium materials.',
        specifications: {
            'Material': 'Leather and synthetic upper',
            'Sole': 'Rubber outsole with Air-Sole unit',
            'Closure': 'Lace-up',
            'Weight': '360g',
            'Origin': 'Vietnam'
        },
        sizes: ['7', '8', '9', '10', '11', '12'],
        colors: ['White/Black', 'Black/White', 'Red/White'],
        inStock: true,
        featured: false
    },
    {
        id: 22,
        name: 'Gazelle Classic',
        brand: 'Adidas',
        category: 'sneakers',
        price: 85,
        originalPrice: 100,
        image: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=400&h=300&fit=crop&auto=format',
        images: [
            'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=400&h=300&fit=crop&auto=format',
            'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=300&fit=crop&auto=format',
            'https://images.unsplash.com/photo-1552346154-21d32810cdfd?w=400&h=300&fit=crop&auto=format'
        ],
        description: 'The iconic Gazelle Classic features suede upper and rubber outsole. A timeless silhouette that never goes out of style.',
        specifications: {
            'Material': 'Suede upper',
            'Sole': 'Rubber outsole',
            'Closure': 'Lace-up',
            'Weight': '300g',
            'Origin': 'Indonesia'
        },
        sizes: ['7', '8', '9', '10', '11', '12'],
        colors: ['White', 'Black', 'Navy', 'Red'],
        inStock: true,
        featured: false
    },
    {
        id: 23,
        name: 'Air Max 90',
        brand: 'Nike',
        category: 'sneakers',
        price: 120,
        originalPrice: 140,
        image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&h=300&fit=crop&auto=format',
        images: [
            'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&h=300&fit=crop&auto=format',
            'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=400&h=300&fit=crop&auto=format',
            'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=300&fit=crop&auto=format'
        ],
        description: 'The Nike Air Max 90 features visible Air-Sole unit and premium materials. A classic running shoe with modern comfort.',
        specifications: {
            'Material': 'Mesh and synthetic upper',
            'Sole': 'Rubber outsole with Air-Sole unit',
            'Closure': 'Lace-up',
            'Weight': '340g',
            'Origin': 'Vietnam'
        },
        sizes: ['7', '8', '9', '10', '11', '12'],
        colors: ['White/Black', 'Black/White', 'Red/White'],
        inStock: true,
        featured: true
    },
    {
        id: 24,
        name: 'Superstar Original',
        brand: 'Adidas',
        category: 'sneakers',
        price: 80,
        originalPrice: 95,
        image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400&h=300&fit=crop&auto=format',
        images: [
            'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400&h=300&fit=crop&auto=format',
            'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&h=300&fit=crop&auto=format',
            'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=400&h=300&fit=crop&auto=format'
        ],
        description: 'The iconic Adidas Superstar with shell toe and three stripes. A basketball classic that became a street style legend.',
        specifications: {
            'Material': 'Leather upper with rubber shell toe',
            'Sole': 'Rubber outsole',
            'Closure': 'Lace-up',
            'Weight': '320g',
            'Origin': 'Indonesia'
        },
        sizes: ['7', '8', '9', '10', '11', '12'],
        colors: ['White/Black', 'Black/White', 'White/Navy'],
        inStock: true,
        featured: false
    },
    {
        id: 25,
        name: 'Blazer Mid',
        brand: 'Nike',
        category: 'sneakers',
        price: 90,
        originalPrice: 110,
        image: 'https://images.unsplash.com/photo-1552346154-21d32810cdfd?w=400&h=300&fit=crop&auto=format',
        images: [
            'https://images.unsplash.com/photo-1552346154-21d32810cdfd?w=400&h=300&fit=crop&auto=format',
            'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400&h=300&fit=crop&auto=format',
            'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&h=300&fit=crop&auto=format'
        ],
        description: 'The Nike Blazer Mid features leather upper and rubber outsole. A basketball classic with timeless style.',
        specifications: {
            'Material': 'Leather upper',
            'Sole': 'Rubber outsole',
            'Closure': 'Lace-up',
            'Weight': '350g',
            'Origin': 'Vietnam'
        },
        sizes: ['7', '8', '9', '10', '11', '12'],
        colors: ['White/Black', 'Black/White', 'White/Red'],
        inStock: true,
        featured: false
    },
    {
        id: 26,
        name: 'Campus 00s',
        brand: 'Adidas',
        category: 'sneakers',
        price: 75,
        originalPrice: 90,
        image: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=400&h=300&fit=crop&auto=format',
        images: [
            'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=400&h=300&fit=crop&auto=format',
            'https://images.unsplash.com/photo-1552346154-21d32810cdfd?w=400&h=300&fit=crop&auto=format',
            'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400&h=300&fit=crop&auto=format'
        ],
        description: 'The Adidas Campus 00s features suede upper and classic three stripes. A retro-inspired silhouette with modern comfort.',
        specifications: {
            'Material': 'Suede upper',
            'Sole': 'Rubber outsole',
            'Closure': 'Lace-up',
            'Weight': '310g',
            'Origin': 'Indonesia'
        },
        sizes: ['7', '8', '9', '10', '11', '12'],
        colors: ['White', 'Black', 'Navy', 'Brown'],
        inStock: true,
        featured: false
    },
    {
        id: 27,
        name: 'Sk8-Hi Classic',
        brand: 'Vans',
        category: 'sneakers',
        price: 70,
        originalPrice: 85,
        image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=300&fit=crop&auto=format',
        images: [
            'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=300&fit=crop&auto=format',
            'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=400&h=300&fit=crop&auto=format',
            'https://images.unsplash.com/photo-1552346154-21d32810cdfd?w=400&h=300&fit=crop&auto=format'
        ],
        description: 'The Vans Sk8-Hi Classic features canvas upper and signature waffle outsole. Perfect for skateboarding and street style.',
        specifications: {
            'Material': 'Canvas upper',
            'Sole': 'Waffle outsole',
            'Closure': 'Lace-up',
            'Weight': '400g',
            'Origin': 'Vietnam'
        },
        sizes: ['7', '8', '9', '10', '11', '12'],
        colors: ['Black/White', 'White/Black', 'Navy/White'],
        inStock: true,
        featured: false
    },
    {
        id: 28,
        name: 'Authentic Classic',
        brand: 'Vans',
        category: 'sneakers',
        price: 60,
        originalPrice: 75,
        image: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=400&h=300&fit=crop&auto=format',
        images: [
            'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=400&h=300&fit=crop&auto=format',
            'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=300&fit=crop&auto=format',
            'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=400&h=300&fit=crop&auto=format'
        ],
        description: 'The Vans Authentic Classic features canvas upper and vulcanized rubber sole. A timeless silhouette for everyday wear.',
        specifications: {
            'Material': 'Canvas upper',
            'Sole': 'Vulcanized rubber',
            'Closure': 'Lace-up',
            'Weight': '280g',
            'Origin': 'Vietnam'
        },
        sizes: ['7', '8', '9', '10', '11', '12'],
        colors: ['Black', 'White', 'Navy', 'Red'],
        inStock: true,
        featured: false
    },
    {
        id: 29,
        name: 'One Star Classic',
        brand: 'Converse',
        category: 'sneakers',
        price: 70,
        originalPrice: 85,
        image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&h=300&fit=crop&auto=format',
        images: [
            'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&h=300&fit=crop&auto=format',
            'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=400&h=300&fit=crop&auto=format',
            'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=300&fit=crop&auto=format'
        ],
        description: 'The Converse One Star Classic features suede upper and rubber outsole. A basketball-inspired silhouette with street style appeal.',
        specifications: {
            'Material': 'Suede upper',
            'Sole': 'Rubber outsole',
            'Closure': 'Lace-up',
            'Weight': '320g',
            'Origin': 'Vietnam'
        },
        sizes: ['7', '8', '9', '10', '11', '12'],
        colors: ['Black', 'White', 'Navy', 'Brown'],
        inStock: true,
        featured: false
    },
    {
        id: 30,
        name: 'Jack Purcell Classic',
        brand: 'Converse',
        category: 'sneakers',
        price: 75,
        originalPrice: 90,
        image: 'https://images.unsplash.com/photo-1552346154-21d32810cdfd?w=400&h=300&fit=crop&auto=format',
        images: [
            'https://images.unsplash.com/photo-1552346154-21d32810cdfd?w=400&h=300&fit=crop&auto=format',
            'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&h=300&fit=crop&auto=format',
            'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=400&h=300&fit=crop&auto=format'
        ],
        description: 'The Converse Jack Purcell Classic features canvas upper and signature smile design. A tennis-inspired silhouette with timeless style.',
        specifications: {
            'Material': 'Canvas upper',
            'Sole': 'Rubber outsole',
            'Closure': 'Lace-up',
            'Weight': '300g',
            'Origin': 'Vietnam'
        },
        sizes: ['7', '8', '9', '10', '11', '12'],
        colors: ['White', 'Black', 'Navy', 'Red'],
        inStock: true,
        featured: false
    },
    {
        id: 31,
        name: 'RS-X Reinvention',
        brand: 'Puma',
        category: 'sneakers',
        price: 120,
        originalPrice: 140,
        image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400&h=300&fit=crop&auto=format',
        images: [
            'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400&h=300&fit=crop&auto=format',
            'https://images.unsplash.com/photo-1552346154-21d32810cdfd?w=400&h=300&fit=crop&auto=format',
            'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&h=300&fit=crop&auto=format'
        ],
        description: 'The Puma RS-X Reinvention combines retro styling with modern technology. Chunky silhouette with bold color combinations.',
        specifications: {
            'Material': 'Mesh and synthetic upper',
            'Sole': 'RS foam midsole',
            'Closure': 'Lace-up',
            'Weight': '340g',
            'Origin': 'Vietnam'
        },
        sizes: ['7', '8', '9', '10', '11', '12'],
        colors: ['White/Black', 'Black/White', 'Grey/Orange'],
        inStock: true,
        featured: true
    },
    {
        id: 32,
        name: 'Suede Classic',
        brand: 'Puma',
        category: 'sneakers',
        price: 80,
        originalPrice: 95,
        image: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=400&h=300&fit=crop&auto=format',
        images: [
            'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=400&h=300&fit=crop&auto=format',
            'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400&h=300&fit=crop&auto=format',
            'https://images.unsplash.com/photo-1552346154-21d32810cdfd?w=400&h=300&fit=crop&auto=format'
        ],
        description: 'The Puma Suede Classic features suede upper and rubber outsole. A timeless silhouette that never goes out of style.',
        specifications: {
            'Material': 'Suede upper',
            'Sole': 'Rubber outsole',
            'Closure': 'Lace-up',
            'Weight': '290g',
            'Origin': 'Vietnam'
        },
        sizes: ['7', '8', '9', '10', '11', '12'],
        colors: ['White', 'Black', 'Navy', 'Red'],
        inStock: true,
        featured: false
    },
    {
        id: 33,
        name: '574 Classic',
        brand: 'New Balance',
        category: 'sneakers',
        price: 85,
        originalPrice: 100,
        image: 'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=400&h=300&fit=crop&auto=format',
        images: [
            'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=400&h=300&fit=crop&auto=format',
            'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=400&h=300&fit=crop&auto=format',
            'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400&h=300&fit=crop&auto=format'
        ],
        description: 'The New Balance 574 Classic features suede and mesh upper with ENCAP midsole. A running-inspired silhouette with street style appeal.',
        specifications: {
            'Material': 'Suede and mesh upper',
            'Sole': 'ENCAP midsole with rubber outsole',
            'Closure': 'Lace-up',
            'Weight': '330g',
            'Origin': 'Vietnam'
        },
        sizes: ['7', '8', '9', '10', '11', '12'],
        colors: ['Grey', 'Navy', 'Black', 'White'],
        inStock: true,
        featured: false
    },
    {
        id: 34,
        name: '327 Classic',
        brand: 'New Balance',
        category: 'sneakers',
        price: 90,
        originalPrice: 110,
        image: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=400&h=300&fit=crop&auto=format',
        images: [
            'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=400&h=300&fit=crop&auto=format',
            'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=400&h=300&fit=crop&auto=format',
            'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=400&h=300&fit=crop&auto=format'
        ],
        description: 'The New Balance 327 Classic features suede and mesh upper with retro-inspired design. A modern take on classic running aesthetics.',
        specifications: {
            'Material': 'Suede and mesh upper',
            'Sole': 'Rubber outsole',
            'Closure': 'Lace-up',
            'Weight': '310g',
            'Origin': 'Vietnam'
        },
        sizes: ['7', '8', '9', '10', '11', '12'],
        colors: ['White', 'Black', 'Navy', 'Grey'],
        inStock: true,
        featured: false
    },
    {
        id: 35,
        name: 'Club C 85',
        brand: 'Reebok',
        category: 'sneakers',
        price: 75,
        originalPrice: 90,
        image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&h=300&fit=crop&auto=format',
        images: [
            'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&h=300&fit=crop&auto=format',
            'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=400&h=300&fit=crop&auto=format',
            'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=400&h=300&fit=crop&auto=format'
        ],
        description: 'The Reebok Club C 85 features leather upper and rubber outsole. A tennis-inspired silhouette with clean, minimalist design.',
        specifications: {
            'Material': 'Leather upper',
            'Sole': 'Rubber outsole',
            'Closure': 'Lace-up',
            'Weight': '300g',
            'Origin': 'Vietnam'
        },
        sizes: ['7', '8', '9', '10', '11', '12'],
        colors: ['White', 'Black', 'Navy', 'Red'],
        inStock: true,
        featured: false
    },
    {
        id: 36,
        name: 'Workout Plus',
        brand: 'Reebok',
        category: 'sneakers',
        price: 80,
        originalPrice: 95,
        image: 'https://images.unsplash.com/photo-1552346154-21d32810cdfd?w=400&h=300&fit=crop&auto=format',
        images: [
            'https://images.unsplash.com/photo-1552346154-21d32810cdfd?w=400&h=300&fit=crop&auto=format',
            'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&h=300&fit=crop&auto=format',
            'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=400&h=300&fit=crop&auto=format'
        ],
        description: 'The Reebok Workout Plus features leather upper and rubber outsole. A fitness-inspired silhouette with classic styling.',
        specifications: {
            'Material': 'Leather upper',
            'Sole': 'Rubber outsole',
            'Closure': 'Lace-up',
            'Weight': '320g',
            'Origin': 'Vietnam'
        },
        sizes: ['7', '8', '9', '10', '11', '12'],
        colors: ['White', 'Black', 'Navy', 'Grey'],
        inStock: true,
        featured: false
    },
    {
        id: 37,
        name: 'Wingtip Brogue',
        brand: 'Clarks',
        category: 'dress-shoes',
        price: 180,
        originalPrice: 220,
        image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&h=300&fit=crop&auto=format',
        images: [
            'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&h=300&fit=crop&auto=format',
            'https://images.unsplash.com/photo-1552346154-21d32810cdfd?w=400&h=300&fit=crop&auto=format',
            'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&h=300&fit=crop&auto=format'
        ],
        description: 'The Clarks Wingtip Brogue features premium leather upper and rubber sole. A classic dress shoe with modern comfort technology.',
        specifications: {
            'Material': 'Premium leather upper',
            'Sole': 'Rubber sole',
            'Closure': 'Lace-up',
            'Weight': '450g',
            'Origin': 'England'
        },
        sizes: ['7', '8', '9', '10', '11', '12'],
        colors: ['Black', 'Brown', 'Tan'],
        inStock: true,
        featured: true
    },
    {
        id: 38,
        name: 'Desert Boot',
        brand: 'Clarks',
        category: 'boots',
        price: 120,
        originalPrice: 150,
        image: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=300&fit=crop&auto=format',
        images: [
            'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=300&fit=crop&auto=format',
            'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&h=300&fit=crop&auto=format',
            'https://images.unsplash.com/photo-1552346154-21d32810cdfd?w=400&h=300&fit=crop&auto=format'
        ],
        description: 'The Clarks Desert Boot features suede upper and crepe rubber sole. A timeless silhouette that works for both casual and smart casual occasions.',
        specifications: {
            'Material': 'Suede upper',
            'Sole': 'Crepe rubber sole',
            'Closure': 'Lace-up',
            'Weight': '400g',
            'Origin': 'England'
        },
        sizes: ['7', '8', '9', '10', '11', '12'],
        colors: ['Brown', 'Black', 'Tan', 'Navy'],
        inStock: true,
        featured: false
    },
    {
        id: 39,
        name: 'Classic Moc',
        brand: 'Sperry',
        category: 'loafers',
        price: 100,
        originalPrice: 120,
        image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop&auto=format',
        images: [
            'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop&auto=format',
            'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=300&fit=crop&auto=format',
            'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&h=300&fit=crop&auto=format'
        ],
        description: 'The Sperry Classic Moc features handsewn moccasin construction and rubber outsole. Perfect for casual and business casual occasions.',
        specifications: {
            'Material': 'Premium leather upper',
            'Sole': 'Rubber outsole',
            'Closure': 'Slip-on',
            'Weight': '260g',
            'Origin': 'China'
        },
        sizes: ['7', '8', '9', '10', '11', '12'],
        colors: ['Brown', 'Black', 'Tan', 'Navy'],
        inStock: true,
        featured: false
    },
    {
        id: 40,
        name: 'A/O 2-Eye',
        brand: 'Sperry',
        category: 'loafers',
        price: 95,
        originalPrice: 115,
        image: 'https://images.unsplash.com/photo-1582897085656-c636d006a246?w=400&h=300&fit=crop&auto=format',
        images: [
            'https://images.unsplash.com/photo-1582897085656-c636d006a246?w=400&h=300&fit=crop&auto=format',
            'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop&auto=format',
            'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=300&fit=crop&auto=format'
        ],
        description: 'The Sperry A/O 2-Eye features handsewn moccasin construction and rubber outsole. A classic boat shoe silhouette with timeless style.',
        specifications: {
            'Material': 'Premium leather upper',
            'Sole': 'Rubber outsole',
            'Closure': 'Lace-up',
            'Weight': '270g',
            'Origin': 'China'
        },
        sizes: ['7', '8', '9', '10', '11', '12'],
        colors: ['Brown', 'Black', 'Tan', 'Navy'],
        inStock: true,
        featured: false
    }
];

// Shopping cart
let cart = [];

// Current filters
let currentFilters = {
    category: 'all',
    brand: 'all',
    price: 'all',
    sort: 'featured',
    search: ''
};

// Export data for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { categories, brands, products, cart, currentFilters };
}
