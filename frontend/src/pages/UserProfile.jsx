import React, { useState } from 'react';
import { Camera, MapPin, Calendar, Star, Shield, Edit, Settings, Eye } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import Header from '../components/ui/layout/Header';
import ProductCard from '../components/ui/product/ProductCard';
import { mockProducts, mockUsers } from '../utils/mockData';

const UserProfile = ({ userId = 1 }) => {
  const [isOwnProfile] = useState(true); // Mock - in real app, check if current user's profile
  const [activeTab, setActiveTab] = useState('listings');

  // Mock user data
  const user = mockUsers[0];
  
  // Mock user's listings
  const userListings = mockProducts.filter(product => product.seller.id === userId);
  const soldListings = mockProducts.slice(0, 2); // Mock sold items
  const favoriteListings = mockProducts.slice(2, 4); // Mock favorites

  const stats = [
    { label: 'Active Listings', value: userListings.length },
    { label: 'Items Sold', value: user.totalSales },
    { label: 'Items Bought', value: user.totalPurchases },
    { label: 'Rating', value: `${user.rating}/5` }
  ];

  const handleProductClick = (product) => {
    // Navigate to product detail
    console.log('Product clicked:', product);
  };

  const handleFavorite = (productId) => {
    console.log('Toggle favorite:', productId);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Profile Header */}
        <Card className="p-6 mb-6">
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
            {/* Profile Picture */}
            <div className="relative">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-24 h-24 rounded-full object-cover"
              />
              {isOwnProfile && (
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute -bottom-2 -right-2 rounded-full bg-white"
                >
                  <Camera className="w-4 h-4" />
                </Button>
              )}
            </div>

            {/* User Info */}
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
                {user.isVerified && (
                  <Shield className="w-6 h-6 text-blue-500" />
                )}
              </div>

              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span>{user.location}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  <span>Joined {user.joinedDate}</span>
                </div>
                <div className="flex items-center">
                  <Star className="w-4 h-4 mr-1 text-yellow-400" />
                  <span>{user.rating} ({user.totalSales + user.totalPurchases} reviews)</span>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">Verified Email</Badge>
                <Badge variant="secondary">Phone Verified</Badge>
                <Badge variant="secondary">Quick Responder</Badge>
                {user.isVerified && <Badge variant="default">Trusted Seller</Badge>}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-2">
              {isOwnProfile ? (
                <>
                  <Button variant="outline">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                  <Button variant="outline">
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </Button>
                </>
              ) : (
                <>
                  <Button>Message</Button>
                  <Button variant="outline">Report User</Button>
                </>
              )}
            </div>
          </div>
        </Card>

        {/* Profile Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="listings">Active Listings ({userListings.length})</TabsTrigger>
            {isOwnProfile && (
              <>
                <TabsTrigger value="sold">Sold Items ({soldListings.length})</TabsTrigger>
                <TabsTrigger value="favorites">Favorites ({favoriteListings.length})</TabsTrigger>
              </>
            )}
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>

          {/* Active Listings */}
          <TabsContent value="listings">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {userListings.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onFavorite={handleFavorite}
                  onProductClick={handleProductClick}
                />
              ))}
            </div>
            {userListings.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">📦</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No active listings
                </h3>
                <p className="text-gray-600">
                  {isOwnProfile ? "Start selling by creating your first listing" : "This user hasn't listed any items yet"}
                </p>
                {isOwnProfile && (
                  <Button className="mt-4">Create First Listing</Button>
                )}
              </div>
            )}
          </TabsContent>

          {/* Sold Items (only for own profile) */}
          {isOwnProfile && (
            <TabsContent value="sold">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {soldListings.map(product => (
                  <div key={product.id} className="relative">
                    <ProductCard
                      product={product}
                      onFavorite={handleFavorite}
                      onProductClick={handleProductClick}
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center">
                      <Badge className="bg-green-500">SOLD</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          )}

          {/* Favorites (only for own profile) */}
          {isOwnProfile && (
            <TabsContent value="favorites">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {favoriteListings.map(product => (
                  <ProductCard
                    key={product.id}
                    product={{ ...product, isFavorited: true }}
                    onFavorite={handleFavorite}
                    onProductClick={handleProductClick}
                  />
                ))}
              </div>
            </TabsContent>
          )}

          {/* Reviews */}
          <TabsContent value="reviews">
            <div className="space-y-4">
              {/* Review Summary */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Reviews & Rating</h3>
                  <div className="flex items-center">
                    <Star className="w-5 h-5 text-yellow-400 mr-1" />
                    <span className="text-lg font-semibold">{user.rating}</span>
                    <span className="text-gray-600 ml-2">({user.totalSales + user.totalPurchases} reviews)</span>
                  </div>
                </div>
                
                {/* Rating Breakdown */}
                <div className="space-y-2">
                  {[5, 4, 3, 2, 1].map(rating => (
                    <div key={rating} className="flex items-center space-x-3">
                      <span className="text-sm w-6">{rating}★</span>
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-yellow-400 h-2 rounded-full" 
                          style={{ width: `${rating === 5 ? 75 : rating === 4 ? 20 : 5}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600 w-8">
                        {rating === 5 ? '75%' : rating === 4 ? '20%' : '5%'}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Individual Reviews */}
              <div className="space-y-4">
                {[
                  {
                    id: 1,
                    reviewer: "Sanjay Kumar",
                    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100",
                    rating: 5,
                    review: "Excellent seller! Item was exactly as described and delivered quickly. Highly recommended!",
                    date: "2 weeks ago",
                    product: "iPhone 14 Pro Max"
                  },
                  {
                    id: 2,
                    reviewer: "Neha Sharma",
                    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100",
                    rating: 4,
                    review: "Good product quality and fair pricing. Communication was prompt and professional.",
                    date: "1 month ago",
                    product: "MacBook Pro"
                  }
                ].map((review) => (
                  <Card key={review.id} className="p-4">
                    <div className="flex items-start space-x-4">
                      <img
                        src={review.avatar}
                        alt={review.reviewer}
                        className="w-10 h-10 rounded-full"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{review.reviewer}</h4>
                          <span className="text-sm text-gray-500">{review.date}</span>
                        </div>
                        <div className="flex items-center mb-2">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                            />
                          ))}
                        </div>
                        <p className="text-gray-700 mb-2">{review.review}</p>
                        <p className="text-sm text-gray-500">Product: {review.product}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default UserProfile;