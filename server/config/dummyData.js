/**
 * Dummy Data
 * Sample data for database seeding
 */

export const dummyUsers = [
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
    region: 'North',
    role: 'customer'
  },
  {
    name: 'Shop Owner',
    email: 'owner@example.com',
    password: 'password123',
    region: 'South',
    role: 'shop_owner'
  },
  {
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'password123',
    region: 'Central',
    role: 'admin'
  }
];

export const dummyShops = [
  {
    name: 'TechHub North',
    description: 'Latest electronics and gadgets',
    category: 'Electronics',
    region: 'North',
    address: '123 Main St',
    city: 'Delhi',
    pincode: '110001',
    contactEmail: 'tech@example.com',
    contactPhone: '9876543210',
    rating: 4.5,
    totalProducts: 80
  },
  {
    name: 'Fashion Forward',
    description: 'Trendy clothing and accessories',
    category: 'Clothing',
    region: 'South',
    address: '456 Fashion Blvd',
    city: 'Chennai',
    pincode: '600001',
    contactEmail: 'fashion@example.com',
    contactPhone: '9876543211',
    rating: 4.2,
    totalProducts: 80
  },
  {
    name: 'Fresh Market',
    description: 'Organic groceries and fresh produce',
    category: 'Grocery',
    region: 'Central',
    address: '789 Market Ave',
    city: 'Bhopal',
    pincode: '462001',
    contactEmail: 'market@example.com',
    contactPhone: '9876543212',
    rating: 4.7,
    totalProducts: 80
  },
  {
    name: 'Home Comfort',
    description: 'Furniture and home decor',
    category: 'Furniture',
    region: 'East',
    address: '321 Comfort St',
    city: 'Kolkata',
    pincode: '700001',
    contactEmail: 'home@example.com',
    contactPhone: '9876543213',
    rating: 4.3,
    totalProducts: 80
  },
  {
    name: 'Book Haven',
    description: 'Wide collection of books',
    category: 'Books',
    region: 'West',
    address: '654 Literary Lane',
    city: 'Mumbai',
    pincode: '400001',
    contactEmail: 'books@example.com',
    contactPhone: '9876543214',
    rating: 4.6,
    totalProducts: 80
  }
];

const electronicsBases = [
  { name: 'Wireless Earbuds', price: 2999, tags: ['audio', 'wireless'] },
  { name: 'Power Bank 10000mAh', price: 1499, tags: ['battery', 'travel'] },
  { name: 'Mechanical Keyboard', price: 3499, tags: ['keyboard', 'gaming'] },
  { name: 'Gaming Mouse', price: 1299, tags: ['mouse', 'gaming'] },
  { name: 'Smart Fitness Band', price: 1999, tags: ['fitness', 'tracker'] },
  { name: 'Bluetooth Speaker', price: 2499, tags: ['audio', 'speaker'] },
  { name: '4K Action Camera', price: 7999, tags: ['camera', 'video'] },
  { name: 'USB-C Charging Cable', price: 499, tags: ['cable', 'charger'] },
  { name: 'Over-Ear Headphones', price: 4599, tags: ['audio', 'headphones'] },
  { name: 'Laptop Cooling Stand', price: 999, tags: ['accessories', 'cooling'] }
];

const clothingBases = [
  { name: 'Crewneck T-Shirt', price: 599, tags: ['shirt', 'casual'] },
  { name: 'Slim Fit Denim Jeans', price: 1999, tags: ['pants', 'denim'] },
  { name: 'Waterproof Hooded Jacket', price: 2999, tags: ['jacket', 'outdoor'] },
  { name: 'Cushioned Running Shoes', price: 3499, tags: ['shoes', 'sports'] },
  { name: 'Warm Woolen Beanie', price: 499, tags: ['accessories', 'winter'] },
  { name: 'Classic Leather Belt', price: 899, tags: ['accessories', 'leather'] },
  { name: 'Athletic Training Shorts', price: 799, tags: ['shorts', 'activewear'] },
  { name: 'Comfortable Cotton Socks', price: 299, tags: ['socks', 'wear'] },
  { name: 'Formal Button-Down Shirt', price: 1299, tags: ['shirt', 'formal'] },
  { name: 'Fleece Pullover Hoodie', price: 1799, tags: ['hoodie', 'casual'] }
];

