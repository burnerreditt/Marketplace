export const mockProducts = [
  {
    id: 1,
    title: "iPhone 14 Pro Max - Excellent Condition",
    price: 85000,
    images: [
      "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=400",
      "https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=400"
    ],
    description: "Mint condition iPhone 14 Pro Max, 256GB, Space Black. Includes original box, charger, and screen protector applied since day 1.",
    category: "electronics",
    location: "Mumbai, Maharashtra",
    postedDate: "2 days ago",
    seller: {
      id: 1,
      name: "Rahul Sharma",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100",
      isVerified: true,
      rating: 4.8,
      totalSales: 23
    },
    isFavorited: false,
    condition: "Like New",
    tags: ["Electronics", "Mobile", "Apple"]
  },
  {
    id: 2,
    title: "Royal Enfield Classic 350 - 2022 Model",
    price: 145000,
    images: [
      "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400",
      "https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=400"
    ],
    description: "Well maintained Royal Enfield Classic 350, single owner, all documents clear. Recently serviced.",
    category: "vehicles",
    location: "Delhi, NCR",
    postedDate: "1 day ago",
    seller: {
      id: 2,
      name: "Priya Patel",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100",
      isVerified: true,
      rating: 4.9,
      totalSales: 12
    },
    isFavorited: true,
    condition: "Good",
    tags: ["Motorcycle", "Royal Enfield", "Vehicle"]
  },
  {
    id: 3,
    title: "2BHK Furnished Apartment for Rent",
    price: 25000,
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=400"
    ],
    description: "Spacious 2BHK fully furnished apartment in prime location. Includes all amenities, parking, and 24/7 security.",
    category: "property",
    location: "Bangalore, Karnataka",
    postedDate: "3 hours ago",
    seller: {
      id: 3,
      name: "Amit Kumar",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
      isVerified: false,
      rating: 4.5,
      totalSales: 8
    },
    isFavorited: false,
    condition: "New",
    tags: ["Apartment", "Rental", "Furnished"]
  },
  {
    id: 4,
    title: "Gaming Setup - Complete Package",
    price: 75000,
    images: [
      "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=400",
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400"
    ],
    description: "Complete gaming setup including RTX 3070 PC, 27\" 144Hz monitor, mechanical keyboard, gaming mouse, and chair.",
    category: "electronics",
    location: "Hyderabad, Telangana",
    postedDate: "1 week ago",
    seller: {
      id: 4,
      name: "Vikash Singh",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100",
      isVerified: true,
      rating: 4.7,
      totalSales: 15
    },
    isFavorited: false,
    condition: "Like New",
    tags: ["Gaming", "PC", "Setup"]
  },
  {
    id: 5,
    title: "Designer Saree Collection - Wedding Special",
    price: 8500,
    images: [
      "https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=400",
      "https://images.unsplash.com/photo-1594736797933-d0e3ba7a2276?w=400"
    ],
    description: "Exclusive designer saree collection for weddings and special occasions. Heavy work, premium fabric, worn only once.",
    category: "apparel",
    location: "Chennai, Tamil Nadu",
    postedDate: "5 days ago",
    seller: {
      id: 5,
      name: "Meera Reddy",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100",
      isVerified: true,
      rating: 4.6,
      totalSales: 31
    },
    isFavorited: true,
    condition: "Like New",
    tags: ["Saree", "Wedding", "Designer"]
  },
  {
    id: 6,
    title: "MacBook Pro 16\" M2 - Professional Use",
    price: 180000,
    images: [
      "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400",
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400"
    ],
    description: "MacBook Pro 16\" with M2 chip, 32GB RAM, 1TB SSD. Perfect for professional work, rarely used, under warranty.",
    category: "electronics",
    location: "Pune, Maharashtra",
    postedDate: "4 days ago",
    seller: {
      id: 6,
      name: "Arjun Malhotra",
      avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100",
      isVerified: true,
      rating: 4.9,
      totalSales: 19
    },
    isFavorited: false,
    condition: "Like New",
    tags: ["Laptop", "MacBook", "Professional"]
  }
];

export const mockCategories = [
  { id: 'all', name: 'Browse all', count: 1250 },
  { id: 'vehicles', name: 'Vehicles', count: 342 },
  { id: 'property', name: 'Property Rentals', count: 189 },
  { id: 'electronics', name: 'Electronics', count: 456 },
  { id: 'entertainment', name: 'Entertainment', count: 123 },
  { id: 'apparel', name: 'Apparel', count: 234 },
  { id: 'classifieds', name: 'Classifieds', count: 67 }
];

export const mockUsers = [
  {
    id: 1,
    name: "Rahul Sharma",
    email: "rahul.sharma@email.com",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100",
    phone: "+91 98765 43210",
    location: "Mumbai, Maharashtra",
    joinedDate: "2023-06-15",
    isVerified: true,
    rating: 4.8,
    totalSales: 23,
    totalPurchases: 12
  }
];

export const mockMessages = [
  {
    id: 1,
    productId: 1,
    buyerId: 2,
    sellerId: 1,
    messages: [
      {
        id: 1,
        senderId: 2,
        text: "Hi! Is this iPhone still available?",
        timestamp: "2024-01-20T10:30:00Z",
        isRead: true
      },
      {
        id: 2,
        senderId: 1,
        text: "Yes, it's still available. Are you interested?",
        timestamp: "2024-01-20T10:35:00Z",
        isRead: true
      },
      {
        id: 3,
        senderId: 2,
        text: "Can we meet for inspection? I'm in Mumbai too.",
        timestamp: "2024-01-20T10:40:00Z",
        isRead: false
      }
    ]
  }
];