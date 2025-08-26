import React from 'react';
import { Grid, Smartphone, Gamepad2, ShoppingBag, Shirt, Car, Home as HomeIcon, Book, Music, Camera, Filter, MapPin } from 'lucide-react';

const Sidebar = ({ activeCategory, onCategoryChange }) => {
  const categories = [
    { id: 'all', name: 'Browse all', icon: Grid },
    { id: 'electronics', name: 'Electronics', icon: Smartphone },
    { id: 'fashion', name: 'Fashion & Style', icon: Shirt },
    { id: 'vehicles', name: 'Vehicles', icon: Car },
    { id: 'home', name: 'Home & Garden', icon: HomeIcon },
    { id: 'books', name: 'Books & Media', icon: Book },
    { id: 'sports', name: 'Sports & Hobbies', icon: Gamepad2 },
    { id: 'collectibles', name: 'Vintage & Collectibles', icon: Camera }
  ];

  const locations = [
    'Mumbai, Maharashtra',
    'Delhi, NCR',
    'Bangalore, Karnataka',
    'Hyderabad, Telangana',
    'Chennai, Tamil Nadu',
    'Pune, Maharashtra'
  ];

  const priceRanges = [
    'Under ₹100',
    '₹100 - ₹500',
    '₹500 - ₹2,000',
    '₹2,000 - ₹10,000',
    'Above ₹10,000'
  ];

  const conditions = [
    'Like New',
    'Excellent',
    'Good',
    'Fair',
    'Vintage'
  ];

  return (
    <div className="w-80 bg-white border-r border-gray-100 h-screen overflow-y-auto">
      <div className="p-6">
        {/* Marketplace Title */}
        <h2 className="text-xl font-light text-gray-900 mb-8">Discover</h2>

        {/* Categories */}
        <div className="mb-10">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-4">Categories</h3>
          <div className="space-y-1">
            {categories.map((category) => {
              const IconComponent = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => onCategoryChange(category.id)}
                  className={`w-full flex items-center px-3 py-2.5 text-left rounded-lg transition-all duration-200 ${
                    activeCategory === category.id 
                      ? 'bg-gray-100 text-gray-900 font-medium' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <IconComponent className="w-4 h-4 mr-3" />
                  <span className="text-sm">{category.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Condition Filter */}
        <div className="mb-10">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-4">Condition</h3>
          <div className="space-y-2">
            {conditions.map((condition, index) => (
              <label key={index} className="flex items-center group cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-gray-900 border-gray-300 rounded focus:ring-gray-500 focus:ring-1"
                />
                <span className="ml-3 text-sm text-gray-600 group-hover:text-gray-900">{condition}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Price Filter */}
        <div className="mb-10">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-4">Price Range</h3>
          <div className="space-y-2">
            {priceRanges.map((range, index) => (
              <label key={index} className="flex items-center group cursor-pointer">
                <input
                  type="radio"
                  name="priceRange"
                  className="w-4 h-4 text-gray-900 border-gray-300 focus:ring-gray-500 focus:ring-1"
                />
                <span className="ml-3 text-sm text-gray-600 group-hover:text-gray-900">{range}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Location Filter */}
        <div className="mb-8">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-4">Location</h3>
          <div className="space-y-2">
            {locations.slice(0, 4).map((location, index) => (
              <label key={index} className="flex items-center group cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-gray-900 border-gray-300 rounded focus:ring-gray-500 focus:ring-1"
                />
                <span className="ml-3 text-sm text-gray-600 group-hover:text-gray-900">{location}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;