const groceryBases = [
  { name: 'Sweet Red Tomatoes', price: 60, tags: ['vegetables', 'fresh'] },
  { name: 'Premium Basmati Rice', price: 120, tags: ['rice', 'staples'] },
  { name: 'Extra Virgin Olive Oil', price: 650, tags: ['oil', 'cooking'] },
  { name: 'Raw Forest Honey', price: 280, tags: ['honey', 'organic'] },
  { name: 'Organic Chia Seeds', price: 190, tags: ['seeds', 'superfood'] },
  { name: 'Green Tea Matcha', price: 390, tags: ['tea', 'beverage'] },
  { name: 'Whole Wheat Bread', price: 45, tags: ['bread', 'bakery'] },
  { name: 'Roasted Almonds', price: 250, tags: ['nuts', 'snacks'] },
  { name: 'Natural Peanut Butter', price: 220, tags: ['spread', 'healthy'] },
  { name: 'Dark Chocolate Bar 80%', price: 130, tags: ['chocolate', 'sweets'] }
];

const furnitureBases = [
  { name: 'Ergonomic Office Chair', price: 7999, tags: ['chair', 'office'] },
  { name: 'Solid Wood Coffee Table', price: 4500, tags: ['table', 'living room'] },
  { name: 'Memory Foam Mattress', price: 12999, tags: ['mattress', 'bedroom'] },
  { name: 'Loft Metal Bookcase', price: 5499, tags: ['bookcase', 'shelf'] },
  { name: 'Velvet Lounge Armchair', price: 8999, tags: ['chair', 'accent'] },
  { name: 'Platform Queen Bed Frame', price: 14999, tags: ['bed', 'bedroom'] },
  { name: 'Minimalist Writing Desk', price: 3999, tags: ['desk', 'study'] },
  { name: 'Adjustable Floor Lamp', price: 1999, tags: ['lamp', 'lighting'] },
  { name: 'Bamboo Shoe Organizer', price: 899, tags: ['shoerack', 'storage'] },
  { name: 'Reversible Area Rug', price: 4999, tags: ['rug', 'decor'] }
];

const bookBases = [
  { name: 'The Silent Echo', price: 299, tags: ['fiction', 'thriller'] },
  { name: 'JavaScript: The Good Parts', price: 699, tags: ['tech', 'programming'] },
  { name: 'Wandering Souls: Fantasy Saga', price: 399, tags: ['fiction', 'fantasy'] },
  { name: 'Mindset: The New Psychology', price: 450, tags: ['self-help', 'psychology'] },
  { name: 'The Ancient Key: Mystery', price: 320, tags: ['fiction', 'history'] },
  { name: 'Guide to Indoor Gardening', price: 499, tags: ['nature', 'lifestyle'] },
  { name: 'Kitchen Alchemy Cookbook', price: 599, tags: ['cooking', 'cookbook'] },
  { name: 'Infinite Cosmos: Stars Voyage', price: 399, tags: ['science', 'astronomy'] },
  { name: 'Digital Frontiers: AI Future', price: 799, tags: ['tech', 'science'] },
  { name: 'Modern Leadership Handbook', price: 349, tags: ['business', 'management'] }
];

const brands = ['Aero', 'Volt', 'Titan', 'Apex', 'Sonic', 'Nimbus', 'Luxe', 'Zen', 'Eco', 'Nova'];
const descriptions = [
  'Premium quality product designed for durability and performance.',
  'Top-rated item crafted from high-grade materials with careful attention to detail.',
  'An essential addition to your daily routine, combining style and utility.',
  'Experience superior quality and unmatched convenience with this popular selection.',
  'Expertly created to meet the highest standards of safety and aesthetic design.'
];

const categoryImages = {
  Electronics: [
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1527866990279-b01648a6274a?w=500&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=500&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=500&auto=format&fit=crop&q=60'
  ],
  Clothing: [
    'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1520903928273-024851a27e4f?w=500&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=500&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=500&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=500&auto=format&fit=crop&q=60'
  ],
  Grocery: [
    'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=500&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=500&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=500&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1517881917430-e70dfb3610aa?w=500&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=500&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1608686207856-001b95cf60ca?w=500&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?w=500&auto=format&fit=crop&q=60'
  ],
  Furniture: [
    'https://images.unsplash.com/photo-1594620302200-9a762244a156?w=500&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=500&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=500&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=500&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=500&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=500&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500&auto=format&fit=crop&q=60'
  ],
  Books: [
    'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=500&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=500&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1610116306796-6ebd7a489148?w=500&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1531988042231-d39a9cc12a9a?w=500&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=500&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=500&auto=format&fit=crop&q=60'
  ]
};

