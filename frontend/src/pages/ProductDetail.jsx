import React, { useState } from 'react';
import { ArrowLeft, Heart, Share2, MapPin, Calendar, Star, Shield, MessageCircle, Phone } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import Header from '../components/ui/layout/Header';

const ProductDetail = ({ productId = 1 }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isFavorited, setIsFavorited] = useState(false);

  // Mock product data (in real app, fetch by productId)
  const product = {
    id: 1,
    title: "iPhone 14 Pro Max - Excellent Condition",
    price: 85000,
    images: [
      "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=600",
      "https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=600",
      "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=600",
      "https://images.unsplash.com/photo-1567581935884-3349723552ca?w=600"
    ],
    description: `Mint condition iPhone 14 Pro Max, 256GB, Space Black. 

Features:
• 256GB Storage
• Space Black Color
• Original box and all accessories included
• Screen protector applied since day 1
• No scratches or dents
• Battery health: 98%
• Under warranty until March 2025

Reason for selling: Upgrading to iPhone 15 Pro Max

Serious buyers only. No lowballers please. Price is slightly negotiable for immediate sale.`,
    category: "Electronics",
    condition: "Like New",
    location: "Bandra West, Mumbai, Maharashtra",
    postedDate: "2 days ago",
    views: 1247,
    seller: {
      id: 1,
      name: "Rahul Sharma",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100",
      isVerified: true,
      rating: 4.8,
      totalSales: 23,
      responseRate: "Usually responds within an hour",
      memberSince: "June 2023"
    },
    tags: ["iPhone", "Apple", "Mobile", "Smartphone"],
    specifications: {
      "Brand": "Apple",
      "Model": "iPhone 14 Pro Max",
      "Storage": "256GB",
      "Color": "Space Black",
      "Condition": "Like New",
      "Warranty": "Yes, until March 2025"
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleContactSeller = () => {
    // Open chat/message modal
    console.log('Contact seller');
  };

  const handleCallSeller = () => {
    // Reveal phone number or initiate call
    console.log('Call seller');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Back Button */}
        <Button variant="ghost" className="mb-4" onClick={() => window.history.back()}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to listings
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Images */}
          <div className="lg:col-span-2">
            <Card className="overflow-hidden">
              {/* Main Image */}
              <div className="aspect-square relative">
                <img
                  src={product.images[selectedImageIndex]}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4 flex space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="bg-white/80 backdrop-blur-sm"
                    onClick={() => setIsFavorited(!isFavorited)}
                  >
                    <Heart className={`w-4 h-4 ${isFavorited ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
                  </Button>
                  <Button variant="outline" size="icon" className="bg-white/80 backdrop-blur-sm">
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Image Thumbnails */}
              <div className="p-4">
                <div className="flex space-x-2 overflow-x-auto">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImageIndex === index ? 'border-blue-500' : 'border-gray-200'
                      }`}
                    >
                      <img src={image} alt={`View ${index + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            </Card>

            {/* Product Details */}
            <Card className="mt-6 p-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">{product.title}</h1>
              
              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {product.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">{tag}</Badge>
                ))}
              </div>

              {/* Description */}
              <div className="mb-6">
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-gray-700 whitespace-pre-line">{product.description}</p>
              </div>

              {/* Specifications */}
              <div>
                <h3 className="font-semibold mb-3">Specifications</h3>
                <div className="grid grid-cols-2 gap-y-2 gap-x-4">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span className="text-gray-600">{key}:</span>
                      <span className="font-medium">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column - Purchase Info */}
          <div className="space-y-6">
            {/* Price & Actions */}
            <Card className="p-6">
              <div className="text-3xl font-bold text-gray-900 mb-2">
                {formatPrice(product.price)}
              </div>
              <div className="text-sm text-gray-600 mb-6">
                Listed {product.postedDate} • {product.views.toLocaleString()} views
              </div>

              <div className="space-y-3">
                <Button onClick={handleContactSeller} className="w-full" size="lg">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Message Seller
                </Button>
                
                <Button variant="outline" onClick={handleCallSeller} className="w-full" size="lg">
                  <Phone className="w-4 h-4 mr-2" />
                  Call Seller
                </Button>
              </div>

              <Separator className="my-4" />

              {/* Location & Condition */}
              <div className="space-y-3 text-sm">
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 text-gray-500 mr-2" />
                  <span>{product.location}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 text-gray-500 mr-2" />
                  <span>Posted {product.postedDate}</span>
                </div>
                <div className="flex items-center">
                  <Shield className="w-4 h-4 text-gray-500 mr-2" />
                  <span>Condition: {product.condition}</span>
                </div>
              </div>
            </Card>

            {/* Seller Info */}
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Seller Information</h3>
              
              <div className="flex items-center mb-4">
                <img
                  src={product.seller.avatar}
                  alt={product.seller.name}
                  className="w-12 h-12 rounded-full mr-3"
                />
                <div>
                  <div className="flex items-center">
                    <h4 className="font-medium">{product.seller.name}</h4>
                    {product.seller.isVerified && (
                      <Shield className="w-4 h-4 text-blue-500 ml-1" />
                    )}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Star className="w-3 h-3 text-yellow-400 mr-1" />
                    <span>{product.seller.rating}</span>
                    <span className="mx-1">•</span>
                    <span>{product.seller.totalSales} sales</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-sm text-gray-600">
                <p>{product.seller.responseRate}</p>
                <p>Member since {product.seller.memberSince}</p>
              </div>

              <Button variant="outline" className="w-full mt-4">
                View Profile
              </Button>
            </Card>

            {/* Safety Tips */}
            <Card className="p-6 bg-blue-50 border-blue-200">
              <div className="flex items-center mb-3">
                <Shield className="w-5 h-5 text-blue-600 mr-2" />
                <h3 className="font-semibold text-blue-900">Safety Tips</h3>
              </div>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Meet in a public place</li>
                <li>• Don't pay in advance</li>
                <li>• Inspect the item thoroughly</li>
                <li>• Trust your instincts</li>
              </ul>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;