const generateProducts = () => {
  const allProducts = [];
  
  const generateCategory = (bases, categoryName) => {
    for (let i = 0; i < 80; i++) {
      const base = bases[i % bases.length];
      const brand = brands[Math.floor(Math.random() * brands.length)];
      const version = i >= bases.length ? ` (Gen ${Math.floor(i / bases.length) + 1})` : '';
      const name = `${brand} ${base.name}${version}`;
      
      // Budget, standard, and premium price ranges
      const multiplier = i % 3 === 0 ? 0.45 : (i % 3 === 1 ? 1.0 : 2.2);
      const priceOffset = Math.floor((Math.random() - 0.5) * 0.25 * base.price);
      const finalPrice = Math.max(15, Math.floor(base.price * multiplier) + priceOffset);
      
      const rating = parseFloat((4.0 + Math.random() * 1.0).toFixed(1));
      const stock = Math.floor(10 + Math.random() * 190);
      const desc = descriptions[Math.floor(Math.random() * descriptions.length)] + ` Perfect for all your ${categoryName.toLowerCase()} needs.`;
      
      const categoryImgs = categoryImages[categoryName] || [];
      const imageSelected = categoryImgs[i % categoryImgs.length] || '';
      
      allProducts.push({
        name,
        description: desc,
        category: categoryName,
        price: finalPrice,
        stock,
        images: imageSelected ? [imageSelected] : [],
        rating,
        tags: [...base.tags, categoryName.toLowerCase(), brand.toLowerCase()]
      });
    }
  };
  
  generateCategory(electronicsBases, 'Electronics');
  generateCategory(clothingBases, 'Clothing');
  generateCategory(groceryBases, 'Grocery');
  generateCategory(furnitureBases, 'Furniture');
  generateCategory(bookBases, 'Books');
  
  return allProducts;
};

const featuredItems = [
  // Electronics
  {
    name: 'Vortex Pulse Quantum Headset',
    description: 'Surround sound audio powerhouse with active noise cancellation and glass-grade transparent acoustics. Perfect for high-intensity gaming and studio production.',
    category: 'Electronics',
    price: 3499,
    stock: 75,
    images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60'],
    rating: 4.9,
    isFeatured: true,
    tags: ['audio', 'gaming', 'headset', 'featured', 'vortex', 'electronics']
  },
  {
    name: 'Nimbus Shield 3-in-1 Charging Dock',
    description: 'Futuristic magnetic rapid charger for your smartphone, smartwatch, and earbuds. Glassmorphic charge-indicator lights with dynamic thermal protection.',
    category: 'Electronics',
    price: 2499,
    stock: 60,
    images: ['https://images.unsplash.com/photo-1622445262465-2481c8573250?w=500&auto=format&fit=crop&q=60'],
    rating: 4.7,
    isFeatured: true,
    tags: ['charger', 'wireless', 'dock', 'featured', 'nimbus', 'electronics']
  },
  {
    name: 'Sonic Wave Pods Pro',
    description: 'Micro wireless earbuds featuring adaptive environment sound-tuning and 40 hours of heavy-bass backup. Comes with a carbon-fiber textured case.',
    category: 'Electronics',
    price: 4999,
    stock: 80,
    images: ['https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&auto=format&fit=crop&q=60'],
    rating: 4.8,
    isFeatured: true,
    tags: ['audio', 'earbuds', 'wireless', 'featured', 'sonic', 'electronics']
  },
  {
    name: 'Volt Charge Matrix Power Bank',
    description: 'Ultra-thin 20000mAh rapid-charge battery pack with an integrated smart status display. Perfect companion for long journeys and digital nomad tasks.',
    category: 'Electronics',
    price: 1999,
    stock: 120,
    images: ['https://images.unsplash.com/photo-1609592424089-9dbb2c01997e?w=500&auto=format&fit=crop&q=60'],
    rating: 4.6,
    isFeatured: true,
    tags: ['battery', 'travel', 'powerbank', 'featured', 'volt', 'electronics']
  },
  {
    name: 'Apex Swift Glide Pad',
    description: 'Low-friction workspace glide surface tracking pad with water-resistant stitching. Designed for optimal optical laser precision.',
    category: 'Electronics',
    price: 999,
    stock: 150,
    images: ['https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=500&auto=format&fit=crop&q=60'],
    rating: 4.5,
    isFeatured: true,
    tags: ['mousepad', 'gaming', 'accessories', 'featured', 'apex', 'electronics']
  },
  {
    name: 'Titan Guard blue-Shield Glasses',
    description: 'Scientific protective lenses designed to block eye strain from high-brightness monitors. Lightweight titanium composite frames.',
    category: 'Electronics',
    price: 1499,
    stock: 90,
    images: ['https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&auto=format&fit=crop&q=60'],
    rating: 4.4,
    isFeatured: true,
    tags: ['eyewear', 'computer', 'accessories', 'featured', 'titan', 'electronics']
  },
  // Clothing
  {
    name: 'Luxe Wrap Organic Scarf',
    description: 'Luxury thermal neck wrap woven from handpicked organic wool fibres. Unbelievably soft insulation for cold winter weather.',
    category: 'Clothing',
    price: 1299,
    stock: 45,
    images: ['https://images.unsplash.com/photo-1520903928273-024851a27e4f?w=500&auto=format&fit=crop&q=60'],
    rating: 4.8,
    isFeatured: true,
    tags: ['scarf', 'winter', 'wool', 'featured', 'luxe', 'clothing']
  },
  {
    name: 'Volt Flex Thermal Base Shirt',
    description: 'High-performance athletic base layer shirt featuring targeted compression mesh and temperature regulating properties.',
    category: 'Clothing',
    price: 999,
    stock: 70,
    images: ['https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=500&auto=format&fit=crop&q=60'],
    rating: 4.5,
    isFeatured: true,
    tags: ['shirt', 'activewear', 'thermal', 'featured', 'volt', 'clothing']
  },
  {
    name: 'Zen Lounge Linen Joggers',
    description: 'Relaxed loose-fit linen pants with elastic drawstrings. Keeps you cool, comfortable, and stylish during beach getaways.',
    category: 'Clothing',
    price: 1899,
    stock: 55,
    images: ['https://images.unsplash.com/photo-1542272604-787c3835535d?w=500&auto=format&fit=crop&q=60'],
    rating: 4.6,
    isFeatured: true,
    tags: ['pants', 'linen', 'casual', 'featured', 'zen', 'clothing']
  },
  {
    name: 'Aero Guard Windbreaker Jacket',
    description: 'Featherlight packable ripstop wind jacket with rain-shedding technology. Packs into its own compact chest pocket.',
    category: 'Clothing',
    price: 2999,
    stock: 40,
    images: ['https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&auto=format&fit=crop&q=60'],
    rating: 4.7,
    isFeatured: true,
    tags: ['jacket', 'windbreaker', 'outdoor', 'featured', 'aero', 'clothing']
  },
  {
    name: 'Nova Knit Slip-on Sneakers',
    description: 'Ultra-flexible engineered mesh upper shoes with supportive memory cushioning. Simplifies everyday commutes.',
    category: 'Clothing',
    price: 2499,
    stock: 65,
    images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop&q=60'],
    rating: 4.3,
    isFeatured: true,
    tags: ['shoes', 'sneakers', 'casual', 'featured', 'nova', 'clothing']
  },
  // Grocery
  {
    name: 'Zen Forest Wild Nectar Honey',
    description: 'Raw single-source wildflower honey harvested from forest reserves. Retains all natural active enzymes.',
    category: 'Grocery',
    price: 590,
    stock: 110,
    images: ['https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=500&auto=format&fit=crop&q=60'],
    rating: 4.9,
    isFeatured: true,
    tags: ['honey', 'organic', 'raw', 'featured', 'zen', 'grocery']
  },
  {
    name: 'Eco Matcha Ceremonial Gold',
    description: 'First-harvest shade-grown tea leaves stone-ground into vibrant green powder. Provides clean mental clarity.',
    category: 'Grocery',
    price: 990,
    stock: 85,
    images: ['https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=500&auto=format&fit=crop&q=60'],
    rating: 4.8,
    isFeatured: true,
    tags: ['tea', 'matcha', 'organic', 'featured', 'eco', 'grocery']
  },
  {
    name: 'Luxe Espresso Dark Concentrate',
    description: 'Rich cold-steeped espresso extract concentrate bottle. Add milk or water for instant barista-style coffee.',
    category: 'Grocery',
    price: 490,
    stock: 130,
    images: ['https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=500&auto=format&fit=crop&q=60'],
    rating: 4.7,
    isFeatured: true,
    tags: ['coffee', 'concentrate', 'espresso', 'featured', 'luxe', 'grocery']
  },
  {
    name: 'Volt Power Protein Granola',
    description: 'Crunchy multi-seed grain oats baked with dark cocoa chunks and soy protein crisps. Healthy fuel.',
    category: 'Grocery',
    price: 340,
    stock: 140,
    images: ['https://images.unsplash.com/photo-1517881917430-e70dfb3610aa?w=500&auto=format&fit=crop&q=60'],
    rating: 4.4,
    isFeatured: true,
    tags: ['granola', 'cereal', 'healthy', 'featured', 'volt', 'grocery']
  },
  {
    name: 'Zen Orchard Cold-Pressed Olive Oil',
    description: 'Premium early-harvest olives cold pressed to lock in peppery antioxidants. Essential cooking upgrade.',
    category: 'Grocery',
    price: 790,
    stock: 95,
    images: ['https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500&auto=format&fit=crop&q=60'],
    rating: 4.6,
    isFeatured: true,
    tags: ['oil', 'oliveoil', 'organic', 'featured', 'zen', 'grocery']
  },
  // Furniture
  {
    name: 'Nimbus Float Wall Bookcase',
    description: 'Minimalist floating solid white-oak shelf rack with concealed hardware. Elegant book organization.',
    category: 'Furniture',
    price: 4999,
    stock: 30,
    images: ['https://images.unsplash.com/photo-1594620302200-9a762244a156?w=500&auto=format&fit=crop&q=60'],
    rating: 4.8,
    isFeatured: true,
    tags: ['shelf', 'bookcase', 'oak', 'featured', 'nimbus', 'furniture']
  },
  {
    name: 'Vortex Throne High-Back Chair',
    description: 'Premium posture-supporting mesh gaming/office chair with 3D armrests and lockable tilt recline.',
    category: 'Furniture',
    price: 12999,
    stock: 25,
    images: ['https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=500&auto=format&fit=crop&q=60'],
    rating: 4.9,
    isFeatured: true,
    tags: ['chair', 'ergonomic', 'office', 'featured', 'vortex', 'furniture']
  },
  {
    name: 'Nova Velvet Tufted Accent Chair',
    description: 'Stunning luxury retro wingback arm-lounge seat supported by gold-plated steel legs.',
    category: 'Furniture',
    price: 14999,
    stock: 20,
    images: ['https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=500&auto=format&fit=crop&q=60'],
    rating: 4.7,
    isFeatured: true,
    tags: ['chair', 'armchair', 'lounge', 'featured', 'nova', 'furniture']
  },
  {
    name: 'Zen Oak Smart Writing Table',
    description: 'Elegant solid oak desk featuring height-adjustable metal legs and integrated smart cable management docks.',
    category: 'Furniture',
    price: 8999,
    stock: 35,
    images: ['https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=500&auto=format&fit=crop&q=60'],
    rating: 4.6,
    isFeatured: true,
    tags: ['desk', 'table', 'office', 'featured', 'zen', 'furniture']
  },
  {
    name: 'Aero Lumina Dimmer Floor Lamp',
    description: 'App-controlled LED ambiance stand lamp with adjustable color temperature from warm gold to daylight.',
    category: 'Furniture',
    price: 2499,
    stock: 50,
    images: ['https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500&auto=format&fit=crop&q=60'],
    rating: 4.5,
    isFeatured: true,
    tags: ['lamp', 'lighting', 'smart', 'featured', 'aero', 'furniture']
  },
  // Books
  {
    name: 'JavaScript: Quantum Web Architectures',
    description: 'Advanced engineering manual detailing concurrency models, event loops, and microservice pipelines.',
    category: 'Books',
    price: 899,
    stock: 100,
    images: ['https://images.unsplash.com/photo-1532012197267-da84d127e765?w=500&auto=format&fit=crop&q=60'],
    rating: 4.9,
    isFeatured: true,
    tags: ['programming', 'javascript', 'tech', 'featured', 'books']
  },
  {
    name: 'The Cybernetic Dawn: Odyssey Volume 1',
    description: 'Bestselling sci-fi thriller tracing neural network consciousness emerging across orbital colonies.',
    category: 'Books',
    price: 499,
    stock: 120,
    images: ['https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500&auto=format&fit=crop&q=60'],
    rating: 4.8,
    isFeatured: true,
    tags: ['fiction', 'scifi', 'novel', 'featured', 'books']
  },
  {
    name: 'Zen Wisdom: Mastery of Everyday Living',
    description: 'Philosophical roadmap providing practical breathing routines, morning focus tasks, and mindfulness.',
    category: 'Books',
    price: 399,
    stock: 150,
    images: ['https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&auto=format&fit=crop&q=60'],
    rating: 4.7,
    isFeatured: true,
    tags: ['mindfulness', 'philosophy', 'lifestyle', 'featured', 'books']
  },
  {
    name: 'Venture Builders: Scale Strategy Playbook',
    description: 'Inside case studies of modern unicorns, examining boot-strapping frameworks and venture growth.',
    category: 'Books',
    price: 599,
    stock: 90,
    images: ['https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=500&auto=format&fit=crop&q=60'],
    rating: 4.6,
    isFeatured: true,
    tags: ['business', 'entrepreneurship', 'strategy', 'featured', 'books']
  }
];

export const dummyProducts = [...generateProducts(), ...featuredItems];
